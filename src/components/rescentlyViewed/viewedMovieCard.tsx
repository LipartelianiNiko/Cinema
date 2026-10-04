function ViewedRescentlyCard() {
  return (
    <article className="viewed-rescently-card">

        <img className="viewed-rescently-card-image">
        </img>

        <div className="viewed-rescently-card-content">
          <h3 className="viewed-rescently-card-title">
            Movie Title
          </h3>

          <div className="viewed-rescently-card-info">
            <span>Genre</span>
            <span>120 min</span>
            <span>16+</span>
          </div>


        </div>
    </article>
  );
}

export default ViewedRescentlyCard;