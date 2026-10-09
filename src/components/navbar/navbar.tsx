import "./Navbar.css";
import SignUpModal from "../auth/signUpModal";
import { useState } from "react";
import LoginModal from "../auth/logInModal";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const [authModal, setAuthModal] = useState<"signup" | "login" | null>(null);
  const navigate = useNavigate();




  return (
    <>
    <nav className="navbar">

      <div className="navbar-left">

        <div className="navbar-logo">
          <span className="navbar-logo-kino">KINO</span>
          <span className="navbar-logo-xii">XII</span>
        </div>

        <div className="navbar-sessions" onClick={() => navigate(`/sessions`)}>
          SESSIONS
        </div>

      </div>

      <div className="navbar-right">

        <div className="navbar-search-frame">
            
        <input
            type="text"
            className="navbar-search"
            placeholder="Search"
        />
        </div>

        <div className="navbar-auth">

          <button className="navbar-signup" onClick={() => setAuthModal("signup")}>
            Sign up
          </button>

          <button className="navbar-login" onClick={() => setAuthModal("login")}>
            Log in
          </button>

        </div>

      </div>

    </nav>

    {authModal === "signup" && (
        <SignUpModal
            onClose={() => setAuthModal(null)}
            onLogin={() => setAuthModal("login")}
        />
    )}

    {authModal === "login" && (
        <LoginModal
            onClose={() => setAuthModal(null)}
            onSignUp={() => setAuthModal("signup")}

        />
    )}
    </>
  );
}

export default Navbar;