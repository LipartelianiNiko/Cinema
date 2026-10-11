import { apiFetch } from "./api";
import type { Order } from "../types/booking";

export function getTickets(filter: "upcoming" | "past") {
    return apiFetch<{ data: Order[] }>(`/tickets?filter=${filter}`);
}

export function refundOrder(reference: string) {
    return apiFetch<{ data: Order }>(`/orders/${reference}/refund`, { method: "POST" });
}