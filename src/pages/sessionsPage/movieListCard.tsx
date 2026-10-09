import "./movieListCard.css"
import SessionListCard from "./sessionsListCard";
import type { MovieSessionsGroup} from "../../types/allSessions"

type MovieListCardProps = {
  movieGroup: MovieSessionsGroup;
};



function MovieListCard({movieGroup}:MovieListCardProps){

    return(

        <div className="movie-list-card-frame">
            <div className="movie-list-card-banner-frame">
                <img className="movie-list-card-poster-frame" src={movieGroup.movie.posterUrl}>
                    
                </img>
                <div className="movie-list-card-movie-details">
                    <div className="movie-list-card-details-top">
                        <h3>{movieGroup.movie.title}</h3>
                        <div className="movie-list-card-age-limit">{movieGroup.movie.ageRating.code}</div>
                    </div>

                    <div className="movie-list-card-duration">{movieGroup.movie.runtimeMinutes} mins</div>

                </div>
            </div>



            <div className="sessions-list-frame">
                {/*sessions cards goes here */}
                    <div className="movies-list-frame">
                        {movieGroup.sessions.map((session) => (
                            <SessionListCard
                            key={session.id}
                            session={session}
                            movie={movieGroup.movie}
                            />
                        ))}
     
                    </div>
                
            </div>

        </div>
    )


}
export default MovieListCard;