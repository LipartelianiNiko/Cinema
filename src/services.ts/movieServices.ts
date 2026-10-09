import { apiFetch } from "./api";
import type { FeaturedFilm } from "../types/movies";
import type { MovieDetailsResponse } from "../types/movieDetals";
import "../types/movieSessions";
import type { MovieSessionsResponse } from "../types/movieSessions";
import type {AllSessionsResponse} from "../types/allSessions"
import { buildSessionsQuery } from "./sessionsQuery";
import type { SessionFilters } from "../pages/sessionsPage/filterPanel";


type FeaturedFilmsResponse = {
  data: FeaturedFilm[];
};

export function getFeaturedFilms() {
  return apiFetch<FeaturedFilmsResponse>("/movies/featured");//use function declared in api.ts to get featued films, return is array of type i declared
}

export function getNowPlayingMovies() {
  return apiFetch<FeaturedFilmsResponse>("/movies/now-playing");
}

export function getCommingSoon() {
  return apiFetch<FeaturedFilmsResponse>("/movies/coming-soon");
}

export function getMovie(slug:string) {
  return apiFetch<MovieDetailsResponse>(`/movies/${slug}`);
}

export function getMovieSessions(slug: string, date: string) {
  return apiFetch<MovieSessionsResponse>(`/movies/${slug}/sessions?date=${date}`);
}

export function getAllSessions(filters?: SessionFilters, signal?: AbortSignal) {
  const query = filters ? buildSessionsQuery(filters) : "";
  return apiFetch<AllSessionsResponse>(`/sessions${query}`, { signal });
}