import { apiFetch } from "./api";
import type { FeaturedFilm } from "../types/movies";

type FeaturedFilmsResponse = {
  data: FeaturedFilm[];
};

export function getFeaturedFilms() {
  return apiFetch<FeaturedFilmsResponse>("/movies/featured");//use function declared in api.ts to get featued films, return is array of type i declared
}

export function getNowPlayingMovies() {
  return apiFetch<FeaturedFilmsResponse>("/movies/now-playing");
}