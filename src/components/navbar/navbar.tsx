function Navbar() {
  return (
    <nav>
        <div className="logo">
            KINO
        </div>

        <a href="/sessions">
            SESSIONS
        </a>

        <input
            type="text"
            placeholder="Search"
        />

        <div className="auth-actions">
        </div>
    </nav>
  );
}

export default Navbar;