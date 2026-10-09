import { Routes, Route } from "react-router-dom";
import Home from "./pages/homePage/homePage";
import MoviePage from "./pages/moviePage/moviePage";
import Navbar from "./components/navbar/navbar";
import SessionsPage from "./pages/sessionsPage/sessionsPage"

function App() {
  return (
    <>
    <Navbar />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies/:slug" element={<MoviePage />} />
      <Route path="/sessions" element={<SessionsPage />} />
    </Routes>
    </>
  );
}

export default App;