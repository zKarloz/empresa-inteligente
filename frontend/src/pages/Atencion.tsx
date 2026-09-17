import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { obtenerClientes, type Cliente } from "../services/clientes";
import { obtenerComentarios, eliminarComentario, type Comentario } from "../services/comentarios";
import {
  obtenerTiemposAtencion,
  crearTiempoAtencion,
  eliminarTiempoAtencion,
  type TiempoAtencion,
} from "../services/tiempoAtencion";
import { obtenerAnalisisNLP, type AnalisisNLP } from "../services/nlp";

const bandejas = [
  ["TODOS", "Todos"], ["VENTAS", "Ventas"], ["SOPORTE", "Soporte"],
  ["RECLAMO", "Reclamos"], ["CONSULTA", "Consultas"],
  ["FELICITACION", "Felicitaciones"], ["OTROS", "Otros"],
  ["SIN_ANALIZAR", "Sin analizar"], ["SIN_CATEGORIA", "Sin categoría"],
] as const;
type Bandeja = typeof bandejas[number][0];

function Atencion() {
  const location = useLocation();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [tiempos, setTiempos] = useState<TiempoAtencion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bandeja, setBandeja] = useState<Bandeja>("TODOS");
  const [falloCarga, setFalloCarga] = useState(false);

  // FORMULARIO TIEMPO
  const [clienteTiempo, setClienteTiempo] = useState("");
  const [comentarioTiempo, setComentarioTiempo] = useState("");
  const [minutos, setMinutos] = useState("");
  const [operador, setOperador] = useState("");
  const [analisisGuardados, setAnalisisGuardados] = useState<AnalisisNLP[]>([]);

  // CARGAR DATOS
  async function cargarDatos() {
    try {
      setCargando(true);
      setFalloCarga(false);
      const [datosClientes, datosComentarios, datosTiempos, datosAnalisis] =
        await Promise.all([
          obtenerClientes(),
          obtenerComentarios(),
          obtenerTiemposAtencion(),
          obtenerAnalisisNLP(),
        ]);
      setClientes(datosClientes);
      setComentarios(datosComentarios);
      setTiempos(datosTiempos);
      setAnalisisGuardados(datosAnalisis);
      setError(null);
    } catch (error) {
      console.error(error);
      setFalloCarga(true);
      setError("No se pudieron cargar los datos de atención. Pulsa Actualizar bandejas para reintentar.");
    } finally {
      setCargando(false);
    }
  }
  useEffect(() => {
    cargarDatos();
  }, []);

  // NAVEGACIÓN DESDE EL SIDEBAR
  useEffect(() => {
    if (!location.hash || cargando) {
      return;
    }
    const id = location.hash.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash, cargando]);

  // CREAR TIEMPO
  async function guardarTiempo(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const valorMinutos = Number(minutos);
    if (Number.isNaN(valorMinutos) || valorMinutos <= 0) {
      setError("Ingresa un tiempo válido en minutos");
      return;
    }
    try {
      await crearTiempoAtencion({
        cliente_id: clienteTiempo ? Number(clienteTiempo) : null,
        comentario_id: comentarioTiempo ? Number(comentarioTiempo) : null,
        tiempo_minutos: valorMinutos,
        operador: operador.trim() || null,
      });
      setClienteTiempo("");
      setComentarioTiempo("");
      setMinutos("");
      setOperador("");
      await cargarDatos();
    } catch (error) {
      console.error(error);
      setError("No se pudo registrar el tiempo de atención");
    }
  }

  // ELIMINAR
  async function borrarComentario(comentario: Comentario) {
    const confirmar = window.confirm(`¿Eliminar el comentario #${comentario.id}?`);
    if (!confirmar) return;
    try {
      await eliminarComentario(comentario.id);
      await cargarDatos();
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar el comentario");
    }
  }
  async function borrarTiempo(tiempo: TiempoAtencion) {
    const confirmar = window.confirm(
      `¿Eliminar el registro de ${tiempo.tiempo_minutos} minutos?`,
    );
    if (!confirmar) return;
    try {
      await eliminarTiempoAtencion(tiempo.id);
      await cargarDatos();
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar el tiempo");
    }
  }

  // Construir índices solo cuando cambian los datos, no por cada fila mostrada.
  const indices = useMemo(
    () => ({
      clientes: new Map(clientes.map((cliente) => [cliente.id, cliente])),
      comentarios: new Map(comentarios.map((comentario) => [comentario.id, comentario])),

      // Usar el mayor ID como en el backend, sin depender del orden recibido.
      analisis: analisisGuardados.reduce((mapa, item) => {
        const anterior = mapa.get(item.comentario_id);
        if (!anterior || item.id > anterior.id) mapa.set(item.comentario_id, item);
        return mapa;
      }, new Map<number, AnalisisNLP>()),
    }),
    [clientes, comentarios, analisisGuardados],
  );

  // UTILIDAD
  function nombreCliente(clienteId: number | null) {
    if (!clienteId) {
      return "Sin cliente";
    }
    const cliente = indices.clientes.get(clienteId);
    return cliente?.nombre ?? `Cliente #${clienteId}`;
  }
  function nombreRemitente(comentario: Comentario) {
    const nombreCompleto = [comentario.nombre_cliente, comentario.apellido_cliente]
      .filter(Boolean)
      .join(" ")
      .trim();
    return nombreCompleto || nombreCliente(comentario.cliente_id);
  }
  function bandejaComentario(comentario: Comentario): Bandeja {
    if (!comentario.procesado) return "SIN_ANALIZAR";
    const categoria = indices.analisis.get(comentario.id)?.categoria_detectada?.trim().toUpperCase();
    // No usar la categoría manual ni convertir categorías desconocidas en OTROS.
    return bandejas.find(([clave]) => !["TODOS", "SIN_ANALIZAR", "SIN_CATEGORIA"].includes(clave)
      && clave === categoria)?.[0] ?? "SIN_CATEGORIA";
  }
  function categoriaNLP(comentario: Comentario) {
    const clave = bandejaComentario(comentario);
    return bandejas.find(([valor]) => valor === clave)?.[1] ?? "Sin categoría";
  }
  const conteos: Record<string, number> = { TODOS: comentarios.length };
  for (const comentario of comentarios) {
    const clave = bandejaComentario(comentario);
    conteos[clave] = (conteos[clave] ?? 0) + 1;
  }
  const comentariosFiltrados = bandeja === "TODOS" ? comentarios
    : comentarios.filter(comentario => bandejaComentario(comentario) === bandeja);

  function nombreEnTiempo(tiempo: TiempoAtencion) {
    const comentario =
      tiempo.comentario_id == null
        ? undefined
        : indices.comentarios.get(tiempo.comentario_id);
    return comentario ? nombreRemitente(comentario) : nombreCliente(tiempo.cliente_id);
  }

  // INTERFAZ
  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Atención</h1>
          <p>Gestión de comentarios y tiempos de atención</p>
        </div>
      </header>
      {error && <div className="message-error">{error}</div>}
      {/* FORMULARIOS */}
      <section className="dashboard-panel">
        {/* TIEMPO */}
        <div className="panel-header">
          <div>
            <h2>Tiempo de atención</h2>
            <p>Registrar duración de una atención</p>
          </div>
        </div>
        <form className="client-form" onSubmit={guardarTiempo}>
          <div className="form-group">
            <label>Cliente</label>
            <select
              value={clienteTiempo}
              onChange={(evento) => setClienteTiempo(evento.target.value)}
            >
              <option value="">Sin cliente asociado</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Comentario relacionado</label>
            <select
              value={comentarioTiempo}
              onChange={(evento) => setComentarioTiempo(evento.target.value)}
            >
              <option value="">Ninguno</option>
              {comentarios.map((comentario) => (
                <option key={comentario.id} value={comentario.id}>
                  #{comentario.id} - {nombreRemitente(comentario)} -{" "}
                  {comentario.contenido.slice(0, 35)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Tiempo (minutos) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={minutos}
                onChange={(evento) => setMinutos(evento.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Operador</label>
              <input
                type="text"
                value={operador}
                onChange={(evento) => setOperador(evento.target.value)}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="primary-button">
              Registrar tiempo
            </button>
          </div>
        </form>
      </section>
      {/* COMENTARIOS */}
      <section id="comentarios" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Comentarios</h2>
            <p>Organizados por la clasificación automática de NLTK. Todos los trabajadores
              pueden ver estas bandejas.</p>
          </div>
        </div>
        <button type="button" className="secondary-button" disabled={cargando}
          onClick={() => void cargarDatos()}>Actualizar bandejas</button>
        {!cargando && !falloCarga && (
          <>
            <div className="attention-inboxes" role="group" aria-label="Filtrar comentarios por categoría">
              {bandejas.map(([clave, etiqueta]) => (
                <button key={clave} type="button" className="attention-inbox"
                  aria-pressed={bandeja === clave} aria-controls="attention-comments-result"
                  onClick={() => setBandeja(clave)}>
                  {etiqueta} <span>{conteos[clave] ?? 0}</span>
                </button>
              ))}
            </div>
            <p role="status">{comentariosFiltrados.length} de {comentarios.length} comentarios
              en {bandejas.find(([clave]) => clave === bandeja)?.[1]}.</p>
            {bandeja === "SIN_CATEGORIA" && <p>El comentario figura como procesado,
              pero falta una categoría reconocida. Revisa o reanaliza su resultado en Inteligencia NLP.</p>}
            {bandeja === "SIN_ANALIZAR" && <p>Puedes procesar estos comentarios desde Inteligencia NLP.</p>}
          </>
        )}
        <div id="attention-comments-result" aria-busy={cargando}>
          {cargando ? (
            <Loading texto="Cargando datos de atención..." />
          ) : falloCarga ? (
            <p>No se pueden mostrar las bandejas hasta cargar los comentarios y sus análisis.</p>
          ) : comentariosFiltrados.length === 0 ? (
            <p>{comentarios.length ? "No hay comentarios en esta bandeja." : "No existen comentarios."}</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre y apellido</th>
                    <th>Empresa</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Comentario</th>
                    <th>Canal</th>
                    <th>Categoría NLTK</th>
                    <th>NLP</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comentariosFiltrados.map((comentario) => (
                    <tr key={comentario.id}>
                      <td>{comentario.id}</td>
                      <td>{nombreRemitente(comentario)}</td>
                      <td>{comentario.empresa_cliente || "—"}</td>
                      <td>{comentario.telefono_cliente || "—"}</td>
                      <td>{comentario.correo_cliente || "—"}</td>
                      <td>{comentario.contenido}</td>
                      <td>{comentario.canal}</td>
                      <td>{categoriaNLP(comentario)}</td>
                      <td>
                        <span
                          className={
                            comentario.procesado
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {comentario.procesado ? "Procesado" : "Pendiente"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => borrarComentario(comentario)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      {/* TIEMPOS */}
      <section id="tiempos" className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Tiempos de atención</h2>
            <p>{tiempos.length} registros</p>
          </div>
        </div>
        {tiempos.length === 0 ? (
          <p>No existen tiempos registrados.</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Comentario</th>
                  <th>Minutos</th>
                  <th>Operador</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tiempos.map((tiempo) => (
                  <tr key={tiempo.id}>
                    <td>{tiempo.id}</td>
                    <td>{nombreEnTiempo(tiempo)}</td>
                    <td>
                      {tiempo.comentario_id
                        ? `#${tiempo.comentario_id}`
                        : "—"}
                    </td>
                    <td>
                      <strong>{tiempo.tiempo_minutos} min</strong>
                    </td>
                    <td>{tiempo.operador ?? "—"}</td>
                    <td>{tiempo.fecha ?? "—"}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => borrarTiempo(tiempo)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
export default Atencion;
