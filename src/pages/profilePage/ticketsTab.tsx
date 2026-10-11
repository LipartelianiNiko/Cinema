import { useCallback, useEffect, useState } from "react";
import { getTickets, refundOrder } from "../../services.ts/ticketServices";
import { getErrorMessage } from "../../services.ts/api";
import type { Order } from "../../types/booking";

function formatPrice(n: number) {
    return `₾${Math.round(n * 100) / 100}`;
}

function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

// the docs say refunds close 2 hours before the session starts (display only; the button uses isRefundable)
function refundUntil(startsAt: string) {
    const cutoff = new Date(new Date(startsAt).getTime() - 2 * 60 * 60 * 1000);
    const time = cutoff.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
    const day = cutoff.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
    return `${time}, ${day}`;
}

function TicketsTab() {
    const [view, setView] = useState<"upcoming" | "past">("upcoming");
    const [upcoming, setUpcoming] = useState<Order[]>([]);
    const [past, setPast] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadTickets = useCallback(() => {
        return Promise.all([getTickets("upcoming"), getTickets("past")])
            .then(([upcomingResponse, pastResponse]) => {
                setUpcoming(upcomingResponse.data);
                setPast(pastResponse.data);
            })
            .catch((err) => setMessage(getErrorMessage(err)))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    async function handleRefund(order: Order) {
        if (!window.confirm(`Refund order ${order.reference}? This cannot be undone.`)) return;
        setMessage("");
        try {
            await refundOrder(order.reference);
            await loadTickets(); // the refunded order moves to the Past tab
        } catch (err) {
            setMessage(getErrorMessage(err)); // 422: already refunded, or inside the cutoff
        }
    }

    const orders = view === "upcoming" ? upcoming : past;

    return (
        <div className="tickets-tab">
            <div className="tickets-switch">
                <button
                    className={`tickets-switch-btn${view === "upcoming" ? " is-active" : ""}`}
                    onClick={() => setView("upcoming")}
                >
                    Upcoming <span className="tickets-count">{upcoming.length}</span>
                </button>
                <button
                    className={`tickets-switch-btn${view === "past" ? " is-active" : ""}`}
                    onClick={() => setView("past")}
                >
                    Past <span className="tickets-count">{past.length}</span>
                </button>
            </div>

            {message && <div className="profile-error">{message}</div>}
            {loading && <div className="profile-hint">Loading tickets...</div>}
            {!loading && orders.length === 0 && <div className="profile-hint">No tickets here yet.</div>}

            {orders.map((order) => (
                <div className="ticket-card" key={order.id}>
                    <img className="ticket-poster" src={order.session.movie.posterUrl} alt="" />

                    <div className="ticket-main">
                        <div className="ticket-title-row">
                            <h3 className="ticket-title">{order.session.movie.title}</h3>
                            <span className="ticket-age">{order.session.movie.ageRating.code}</span>
                            <span className="ticket-runtime">{order.session.movie.runtimeMinutes} min</span>
                        </div>

                        <div className="ticket-details">
                            <div>
                                <div className="ticket-label">Date</div>
                                <div className="ticket-value">{formatDate(order.session.date)} · {order.session.time}</div>
                            </div>
                            <div>
                                <div className="ticket-label">Venue</div>
                                <div className="ticket-value">{order.session.venue.name} · Hall {order.session.hall.name}</div>
                            </div>
                            <div>
                                <div className="ticket-label">Format</div>
                                <div className="ticket-value">{order.session.format.name} · {order.session.language.name}</div>
                            </div>
                        </div>

                        <div className="ticket-seats">
                            <span className="ticket-label">Seats</span>
                            {order.tickets.map((t) => (
                                <span className="ticket-seat" key={t.id}>{t.seatCode} · {t.ticketType.name}</span>
                            ))}
                        </div>
                    </div>

                    <div className="ticket-side">
                        <div className="ticket-label">Order</div>
                        <div className="ticket-value">#{order.reference}</div>

                        <div className="ticket-total-row">
                            <span className="ticket-label">Total paid</span>
                            <span className="ticket-total">{formatPrice(order.totalPrice)}</span>
                        </div>

                        <button
                            className="ticket-refund-btn"
                            disabled={!order.isRefundable}
                            title={!order.isRefundable && order.isUpcoming ? "Refunds close 2 hours before the session starts." : undefined}
                            onClick={() => handleRefund(order)}
                        >
                            Refund
                        </button>

                        <div className="ticket-note">
                            {order.refundedAt
                                ? "Refunded"
                                : order.isRefundable
                                  ? `Refundable until ${refundUntil(order.session.startsAt)}`
                                  : order.isUpcoming
                                    ? "Refund window closed"
                                    : "Session has passed"}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TicketsTab;