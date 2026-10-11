import "./Navbar.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import type { User } from "../../types/auth";

function getInitials(user: User) {
  const name = user.fullName || user.username;
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function Avatar({ user }: { user: User }) {
  return (
    <span className="avatar">
      {user.avatar ? (
        <img className="avatar-img" src={user.avatar} alt="" />
      ) : (
        <span className="avatar-initials">{getInitials(user)}</span>
      )}
      <span className={`avatar-dot ${user.profileComplete ? "is-complete" : "is-incomplete"}`} />
    </span>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const { user, openLogin, openSignUp, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goTo(path: string) {
    setMenuOpen(false);
    navigate(path);
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <span className="navbar-logo-kino">KINO</span>
          <span className="navbar-logo-xii">XII</span>
        </div>
        <div className="navbar-sessions" onClick={() => navigate("/sessions")}>
          SESSIONS
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-search-frame">
          <input type="text" className="navbar-search" placeholder="Search" />
        </div>

        <div className="navbar-auth" ref={menuRef}>
          {user ? (
            <>
              <button className="navbar-user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <Avatar user={user} />
                <span className="navbar-username">{(user.fullName || user.username).split(" ")[0]}</span>
                <span className={`navbar-chevron${menuOpen ? " is-open" : ""}`}>⌄</span>
              </button>

              {menuOpen && (
                <div className="navbar-menu">
                  <div className="menu-user">
                    <Avatar user={user} />
                    <div className="menu-user-text">
                      <div className="menu-user-name">{user.fullName || user.username}</div>
                      <div className="menu-user-email">{user.email}</div>
                    </div>
                  </div>

                  {user.profileComplete ? (
                    <div className="menu-banner is-complete">Profile Complete ✓</div>
                  ) : (
                    <div className="menu-banner is-incomplete">
                      <div className="menu-banner-title">Profile incomplete</div>
                      <div className="menu-banner-text">Please complete your profile to enable booking</div>
                    </div>
                  )}

                  <button className="menu-item" onClick={() => goTo("/profile")}>My Profile</button>
                  <button className="menu-item" onClick={() => goTo("/profile?tab=tickets")}>My Tickets</button>

                  <div className="menu-divider" />

                  <button
                    className="menu-item is-logout"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button className="navbar-signup" onClick={openSignUp}>Sign up</button>
              <button className="navbar-login" onClick={() => openLogin()}>Log in</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;