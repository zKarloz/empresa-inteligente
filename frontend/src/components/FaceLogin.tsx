import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  ScanFace,
  ShieldCheck,
} from "lucide-react";

import {
  analizarRostro,
  inicializarReconocimientoFacial,
  type AnalisisFacial,
} from "../services/facialRecognition";

import {
  verificarBiometria,
} from "../services/biometria";


interface FaceLoginProps {
  onSuccess: () => void;
}


function FaceLogin({
  onSuccess,
}: FaceLoginProps) {

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const activoRef =
    useRef(false);

  const timerRef =
    useRef<number | null>(null);


  const [camaras, setCamaras] =
    useState<MediaDeviceInfo[]>([]);

  const [
    camaraSeleccionada,
    setCamaraSeleccionada,
  ] = useState("");

  const [analisis, setAnalisis] =
    useState<AnalisisFacial | null>(null);

  const [estado, setEstado] =
    useState("Preparando modelos...");

  const [modelosListos, setModelosListos] =
    useState(false);

  const [verificando, setVerificando] =
    useState(false);

  const [camaraActiva, setCamaraActiva] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  // =====================================================
  // INICIALIZAR
  // =====================================================

  useEffect(() => {

    async function iniciar() {

      try {

        await inicializarReconocimientoFacial();

        setModelosListos(true);

        setEstado(
          "Selecciona una cámara."
        );


        const dispositivos =
          await navigator.mediaDevices
            .enumerateDevices();


        const disponibles =
          dispositivos.filter(
            dispositivo =>
              dispositivo.kind ===
              "videoinput"
          );


        setCamaras(disponibles);


        if (disponibles.length > 0) {

          setCamaraSeleccionada(
            disponibles[0].deviceId
          );

        }

      } catch (err) {

        console.error(err);

        setError(
          "No se pudieron cargar los modelos faciales."
        );

      }

    }


    iniciar();


    return () => {

      detenerCamara();

    };

  }, []);


  // =====================================================
  // DETENER CÁMARA
  // =====================================================

  function detenerCamara() {

    activoRef.current = false;


    if (timerRef.current !== null) {

      window.clearTimeout(
        timerRef.current
      );

    }


    streamRef.current
      ?.getTracks()
      .forEach(
        track => track.stop()
      );


    streamRef.current = null;

  }


  // =====================================================
  // INICIAR CÁMARA
  // =====================================================

  async function iniciarCamara() {

    if (!modelosListos) {
      return;
    }


    try {

      setError(null);

      detenerCamara();


      const stream =
        await navigator.mediaDevices
          .getUserMedia({

            video: camaraSeleccionada
              ? {
                  deviceId: {
                    exact:
                      camaraSeleccionada,
                  },

                  width: {
                    ideal: 1280,
                  },

                  height: {
                    ideal: 720,
                  },
                }
              : true,

            audio: false,

          });


      streamRef.current =
        stream;


      if (!videoRef.current) {
        return;
      }


      videoRef.current.srcObject =
        stream;


      await videoRef.current.play();


      activoRef.current = true;

      setCamaraActiva(true);

      setEstado(
        "Colócate frente a la cámara."
      );


      analizarContinuamente();

    } catch (err) {

      console.error(err);

      setError(
        "No se pudo iniciar la cámara seleccionada."
      );

    }

  }


  // =====================================================
  // ANALIZAR CONTINUAMENTE
  // =====================================================

  async function analizarContinuamente() {

    if (!activoRef.current) {
      return;
    }


    try {

      const video =
        videoRef.current;


      if (
        video &&
        video.readyState >= 2
      ) {

        const resultado =
          await analizarRostro(video);


        if (!activoRef.current) {
          return;
        }


        setAnalisis(resultado);

        setEstado(
          resultado.mensaje
        );

      }

    } catch (err) {

      console.error(
        "Error analizando rostro:",
        err
      );

    }


    timerRef.current =
      window.setTimeout(
        analizarContinuamente,
        400
      );

  }


  // =====================================================
  // VERIFICAR IDENTIDAD
  // =====================================================

  async function verificarIdentidad() {

    if (
      !analisis?.valido ||
      !analisis.embedding
    ) {

      return;

    }


    try {

      setVerificando(true);

      setError(null);

      setEstado(
        "Comparando identidad..."
      );


      const respuesta =
        await verificarBiometria(
          "admin@empresa.com",
          analisis.embedding
        );


      if (respuesta.verificado) {

        setEstado(
          `Administrador reconocido · ${(
            respuesta.similitud * 100
          ).toFixed(0)}%`
        );


        detenerCamara();


        window.setTimeout(
          () => {
            onSuccess();
          },
          700
        );

      } else {

        setEstado(
          "Rostro no autorizado."
        );

        setError(
          `La identidad no coincide. Similitud: ${(
            respuesta.similitud * 100
          ).toFixed(0)}%`
        );

      }

    } catch (err) {

      console.error(err);

      setEstado(
        "Error verificando identidad."
      );

      setError(
        "No se pudo comprobar el rostro con el servidor."
      );

    } finally {

      setVerificando(false);

    }

  }


  return (

    <div className="face-login">


      {/* SELECTOR */}

      <div className="face-login-selector">

        <select
          value={camaraSeleccionada}
          onChange={e =>
            setCamaraSeleccionada(
              e.target.value
            )
          }
        >

          {camaras.map(
            (camara, index) => (

              <option
                key={camara.deviceId}
                value={camara.deviceId}
              >

                {camara.label ||
                  `Cámara ${index + 1}`}

              </option>

            )
          )}

        </select>


        <button
          type="button"
          onClick={iniciarCamara}
          disabled={!modelosListos}
          className="face-start-button"
        >

          <Camera size={15} />

          Activar cámara

        </button>

      </div>


      {/* VIDEO */}

      <div className="face-login-camera">

        <video
          ref={videoRef}
          muted
          playsInline
        />


        {!camaraActiva && (

          <div className="face-login-placeholder">

            <ScanFace size={45} />

            <span>
              Cámara desactivada
            </span>

          </div>

        )}


        {camaraActiva && (

          <div className="face-login-frame" />

        )}

      </div>


      {/* ESTADO */}

      <div
        className={
          analisis?.valido
            ? "face-login-state valid"
            : "face-login-state"
        }
      >

        <ShieldCheck size={16} />

        {estado}

      </div>


      {/* MÉTRICAS */}

      {analisis && (

        <div className="face-login-metrics">

          <span>
            Detección{" "}
            <strong>
              {(
                analisis.confianza *
                100
              ).toFixed(0)}
              %
            </strong>
          </span>

          <span>
            Real{" "}
            <strong>
              {(
                analisis.real *
                100
              ).toFixed(0)}
              %
            </strong>
          </span>

          <span>
            Liveness{" "}
            <strong>
              {(
                analisis.live *
                100
              ).toFixed(0)}
              %
            </strong>
          </span>

        </div>

      )}


      {/* VERIFICAR */}

      <button
        type="button"
        className="login-button"
        disabled={
          !analisis?.valido ||
          verificando
        }
        onClick={
          verificarIdentidad
        }
      >

        {verificando
          ? "Verificando identidad..."
          : "Verificar rostro"}

      </button>


      {error && (

        <div className="login-error">
          {error}
        </div>

      )}

    </div>

  );

}


export default FaceLogin;