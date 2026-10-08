import "./movieListCard.css"
import SessionListCard from "./sessionsListCard";
import poster from "./movie.jpg";
function MovieListCard(){

    return(

        <div className="movie-list-card-frame">
            <div className="movie-list-card-banner-frame">
                <img className="movie-list-card-poster-frame" src={poster}>
                    
                </img>
                <div className="movie-list-card-movie-details">
                    <div className="movie-list-card-details-top">
                        <h3>The Odyssey</h3>
                        <div className="movie-list-card-age-limit">13+</div>
                    </div>

                    <div className="movie-list-card-duration">130 mins</div>

                </div>
            </div>



            <div className="sessions-list-frame">
                {/*sessions cards goes here */}
                <SessionListCard></SessionListCard>
                <SessionListCard></SessionListCard>
                <SessionListCard></SessionListCard>
                <SessionListCard></SessionListCard>
            </div>

        </div>
    )


}
export default MovieListCard;