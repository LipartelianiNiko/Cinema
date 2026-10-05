import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-left">

        <div className="navbar-logo">
          <span className="navbar-logo-kino">KINO</span>
          <span className="navbar-logo-xii">XII</span>
        </div>

        <div className="navbar-sessions">
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

          <button className="navbar-signup">
            Sign up
          </button>

          <button className="navbar-login">
            Log in
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;