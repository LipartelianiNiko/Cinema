import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/auth";
import { getMe, logoutRequest } from "../services.ts/authServices";
import { ApiError } from "../services.ts/api";
import LoginModal from "../components/auth/logInModal";
import SignUpModal from "../components/auth/signUpModal";

type AuthContextValue = {
    user: User | null;
    openLogin: (afterLogin?: () => void) => void;
    openSignUp: () => void;
    updateUser: (user: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getSavedUser(): User | null {
    const saved = localStorage.getItem("user");
    if (!saved || !localStorage.getItem("token")) return null;
    return JSON.parse(saved);
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(getSavedUser);
    const [modal, setModal] = useState<"login" | "signup" | null>(null);
    const afterLogin = useRef<(() => void) | null>(null);
    const navigate = useNavigate();

    // on page load: refresh the user from the server
    useEffect(() => {
        if (!localStorage.getItem("token")) return;

        getMe()
            .then((response) => {
                localStorage.setItem("user", JSON.stringify(response.data));
                setUser(response.data);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            });
    }, []);

    function openLogin(action?: () => void) {
        afterLogin.current = action ?? null;
        setModal("login");
    }

    function openSignUp() {
        setModal("signup");
    }

    function closeModal() {
        afterLogin.current = null;
        setModal(null);
    }

    function updateUser(newUser: User) {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    }

    function handleSuccess(newUser: User, token: string) {
        localStorage.setItem("token", token);
        updateUser(newUser);
        setModal(null);

        if (newUser.profileComplete) {
            afterLogin.current?.();
        } else {
            navigate("/profile"); // booking is blocked until the profile is filled in
        }
        afterLogin.current = null;
    }

    function logout() {
        logoutRequest().catch(() => {});
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, openLogin, openSignUp, updateUser, logout }}>
            {children}

            {modal === "login" && (
                <LoginModal onClose={closeModal} onSignUp={openSignUp} onSuccess={handleSuccess} />
            )}
            {modal === "signup" && (
                <SignUpModal onClose={closeModal} onLogin={() => setModal("login")} onSuccess={handleSuccess} />
            )}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}