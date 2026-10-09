import { useMemo } from "react";
import { useFilterOptions } from "../../context/filterOptionsCOntext";
import "./FilterPanel.css";

export type SessionFilters = {
    venues: string[];    // slugs
    formats: string[];   // slugs
    languages: string[]; // slugs
    bands: string[];     // "morning" | "afternoon" | "evening"
    date: string;        // "YYYY-MM-DD", always exactly one
};

function toISO(d: Date) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

// eslint-disable-next-line react-refresh/only-export-components
export const EMPTY_FILTERS: SessionFilters = {
    venues: [],
    formats: [],
    languages: [],
    bands: [],
    date: toISO(new Date()),
};

const DATE_RANGE_DAYS = 14;

function toggleIn<T>(list: T[], item: T): T[] {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

type CheckRowProps = {
    label: string;
    hint?: string;
    checked: boolean;
    onChange: () => void;
};

function CheckRow({ label, hint, checked, onChange }: CheckRowProps) {
    return (
        <label className="fp-check">
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="fp-box" aria-hidden="true">
                <svg viewBox="0 0 12 12" width="10" height="10">
                    <path
                        d="M2.5 6.2l2.4 2.4 4.6-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className="fp-label">{label}</span>
            {hint && <span className="fp-hint">· {hint}</span>}
        </label>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="fp-section">
            <h3 className="fp-section-title">{title}</h3>
            {children}
        </section>
    );
}

type FilterPanelProps = {
    value: SessionFilters;
    onChange: (next: SessionFilters) => void;
};

export default function FilterPanel({ value, onChange }: FilterPanelProps) {
    const { options, loading, error } = useFilterOptions();

    const dates = useMemo(
        () =>
            Array.from({ length: DATE_RANGE_DAYS }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                return {
                    id: toISO(d),
                    day: d.toLocaleDateString("en-US", { weekday: "short" }),
                    num: d.getDate(),
                };
            }),
        []
    );

    if (loading) return <div className="fp-status">Loading filters…</div>;
    if (error || !options) {
        return <div className="fp-status fp-status--error">{error ?? "No filters available."}</div>;
    }

    // Formats offered by the selected venues (all formats if no venue selected)
    const selectedVenues = options.venues.filter((v) => value.venues.includes(v.slug));
    const visibleFormats =
        selectedVenues.length === 0
            ? options.formats
            : options.formats.filter((f) =>
                  selectedVenues.some((v) => v.formats.some((vf) => vf.slug === f.slug))
              );

    // Toggling a venue also drops selected formats the remaining venues don't have
    const toggleVenue = (slug: string) => {
        const venues = toggleIn(value.venues, slug);
        const chosen = options.venues.filter((v) => venues.includes(v.slug));
        const formats =
            chosen.length === 0
                ? value.formats
                : value.formats.filter((fs) =>
                      chosen.some((v) => v.formats.some((vf) => vf.slug === fs))
                  );
        onChange({ ...value, venues, formats });
    };

    // Date is always on, so it isn't counted
    const activeCount =
        value.venues.length + value.formats.length + value.languages.length + value.bands.length;

    return (
        <>
            <div className="fp-body">
                <h2 className="fp-title">Filters</h2>

                <Section title="Venue">
                    {options.venues.map((v) => (
                        <CheckRow
                            key={v.id}
                            label={v.name}
                            hint={v.city}
                            checked={value.venues.includes(v.slug)}
                            onChange={() => toggleVenue(v.slug)}
                        />
                    ))}
                </Section>

                <Section title="Date">
                    <div className="fp-dates">
                        {dates.map((d) => {
                            const active = value.date === d.id;
                            return (
                                <button
                                    key={d.id}
                                    type="button"
                                    className={`fp-date${active ? " is-active" : ""}`}
                                    aria-pressed={active}
                                    onClick={() => onChange({ ...value, date: d.id })}
                                >
                                    <span className="fp-date-day">{d.day}</span>
                                    <span className="fp-date-num">{d.num}</span>
                                </button>
                            );
                        })}
                    </div>
                </Section>

                <Section title="Format">
                    {visibleFormats.map((f) => (
                        <CheckRow
                            key={f.id}
                            label={f.name}
                            checked={value.formats.includes(f.slug)}
                            onChange={() =>
                                onChange({ ...value, formats: toggleIn(value.formats, f.slug) })
                            }
                        />
                    ))}
                </Section>

                <Section title="Language">
                    {options.languages.map((l) => (
                        <CheckRow
                            key={l.id}
                            label={l.name}
                            checked={value.languages.includes(l.slug)}
                            onChange={() =>
                                onChange({ ...value, languages: toggleIn(value.languages, l.slug) })
                            }
                        />
                    ))}
                </Section>

                <Section title="Time of day">
                    {options.timeBands.map((t) => (
                        <CheckRow
                            key={t.id}
                            label={t.label}
                            checked={value.bands.includes(t.id)}
                            onChange={() =>
                                onChange({ ...value, bands: toggleIn(value.bands, t.id) })
                            }
                        />
                    ))}
                </Section>
            </div>

            <div className="fp-footer">
                {activeCount > 0 && (
                    <button
                        type="button"
                        className="fp-clear"
                        onClick={() => onChange({ ...EMPTY_FILTERS, date: value.date })}
                    >
                        Clear filters
                    </button>
                )}
                <span className="fp-count">
                    {activeCount} filter{activeCount === 1 ? "" : "s"} active
                </span>
            </div>
        </>
    );
}