import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FaceLogin from "../components/FaceLogin";

import {
  Sparkles,
  Mail,
  LockKeyhole,
  ShieldCheck,
  ScanFace,
} from "lucide-react";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [cargando, setCargando] =
    useState(false);

  const [loginFacial, setLoginFacial] =
  useState(false);


  function iniciarSesion(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setError(null);
    setCargando(true);


    // ============================================
    // LOGIN TEMPORAL DE PRUEBA
    // ============================================

    setTimeout(() => {

      if (
        email === "admin@empresa.com" &&
        password === "123456"
      ) {

        /*
          Temporal.

          Luego esto será reemplazado por una
          sesión generada desde FastAPI.
        */

        sessionStorage.setItem(
          "isAuthenticated",
          "true"
        );

        navigate("/dashboard", {
          replace: true,
        });

      } else {

        setError(
          "Correo o contraseña incorrectos."
        );

      }


      setCargando(false);

    }, 600);
  }

  function accesoFacialCorrecto() {

    sessionStorage.setItem(
      "isAuthenticated",
      "true"
    );

    navigate("/dashboard", {
      replace: true,
    });

  }

  return (
    <main className="login-page">

      {/* ===================================== */}
      {/* PANEL IZQUIERDO */}
      {/* ===================================== */}

      <section className="login-hero">

        <div className="login-hero-content">

          <div className="login-badge">
            <Sparkles size={15} />

            <span>
              IA & ANALÍTICA EMPRESARIAL
            </span>
          </div>


          <h1>
            Centro{" "}
            <span>
              Inteligente
            </span>
          </h1>


          <p>
            Plataforma empresarial para la gestión
            de clientes, análisis NLP, métricas
            científicas y automatización de procesos.
          </p>


          <div className="login-security-info">

            <ShieldCheck size={18} />

            <span>
              Acceso seguro al sistema empresarial
            </span>

          </div>

        </div>

      </section>


      {/* ===================================== */}
      {/* PANEL DERECHO */}
      {/* ===================================== */}

      <section className="login-panel">

        <div className="login-card">


          {/* LOGO */}

          <div className="login-logo">

            <Sparkles size={28} />

          </div>


          <div className="login-title">

            <h2>
              Iniciar sesión
            </h2>

            <p>
              Ingresa tus credenciales para
              acceder al Centro Inteligente.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="login-error">
              {error}
            </div>

          )}


          {/* FORMULARIO */}

          <form
            className="login-form"
            onSubmit={iniciarSesion}
          >


            {/* CORREO */}

            <div className="login-form-group">

              <label htmlFor="login-email">
                Correo electrónico
              </label>


              <div className="login-input-container">

                <Mail
                  size={17}
                  className="login-input-icon"
                />


                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(evento) =>
                    setEmail(
                      evento.target.value
                    )
                  }
                  placeholder="admin@empresa.com"
                  autoComplete="email"
                  required
                />

              </div>

            </div>


            {/* CONTRASEÑA */}

            <div className="login-form-group">

              <label htmlFor="login-password">
                Contraseña
              </label>


              <div className="login-input-container">

                <LockKeyhole
                  size={17}
                  className="login-input-icon"
                />


                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(evento) =>
                    setPassword(
                      evento.target.value
                    )
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />

              </div>

            </div>


            {/* BOTÓN */}

            <button
              type="submit"
              className="login-button"
              disabled={cargando}
            >

              {cargando
                ? "Verificando..."
                : "Ingresar al sistema"}

            </button>

          </form>

          <div className="login-separator">
            <span>o</span>
          </div>


          {!loginFacial ? (

            <button
              type="button"
              className="login-face-button"
              onClick={() =>
                setLoginFacial(true)
              }
            >

              <ScanFace size={17} />

              Ingresar con reconocimiento facial

            </button>

          ) : (

            <div className="login-face-area">

              <FaceLogin
                onSuccess={
                  accesoFacialCorrecto
                }
              />


              <button
                type="button"
                className="login-face-cancel"
                onClick={() =>
                  setLoginFacial(false)
                }
              >

                Volver a contraseña

              </button>

            </div>

          )}

          {/* CREDENCIALES DEMO */}

          <div className="login-demo">

            <span>
              Acceso de demostración
            </span>

            <strong>
              admin@empresa.com
            </strong>

            <small>
              Contraseña: 123456
            </small>

          </div>


          <div className="login-future">

            Próximamente: autenticación
            biométrica facial

          </div>

        </div>

      </section>

    </main>
  );
}


export default Login;