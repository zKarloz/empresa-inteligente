import { useEffect, useState } from "react";
import Loading from "../components/Loading";

import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  type Cliente,
  type ClienteCreate,
} from "../services/clientes";


const formularioInicial: ClienteCreate = {
  nombre: "",
  email: "",
  telefono: "",
  empresa: "",
  activo: true,
};


function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [formulario, setFormulario] =
    useState<ClienteCreate>(formularioInicial);

  const [clienteEditando, setClienteEditando] =
    useState<number | null>(null);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  // ============================================
  // CARGAR CLIENTES
  // ============================================

  async function cargarClientes() {
    try {
      setCargando(true);

      const datos = await obtenerClientes();

      setClientes(datos);
      setError(null);

    } catch (error) {
      console.error(
        "Error al cargar clientes:",
        error
      );

      setError(
        "No se pudieron cargar los clientes"
      );

    } finally {
      setCargando(false);
    }
  }


  useEffect(() => {
    cargarClientes();
  }, []);


  // ============================================
  // CAMBIAR CAMPOS DEL FORMULARIO
  // ============================================

  function manejarCambio(
    evento: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value, type, checked } =
      evento.target;

    setFormulario((anterior) => ({
      ...anterior,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }


  // ============================================
  // NUEVO CLIENTE
  // ============================================

  function abrirNuevoCliente() {
    setFormulario(formularioInicial);
    setClienteEditando(null);
    setMostrarFormulario(true);
    setError(null);
  }


  // ============================================
  // EDITAR CLIENTE
  // ============================================

  function editarCliente(cliente: Cliente) {
    setFormulario({
      nombre: cliente.nombre,
      email: cliente.email ?? "",
      telefono: cliente.telefono ?? "",
      empresa: cliente.empresa ?? "",
      activo: cliente.activo,
    });

    setClienteEditando(cliente.id);
    setMostrarFormulario(true);
    setError(null);
  }


  // ============================================
  // CANCELAR FORMULARIO
  // ============================================

  function cancelarFormulario() {
    setFormulario(formularioInicial);
    setClienteEditando(null);
    setMostrarFormulario(false);
    setError(null);
  }


  // ============================================
  // GUARDAR CLIENTE
  // ============================================

  async function guardarCliente(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (!formulario.nombre.trim()) {
      setError(
        "El nombre del cliente es obligatorio"
      );
      return;
    }

    const datos: ClienteCreate = {
      nombre: formulario.nombre.trim(),

      email:
        formulario.email?.trim() || null,

      telefono:
        formulario.telefono?.trim() || null,

      empresa:
        formulario.empresa?.trim() || null,

      activo: formulario.activo,
    };

    try {
      setGuardando(true);
      setError(null);

      if (clienteEditando !== null) {
        await actualizarCliente(
          clienteEditando,
          datos
        );
      } else {
        await crearCliente(datos);
      }

      await cargarClientes();

      setFormulario(formularioInicial);
      setClienteEditando(null);
      setMostrarFormulario(false);

    } catch (error) {
      console.error(
        "Error al guardar cliente:",
        error
      );

      setError(
        "No se pudo guardar el cliente"
      );

    } finally {
      setGuardando(false);
    }
  }


  // ============================================
  // ELIMINAR CLIENTE
  // ============================================

  async function confirmarEliminar(
    cliente: Cliente
  ) {
    const confirmado = window.confirm(
      `¿Eliminar al cliente "${cliente.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    try {
      setError(null);

      await eliminarCliente(cliente.id);

      setClientes((anteriores) =>
        anteriores.filter(
          (item) => item.id !== cliente.id
        )
      );

    } catch (error) {
      console.error(
        "Error al eliminar cliente:",
        error
      );

      setError(
        "No se pudo eliminar el cliente"
      );
    }
  }


  // ============================================
  // INTERFAZ
  // ============================================

  return (
    <main className="dashboard-page">

      <header className="dashboard-header">
        <div>
          <h1>Clientes</h1>

          <p>
            Gestión de clientes registrados
            en el sistema
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={abrirNuevoCliente}
        >
          + Nuevo cliente
        </button>
      </header>


      {/* ===================================== */}
      {/* MENSAJES */}
      {/* ===================================== */}

      {error && (
        <div className="message-error">
          {error}
        </div>
      )}


      {/* ===================================== */}
      {/* FORMULARIO */}
      {/* ===================================== */}

      {mostrarFormulario && (
        <section className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>
                {clienteEditando !== null
                  ? "Editar cliente"
                  : "Nuevo cliente"}
              </h2>

              <p>
                Completa los datos del cliente
              </p>
            </div>
          </div>


          <form
            className="client-form"
            onSubmit={guardarCliente}
          >

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="nombre">
                  Nombre *
                </label>

                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>


              <div className="form-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formulario.email ?? ""}
                  onChange={manejarCambio}
                />
              </div>


              <div className="form-group">
                <label htmlFor="telefono">
                  Teléfono
                </label>

                <input
                  id="telefono"
                  name="telefono"
                  type="text"
                  value={
                    formulario.telefono ?? ""
                  }
                  onChange={manejarCambio}
                />
              </div>


              <div className="form-group">
                <label htmlFor="empresa">
                  Empresa
                </label>

                <input
                  id="empresa"
                  name="empresa"
                  type="text"
                  value={
                    formulario.empresa ?? ""
                  }
                  onChange={manejarCambio}
                />
              </div>

            </div>


            <label className="checkbox-group">
              <input
                name="activo"
                type="checkbox"
                checked={
                  formulario.activo ?? true
                }
                onChange={manejarCambio}
              />

              Cliente activo
            </label>


            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={cancelarFormulario}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : clienteEditando !== null
                    ? "Guardar cambios"
                    : "Crear cliente"}
              </button>

            </div>

          </form>

        </section>
      )}


      {/* ===================================== */}
      {/* TABLA */}
      {/* ===================================== */}

      <section className="dashboard-panel">

        <div className="panel-header">
          <div>
            <h2>Lista de clientes</h2>

            <p>
              {clientes.length} cliente
              {clientes.length !== 1 ? "s" : ""}
              {" "}registrado
              {clientes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>


        {cargando ? (
          <Loading texto="Cargando clientes..." />

        ) : clientes.length === 0 ? (
          <p>
            No existen clientes registrados.
          </p>

        ) : (
          <div className="table-container">

            <table className="data-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Empresa</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>


              <tbody>

                {clientes.map((cliente) => (

                  <tr key={cliente.id}>

                    <td>
                      {cliente.id}
                    </td>

                    <td>
                      <strong>
                        {cliente.nombre}
                      </strong>
                    </td>

                    <td>
                      {cliente.email ?? "—"}
                    </td>

                    <td>
                      {cliente.telefono ?? "—"}
                    </td>

                    <td>
                      {cliente.empresa ?? "—"}
                    </td>

                    <td>
                      <span
                        className={
                          cliente.activo
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {cliente.activo
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            editarCliente(cliente)
                          }
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            confirmarEliminar(
                              cliente
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>
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


export default Clientes;