import MovieListCard from "./movieListCard";
import "./SessionsPage.css"
import type {MovieSessionsGroup} from "../../types/allSessions"
import {getAllSessions} from "../../services.ts/movieServices"
import FilterPanel, { EMPTY_FILTERS, type SessionFilters } from "./filterPanel";
import { Fragment, useEffect, useState } from "react";



function SessionsPage(){
    const [filters, setFilters] = useState<SessionFilters>(EMPTY_FILTERS);


      const [allSessions, setAllSessions] = useState<MovieSessionsGroup[]>([]);//set featured films to be empty array, setFetaured changes it

        const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const loadAllSessions = async () => {
            try {
                setLoading(true);
                const response = await getAllSessions(filters, controller.signal);
                setAllSessions(response.data);
            } catch (error) {
                if (controller.signal.aborted) return; // cancelled by a newer request, not a real error
                console.error("Failed to load sessions:", error);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        loadAllSessions();
        return () => controller.abort(); // cancels the previous request when filters change
    }, [filters]);

        console.log(allSessions.map((g) => g.movie.id));
    return(
        <div className="sessions-page">
            <div className="filters-frame">
                <div className="filters-header-frame">
                    <div className="filters-header-sessions">Sessions</div>
                    <div className="filters-header-blabla">Browse showtimes across all venues</div>
                </div>

                <div className="filters">
                    <FilterPanel value={filters} onChange={setFilters} />
                </div>

            </div>


            <div className="sessions-pagination-frame">
                
                    <div className="movies-list-frame-header">
                        <div className="movies-list-header">Showing</div>
                        <div className="sorting-frame">
                            <div className="sort">Sort:</div>
                            <div className="sort-by">Sort BY</div>
                            
                            </div>
                    </div>

                <div className={`movies-list-frame${loading ? " is-loading" : ""}`}>
                    {allSessions.map((movieGroup) => (
                        <Fragment key={movieGroup.movie.id}>
                            <MovieListCard movieGroup={movieGroup} />
                            <div className="movies-border"></div>
                        </Fragment>
                    ))}
                </div>
                
            </div>

        </div>
    )

}

export default SessionsPage;