import type { MovieSession } from "../../types/movieSessions";

type HallCardProps = {
  session: MovieSession;
};

function SessionCard({session}:HallCardProps){
    return( 
        <div className="session-frame">

            <div className="left-frame">
                <div className="time-frame">
                    <p className="time">{session.time}</p>
                </div>
                <div className="language-badge-frame">
                    <div className="language">ENG</div>
                    <div className="badge">MAX</div>

                </div>
            </div>
            <div className="border-line"></div>
            <div className="right-frame">
                <div className="price-frame"></div>
                <div className="tickets-left"></div>
            </div>
        </div>
    )
}

export default SessionCard;