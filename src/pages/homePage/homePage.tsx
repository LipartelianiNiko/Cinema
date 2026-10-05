import Navbar from "../../components/navbar/navbar";
import Hero from "../../components/hero/hero";
import NowInCinema from "../../components/nowPlaying/nowPlayingMovies"; 
import UpcomingMovies from "../../components/upcomingMovies/upcomingMovies";
import PreviouslyViewed from "../../components/rescentlyViewed/rescentlyViewed";

function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <NowInCinema />
        <UpcomingMovies />
        <PreviouslyViewed />
      </main>
    </>
  );
}

export default HomePage;