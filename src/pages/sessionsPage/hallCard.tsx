import SessionCard from "./sessionCard";
import "./hallcard.css"
import type { HallGroup } from "../../types/movieSessions"; 
type HallCardProps = {
  hall: HallGroup;
};

function HallCard({ hall }: HallCardProps) {
    return(
        <div className="hall-frame">
            <p className="hall-name">Hall {hall.hall.name}</p>
            <div className="session-cards-frame">
                {/**here goes loop to dynamially create cards */}
                {hall.sessions.map((session) => (
                    <SessionCard session={session}></SessionCard>
                ))}
            </div>

        </div>

    );

}

export default HallCard;