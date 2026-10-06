import "./commingSoonCard.css"
import type { FeaturedFilm } from "../../types/movies"

type MovieCardProps = {
  movie: FeaturedFilm;
};


function CommingSoonCard({movie}: MovieCardProps){
    return(
    
        <div className="card-frame">

            <div className="image-frame">
                <img src={movie.posterUrl} className="comming-soon-image"></img>

            </div>

            <div className="details-frame">
                <div className="date-frame">
                <label>IN CINEMAS {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                    })}
                </label>
                </div>

                <div className="name-frame">
                    <p className="name">{movie.title}</p>
                    <p className="genre-duration">{movie.genres[0].name} - {movie.runtimeMinutes}min</p>

                </div>

                    <button className="notify-btn">Notify Me</button>
            </div>

        </div>
    );
}

export default CommingSoonCard;