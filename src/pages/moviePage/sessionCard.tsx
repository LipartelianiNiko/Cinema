import type { MovieSession } from "../../types/movieSessions";
import "./sessionCard.css"

type HallCardProps = {
  session: MovieSession;
};


function SessionCard({session}:HallCardProps){
    return( 
        <>
        <div className="session-frame" >

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

        </>
    )
}

export default SessionCard;