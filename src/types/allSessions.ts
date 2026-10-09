export type AgeRating = {
    code: string;
    minAge: number;
    description: string;
};

export type Genre = {
    id: number;
    slug: string;
    name: string;
};

export type MovieFormat = {
    id: number;
    slug: string;
    name: string;
    priceUplift: number;
};

export type SessionVenue = {
    id: number;
    slug: string;
    name: string;
    city: string;
};

export type SessionHall = {
    id: number;
    name: string;
    venue: SessionVenue;
};

export type SessionLanguage = {
    id: number;
    slug: string;
    name: string;
    code: string;
};

export type SessionsListMovie = {
    id: number;
    slug: string;
    title: string;
    kind: string;
    runtimeMinutes: number;
    posterUrl: string;
    backdropUrl: string;
    releaseDate: string;
    isComingSoon: boolean;
    isNotified: boolean;
    isFeatured: boolean;
    fromPrice: number;
    ageRating: AgeRating;
    genres: Genre[];
    formats: MovieFormat[];
};

export type SessionListItem = {
    id: number;
    startsAt: string;
    date: string;
    time: string;
    timeBand: "morning" | "afternoon" | "evening";
    price: number;
    seatsLeft: number;
    isSoldOut: boolean;
    hall: SessionHall;
    venue: SessionVenue;
    format: MovieFormat;
    language: SessionLanguage;
    movie: SessionsListMovie;
};

//movie and its sessions, use this for rendering
export type MovieSessionsGroup = {
    movie: SessionsListMovie;
    sessions: SessionListItem[];
};

//for pagination and details
export type AllSessionsMeta = {
    currentPage: number;
    lastPage: number;
    perPage: number;
    totalSessions: number;
    totalMovies: number;
    date: string;
};

export type AllSessionsResponse = {
    data: MovieSessionsGroup[];
    meta: AllSessionsMeta;
};