import "./sessionsListCard.css"
import type { SessionListItem} from "../../types/allSessions"
import type { SessionsListMovie} from "../../types/allSessions"

type SessionListCardProps = {
    movie: SessionsListMovie;
    session: SessionListItem;
};



function SessionListCard({session, movie}:SessionListCardProps ){
    return(
        <div className="card-frame">
            <div className="card-contents">
                <div className="card-top">
                    <div className="time">{session.time}</div>
                    <div className="sessions-list-format-badge">{movie.formats[0].name}</div>
            
                </div>
                
                <div className="card-bottom">

                    <div className="card-bottom-detils">
                        <div className="subtitles">{session.language.code}</div>
                        <div className="location">{session.venue.name} · Hall {session.hall.name}</div>
                    </div>
                    <div className="card-bottom-tickets-price">
                        <div className="tickets-left">{session.seatsLeft} left</div>
                        <div className="price">₾{session.price}</div>
                    </div>

                </div>
            
            </div>
        </div>
    )

}

export default SessionListCard