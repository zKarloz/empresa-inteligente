import { useEffect } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  UserCircle,
  ShieldCheck,
  Mail,
  LogOut,
} from "lucide-react";

import FaceRecognition from
  "../components/FaceRecognition";

import {
  registrarBiometria,
} from "../services/biometria";

function Configuracion() {

  const location = useLocation();
  const navigate = useNavigate();


  // ============================================
  // USUARIO DE DEMOSTRACIÓN
  // ============================================

  const usuarioActual = {
    nombre: "Administrador",
    correo: "admin@empresa.com",
    rol: "Administrador",
    estado: "Activo",
  };


  // ============================================
  // NAVEGACIÓN DESDE SIDEBAR
  // ============================================

  useEffect(() => {

    if (!location.hash) {
      return;
    }

    const id =
      location.hash.replace("#", "");

    const elemento =
      document.getElementById(id);

    if (elemento) {

      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }

  }, [location.hash]);


  // ============================================
  // CERRAR SESIÓN
  // ============================================

  function cerrarSesion() {

    sessionStorage.removeItem(
      "isAuthenticated"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );

  }


  return (

    <main className="dashboard-page">


      {/* ===================================== */}
      {/* ENCABEZADO */}
      {/* ===================================== */}

      <header className="dashboard-header">

        <div>

          <h1>
            Configuración
          </h1>

          <p>
            Administración general y
            configuración del sistema
          </p>

        </div>

      </header>


      {/* ===================================== */}
      {/* PERFIL */}
      {/* ===================================== */}

      <section
        id="perfil"
        className="dashboard-panel profile-panel"
      >

        <div className="profile-header">

          <div className="profile-avatar">

            <UserCircle size={38} />

          </div>


          <div className="profile-main-info">

            <span className="profile-label">
              Usuario actual
            </span>

            <h2>
              {usuarioActual.nombre}
            </h2>

            <p>
              <Mail size={14} />

              {usuarioActual.correo}
            </p>

          </div>


          <span className="profile-role">

            <ShieldCheck size={15} />

            {usuarioActual.rol}

          </span>

        </div>


        <div className="profile-details">


          <div className="profile-detail">

            <span>
              Rol
            </span>

            <strong>
              {usuarioActual.rol}
            </strong>

          </div>


          <div className="profile-detail">

            <span>
              Estado
            </span>

            <strong className="profile-active">
              ● {usuarioActual.estado}
            </strong>

          </div>


          <div className="profile-detail">

            <span>
              Autenticación
            </span>

            <strong>
              Contraseña demo
            </strong>

          </div>


          <div className="profile-detail">

            <span>
              Biometría facial
            </span>

            <strong className="profile-pending">
              Pendiente
            </strong>

          </div>


        </div>


        <div className="profile-actions">

          <button
            type="button"
            className="logout-button"
            onClick={cerrarSesion}
          >

            <LogOut size={16} />

            Cerrar sesión

          </button>

        </div>

      </section>

      <section className="dashboard-panel">

        <div className="panel-header">

          <div>

            <h2>
              Registrar rostro
            </h2>

            <p>
              Configuración biométrica del
              administrador.
            </p>

          </div>

        </div>


        <FaceRecognition
          onRegistroCompleto={async (
            embeddings
          ) => {

            try {

              const respuesta =
                await registrarBiometria(
                  "admin@empresa.com",
                  embeddings
                );


              console.log(
                respuesta
              );


              alert(
                "Biometría facial guardada correctamente."
              );

            } catch (error) {

              console.error(
                "Error registrando biometría:",
                error
              );


              alert(
                "No se pudo guardar la biometría."
              );

            }

          }}
        />

      </section>

      {/* ===================================== */}
      {/* USUARIOS */}
      {/* ===================================== */}

      <section
        id="usuarios"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Usuarios
            </h2>

            <p>
              Administración de usuarios y
              roles del sistema
            </p>

          </div>

        </div>


        <p>
          Próximamente podrás administrar
          usuarios, roles y permisos desde
          esta sección.
        </p>

      </section>


      {/* ===================================== */}
      {/* CATEGORÍAS */}
      {/* ===================================== */}

      <section
        id="categorias-config"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Categorías
            </h2>

            <p>
              Configuración de categorías
              utilizadas para clasificar
              comentarios
            </p>

          </div>

        </div>


        <p>
          Próximamente podrás crear,
          modificar y administrar las
          categorías del sistema.
        </p>

      </section>


      {/* ===================================== */}
      {/* AUDITORÍA */}
      {/* ===================================== */}

      <section
        id="auditoria"
        className="dashboard-panel"
      >

        <div className="panel-header">

          <div>

            <h2>
              Auditoría
            </h2>

            <p>
              Consulta de las acciones
              realizadas dentro de la
              aplicación
            </p>

          </div>

        </div>


        <p>
          Próximamente se mostrarán los
          eventos y acciones registradas
          por los usuarios.
        </p>

      </section>


    </main>

  );

}


export default Configuracion;