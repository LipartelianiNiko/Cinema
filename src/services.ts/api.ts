//function for calling api, reusable

const BASE_URL = import.meta.env.VITE_API_BASE_URL;//server's base url imported from .env

export async function apiFetch<T>(
  endpoint: string,// for endpoint specification
  options?: RequestInit//optional
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}