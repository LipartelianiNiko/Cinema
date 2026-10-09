import type {
    FilterOptions,
    FilterOptionsResponse
} from "../types/filterOptions";


let filterOptionsRequest: Promise<FilterOptions> | null = null;

export function getFilterOptions(): Promise<FilterOptions> {
       console.log("API URL:", import.meta.env.VITE_API_BASE_URL);
    if (!filterOptionsRequest) {
        filterOptionsRequest = fetch(
            `${import.meta.env.VITE_API_BASE_URL}/filter-options`
        )
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch filter options");
                }

                const result: FilterOptionsResponse = await response.json();
                return result.data;
            })
            .catch((error: unknown) => {
                filterOptionsRequest = null;
                console.error("Filter options failed:", error);
                throw error;
    
            });
    }

    return filterOptionsRequest;
}