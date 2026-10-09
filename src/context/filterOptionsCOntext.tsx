import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import { getFilterOptions } from "../services.ts/filterOptionsService";
import type { FilterOptions } from "../types/filterOptions";

type FilterOptionsContextValue = {
    options: FilterOptions | null;
    loading: boolean;
    error: string | null;
};

const FilterOptionsContext =
    createContext<FilterOptionsContextValue | undefined>(undefined);

type FilterOptionsProviderProps = {
    children: ReactNode;
};

export function FilterOptionsProvider({
    children
}: FilterOptionsProviderProps) {
    const [options, setOptions] = useState<FilterOptions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getFilterOptions()
            .then(setOptions)
            .catch(() => setError("Could not load configuration. Please retry."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <FilterOptionsContext.Provider value={{ options, loading, error }}>
            {children}
        </FilterOptionsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFilterOptions() {
    const context = useContext(FilterOptionsContext);

    if (!context) {
        throw new Error(
            "useFilterOptions must be used inside FilterOptionsProvider"
        );
    }

    return context;
}