import "./nowPlaying.css"
import "./nowPlayingCard.css"
import type { FeaturedFilm } from "../../types/movies"
import { useNavigate } from "react-router-dom";

type MovieCardProps = {
  movie: FeaturedFilm;
};

function NowPayingMovieCard({movie}: MovieCardProps) {
  const navigate = useNavigate();
  return (
    <article className="now-playing-card">
        <div className="now-playing-card-content">

          <div className="now-playing-card-image-box">
            <img src={movie.posterUrl} className="now-playing-card-image">
            </img>
          </div>

          <div className="now-playing-card-details">

            <h3 className="now-playing-card-title">
              {movie.title}
            </h3>

            <div className="now-playing-card-info">

              <div className="genre-duration">
                <span>{movie.genres[0].name}</span>
                <span> | {movie.runtimeMinutes} min</span>
              </div>

              <span className="age">{movie.ageRating.code}</span>
            </div>

            <div className="price-btn-frame">
              <label className="price-from">
                from {movie.fromPrice}
              </label>
              
              {/**request is sent with slug , not id */}
              <button className="buy-btn"
              onClick={() => navigate(`/movies/${movie.slug}`)
              }>
                <p className="buy-btn-text">Buy Ticket</p></button>
            </div>
          </div>

          <div></div>

        </div>
    </article>
  );
}

export default NowPayingMovieCard;