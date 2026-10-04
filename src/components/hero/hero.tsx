function Hero() {
  return (
    <section className="hero">
      <div className="hero-image">
        {/* movie background image */}
      </div>

      <div className="hero-content">
        <h1>Movie name</h1>

        <p>Movie description</p>

        <div className="hero-info">
          <span>Duration</span>
          <span>Age limit</span>
        </div>

        <button>Buy tickets</button>

        <div className="hero-actions">
            <button>Buy tickets</button>
            <button>All Sessions</button>
        </div>
      </div>

      <div className="hero-controls">
        {/* previous / indicators / next */}
      </div>
    </section>
  );
}

export default Hero;