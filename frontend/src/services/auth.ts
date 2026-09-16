import { apiFetch } from "./api";

export interface Usuario {
    usuario_email: string;
    nombre: string;
    rol: string;
}
export interface Acceso {
    token: string;
    facial_pendiente: boolean;
    usuario_email: string;
}

export function iniciarSesion(email: string, password: string, facial: boolean) {
    return apiFetch<Acceso>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, facial }),
    });
}
export function guardarSesion(token: string) {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.setItem("authToken", token);
}
export const obtenerUsuario = () => apiFetch<Usuario>("/api/auth/me");
export async function cerrarSesion() {
    // Esperar la revocación antes de abandonar la pantalla. Si falla, permitir reintentar.
    await apiFetch<void>("/api/auth/logout", { method: "POST" });
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("isAuthenticated");
}
