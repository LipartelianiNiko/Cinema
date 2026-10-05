// Hero.types.ts
export type FeaturedFilm = {
  id: number;
  slug: string;
  title: string;
  runtimeMinutes: number;
  backdropUrl: string;
  fromPrice: number;
  synopsis: string;
  isFeatured: boolean;
  ageRating: {
    code: string;
    minAge: number;
    description: string;
  };
};

/*bassed on this
 {
      "id": 1,
      "slug": "the-end-of-oak-street-1101383",
      "title": "The End of Oak Street",
      "kind": "film",
      "runtimeMinutes": 100,
      "posterUrl": "https://image.tmdb.org/t/p/w500/fYXqpgPmHMphSF2W30GbTeJVIa5.jpg",
      "backdropUrl": "https://image.tmdb.org/t/p/w1280/b9q9VmbXDvJmTziRqkwdEmFdwhr.jpg",
      "releaseDate": "2026-08-12",
      "isComingSoon": false,
      "isNotified": false,
      "isFeatured": true,
      "fromPrice": 14,
      "ageRating": {
        "code": "12+",
        "minAge": 12,
        "description": "Not recommended for under-12s. Tickets require an account aged 12 or over."
      },
      "genres": [
        {
          "id": 1,
          "slug": "science-fiction",
          "name": "Science Fiction"
        },
        {
          "id": 2,
          "slug": "mystery",
          "name": "Mystery"
        },
        {
          "id": 3,
          "slug": "thriller",
          "name": "Thriller"
        }
      ],
      "formats": [
        {
          "id": 3,
          "slug": "atmos",
          "name": "ATMOS",
          "priceUplift": 4
        },
        {
          "id": 5,
          "slug": "motion",
          "name": "MOTION",
          "priceUplift": 8
        }
      ],
      "synopsis": "After a mysterious cosmic event rips Oak Street from suburbia and transports their neighborhood to someplace unknown, the Platt family soon discovers that their very survival depends on them sticking together as they navigate their now unrecognizable surroundings."
    },
*/