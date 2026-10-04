function NowPayingMovieCard() {
  return (
    <article className="now-playing-card">

        <img className="now-playing-card-image">
        </img>

        <div className="now-playing-card-content">
          <h3 className="now-playing-card-title">
            Movie Title
          </h3>

          <div className="now-playing-card-info">
            <span>Genre</span>
            <span>120 min</span>
            <span>16+</span>
          </div>

          <div className="now-playing-card-bottom">
              <span className="now-playing-card-price">
                From $10
              </span>

              <button className="now-playing-card-button">
                Buy Tickets
              </button>
          </div>


        </div>
    </article>
  );
}

export default NowPayingMovieCard;