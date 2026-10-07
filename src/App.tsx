import { Routes, Route } from "react-router-dom";
import Home from "./pages/homePage/homePage";
import SessionsPage from "./pages/sessionsPage/sessionsPage";
import Navbar from "./components/navbar/navbar";

function App() {
  return (
    <>
    <Navbar />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies/:slug" element={<SessionsPage />} />
    </Routes>
    </>
  );
}

export default App;