import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Loading from "../components/Loading";

import {
  obtenerClientes,
  type Cliente,
} from "../services/clientes";

import {
  obtenerComentarios,
  eliminarComentario,
  type Comentario,
} from "../services/comentarios";

import {
  obtenerTiemposAtencion,
  crearTiempoAtencion,
  eliminarTiempoAtencion,
  type TiempoAtencion,
} from "../services/tiempoAtencion";

import {
  obtenerAnalisisNLP,
  type AnalisisNLP,
} from "../services/nlp";


function Atencion() {
  const location = useLocation();

  const [clientes, setClientes] =
    useState<Cliente[]>([]);

  const [comentarios, setComentarios] =
    useState<Comentario[]>([]);

  const [tiempos, setTiempos] =
    useState<TiempoAtencion[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  // FORMULARIO TIEMPO
  const [clienteTiempo, setClienteTiempo] =
    useState("");

  const [comentarioTiempo, setComentarioTiempo] =
    useState("");

  const [minutos, setMinutos] =
    useState("");

  const [operador, setOperador] =
    useState("");


  const [analisisGuardados, setAnalisisGuardados] =
  useState<AnalisisNLP[]>([]);

  // ============================================
  // CARGAR DATOS
  // ============================================

  async function cargarDatos() {
    try {
      setCargando(true);

      const [
        datosClientes,
        datosComentarios,
        datosTiempos,
        datosAnalisis,
      ] = await Promise.all([
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

      setError(
        "No se pudieron cargar los datos de atención"
      );

    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarDatos();
  }, []);

  // ============================================
  // NAVEGACIÓN DESDE EL SIDEBAR
  // ============================================

  useEffect(() => {
    if (!location.hash || cargando) {
      return;
    }

    const id = location.hash.replace("#", "");

    const elemento =
      document.getElementById(id);

    if (elemento) {
      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [location.hash, cargando]);


  // ============================================
  // CREAR TIEMPO
  // ============================================

  async function guardarTiempo(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    const valorMinutos = Number(minutos);

    if (
      Number.isNaN(valorMinutos) ||
      valorMinutos <= 0
    ) {
      setError(
        "Ingresa un tiempo válido en minutos"
      );
      return;
    }

    try {
      await crearTiempoAtencion({
        cliente_id:
          clienteTiempo
            ? Number(clienteTiempo)
            : null,

        comentario_id:
          comentarioTiempo
            ? Number(comentarioTiempo)
            : null,

        tiempo_minutos:
          valorMinutos,

        operador:
          operador.trim() || null,
      });

      setClienteTiempo("");
      setComentarioTiempo("");
      setMinutos("");
      setOperador("");

      await cargarDatos();

    } catch (error) {
      console.error(error);

      setError(
        "No se pudo registrar el tiempo de atención"
      );
    }
  }


  // ============================================
  // ELIMINAR
  // ============================================

  async function borrarComentario(
    comentario: Comentario
  ) {
    const confirmar = window.confirm(
      `¿Eliminar el comentario #${comentario.id}?`
    );

    if (!confirmar) return;

    try {
      await eliminarComentario(
        comentario.id
      );

      await cargarDatos();

    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar el comentario"
      );
    }
  }


  async function borrarTiempo(
    tiempo: TiempoAtencion
  ) {
    const confirmar = window.confirm(
      `¿Eliminar el registro de ${tiempo.tiempo_minutos} minutos?`
    );

    if (!confirmar) return;

    try {
      await eliminarTiempoAtencion(
        tiempo.id
      );

      await cargarDatos();

    } catch (error) {
      console.error(error);

      setError(
        "No se pudo eliminar el tiempo"
      );
    }
  }


  // ============================================
  // UTILIDAD
  // ============================================

  function nombreCliente(
    clienteId: number | null
  ) {
    if (!clienteId) {
      return "Sin cliente";
    }

    const cliente = clientes.find(
      (item) => item.id === clienteId
    );

    return cliente?.nombre ??
      `Cliente #${clienteId}`;
  }

  function nombreRemitente(comentario: Comentario) {
  const nombreCompleto = [
    comentario.nombre_cliente,
    comentario.apellido_cliente,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return nombreCompleto || nombreCliente(comentario.cliente_id);
}

  function categoriaNLP(comentario: Comentario) {
    const analisis = analisisGuardados.find(
      (item) => item.comentario_id === comentario.id
    );

    return (
      analisis?.categoria_detectada ??
      (comentario.procesado ? "Sin categoría detectada" : "Pendiente")
    );
  }

  function nombreEnTiempo(tiempo: TiempoAtencion) {
    const comentario = comentarios.find(
      (item) => item.id === tiempo.comentario_id
    );

    return comentario
      ? nombreRemitente(comentario)
      : nombreCliente(tiempo.cliente_id);
  }

  // ============================================
  // INTERFAZ
  // ============================================

  return (
    <main className="dashboard-page">

      <header className="dashboard-header">
        <div>
          <h1>Atención</h1>

          <p>
            Gestión de comentarios y tiempos
            de atención
          </p>
        </div>
      </header>


      {error && (
        <div className="message-error">
          {error}
        </div>
      )}


      {/* ===================================== */}
      {/* FORMULARIOS */}
      {/* ===================================== */}

      <section className="dashboard-panel">


        {/* TIEMPO */}

          <div className="panel-header">
            <div>
              <h2>
                Tiempo de atención
              </h2>

              <p>
                Registrar duración de una atención
              </p>
            </div>
          </div>


          <form
            className="client-form"
            onSubmit={guardarTiempo}
          >

            <div className="form-group">
              <label>
                Cliente
              </label>

              <select
                value={clienteTiempo}
                onChange={(evento) =>
                  setClienteTiempo(
                    evento.target.value
                  )
                }
              >
                <option value="">
                  Sin cliente asociado
                </option>

                {clientes.map((cliente) => (
                  <option
                    key={cliente.id}
                    value={cliente.id}
                  >
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>


            <div className="form-group">
              <label>
                Comentario relacionado
              </label>

              <select
                value={comentarioTiempo}
                onChange={(evento) =>
                  setComentarioTiempo(
                    evento.target.value
                  )
                }
              >
                <option value="">
                  Ninguno
                </option>

                {comentarios.map(
                  (comentario) => (
                    <option
                      key={comentario.id}
                      value={comentario.id}
                    >
                      #{comentario.id} - {nombreRemitente(comentario)} -{" "}
                      {comentario.contenido.slice(0, 35)}
                    </option>
                  )
                )}
              </select>
            </div>


            <div className="form-grid">

              <div className="form-group">
                <label>
                  Tiempo (minutos) *
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={minutos}
                  onChange={(evento) =>
                    setMinutos(
                      evento.target.value
                    )
                  }
                  required
                />
              </div>


              <div className="form-group">
                <label>
                  Operador
                </label>

                <input
                  type="text"
                  value={operador}
                  onChange={(evento) =>
                    setOperador(
                      evento.target.value
                    )
                  }
                />
              </div>

            </div>


            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
              >
                Registrar tiempo
              </button>
            </div>

          </form>

      </section>


      {/* ===================================== */}
      {/* COMENTARIOS */}
      {/* ===================================== */}

      <section id="comentarios" className="dashboard-panel">

        <div className="panel-header">
          <div>
            <h2>Comentarios</h2>

            <p>
              {comentarios.length} registros
            </p>
          </div>
        </div>


        {cargando ? (
          <Loading texto="Cargando datos de atención..." />

        ) : comentarios.length === 0 ? (
          <p>
            No existen comentarios.
          </p>

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
                {comentarios.map((comentario) => (
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

      </section>


      {/* ===================================== */}
      {/* TIEMPOS */}
      {/* ===================================== */}

      <section id="tiempos" className="dashboard-panel">

        <div className="panel-header">
          <div>
            <h2>
              Tiempos de atención
            </h2>

            <p>
              {tiempos.length} registros
            </p>
          </div>
        </div>


        {tiempos.length === 0 ? (
          <p>
            No existen tiempos registrados.
          </p>

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

                {tiempos.map(
                  (tiempo) => (
                    <tr key={tiempo.id}>

                      <td>
                        {tiempo.id}
                      </td>

                      <td>
                       {nombreEnTiempo(tiempo)}
                      </td>

                      <td>
                        {tiempo.comentario_id
                          ? `#${tiempo.comentario_id}`
                          : "—"}
                      </td>

                      <td>
                        <strong>
                          {tiempo.tiempo_minutos}
                          {" "}min
                        </strong>
                      </td>

                      <td>
                        {tiempo.operador ??
                          "—"}
                      </td>

                      <td>
                        {tiempo.fecha ??
                          "—"}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            borrarTiempo(
                              tiempo
                            )
                          }
                        >
                          Eliminar
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </main>
  );
}


export default Atencion;