import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import type { FeaturedFilm } from "./hero.types";//type
import { getFeaturedFilms } from "../../services.ts/movieServices";

//make request to api to get featured films as the component is mounted. use useeffect,
//service function is declared in moviesServices,
// getFeaturedFilms requests to base-url/movies/featured and returns array of type FeaturedFilm
//store retuend array in useEffect variable featuredFilms
//use index(currentIndex) to show carousel 

import "./hero.css"
function Hero() {
  const [featuredFilms, setFeaturedFilms] = useState<FeaturedFilm[]>([]);//set featured films to be empty array, setFetaured changes it
  const [currentIndex, setCurrentIndex] = useState(0);//index for picking movie in featuredFilm array of returned featured

  useEffect(() => {
    const loadFeaturedFilms = async () => {
      try {
        const response = await getFeaturedFilms();

        setFeaturedFilms(response.data);
      } catch (error) {
        console.error("Failed to load featured films:", error);
      }
    };

    loadFeaturedFilms();
  }, []);

  console.log(featuredFilms);
  if (featuredFilms.length === 0) {
  return null;
}
  const currentFilm=featuredFilms[currentIndex];


  return (
    <div className="hero">
      <div className="hero-image">
        {/* movie background image */}
        <img src={currentFilm.backdropUrl}></img>
      </div>

      <div className="hero-content-box">
        <div className="premiere-box">
          <p>premiere</p>

        </div>

        <div className="details-box">
          <h1 className="name">{currentFilm.title}</h1>

          <div className="info-badges">

          </div>

          <p className="hero-movie-description">{currentFilm.synopsis}</p>


          <div className="hero-actions-box">
            <button className="hero-buy-btn">Buy tickets</button>
            <button className="hero-movie-sessions-btn">All sessions</button>
          </div>
        </div>
      </div>

      <div className="hero-navigation-box">
        {/* previous / indicators / next */}
        <div className="hero-tabs-box">

        </div>

        <div className="hero-arrows-box">
          <button className="hero-btn-back"
          onClick={() => setCurrentIndex((currentIndex - 1 + featuredFilms.length) % featuredFilms.length)}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={24}
              color="white"
              strokeWidth={1.5}
            />
          </button>

          <button className="hero-btn-next"
          onClick={() => setCurrentIndex((currentIndex + 1) % featuredFilms.length)}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={24}
              color="white"
              strokeWidth={1.5}
            />
          </button>
        </div>

      </div>
    </div>
  );
}

export default Hero;