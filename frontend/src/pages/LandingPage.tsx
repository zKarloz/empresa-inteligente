import { useState } from "react";
import { crearComentario } from "../services/comentarios";
// Un solo estado facilita validar y limpiar el formulario completo.
const formularioInicial = {
  nombre: "",
  apellido: "",
  empresa: "",
  numero: "",
  correo: "",
  comentario: "",
};
const camposContacto = [
  {
    nombre: "nombre",
    etiqueta: "Nombre",
    tipo: "text",
    autocompletar: "given-name",
    maximo: 150,
    ejemplo: "Ej. Carlos",
  },
  {
    nombre: "apellido",
    etiqueta: "Apellido",
    tipo: "text",
    autocompletar: "family-name",
    maximo: 150,
    ejemplo: "Ej. Pérez",
  },
  {
    nombre: "empresa",
    etiqueta: "Empresa",
    tipo: "text",
    autocompletar: "organization",
    maximo: 200,
    ejemplo: "Nombre de tu empresa",
  },
  {
    nombre: "numero",
    etiqueta: "Número",
    tipo: "tel",
    autocompletar: "tel",
    maximo: 30,
    ejemplo: "Ej. +51 999999999",
  },
  {
    nombre: "correo",
    etiqueta: "Correo",
    tipo: "email",
    autocompletar: "email",
    maximo: 254,
    ejemplo: "Ej. carlos@empresa.com",
  },
] as const;

function LandingPage() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  async function enviarComentario(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;
    setError("");
    setMensaje("");
    const campos = Object.values(formulario);
    if (campos.some((campo) => !campo.trim())) {
      setError("Completa todos los campos del formulario.");
      return;
    }
    try {
      setEnviando(true);
      await crearComentario({
        cliente_id: null,
        nombre_cliente: formulario.nombre.trim(),
        apellido_cliente: formulario.apellido.trim(),
        empresa_cliente: formulario.empresa.trim(),
        telefono_cliente: formulario.numero.trim(),
        correo_cliente: formulario.correo.trim(),
        contenido: formulario.comentario.trim(),
        canal: "web",
        estado: "pendiente",
        categoria: null,
      });
      setMensaje("¡Gracias! Tu comentario fue enviado correctamente.");
      setFormulario(formularioInicial);
    } catch (error) {
      console.error(error);
      setError("No se pudo enviar el comentario. Inténtalo nuevamente.");
    } finally {
      setEnviando(false);
    }
  }
  function cambiarCampo(nombre: keyof typeof formularioInicial, valor: string) {
    setFormulario((anterior) => ({ ...anterior, [nombre]: valor }));
  }

  // Reutilizar el mismo input conservando identificadores, límites y autocompletado.
  function mostrarCampo(campo: (typeof camposContacto)[number]) {
    return (
      <div className="landing-form-group" key={campo.nombre}>
        <label htmlFor={`contacto-${campo.nombre}`}>{campo.etiqueta} *</label>
        <input
          id={`contacto-${campo.nombre}`}
          name={campo.nombre}
          type={campo.tipo}
          autoComplete={campo.autocompletar}
          maxLength={campo.maximo}
          value={formulario[campo.nombre]}
          onChange={(evento) => cambiarCampo(campo.nombre, evento.target.value)}
          placeholder={campo.ejemplo}
          disabled={enviando}
          required
        />
      </div>
    );
  }

  return (
    <main className="landing-page">
      {/* NAVBAR */}
      <header className="landing-navbar">
        <div className="landing-brand">Centro Inteligente</div>
        <nav className="landing-nav">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#comentario">Comentarios</a>
          <a href="/login" className="landing-login">
            Acceso personal
          </a>
        </nav>
      </header>
      {/* HERO */}
      <section id="inicio" className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-tag">Atención al cliente</span>
          <h1>Tu opinión nos ayuda a mejorar</h1>
          <p>
            Queremos conocer tu experiencia. Envíanos tus comentarios, consultas o
            sugerencias y nuestro equipo podrá revisarlos.
          </p>
          <a href="#comentario" className="landing-primary-button">
            Enviar comentario
          </a>
        </div>
        <div className="landing-hero-card">
          <div className="hero-card-icon">💬</div>
          <h2>Atención rápida</h2>
          <p>Tus comentarios llegan directamente a nuestro equipo de atención.</p>
        </div>
      </section>
      {/* SERVICIOS */}
      <section id="servicios" className="landing-section">
        <div className="landing-section-title">
          <span>Nuestro servicio</span>
          <h2>¿Cómo podemos ayudarte?</h2>
          <p>Contamos con diferentes canales para recibir tus consultas.</p>
        </div>
        <div className="landing-cards">
          <article className="landing-card">
            <div>⚡</div>
            <h3>Atención rápida</h3>
            <p>
              Registramos tus solicitudes para que puedan ser atendidas por nuestro
              personal.
            </p>
          </article>
          <article className="landing-card">
            <div>💬</div>
            <h3>Comentarios</h3>
            <p>Puedes enviarnos consultas, reclamos, felicitaciones o sugerencias.</p>
          </article>
          <article className="landing-card">
            <div>📊</div>
            <h3>Mejora continua</h3>
            <p>Analizamos la información recibida para mejorar nuestros servicios.</p>
          </article>
        </div>
      </section>
      {/* FORMULARIO */}
      <section id="comentario" className="landing-comment-section">
        <div className="landing-comment-info">
          <span>Contáctanos</span>
          <h2>Cuéntanos tu experiencia</h2>
          <p>
            Completa el formulario. Tu comentario será recibido directamente por nuestro
            equipo de atención.
          </p>
          <div className="landing-info-item">✅ Registro inmediato</div>
          <div className="landing-info-item">✅ Atención personalizada</div>
          <div className="landing-info-item">✅ Seguimiento de comentarios</div>
        </div>
        <div className="landing-form-container">
          <form className="landing-form" onSubmit={enviarComentario}>
            <div className="landing-form-grid">
              {camposContacto.slice(0, 2).map(mostrarCampo)}
            </div>
            <div className="landing-form-grid">
              {camposContacto.slice(2, 4).map(mostrarCampo)}
            </div>
            {camposContacto.slice(4).map(mostrarCampo)}
            <div className="landing-form-group">
              <label htmlFor="contacto-comentario">Comentario *</label>
              <textarea
                id="contacto-comentario"
                name="comentario"
                rows={6}
                value={formulario.comentario}
                onChange={(evento) =>
                  cambiarCampo("comentario", evento.target.value)
                }
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
            <button type="submit" className="landing-submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar comentario"}
            </button>
          </form>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="landing-footer">
        <strong>Centro Inteligente</strong>
        <p>Plataforma de atención al cliente</p>
        <p>© 2026 Centro Inteligente</p>
      </footer>
    </main>
  );
}
export default LandingPage;
