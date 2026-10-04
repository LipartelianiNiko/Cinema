function CommingSoonMovieCard() {
  return (
    <article className="comming-soon-card">

        <img className="comming-soon-card-image">
        </img>

        <div className="comming-soon-card-content">
          <h3 className="comming-soon-card-title">
            Movie Title
          </h3>

          <div className="comming-soon-card-info">
            <span>Genre</span>
            <span>120 min</span>
            <span>16+</span>
          </div>

          <div className="comming-soon-bottom">
              <button className="comming-soon-notify-button">
                Notify Me
              </button>
          </div>


        </div>
    </article>
  );
}

export default CommingSoonMovieCard;