import MovieListCard from "./movieListCard";
import "./SessionsPage.css";
import type { MovieSessionsGroup } from "../../types/allSessions";
import { getAllSessions } from "../../services.ts/movieServices";
import FilterPanel, { EMPTY_FILTERS, type SessionFilters } from "./filterPanel";
import { Fragment, useEffect, useState } from "react";

function getPageList(page: number, lastPage: number): (number | "…")[] {
    const nums = Array.from(new Set([1, page - 1, page, page + 1, lastPage]))
        .filter((n) => n >= 1 && n <= lastPage)
        .sort((a, b) => a - b);

    const result: (number | "…")[] = [];
    nums.forEach((n, i) => {
        if (i > 0 && n - nums[i - 1] > 1) result.push("…");
        result.push(n);
    });
    return result;
}

function SessionsPage() {
    const [filters, setFilters] = useState<SessionFilters>(EMPTY_FILTERS);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [totalSessions, setTotalSessions] = useState(0);
    const [allSessions, setAllSessions] = useState<MovieSessionsGroup[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const loadAllSessions = async () => {
            try {
                setLoading(true);
                const response = await getAllSessions(filters, page, controller.signal);
                setAllSessions(response.data);
                setLastPage(response.meta.lastPage);
                setTotalSessions(response.meta.totalSessions);
            } catch (error) {
                if (controller.signal.aborted) return;
                console.error("Failed to load sessions:", error);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        loadAllSessions();
        return () => controller.abort();
    }, [filters, page]);

    // Any filter change resets to page 1 (required by the API docs)
    const handleFiltersChange = (next: SessionFilters) => {
        setFilters(next);
        setPage(1);
    };

    const goToPage = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="sessions-page">
            <div className="filters-frame">
                <div className="filters-header-frame">
                    <div className="filters-header-sessions">Sessions</div>
                    <div className="filters-header-blabla">Browse showtimes across all venues</div>
                </div>

                <div className="filters">
                    <FilterPanel value={filters} onChange={handleFiltersChange} />
                </div>
            </div>

            <div className="sessions-pagination-frame">
                <div className="movies-list-frame-header">
                    <div className="movies-list-header">Showing {totalSessions} sessions</div>
                    <div className="sorting-frame">
                        <div className="sort">Sort:</div>
                        <div className="sort-by">Sort BY</div>
                    </div>
                </div>

                <div className={`movies-list-frame${loading ? " is-loading" : ""}`}>
                    {!loading && allSessions.length === 0 && (
                        <div className="movies-empty">No sessions found for these filters.</div>
                    )}
                    {allSessions.map((movieGroup) => (
                        <Fragment key={movieGroup.movie.id}>
                            <MovieListCard movieGroup={movieGroup} />
                            <div className="movies-border"></div>
                        </Fragment>
                    ))}
                </div>

                {lastPage > 1 && (
                    <nav className="pagination" aria-label="Pagination">
                        <button
                            type="button"
                            className="pg-btn pg-arrow"
                            aria-label="Previous page"
                            disabled={page <= 1}
                            onClick={() => goToPage(page - 1)}
                        >
                            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                                <path d="M7.5 2.5L4 6l3.5 3.5" fill="none" stroke="currentColor"
                                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {getPageList(page, lastPage).map((p, i) =>
                            p === "…" ? (
                                <span key={`dots-${i}`} className="pg-dots">…</span>
                            ) : (
                                <button
                                    key={p}
                                    type="button"
                                    className={`pg-btn${p === page ? " is-active" : ""}`}
                                    aria-current={p === page ? "page" : undefined}
                                    onClick={() => goToPage(p)}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            className="pg-btn pg-arrow"
                            aria-label="Next page"
                            disabled={page >= lastPage}
                            onClick={() => goToPage(page + 1)}
                        >
                            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                                <path d="M4.5 2.5L8 6l-3.5 3.5" fill="none" stroke="currentColor"
                                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </nav>
                )}
            </div>
        </div>
    );
}

export default SessionsPage;