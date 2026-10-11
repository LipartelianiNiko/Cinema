import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useFilterOptions } from "../../context/filterOptionsCOntext";
import { updateProfile } from "../../services.ts/authServices";
import { ApiError, getErrorMessage } from "../../services.ts/api";
import type { User } from "../../types/auth";
import TicketsTab from "./ticketsTab";
import "./profilePage.css";

function PersonalInfo({ user }: { user: User }) {
    const { updateUser } = useAuth();
    const { options } = useFilterOptions();

    const [fullName, setFullName] = useState(user.fullName ?? "");
    const [mobile, setMobile] = useState(user.mobileNumber ?? "");
    const [dob, setDob] = useState(user.dateOfBirth ?? "");
    const [venueId, setVenueId] = useState(user.preferredVenue ? String(user.preferredVenue.id) : "");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [message, setMessage] = useState("");
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFieldErrors({});
        setMessage("");
        setSaved(false);

        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("mobileNumber", mobile);
        formData.append("dateOfBirth", dob);
        if (venueId) formData.append("preferredVenueId", venueId);

        setLoading(true);
        try {
            const response = await updateProfile(formData);
            updateUser(response.data);
            setSaved(true);
        } catch (err) {
            const body = err instanceof ApiError ? (err.body as { errors?: Record<string, string[]> } | null) : null;
            if (body?.errors) setFieldErrors(body.errors);
            else setMessage(getErrorMessage(err));
        }
        setLoading(false);
    }

    // which age ratings this user may buy, from the age the server calculated
    const allowed = options?.ageRatings.filter((r) => user.age !== null && r.minAge <= user.age) ?? [];
    const allAllowed = options ? allowed.length === options.ageRatings.length : false;

    return (
        <form className="profile-form" onSubmit={handleSubmit}>
            {!user.profileComplete && (
                <div className="profile-banner">Profile incomplete. Please complete your profile to enable booking.</div>
            )}

            <label className="profile-field">
                <span className="profile-label">Full name</span>
                <input className="profile-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                {fieldErrors.fullName && <span className="profile-error">{fieldErrors.fullName[0]}</span>}
            </label>

            <label className="profile-field">
                <span className="profile-label">Email</span>
                <input className="profile-input" value={user.email} disabled />
                <span className="profile-hint">Set at registration and cannot be changed</span>
            </label>

            <label className="profile-field">
                <span className="profile-label">Mobile number</span>
                <input
                    className="profile-input"
                    placeholder="5XX XXX XXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />
                {fieldErrors.mobileNumber && <span className="profile-error">{fieldErrors.mobileNumber[0]}</span>}
            </label>

            <label className="profile-field">
                <span className="profile-label">Date of birth</span>
                <input className="profile-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                {fieldErrors.dateOfBirth && <span className="profile-error">{fieldErrors.dateOfBirth[0]}</span>}
                {user.age !== null && options && (
                    <span className="profile-hint">
                        You are {user.age}, you can buy tickets for{" "}
                        {allAllowed ? "all age ratings" : allowed.map((r) => r.code).join(", ")}
                    </span>
                )}
            </label>

            <label className="profile-field">
                <span className="profile-label">Preferred Venue (Optional)</span>
                <select className="profile-input" value={venueId} onChange={(e) => setVenueId(e.target.value)}>
                    <option value="">None</option>
                    {options?.venues.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                </select>
                {fieldErrors.preferredVenueId && <span className="profile-error">{fieldErrors.preferredVenueId[0]}</span>}
            </label>

            {message && <div className="profile-error">{message}</div>}
            {saved && <div className="profile-saved">Profile saved.</div>}

            <button type="submit" className="profile-save-btn" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
            </button>
        </form>
    );
}

function ProfilePage() {
    const { user, openLogin } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get("tab") === "tickets" ? "tickets" : "info";

    if (!user) {
        return (
            <div className="profile-page">
                <h1 className="profile-title">My Profile</h1>
                <p className="profile-hint">Please log in to see your profile.</p>
                <button className="profile-save-btn" onClick={() => openLogin()}>Log in</button>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <h1 className="profile-title">My Profile</h1>

            <div className="profile-tabs">
                <button
                    className={`profile-tab${tab === "info" ? " is-active" : ""}`}
                    onClick={() => setSearchParams({})}
                >
                    Personal Information
                </button>
                <button
                    className={`profile-tab${tab === "tickets" ? " is-active" : ""}`}
                    onClick={() => setSearchParams({ tab: "tickets" })}
                >
                    My Tickets
                </button>
            </div>

            {tab === "info" ? <PersonalInfo user={user} /> : <TicketsTab />}
        </div>
    );
}

export default ProfilePage;