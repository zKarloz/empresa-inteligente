const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // El servidor valida el token. La antigua marca isAuthenticated ya no se utiliza.
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = sessionStorage.getItem("authToken");
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      typeof body?.detail === "string"
        ? body.detail
        : `No se pudo completar la solicitud (${response.status})`,
    );
  }
  return response.status === 204 ? (undefined as T) : response.json();
}
