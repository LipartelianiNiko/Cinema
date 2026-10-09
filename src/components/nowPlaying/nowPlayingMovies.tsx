import "./nowPlaying.css"
import NowPayingMovieCard from "./nowPlayingMovieCard"
import { getNowPlayingMovies } from "../../services.ts/movieServices";
import type { FeaturedFilm } from "../../types/movies"
import CommingSoonCard from "./commingSoonCard"
import { getCommingSoon } from "../../services.ts/movieServices";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

function NowPayingMovies() {
    const navigate = useNavigate();


  const [movies, setNowPlayingMovies] = useState<FeaturedFilm[]>([]);//set featured films to be empty array, setFetaured changes it
  
  const [comingSoon, setComingSoon]=useState<FeaturedFilm[]>([]);//

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

      useEffect(() => {
      const loadCommingSoon = async () => {
        try {
          const response = await getCommingSoon();
  
          setComingSoon(response.data);
        } catch (error) {
          console.error("Failed to load featured films:", error);
        }
      };
  
      loadCommingSoon();
    }, []);
  
    console.log(movies);
    console.log(comingSoon);


  return (
    <div className="home-movies-frame">
      <section className="now-playing-frame">

        <div className="now-playing-headers">
          <div className="now-playing-box"><h1 className="now-playing-text">NOW PLAYING</h1></div>
          <div className="see-all-box" onClick={() => navigate(`/sessions`)}>see all</div>
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

        <div className="comming-soon-headers">
          <div className="comming-soon-box">
            <h1>COMMING SOON</h1>
          </div>

          <div className="see-all-bottom">see all</div>
        </div>

        <div className="comming-soon-cards-frame">
           {comingSoon.map((movie) => (
            <CommingSoonCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>

        
      
      </div>
    </div>
  );
}

export default NowPayingMovies;