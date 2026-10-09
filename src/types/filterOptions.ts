export type FilterFormat = {
    id: number;
    slug: string;
    name: string;
    priceUplift: number;
};

export type FilterVenue = {
    id: number;
    slug: string;
    name: string;
    city: string;
    formats: FilterFormat[];
};

export type FilterLanguage = {
    id: number;
    slug: string;
    name: string;
    code: string;
};

export type FilterTimeBand = {
    id: string;
    label: string;
};

export type FilterSort = {
    id: string;
    label: string;
};

export type TicketTypeOption = {
    id: number;
    slug: string;
    name: string;
    priceRatio: number;
    note: string | null;
    blockedFromRatingAge: number | null;
};

export type AgeRatingOption = {
    code: string;
    minAge: number;
    description: string;
};

export type FilterOptions = {
    venues: FilterVenue[];
    formats: FilterFormat[];
    languages: FilterLanguage[];
    timeBands: FilterTimeBand[];
    sorts: FilterSort[];
    ticketTypes: TicketTypeOption[];
    ageRatings: AgeRatingOption[];
    maxSeatsPerOrder: number;
    holdMinutes: number;
};

export type FilterOptionsResponse = {
    data: FilterOptions;
};