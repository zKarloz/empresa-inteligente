import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { useCamaraFacial } from "../hooks/useCamaraFacial";
import { verificarBiometria } from "../services/biometria";
import { ApiError } from "../services/api";

interface Props {
  challenge: string;
  onSuccess: (token: string) => void;
}
export default function FaceLogin({ challenge, onSuccess }: Props) {
  const camara = useCamaraFacial();
  const bloqueo = useRef(false);
  const vigente = useRef(false);
  const [verificando, setVerificando] = useState(false);
  const [agotado, setAgotado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  useEffect(() => {
    vigente.current = true;
    return () => {
      vigente.current = false;
    };
  }, []);

  async function verificar() {
    if (bloqueo.current || agotado) return;
    bloqueo.current = true;
    setVerificando(true);
    setMensaje("");
    try {
      const embedding = await camara.capturar();
      const resultado = await verificarBiometria(challenge, embedding);
      if (!vigente.current) return;
      if (resultado.verificado && resultado.token) {
        camara.detener();
        onSuccess(resultado.token);
      } else {
        setMensaje(
          `No coincide. Puntuación: ${resultado.similitud.toFixed(2)}; coincidencias: ${resultado.coincidencias}/5.`,
        );
      }
    } catch (e) {
      if (!vigente.current) return;
      if (e instanceof ApiError && [401, 429].includes(e.status)) setAgotado(true);
      setMensaje(e instanceof Error ? e.message : "No se pudo verificar el rostro");
    } finally {
      bloqueo.current = false;
      if (vigente.current) setVerificando(false);
    }
  }
  return (
    <div className="face-login">
      <p>Contraseña comprobada. Ahora verifica tu rostro.</p>
      <div className="face-login-selector">
        <button
          type="button"
          className="face-start-button"
          disabled={camara.iniciando || verificando}
          onClick={() => (camara.activa ? camara.detener() : void camara.iniciar())}
        >
          {camara.activa ? <CameraOff size={16} /> : <Camera size={16} />}
          {camara.iniciando
            ? "Preparando…"
            : camara.activa
              ? "Apagar cámara"
              : "Activar cámara"}
        </button>
      </div>
      <div className="face-login-camera">
        <video ref={camara.videoRef} muted playsInline />
      </div>
      <p className="face-login-state">
        {camara.analisis?.mensaje ?? "Activa la cámara para continuar"}
      </p>
      <button
        type="button"
        className="login-button"
        disabled={!camara.analisis?.valido || verificando || agotado}
        onClick={() => void verificar()}
      >
        {verificando ? "Verificando…" : "Verificar rostro"}
      </button>
      {(mensaje || camara.error) && (
        <p role="alert" className="login-error">
          {mensaje || camara.error}
        </p>
      )}
    </div>
  );
}
