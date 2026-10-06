import Navbar from "../../components/navbar/navbar";
import Hero from "../../components/hero/hero";
import NowInCinema from "../../components/nowPlaying/nowPlayingMovies"; 
import PreviouslyViewed from "../../components/rescentlyViewed/rescentlyViewed";

function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <NowInCinema />
        <PreviouslyViewed />
      </main>
    </>
  );
}

export default HomePage;