import { apiFetch } from "./api";
import type { FeaturedFilm } from "../components/hero/hero.types";

type FeaturedFilmsResponse = {
  data: FeaturedFilm[];
};

export function getFeaturedFilms() {
  return apiFetch<FeaturedFilmsResponse>("/movies/featured");//use function declared in api.ts to get featued films, return is array of type i declared
}