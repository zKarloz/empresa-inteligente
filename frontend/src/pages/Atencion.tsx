import { useEffect, useState } from "react";

import {
  obtenerClientes,
  type Cliente,
} from "../services/clientes";

import {
  obtenerComentarios,
  crearComentario,
  eliminarComentario,
  type Comentario,
} from "../services/comentarios";

import {
  obtenerTiemposAtencion,
  crearTiempoAtencion,
  eliminarTiempoAtencion,
  type TiempoAtencion,
} from "../services/tiempoAtencion";


function Atencion() {
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


  // FORMULARIO COMENTARIO
  const [clienteComentario, setClienteComentario] =
    useState("");

  const [contenido, setContenido] =
    useState("");

  const [canal, setCanal] =
    useState("web");

  const [categoria, setCategoria] =
    useState("");


  // FORMULARIO TIEMPO
  const [clienteTiempo, setClienteTiempo] =
    useState("");

  const [comentarioTiempo, setComentarioTiempo] =
    useState("");

  const [minutos, setMinutos] =
    useState("");

  const [operador, setOperador] =
    useState("");


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
      ] = await Promise.all([
        obtenerClientes(),
        obtenerComentarios(),
        obtenerTiemposAtencion(),
      ]);

      setClientes(datosClientes);
      setComentarios(datosComentarios);
      setTiempos(datosTiempos);

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
  // CREAR COMENTARIO
  // ============================================

  async function guardarComentario(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (!contenido.trim()) {
      setError(
        "El comentario no puede estar vacío"
      );
      return;
    }

    try {
      await crearComentario({
        cliente_id:
          clienteComentario
            ? Number(clienteComentario)
            : null,

        contenido: contenido.trim(),
        canal,
        estado: "pendiente",

        categoria:
          categoria || null,
      });

      setContenido("");
      setClienteComentario("");
      setCanal("web");
      setCategoria("");

      await cargarDatos();

    } catch (error) {
      console.error(error);

      setError(
        "No se pudo registrar el comentario"
      );
    }
  }


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

      <section className="dashboard-grid">

        {/* COMENTARIO */}

        <article className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>
                Nuevo comentario
              </h2>

              <p>
                Registrar una solicitud o comentario
              </p>
            </div>
          </div>


          <form
            className="client-form"
            onSubmit={guardarComentario}
          >

            <div className="form-group">
              <label>
                Cliente
              </label>

              <select
                value={clienteComentario}
                onChange={(evento) =>
                  setClienteComentario(
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
                Comentario *
              </label>

              <textarea
                rows={5}
                value={contenido}
                onChange={(evento) =>
                  setContenido(
                    evento.target.value
                  )
                }
                required
              />
            </div>


            <div className="form-grid">

              <div className="form-group">
                <label>
                  Canal
                </label>

                <select
                  value={canal}
                  onChange={(evento) =>
                    setCanal(
                      evento.target.value
                    )
                  }
                >
                  <option value="web">
                    Web
                  </option>

                  <option value="email">
                    Email
                  </option>

                  <option value="telefono">
                    Teléfono
                  </option>

                  <option value="whatsapp">
                    WhatsApp
                  </option>
                </select>
              </div>


              <div className="form-group">
                <label>
                  Categoría
                </label>

                <select
                  value={categoria}
                  onChange={(evento) =>
                    setCategoria(
                      evento.target.value
                    )
                  }
                >
                  <option value="">
                    Sin categoría
                  </option>

                  <option value="VENTAS">
                    Ventas
                  </option>

                  <option value="SOPORTE">
                    Soporte
                  </option>

                  <option value="RECLAMO">
                    Reclamo
                  </option>

                  <option value="CONSULTA">
                    Consulta
                  </option>

                  <option value="FELICITACION">
                    Felicitación
                  </option>

                  <option value="OTROS">
                    Otros
                  </option>
                </select>
              </div>

            </div>


            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
              >
                Registrar comentario
              </button>
            </div>

          </form>

        </article>


        {/* TIEMPO */}

        <article className="dashboard-panel">

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
                      #{comentario.id} -{" "}
                      {comentario.contenido.slice(
                        0,
                        35
                      )}
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

        </article>

      </section>


      {/* ===================================== */}
      {/* COMENTARIOS */}
      {/* ===================================== */}

      <section className="dashboard-panel">

        <div className="panel-header">
          <div>
            <h2>Comentarios</h2>

            <p>
              {comentarios.length} registros
            </p>
          </div>
        </div>


        {cargando ? (
          <p>Cargando...</p>

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
                  <th>Cliente</th>
                  <th>Comentario</th>
                  <th>Canal</th>
                  <th>Categoría</th>
                  <th>NLP</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {comentarios.map(
                  (comentario) => (
                    <tr key={comentario.id}>

                      <td>
                        {comentario.id}
                      </td>

                      <td>
                        {nombreCliente(
                          comentario.cliente_id
                        )}
                      </td>

                      <td>
                        {comentario.contenido}
                      </td>

                      <td>
                        {comentario.canal}
                      </td>

                      <td>
                        {comentario.categoria ??
                          "—"}
                      </td>

                      <td>
                        <span
                          className={
                            comentario.procesado
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {comentario.procesado
                            ? "Procesado"
                            : "Pendiente"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            borrarComentario(
                              comentario
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


      {/* ===================================== */}
      {/* TIEMPOS */}
      {/* ===================================== */}

      <section className="dashboard-panel">

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
                        {nombreCliente(
                          tiempo.cliente_id
                        )}
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