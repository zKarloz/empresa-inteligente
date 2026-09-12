import { useState } from "react";
import { crearComentario } from "../services/comentarios";

function LandingPage() {

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [numero, setNumero] = useState("");
  const [correo, setCorreo] = useState("");
  const [comentario, setComentario] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");


  async function enviarComentario(
    evento: React.FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (enviando) return;

    setError("");
    setMensaje("");

    const campos = [
      nombre,
      apellido,
      empresa,
      numero,
      correo,
      comentario,
    ];

    if (campos.some((campo) => !campo.trim())) {
      setError("Completa todos los campos del formulario.");
      return;
    }

    try {
      setEnviando(true);

      await crearComentario({
        cliente_id: null,
        nombre_cliente: nombre.trim(),
        apellido_cliente: apellido.trim(),
        empresa_cliente: empresa.trim(),
        telefono_cliente: numero.trim(),
        correo_cliente: correo.trim(),
        contenido: comentario.trim(),
        canal: "web",
        estado: "pendiente",
        categoria: null,
      });

      setMensaje(
        "¡Gracias! Tu comentario fue enviado correctamente."
      );

      setNombre("");
      setApellido("");
      setEmpresa("");
      setNumero("");
      setCorreo("");
      setComentario("");
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo enviar el comentario. Inténtalo nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  }


  return (

    <main className="landing-page">


      {/* NAVBAR */}

      <header className="landing-navbar">

        <div className="landing-brand">
          Centro Inteligente
        </div>


        <nav className="landing-nav">

          <a href="#inicio">
            Inicio
          </a>

          <a href="#servicios">
            Servicios
          </a>

          <a href="#comentario">
            Comentarios
          </a>

          <a
            href="/login"
            className="landing-login"
          >
            Acceso personal
          </a>

        </nav>

      </header>


      {/* HERO */}

      <section
        id="inicio"
        className="landing-hero"
      >

        <div className="landing-hero-content">

          <span className="landing-tag">
            Atención al cliente
          </span>


          <h1>
            Tu opinión nos ayuda
            a mejorar
          </h1>


          <p>
            Queremos conocer tu experiencia.
            Envíanos tus comentarios,
            consultas o sugerencias y nuestro
            equipo podrá revisarlos.
          </p>


          <a
            href="#comentario"
            className="landing-primary-button"
          >
            Enviar comentario
          </a>

        </div>


        <div className="landing-hero-card">

          <div className="hero-card-icon">
            💬
          </div>

          <h2>
            Atención rápida
          </h2>

          <p>
            Tus comentarios llegan
            directamente a nuestro equipo
            de atención.
          </p>

        </div>

      </section>


      {/* SERVICIOS */}

      <section
        id="servicios"
        className="landing-section"
      >

        <div className="landing-section-title">

          <span>
            Nuestro servicio
          </span>

          <h2>
            ¿Cómo podemos ayudarte?
          </h2>

          <p>
            Contamos con diferentes canales
            para recibir tus consultas.
          </p>

        </div>


        <div className="landing-cards">


          <article className="landing-card">

            <div>
              ⚡
            </div>

            <h3>
              Atención rápida
            </h3>

            <p>
              Registramos tus solicitudes
              para que puedan ser atendidas
              por nuestro personal.
            </p>

          </article>


          <article className="landing-card">

            <div>
              💬
            </div>

            <h3>
              Comentarios
            </h3>

            <p>
              Puedes enviarnos consultas,
              reclamos, felicitaciones
              o sugerencias.
            </p>

          </article>


          <article className="landing-card">

            <div>
              📊
            </div>

            <h3>
              Mejora continua
            </h3>

            <p>
              Analizamos la información
              recibida para mejorar
              nuestros servicios.
            </p>

          </article>


        </div>

      </section>


      {/* FORMULARIO */}

      <section
        id="comentario"
        className="landing-comment-section"
      >

        <div className="landing-comment-info">

          <span>
            Contáctanos
          </span>

          <h2>
            Cuéntanos tu experiencia
          </h2>

          <p>
            Completa el formulario.
            Tu comentario será recibido
            directamente por nuestro
            equipo de atención.
          </p>


          <div className="landing-info-item">
            ✅ Registro inmediato
          </div>

          <div className="landing-info-item">
            ✅ Atención personalizada
          </div>

          <div className="landing-info-item">
            ✅ Seguimiento de comentarios
          </div>

        </div>


        <div className="landing-form-container">


          <form
            className="landing-form"
            onSubmit={enviarComentario}
          >
            <div className="landing-form-grid">
              <div className="landing-form-group">
                <label htmlFor="contacto-nombre">
                  Nombre *
                </label>

                <input
                  id="contacto-nombre"
                  name="nombre"
                  type="text"
                  autoComplete="given-name"
                  maxLength={150}
                  value={nombre}
                  onChange={(evento) => setNombre(evento.target.value)}
                  placeholder="Ej. Carlos"
                  disabled={enviando}
                  required
                />
              </div>

              <div className="landing-form-group">
                <label htmlFor="contacto-apellido">
                  Apellido *
                </label>

                <input
                  id="contacto-apellido"
                  name="apellido"
                  type="text"
                  autoComplete="family-name"
                  maxLength={150}
                  value={apellido}
                  onChange={(evento) => setApellido(evento.target.value)}
                  placeholder="Ej. Pérez"
                  disabled={enviando}
                  required
                />
              </div>
            </div>

            <div className="landing-form-grid">
              <div className="landing-form-group">
                <label htmlFor="contacto-empresa">
                  Empresa *
                </label>

                <input
                  id="contacto-empresa"
                  name="empresa"
                  type="text"
                  autoComplete="organization"
                  maxLength={200}
                  value={empresa}
                  onChange={(evento) => setEmpresa(evento.target.value)}
                  placeholder="Nombre de tu empresa"
                  disabled={enviando}
                  required
                />
              </div>

              <div className="landing-form-group">
                <label htmlFor="contacto-numero">
                  Número *
                </label>

                <input
                  id="contacto-numero"
                  name="numero"
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  value={numero}
                  onChange={(evento) => setNumero(evento.target.value)}
                  placeholder="Ej. +51 999999999"
                  disabled={enviando}
                  required
                />
              </div>
            </div>

            <div className="landing-form-group">
              <label htmlFor="contacto-correo">
                Correo *
              </label>

              <input
                id="contacto-correo"
                name="correo"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)}
                placeholder="Ej. carlos@empresa.com"
                disabled={enviando}
                required
              />
            </div>

            <div className="landing-form-group">
              <label htmlFor="contacto-comentario">
                Comentario *
              </label>

              <textarea
                id="contacto-comentario"
                name="comentario"
                rows={6}
                value={comentario}
                onChange={(evento) => setComentario(evento.target.value)}
                placeholder="Escribe aquí tu comentario..."
                disabled={enviando}
                required
              />
            </div>

            {mensaje && (
              <div className="landing-success" role="status">
                {mensaje}
              </div>
            )}

            {error && (
              <div className="landing-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="landing-submit"
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Enviar comentario"}
            </button>
          </form>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="landing-footer">

        <strong>
          Centro Inteligente
        </strong>

        <p>
          Plataforma de atención al cliente
        </p>

        <p>
          © 2026 Centro Inteligente
        </p>

      </footer>


    </main>

  );

}


export default LandingPage;