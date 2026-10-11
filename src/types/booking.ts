export type HoldSeat = {
    seatId: number;
    code: string;
    ticketType: { slug: string; name: string };
    price: number;
};

export type Hold = {
    holdId: string;
    sessionId: number;
    expiresAt: string;
    secondsRemaining: number;
    isLive: boolean;
    subtotal: number;
    seats: HoldSeat[];
};

export type HoldResponse = { data: Hold };

export type OrderRequest = {
    holdId: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
};

export type Order = {
    id: number;
    reference: string;
    status: string;
    totalPrice: number;
    refundedAt: string | null;
    isUpcoming: boolean;
    isRefundable: boolean;
    cardLastFour: string;
    session: {
        id: number;
        startsAt: string;
        date: string;
        time: string;
        hall: { name: string };
        venue: { name: string };
        format: { name: string };
        language: { name: string };
        movie: {
            title: string;
            posterUrl: string;
            runtimeMinutes: number;
            ageRating: { code: string };
        };
    };
    tickets: {
        id: number;
        seatCode: string;
        ticketType: { slug: string; name: string };
        price: number;
    }[];
};

export type OrderResponse = { data: Order };