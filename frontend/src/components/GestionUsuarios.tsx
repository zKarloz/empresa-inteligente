import { useEffect, useRef, useState } from "react";
import {
    listarUsuarios,
    crearUsuario,
    cambiarEstadoUsuario,
    type UsuarioAdministrable,
} from "../services/auth";

export default function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState<UsuarioAdministrable[]>([]);
    const [formulario, setFormulario] = useState({ nombre: "", email: "", password: "" });
    const [cargando, setCargando] = useState(true);
    const [ocupado, setOcupado] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const bloqueo = useRef(false);

    useEffect(() => {
        let vigente = true;
        listarUsuarios()
            .then((datos) => {
                if (vigente) setUsuarios(datos);
            })
            .catch((e: unknown) => {
                if (vigente)
                    setError(e instanceof Error ? e.message : "No se pudo cargar la lista");
            })
            .finally(() => {
                if (vigente) setCargando(false);
            });
        return () => {
            vigente = false;
        };
    }, []);

    async function guardar(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (bloqueo.current) return;
        if (!formulario.nombre.trim()) {
            setError("Escribe el nombre del compañero");
            return;
        }
        bloqueo.current = true;
        setOcupado(true);
        setError("");
        setMensaje("");
        try {
            const usuario = await crearUsuario(
                formulario.nombre.trim(),
                formulario.email.trim(),
                formulario.password,
            );
            setUsuarios((anteriores) => [...anteriores, { ...usuario, rostro_registrado: false }]);
            setFormulario({ nombre: "", email: "", password: "" });
            setMensaje(
                "Cuenta creada. Comparte las credenciales en privado y pide al compañero cambiar su contraseña.",
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo crear la cuenta");
        } finally {
            bloqueo.current = false;
            setOcupado(false);
        }
    }

    async function cambiarEstado(usuario: UsuarioAdministrable) {
        if (bloqueo.current) return;
        if (
            usuario.activo &&
            !window.confirm(`¿Desactivar a ${usuario.nombre}? Se cerrarán sus sesiones.`)
        )
            return;
        bloqueo.current = true;
        setOcupado(true);
        setError("");
        setMensaje("");
        try {
            const resultado = await cambiarEstadoUsuario(usuario.id, !usuario.activo);
            setUsuarios((anteriores) =>
                anteriores.map((item) =>
                    item.id === usuario.id ? { ...item, activo: resultado.activo } : item,
                ),
            );
            setMensaje(
                resultado.activo
                    ? "Cuenta activada. Debe iniciar sesión nuevamente."
                    : "Cuenta desactivada y sesiones revocadas.",
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : "No se pudo actualizar la cuenta");
        } finally {
            bloqueo.current = false;
            setOcupado(false);
        }
    }

    return (
        <section id="usuarios" className="dashboard-panel">
            <div className="panel-header">
                <div>
                    <h2>Usuarios</h2>
                    <p>Crear y administrar cuentas de trabajadores</p>
                </div>
            </div>
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
            <form className="client-form" onSubmit={guardar}>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="usuario-nombre">Nombre</label>
                        <input
                            id="usuario-nombre"
                            value={formulario.nombre}
                            maxLength={150}
                            required
                            disabled={ocupado}
                            onChange={(e) =>
                                setFormulario({ ...formulario, nombre: e.target.value })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="usuario-correo">Correo</label>
                        <input
                            id="usuario-correo"
                            type="email"
                            value={formulario.email}
                            maxLength={254}
                            required
                            disabled={ocupado}
                            onChange={(e) =>
                                setFormulario({ ...formulario, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="usuario-password">
                            Contraseña inicial (mínimo 15 caracteres)
                        </label>
                        <input
                            id="usuario-password"
                            type="password"
                            autoComplete="new-password"
                            value={formulario.password}
                            minLength={15}
                            maxLength={256}
                            required
                            disabled={ocupado}
                            onChange={(e) =>
                                setFormulario({ ...formulario, password: e.target.value })
                            }
                        />
                    </div>
                </div>
                <button type="submit" className="primary-button" disabled={ocupado || cargando}>
                    {ocupado ? "Procesando…" : "Crear trabajador"}
                </button>
            </form>
            {cargando ? (
                <p role="status">Cargando usuarios…</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Rostro</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.usuario_email}</td>
                                    <td>{usuario.rol}</td>
                                    <td>
                                        {usuario.rostro_registrado ? "Registrado" : "Pendiente"}
                                    </td>
                                    <td>{usuario.activo ? "Activo" : "Inactivo"}</td>
                                    <td>
                                        {usuario.rol === "Trabajador" && (
                                            <button
                                                type="button"
                                                disabled={ocupado}
                                                className={
                                                    usuario.activo
                                                        ? "delete-button"
                                                        : "primary-button"
                                                }
                                                onClick={() => void cambiarEstado(usuario)}
                                            >
                                                {usuario.activo ? "Desactivar" : "Activar"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
