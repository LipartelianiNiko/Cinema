import type { SessionHall } from "./allSessions";

export type SeatState = "available" | "sold" | "held" | "unavailable";

export type Seat = {
    id: number;
    code: string;
    label: string;
    state: SeatState;
    aisleAfter: boolean;
    isMine: boolean;
};

export type SeatRow = {
    label: string;
    seats: Seat[];
};

export type SeatSection = {
    name: string;
    rows: SeatRow[];
};

export type SeatMapResponse = {
    data: {
        sessionId: number;
        hall: SessionHall;
        sections: SeatSection[];
    };
};