const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    }
  );


  if (!response.ok) {
    throw new Error(
      `Error ${response.status}: ${response.statusText}`
    );
  }


  if (response.status === 204) {
    return undefined as T;
  }


  return response.json();
}