import { useRef, useState } from "react";
import { cambiarPassword } from "../services/auth";

export default function CambiarPassword() {
    const [actual, setActual] = useState("");
    const [nueva, setNueva] = useState("");
    const [repetida, setRepetida] = useState("");
    const [ocupado, setOcupado] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const bloqueo = useRef(false);

    async function guardar(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (bloqueo.current) return;
        setError("");
        setMensaje("");
        if (nueva !== repetida) {
            setError("Las contraseñas nuevas no coinciden");
            return;
        }
        bloqueo.current = true;
        setOcupado(true);
        try {
            await cambiarPassword(actual, nueva);
            setActual("");
            setNueva("");
            setRepetida("");
            setMensaje("Contraseña actualizada. Se cerraron las demás sesiones de tu cuenta.");
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo cambiar la contraseña");
        } finally {
            bloqueo.current = false;
            setOcupado(false);
        }
    }

    return (
        <section className="dashboard-panel">
            <div className="panel-header">
                <div>
                    <h2>Cambiar mi contraseña</h2>
                    <p>Usa una contraseña propia de al menos 15 caracteres.</p>
                </div>
            </div>
            <form className="client-form" onSubmit={guardar}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="password-actual">Contraseña actual</label>
                        <input
                            id="password-actual"
                            type="password"
                            autoComplete="current-password"
                            value={actual}
                            required
                            maxLength={256}
                            disabled={ocupado}
                            onChange={(e) => setActual(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password-nueva">Nueva contraseña</label>
                        <input
                            id="password-nueva"
                            type="password"
                            autoComplete="new-password"
                            value={nueva}
                            required
                            minLength={15}
                            maxLength={256}
                            disabled={ocupado}
                            onChange={(e) => setNueva(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password-repetida">Repetir nueva contraseña</label>
                        <input
                            id="password-repetida"
                            type="password"
                            autoComplete="new-password"
                            value={repetida}
                            required
                            minLength={15}
                            maxLength={256}
                            disabled={ocupado}
                            onChange={(e) => setRepetida(e.target.value)}
                        />
                    </div>
                </div>
                <button type="submit" className="primary-button" disabled={ocupado}>
                    {ocupado ? "Guardando…" : "Cambiar contraseña"}
                </button>
            </form>
            {error && (
                <p role="alert" className="message-error">
                    {error}
                </p>
            )}
            {mensaje && (
                <p role="status" className="message-success">
                    {mensaje}
                </p>
            )}
        </section>
    );
}
