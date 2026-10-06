import "./nowPlaying.css"
import NowPayingMovieCard from "./nowPlayingMovieCard"
import { getNowPlayingMovies } from "../../services.ts/movieServices";
import type { FeaturedFilm } from "../../types/movies"

import { useEffect, useState } from "react";

function NowPayingMovies() {

  const [movies, setNowPlayingMovies] = useState<FeaturedFilm[]>([]);//set featured films to be empty array, setFetaured changes it
  
    useEffect(() => {
      const loadNowPlayingMovies = async () => {
        try {
          const response = await getNowPlayingMovies();
  
          setNowPlayingMovies(response.data);
        } catch (error) {
          console.error("Failed to load featured films:", error);
        }
      };
  
      loadNowPlayingMovies();
    }, []);
  
    console.log(movies);


  return (
    <div className="home-movies-frame">
      <section className="now-playing-frame">

        <div className="now-playing-headers">
          <div className="now-playing-box"><h1 className="now-playing-text">now playing</h1></div>
          <div className="see-all-box">see all</div>
        </div>

        <div className="now-playing-movies">
            {movies.map((movie) => (
            <NowPayingMovieCard
              key={movie.id}
              movie={movie}
            />
  ))}
        </div>
      </section>

      <section className="section-brake"></section>

      <div className="comming-soon-frame">

      </div>
    </div>
  );
}

export default NowPayingMovies;