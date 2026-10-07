export type HallGroup={
  hall:Hall;
  sessions:MovieSession[];
}

export type Venue = {
  id: number;
  slug: string;
  name: string;
  city: string;
};

export type Hall = {
  id: number;
  name: string;
  venue: Venue;
};

export type SessionFormat = {
  id: number;
  slug: string;
  name: string;
  priceUplift: number;
};

export type SessionLanguage = {
  id: number;
  slug: string;
  name: string;
  code: string;
};

export type MovieSession = {
  id: number;
  startsAt: string;
  date: string;
  time: string;
  timeBand: string;
  price: number;
  seatsLeft: number;
  isSoldOut: boolean;
  hall: Hall;
  venue: Venue;
  format: SessionFormat;
  language: SessionLanguage;
};

export type VenueSessions = {
  venue: Venue;
  sessions: MovieSession[];
};

export type MovieSessionsResponse = {//for the actual response
  data: VenueSessions[];
};


/* based on this 
{
  "data": [
    {
      "venue": {
        "id": 3,
        "slug": "rustaveli",
        "name": "Rustaveli Palace",
        "city": "Tbilisi"
      },
      "sessions": [
        {
          "id": 1197,
          "startsAt": "2026-10-07T22:00:00+00:00",
          "date": "2026-10-07",
          "time": "22:00",
          "timeBand": "evening",
          "price": 12,
          "seatsLeft": 40,
          "isSoldOut": false,
          "hall": {
            "id": 11,
            "name": "C",
            "venue": {
              "id": 3,
              "slug": "rustaveli",
              "name": "Rustaveli Palace",
              "city": "Tbilisi"
            }
          },
          "venue": {
            "id": 3,
            "slug": "rustaveli",
            "name": "Rustaveli Palace",
            "city": "Tbilisi"
          },
          "format": {
            "id": 1,
            "slug": "standard",
            "name": "Standard",
            "priceUplift": 0
          },
          "language": {
            "id": 3,
            "slug": "original-subtitles",
            "name": "Original with Subtitles",
            "code": "ENG"
          }
        }
      ]
    }
  ]
}*/