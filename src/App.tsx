import { Routes, Route } from "react-router-dom";
import Home from "./pages/homePage/homePage";
import MoviePage from "./pages/moviePage/moviePage";
import Navbar from "./components/navbar/navbar";

function App() {
  return (
    <>
    <Navbar />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies/:slug" element={<MoviePage />} />
    </Routes>
    </>
  );
}

export default App;