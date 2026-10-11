import { useState } from "react";
import "./signUpModal.css";
import { getErrorMessage } from "../../services.ts/api";
import { login } from "../../services.ts/authServices";
import type { User } from "../../types/auth";

type LoginModalProps = {
    onClose: () => void;
    onSignUp: () => void;
    onSuccess: (user: User, token: string) => void;
};

function LoginModal({ onClose, onSignUp, onSuccess }: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await login(email, password);
            onSuccess(response.data.user, response.data.token);
        } catch (err) {
            setError(getErrorMessage(err)); // modal stays open, email stays filled in
            setLoading(false);
        }
    }

    return (
        <div
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="log-in-modal-frame">
                <div className="header">
                    <div className="title-welcome-frame">
                        <h2 className="sign-up-header">Log in</h2>
                        <p className="welcome">Welcome to Kino XII</p>
                    </div>
                    <button type="button" className="close-btn" onClick={onClose}>✖</button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form">
                        <div className="input-frame">
                            <div className="input-header">Email</div>
                            <input
                                className="username-email-input"
                                placeholder="example@gmail.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-frame">
                            <div className="input-header">Password</div>
                            <input
                                className="username-email-input"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <div className="btn-frame">
                        <button type="submit" className="sign-up-btn" disabled={loading}>
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                        <div className="footer">
                            <p className="already-have-account">Don't have an account?</p>
                            <p className="log-in-already" onClick={onSignUp}>Sign up</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;