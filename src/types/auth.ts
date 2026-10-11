export type User = {
    id: number;
    username: string;
    email: string;
    avatar: string | null;
    fullName: string | null;
    mobileNumber: string | null;
    dateOfBirth: string | null;
    age: number | null;
    preferredVenue: { id: number; slug: string; name: string; city: string } | null;
    profileComplete: boolean;
};

export type UserResponse = { data: User };

export type AuthResponse = {
    data: { user: User; token: string };
};