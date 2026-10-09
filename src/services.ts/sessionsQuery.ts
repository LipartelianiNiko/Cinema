import type { SessionFilters } from "../pages/sessionsPage/filterPanel"; // keep your real path

export function buildSessionsQuery(filters: SessionFilters): string {
    const params = new URLSearchParams();

    params.set("date", filters.date);
    filters.venues.forEach((s) => params.append("venues[]", s));
    filters.formats.forEach((s) => params.append("formats[]", s));
    filters.languages.forEach((s) => params.append("languages[]", s));
    filters.bands.forEach((s) => params.append("bands[]", s));

    return `?${params.toString()}`;
}