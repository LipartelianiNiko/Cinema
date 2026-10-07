import type { Genre } from "./genres";

export type MovieDetails = {
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

  ageRating: {
    code: string;
    minAge: number;
    description: string;
  };

  genres: Genre[];

  formats: {
    id: number;
    slug: string;
    name: string;
    priceUplift: number;
  }[];

  synopsis: string;
  director: string;
  cast: string;
  availableDates: string[];
};

export type MovieDetailsResponse = {
  data: MovieDetails;
};



/**{
  "data": {
    "id": 23,
    "slug": "buddy-1514026",
    "title": "Buddy",
    "kind": "film",
    "runtimeMinutes": 95,
    "posterUrl": "https://image.tmdb.org/t/p/w500/szMG36D2cIxeQ7i5zRQbq0DnNDe.jpg",
    "backdropUrl": "https://image.tmdb.org/t/p/w1280/ytoLEl5yDaxB8AtZ52uKWjaQ9ql.jpg",
    "releaseDate": "2026-08-27",
    "isComingSoon": false,
    "isNotified": false,
    "isFeatured": false,
    "fromPrice": 12,
    "ageRating": {
      "code": "16+",
      "minAge": 16,
      "description": "Restricted to viewers aged 16 and over. Child tickets are unavailable."
    },
    "genres": [
      {
        "id": 4,
        "slug": "horror",
        "name": "Horror"
      },
      {
        "id": 6,
        "slug": "comedy",
        "name": "Comedy"
      },
      {
        "id": 12,
        "slug": "fantasy",
        "name": "Fantasy"
      }
    ],
    "formats": [
      {
        "id": 4,
        "slug": "panorama",
        "name": "PANORAMA",
        "priceUplift": 5
      }
    ],
    "synopsis": "A magical, singing orange unicorn holds his cast hostage in a surreal TV-show dimension, as he becomes more and more demented.",
    "director": "Casper Kelly",
    "cast": "Keegan-Michael Key, Cristin Milioti, Delaney Quinn",
    "availableDates": [
      "2026-10-07",
      "2026-10-08",
      "2026-10-09",
      "2026-10-10",
      "2026-10-11",
      "2026-10-12",
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
      "2026-10-19",
      "2026-10-20"
    ]
  }
} */