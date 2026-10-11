import { useState } from "react";
import "./signUpModal.css";
import { getErrorMessage } from "../../services.ts/api";
import { register } from "../../services.ts/authServices";
import type { User } from "../../types/auth";

type SignUpModalProps = {
    onClose: () => void;
    onLogin: () => void;
    onSuccess: (user: User, token: string) => void;
};

function SignUpModal({ onClose, onLogin, onSuccess }: SignUpModalProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("password_confirmation", confirm); // snake_case, as the docs say
        if (avatar) formData.append("avatar", avatar);

        setLoading(true);
        try {
            const response = await register(formData);
            onSuccess(response.data.user, response.data.token);
        } catch (err) {
            setError(getErrorMessage(err));
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
            <div className="sign-up-modal-frame">
                <div className="header">
                    <div className="title-welcome-frame">
                        <h2 className="sign-up-header">Sign up</h2>
                        <p className="welcome">Welcome to Kino XII</p>
                    </div>
                    <button type="button" className="close-btn" onClick={onClose}>✖</button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="avatar-upload-frame">
                        <label className="upload-box">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                hidden
                                onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
                            />
                        </label>
                        <div className="avatar-lables">
                            <div className="upload-avatar">Upload Avatar (optional)</div>
                            <div className="file-formats">{avatar ? avatar.name : "JPG, PNG or WEBP"}</div>
                        </div>
                    </div>

                    <div className="form">
                        <div className="input-frame">
                            <div className="input-header">Username</div>
                            <input
                                className="username-email-input"
                                placeholder="User"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

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

                        <div className="password-frame">
                            <div className="password-left">
                                <div className="password-input-header">Password</div>
                                <input
                                    className="password-input"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="password-right">
                                <div className="password-input-header">Confirm password</div>
                                <input
                                    className="password-confirm-input"
                                    placeholder="••••••••"
                                    type="password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <div className="btn-frame">
                        <button type="submit" className="sign-up-btn" disabled={loading}>
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                        <div className="footer">
                            <p className="already-have-account">Already have an account?</p>
                            <p className="log-in-already" onClick={onLogin}>Log in</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpModal;