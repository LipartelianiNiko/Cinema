import { apiFetch } from "./api";
import type { AuthResponse, UserResponse } from "../types/auth";

export function login(email: string, password: string) {
    return apiFetch<AuthResponse>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function register(formData: FormData) {
    return apiFetch<AuthResponse>("/register", { method: "POST", body: formData });
}

export function logoutRequest() {
    return apiFetch<void>("/logout", { method: "POST" });
}

export function getMe() {
    return apiFetch<UserResponse>("/me");
}

export function updateProfile(formData: FormData) {
    return apiFetch<UserResponse>("/profile", { method: "PUT", body: formData });
}