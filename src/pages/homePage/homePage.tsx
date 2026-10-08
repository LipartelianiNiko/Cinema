import Hero from "../../components/hero/hero";
import NowInCinema from "../../components/nowPlaying/nowPlayingMovies"; 
import PreviouslyViewed from "../../components/rescentlyViewed/rescentlyViewed";
import SessionsPage from "../sessionsPage/sessionsPage";
function HomePage() {
  return (
    <>

      <main>
        <Hero />
        <NowInCinema />
        <PreviouslyViewed />
        <div></div>
        <SessionsPage/>
      </main>
    </>
  );
}

export default HomePage;