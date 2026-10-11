import { Fragment, useCallback, useEffect, useState } from "react";
import { getSession, getSessionSeats } from "../../services.ts/movieServices";
import { holdSeats, releaseHold, createOrder } from "../../services.ts/bookinServices";
import { ApiError } from "../../services.ts/api";
import { useFilterOptions } from "../../context/filterOptionsCOntext";
import type { SessionListItem } from "../../types/allSessions";
import type { SeatSection } from "../../types/sessionSeats";
import type { Hold, Order } from "../../types/booking";
import "./SeatSelectionModal.css";

type SelectedSeat = {
    id: number;
    code: string;
    ticketTypeId: number;
};

type Profile = { fullName: string; email: string; mobileNumber: string };

type Step = "seats" | "checkout" | "done";

type Fields = {
    fullName: string;
    email: string;
    mobileNumber: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
};

type SeatSelectionModalProps = {
    sessionId: number;
    profile?: Profile;            // prefills the checkout form
    onClose: () => void;
    onLoginRequired?: () => void; // called when the server says 401
};

function formatPrice(n: number) {
    const rounded = Math.round(n * 100) / 100;
    return `₾${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)}`;
}

function formatTimer(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
}

// seconds left until the hold expires, always calculated from expiresAt so it can't drift
function secondsUntil(expiresAt: string) {
    return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

function SeatSelectionModal({ sessionId, profile, onClose, onLoginRequired }: SeatSelectionModalProps) {
    const { options } = useFilterOptions();

    const [session, setSession] = useState<SessionListItem | null>(null);
    const [sections, setSections] = useState<SeatSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selected, setSelected] = useState<SelectedSeat[]>([]);

    const [step, setStep] = useState<Step>("seats");
    const [hold, setHold] = useState<Hold | null>(null);
    const [remaining, setRemaining] = useState(0);
    const [notice, setNotice] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [form, setForm] = useState<Fields>({
        fullName: profile?.fullName ?? "",
        email: profile?.email ?? "",
        mobileNumber: profile?.mobileNumber ?? "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    const refreshSeats = useCallback(async () => {
        try {
            const response = await getSessionSeats(sessionId);
            setSections(response.data.sections);
        } catch (err) {
            console.error("Failed to refresh seats:", err);
        }
    }, [sessionId]);

    // load session info + hall map when the modal opens
    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                setLoading(true);
                setError(false);
                const [sessionResponse, seatsResponse] = await Promise.all([
                    getSession(sessionId, controller.signal),
                    getSessionSeats(sessionId, controller.signal),
                ]);
                setSession(sessionResponse.data);
                setSections(seatsResponse.data.sections);
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to load seat selection:", err);
                setError(true);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        load();
        return () => controller.abort();
    }, [sessionId]);

    // lock page scroll while open
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    // closing releases the hold (unless it was already paid)
    const handleClose = useCallback(() => {
        if (hold && !order) releaseHold(hold.holdId).catch(() => {});
        onClose();
    }, [hold, order, onClose]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [handleClose]);

    const resetAfterExpiry = useCallback(
        (message: string) => {
            setHold(null);
            setSelected([]);
            setStep("seats");
            setNotice(message);
            refreshSeats();
        },
        [refreshSeats]
    );

    // countdown: state is only updated inside the interval callback
    useEffect(() => {
        if (!hold) return;

        const id = setInterval(() => {
            const left = secondsUntil(hold.expiresAt);
            setRemaining(left);
            if (left === 0) {
                resetAfterExpiry("Your hold time expired. Please re-select your seats.");
            }
        }, 1000);

        return () => clearInterval(id);
    }, [hold, resetAfterExpiry]);

    const secondsLeft = hold ? remaining : null;

    const ticketTypes = options?.ticketTypes ?? [];
    const maxSeats = options?.maxSeatsPerOrder ?? 3;
    const defaultTicketType = ticketTypes.find((t) => t.priceRatio === 1) ?? ticketTypes[0];

    const toggleSeat = (seatId: number, code: string) => {
        if (selected.some((s) => s.id === seatId)) {
            setSelected(selected.filter((s) => s.id !== seatId));
            return;
        }
        if (selected.length >= maxSeats || !defaultTicketType) return;
        setSelected([...selected, { id: seatId, code, ticketTypeId: defaultTicketType.id }]);
    };

    const changeTicketType = (seatId: number, ticketTypeId: number) => {
        setSelected(selected.map((s) => (s.id === seatId ? { ...s, ticketTypeId } : s)));
    };

    const priceOf = (seat: SelectedSeat) => {
        const ratio = ticketTypes.find((t) => t.id === seat.ticketTypeId)?.priceRatio ?? 1;
        return (session?.price ?? 0) * ratio;
    };

    const subtotal = selected.reduce((sum, s) => sum + priceOf(s), 0);

    // 409: some seats were taken. Mark them sold, drop them, keep the rest.
    const handleContested = (codes: string[], from: "hold" | "order") => {
        setSections((prev) =>
            prev.map((section) => ({
                ...section,
                rows: section.rows.map((row) => ({
                    ...row,
                    seats: row.seats.map((seat) =>
                        codes.includes(seat.code) ? { ...seat, state: "sold" as const } : seat
                    ),
                })),
            }))
        );
        setSelected((prev) => prev.filter((s) => !codes.includes(s.code)));
        setNotice(
            codes.length > 0
                ? `${codes.join(", ")} ${codes.length > 1 ? "were" : "was"} just taken. Your other seats are still selected.`
                : "Some seats were just taken. Please check your selection."
        );
        if (from === "order") setHold(null);
        setStep("seats");
        refreshSeats();
    };

    const handleBookingError = (err: unknown, from: "hold" | "order") => {
        if (!(err instanceof ApiError)) {
            setNotice("Something went wrong. Please try again.");
            return;
        }

        const body = err.body as {
            message?: string;
            errors?: Record<string, string[]>;
            contested?: string[];
        } | null;

        if (err.status === 401) {
            onLoginRequired?.();
            return;
        }

        if (err.status === 409) {
            handleContested(body?.contested ?? [], from);
            return;
        }

        if (err.status === 422) {
            if (body?.errors) {
                if (from === "order") {
                    setFieldErrors(body.errors);
                    setNotice("Please fix the highlighted fields.");
                } else {
                    setNotice(Object.values(body.errors)[0]?.[0] ?? body.message ?? "Invalid selection.");
                }
                return;
            }
            // message only: a booking rule, or (on /orders) the hold ran out
            if (from === "order") {
                resetAfterExpiry(body?.message ?? "Your hold time expired. Please re-select your seats.");
            } else {
                setNotice(body?.message ?? "Could not hold these seats.");
            }
            return;
        }

        setNotice(body?.message ?? "Something went wrong. Please try again.");
    };

    // step 1 -> step 2
    const handleNext = async () => {
        setNotice(null);
        setBusy(true);
        try {
            const response = await holdSeats(
                sessionId,
                selected.map((s) => ({
                    seatId: s.id,
                    ticketType: ticketTypes.find((t) => t.id === s.ticketTypeId)?.slug ?? "adult",
                }))
            );
            setHold(response.data);
            setRemaining(secondsUntil(response.data.expiresAt)); // shows ~8:00 right away
            setStep("checkout");
        } catch (err) {
            handleBookingError(err, "hold");
        } finally {
            setBusy(false);
        }
    };

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hold || busy) return;
        setNotice(null);
        setFieldErrors({});
        setBusy(true);
        try {
            const response = await createOrder({ holdId: hold.holdId, ...form });
            setOrder(response.data);
            setHold(null);
            setStep("done");
        } catch (err) {
            handleBookingError(err, "order");
        } finally {
            setBusy(false);
        }
    };

    // a plain function (not a component) so inputs keep focus while typing
    const renderField = (name: keyof Fields, label: string, placeholder?: string) => (
        <label className="checkout-field">
            <span className="checkout-label">{label}</span>
            <input
                className={`checkout-input${fieldErrors[name] ? " has-error" : ""}`}
                value={form[name]}
                placeholder={placeholder}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            />
            {fieldErrors[name] && <span className="checkout-error">{fieldErrors[name][0]}</span>}
        </label>
    );

    const isReady = !loading && !error && session && options;

    const sessionDate = session
        ? new Date(`${session.date}T00:00:00`).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
          })
        : "";

    return (
        <div className="seat-modal-overlay" onClick={step === "checkout" ? undefined : handleClose}>
            <div
                className="seat-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Seat selection"
                onClick={(e) => e.stopPropagation()}
            >
                {!isReady ? (
                    <div className="seat-modal-status">
                        {error ? "Could not load the hall. Please retry." : "Loading seats…"}
                    </div>
                ) : (
                    <>
                        <div className="seat-modal-header">
                            <div className="seat-modal-header-text">
                                <div className="seat-modal-title">{session.movie.title}</div>
                                <div className="seat-modal-info">
                                    {session.venue.name} · Hall {session.hall.name} · {sessionDate} ·{" "}
                                    {session.time} · {session.format.name} · {session.language.name}
                                </div>
                            </div>

                            {secondsLeft !== null && (
                                <div className="seat-hold-timer">
                                    <div className="seat-hold-timer-label">Seats held</div>
                                    <div className="seat-hold-timer-value">{formatTimer(secondsLeft)}</div>
                                </div>
                            )}
                        </div>

                        {notice && <div className="seat-notice" role="alert">{notice}</div>}

                        {step === "done" && order ? (
                            <div className="order-done">
                                <div className="order-done-title">Booking confirmed</div>
                                <div className="order-done-ref">
                                    Reference <strong>{order.reference}</strong>
                                </div>
                                <div className="order-done-info">
                                    {order.session.movie.title} · {order.session.venue.name} · Hall{" "}
                                    {order.session.hall.name} · {order.session.date} · {order.session.time}
                                </div>
                                <ul className="order-done-tickets">
                                    {order.tickets.map((t) => (
                                        <li key={t.id}>
                                            Seat {t.seatCode} · {t.ticketType.name} · {formatPrice(t.price)}
                                        </li>
                                    ))}
                                </ul>
                                <div className="order-done-total">
                                    Total {formatPrice(order.totalPrice)} · Card •••• {order.cardLastFour}
                                </div>
                                <button type="button" className="next-btn order-done-btn" onClick={handleClose}>
                                    Close
                                </button>
                            </div>
                        ) : (
                            <div className="seat-modal-body">
                                <div className="seat-modal-left">
                                    <div className="seat-modal-tabs">
                                        <button
                                            type="button"
                                            className={`seat-tab${step === "seats" ? " is-active" : ""}`}
                                            onClick={() => setStep("seats")}
                                        >
                                            Seats
                                        </button>
                                        <button
                                            type="button"
                                            className={`seat-tab${step === "checkout" ? " is-active" : ""}`}
                                            disabled
                                        >
                                            Checkout
                                        </button>
                                    </div>

                                    {step === "seats" ? (
                                        <>
                                            <div className="seat-screen">Screen</div>

                                            <div className="seat-map-frame">
                                                {sections.map((section, i) => {
                                                    const firstRow = section.rows[0]?.label;
                                                    const lastRow = section.rows[section.rows.length - 1]?.label;
                                                    const rowsText =
                                                        firstRow === lastRow
                                                            ? `Row ${firstRow}`
                                                            : `Rows ${firstRow}-${lastRow}`;

                                                    return (
                                                        <div className="seat-section" key={`${section.name}-${i}`}>
                                                            <div className="seat-section-title">
                                                                {section.name} · {rowsText}
                                                            </div>

                                                            {section.rows.map((row) => (
                                                                <div className="seat-row" key={row.label}>
                                                                    <span className="seat-row-label">{row.label}</span>

                                                                    <div className="seat-row-seats">
                                                                        {row.seats.map((seat) => {
                                                                            const isSelected = selected.some(
                                                                                (s) => s.id === seat.id
                                                                            );
                                                                            return (
                                                                                <Fragment key={seat.id}>
                                                                                    {seat.state === "unavailable" ? (
                                                                                        <span className="seat-gap" />
                                                                                    ) : (
                                                                                        <button
                                                                                            type="button"
                                                                                            className={`seat is-${seat.state}${
                                                                                                isSelected ? " is-selected" : ""
                                                                                            }`}
                                                                                            disabled={seat.state !== "available"}
                                                                                            aria-label={`Seat ${seat.code}`}
                                                                                            aria-pressed={isSelected}
                                                                                            onClick={() =>
                                                                                                toggleSeat(seat.id, seat.code)
                                                                                            }
                                                                                        >
                                                                                            {seat.label}
                                                                                        </button>
                                                                                    )}
                                                                                    {seat.aisleAfter && (
                                                                                        <span className="aisle" />
                                                                                    )}
                                                                                </Fragment>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="seat-legend">
                                                <span className="seat-legend-item"><i className="seat-legend-box" />Available</span>
                                                <span className="seat-legend-item"><i className="seat-legend-box is-selected" />Selected</span>
                                                <span className="seat-legend-item"><i className="seat-legend-box is-sold" />Sold</span>
                                                <span className="seat-legend-item"><i className="seat-legend-box is-held" />Held by another user</span>
                                            </div>
                                        </>
                                    ) : (
                                        <form id="checkout-form" className="checkout-form" onSubmit={handlePay}>
                                            {renderField("fullName", "Full name")}
                                            {renderField("email", "Email")}
                                            {renderField("mobileNumber", "Mobile number", "5XX XXX XXX")}
                                            {renderField("cardNumber", "Card number", "4242 4242 4242 4242")}
                                            <div className="checkout-row">
                                                {renderField("expiry", "Expiry", "MM/YY")}
                                                {renderField("cvv", "CVV", "123")}
                                            </div>
                                        </form>
                                    )}
                                </div>

                                {step === "seats" ? (
                                    <div className="seats-panel">
                                        <div className="seats-panel-title">Your seats · Max {maxSeats}</div>

                                        <div className="seats-panel-list">
                                            {selected.length === 0 ? (
                                                <div className="seats-panel-hint">
                                                    Pick up to {maxSeats} seats from the map. Each seat can carry its
                                                    own ticket type.
                                                </div>
                                            ) : (
                                                selected.map((seat) => (
                                                    <div className="selected-seat-card" key={seat.id}>
                                                        <div className="selected-seat-top">
                                                            <span className="selected-seat-name">
                                                                <span className="selected-seat-word">Seat</span> {seat.code}
                                                            </span>
                                                            <span className="selected-seat-price">
                                                                {formatPrice(priceOf(seat))}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                className="selected-seat-remove"
                                                                aria-label={`Remove seat ${seat.code}`}
                                                                onClick={() => toggleSeat(seat.id, seat.code)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>

                                                        <div className="ticket-type-row">
                                                            {ticketTypes
                                                                .filter(
                                                                    (t) =>
                                                                        t.blockedFromRatingAge === null ||
                                                                        session.movie.ageRating.minAge <
                                                                            t.blockedFromRatingAge
                                                                )
                                                                .map((t) => (
                                                                    <button
                                                                        key={t.id}
                                                                        type="button"
                                                                        className={`ticket-type-btn${
                                                                            seat.ticketTypeId === t.id ? " is-active" : ""
                                                                        }`}
                                                                        onClick={() => changeTicketType(seat.id, t.id)}
                                                                    >
                                                                        {t.name} {Math.round(t.priceRatio * 100)}%
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="seats-panel-footer">
                                            <div className="subtotal-row">
                                                <span className="subtotal-label">Subtotal</span>
                                                <span className="subtotal-value">{formatPrice(subtotal)}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="next-btn"
                                                disabled={selected.length === 0 || busy}
                                                onClick={handleNext}
                                            >
                                                {busy ? "Holding seats…" : "Next: Checkout"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    hold && (
                                        <div className="seats-panel">
                                            <div className="seats-panel-title">Order summary</div>

                                            <div className="seats-panel-list">
                                                {hold.seats.map((s) => (
                                                    <div className="summary-row" key={s.seatId}>
                                                        <span>Seat {s.code} · {s.ticketType.name}</span>
                                                        <span>{formatPrice(s.price)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="seats-panel-footer">
                                                <div className="subtotal-row">
                                                    <span className="subtotal-label">Total</span>
                                                    <span className="subtotal-value">{formatPrice(hold.subtotal)}</span>
                                                </div>
                                                <button
                                                    type="submit"
                                                    form="checkout-form"
                                                    className="next-btn"
                                                    disabled={busy}
                                                >
                                                    {busy ? "Processing…" : `Pay ${formatPrice(hold.subtotal)}`}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default SeatSelectionModal;