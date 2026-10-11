import { useState } from "react";
import { createPortal } from "react-dom";
import type { MovieSession } from "../../types/movieSessions";
import "./sessionCard.css";
import SeatSelectionModal from "../../components/seatSelection/seatSelectionModal";
import { useAuth } from "../../context/authContext";

type SessionCardProps = {
  session: MovieSession;
};

function SessionCard({ session }: SessionCardProps) {
    const [openSessionId, setOpenSessionId] = useState<number | null>(null);
    const { user, openLogin, logout } = useAuth();

    // opens the seat modal
    function openSeats() {
        setOpenSessionId(session.id);
    }

    // runs when the card is clicked
    function handleClick() {
        if (session.isSoldOut) return;

        if (!user) {
            openLogin(openSeats); // show login, then run openSeats after a successful login
            return;
        }

        openSeats(); // already logged in
    }

    return (
        <>
            <div
                className={`session-frame${session.isSoldOut ? " is-sold-out" : ""}`}
                role="button"
                tabIndex={session.isSoldOut ? -1 : 0}
                onClick={handleClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                <div className="left-frame">
                    <div className="time-frame">
                        <h2 className="time">{session.time}</h2>
                    </div>
                    <div className="language-badge-frame">
                        <div className="language"><p>ENG</p></div>
                        <div className="format-badge"><p>MAX</p></div>
                    </div>
                </div>
                <div className="border-line"></div>
                <div className="right-frame">
                    <div className="price-frame">
                        <h3>
                            <span>₾</span>
                            <span>{session.price}</span>
                        </h3>
                    </div>
                    <div className="seats-left"><p>{session.seatsLeft} left</p></div>
                </div>
            </div>

            {openSessionId !== null &&
                createPortal(
                    <SeatSelectionModal
                        sessionId={openSessionId}
                        onClose={() => setOpenSessionId(null)}
                        onLoginRequired={() => {
                            // the token expired: log out, close the seat modal, ask for login again
                            logout();
                            setOpenSessionId(null);
                            openLogin(openSeats);
                        }}
                        profile={
                            user
                                ? {
                                      fullName: user.fullName ?? "",
                                      email: user.email,
                                      mobileNumber: user.mobileNumber ?? "",
                                  }
                                : undefined
                        }
                    />,
                    document.body
                )}
        </>
    );
}

export default SessionCard;