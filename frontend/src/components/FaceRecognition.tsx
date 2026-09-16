import { useRef, useState } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { useCamaraFacial } from "../hooks/useCamaraFacial";

interface Props {
  onRegistroCompleto: (embeddings: number[][]) => Promise<void>;
}
const indicaciones = [
  "Mira al centro",
  "Gira ligeramente a la izquierda",
  "Gira ligeramente a la derecha",
  "Acércate un poco",
  "Vuelve a mirar al centro",
];

export default function FaceRecognition({ onRegistroCompleto }: Props) {
  const camara = useCamaraFacial(true);
  const bloqueo = useRef(false);
  const [muestras, setMuestras] = useState<number[][]>([]);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [guardado, setGuardado] = useState(false);

  async function capturar() {
    if (bloqueo.current || muestras.length >= 5) return;
    bloqueo.current = true;
    setOcupado(true);
    setError("");
    try {
      const nueva = await camara.capturar();
      if (muestras.some((muestra) => muestra.every((valor, i) => valor === nueva[i]))) {
        throw new Error("La muestra es idéntica. Muévete ligeramente y vuelve a capturar");
      }
      setMuestras([...muestras, nueva]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo capturar");
    } finally {
      bloqueo.current = false;
      setOcupado(false);
    }
  }

  async function guardar() {
    if (bloqueo.current || muestras.length !== 5) return;
    bloqueo.current = true;
    setOcupado(true);
    setError("");
    try {
      await onRegistroCompleto(muestras);
      setGuardado(true);
      camara.detener();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar. Puedes reintentar");
    } finally {
      bloqueo.current = false;
      setOcupado(false);
    }
  }

  // Capturar y guardar son pasos separados: cinco capturas no implican éxito en la BD.
  return (
    <section className="face-recognition">
      <div className="face-camera-container">
        <video ref={camara.videoRef} className="face-video" muted playsInline />
        <div className="face-guide">
          <div className="face-guide-frame" />
        </div>
      </div>
      <div className="face-register-info">
        <h3>
          {guardado
            ? "Rostro guardado"
            : (indicaciones[muestras.length] ?? "Muestras listas para guardar")}
        </h3>
        <p>{camara.iniciando ? "Preparando cámara…" : camara.analisis?.mensaje}</p>
        <p>
          {muestras.length}/5 muestras. Los giros son indicaciones de captura, no una
          prueba de identidad.
        </p>
        {!guardado && (
          <p>
            Guardar rostro reemplaza las cinco muestras anteriores de esta cuenta. Todas
            las capturas deben ser de la misma persona.
          </p>
        )}
        {muestras.length < 5 ? (
          <button
            type="button"
            className="primary-button"
            disabled={ocupado || !camara.analisis?.valido}
            onClick={() => void capturar()}
          >
            <Camera size={16} /> Capturar muestra {muestras.length + 1}/5
          </button>
        ) : (
          !guardado && (
            <button
              type="button"
              className="primary-button"
              disabled={ocupado}
              onClick={() => void guardar()}
            >
              {ocupado ? "Guardando…" : "Guardar rostro"}
            </button>
          )
        )}
        {guardado && (
          <p>
            <CheckCircle2 size={16} /> Registro guardado correctamente
          </p>
        )}
        {(error || camara.error) && (
          <p role="alert" className="message-error">
            {error || camara.error}
          </p>
        )}
        {!camara.activa && !camara.iniciando && !guardado && (
          <button
            type="button"
            className="primary-button"
            onClick={() => void camara.iniciar()}
          >
            Reintentar cámara
          </button>
        )}
      </div>
    </section>
  );
}
