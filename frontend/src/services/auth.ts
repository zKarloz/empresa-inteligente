import { apiFetch } from "./api";

export interface Usuario {
    id: number;
    activo: boolean;
    usuario_email: string;
    nombre: string;
    rol: "Administrador" | "Trabajador";
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

// Administración de compañeros; el backend también comprueba el rol.
export interface UsuarioAdministrable extends Usuario {
    rostro_registrado: boolean;
}
export const listarUsuarios = () => apiFetch<UsuarioAdministrable[]>("/api/auth/usuarios");
export function crearUsuario(nombre: string, email: string, password: string) {
    return apiFetch<Usuario>("/api/auth/usuarios", {
        method: "POST",
        body: JSON.stringify({ nombre, email, password }),
    });
}
export function cambiarEstadoUsuario(id: number, activo: boolean) {
    return apiFetch<{ id: number; activo: boolean }>(`/api/auth/usuarios/${id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ activo }),
    });
}
export async function cambiarPassword(passwordActual: string, passwordNueva: string) {
    const respuesta = await apiFetch<{ token: string }>("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({ password_actual: passwordActual, password_nueva: passwordNueva }),
    });
    // Conservar la sesión de esta pestaña; el servidor revoca las demás.
    guardarSesion(respuesta.token);
}
