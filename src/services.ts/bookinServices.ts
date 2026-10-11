import { apiFetch } from "./api";
import type { HoldResponse, OrderRequest, OrderResponse } from "../types/booking";

export function holdSeats(sessionId: number, seats: { seatId: number; ticketType: string }[]) {
    return apiFetch<HoldResponse>(`/sessions/${sessionId}/holds`, {
        method: "POST",
        body: JSON.stringify({ seats }),
    });
}

export function getHold(holdId: string) {
    return apiFetch<HoldResponse>(`/holds/${holdId}`);
}

export function releaseHold(holdId: string) {
    return apiFetch<void>(`/holds/${holdId}`, { method: "DELETE" });
}

export function createOrder(body: OrderRequest) {
    return apiFetch<OrderResponse>("/orders", {
        method: "POST",
        body: JSON.stringify(body),
    });
}