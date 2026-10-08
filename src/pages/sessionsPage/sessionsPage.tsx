import MovieListCard from "./movieListCard";
import "./movieListCard.css"
function SessionsPage(){
    return(
        <div className="sessions-page">
            <div className="filters-frame"></div>


            <div className="sessions-pagination-frame">

                <div className="sessions-frame">

                    <div className="sessions-frame-header">
                        <div className="sesssions-header"></div>
                        <div className="sorting"></div>

                        <div>
                            <MovieListCard></MovieListCard>
                            <MovieListCard></MovieListCard>
                            <MovieListCard></MovieListCard>


                        </div>
                    </div>
                </div>
            </div>

        </div>
    )

}

export default SessionsPage;