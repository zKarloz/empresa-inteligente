import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Camera,
  CheckCircle2,
  ScanFace,
  ShieldCheck,
} from "lucide-react";

import {
  analizarRostro,
  inicializarReconocimientoFacial,
  type AnalisisFacial,
} from "../services/facialRecognition";


// =========================================================
// PROPS
// =========================================================

interface FaceRecognitionProps {

  onRegistroCompleto?: (
    embeddings: number[][]
  ) => void;

}


// =========================================================
// INDICACIONES DE REGISTRO
// =========================================================

const indicaciones = [

  "Mira directamente a la cámara.",

  "Gira ligeramente el rostro hacia la izquierda.",

  "Gira ligeramente el rostro hacia la derecha.",

  "Acércate un poco a la cámara.",

  "Vuelve a mirar directamente al centro.",

];


function FaceRecognition({
  onRegistroCompleto,
}: FaceRecognitionProps) {

  const videoRef =
    useRef<HTMLVideoElement | null>(
      null
    );


  const streamRef =
    useRef<MediaStream | null>(
      null
    );


  const activoRef =
    useRef(true);


  const [
    estado,
    setEstado,
  ] = useState(
    "Preparando reconocimiento facial..."
  );


  const [
    modelosListos,
    setModelosListos,
  ] = useState(false);


  const [
    analisis,
    setAnalisis,
  ] =
    useState<AnalisisFacial | null>(
      null
    );


  const [
    muestras,
    setMuestras,
  ] =
    useState<number[][]>([]);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );
    

  // =======================================================
  // INICIAR SISTEMA
  // =======================================================

  useEffect(() => {

    activoRef.current = true;


    async function iniciar() {

      try {

        setEstado(
          "Cargando modelos biométricos..."
        );


        await inicializarReconocimientoFacial();


        if (!activoRef.current) {
          return;
        }


        setEstado(
          "Solicitando acceso a la cámara..."
        );


        const stream =
          await navigator.mediaDevices.getUserMedia({

            video: {
              width: {
                ideal: 1280,
              },

              height: {
                ideal: 720,
              },

              facingMode: "user",
            },

            audio: false,

          });


        if (!activoRef.current) {

          stream.getTracks().forEach(
            (track) => track.stop()
          );

          return;

        }


        streamRef.current =
          stream;


        const video =
          videoRef.current;


        if (!video) {

          stream.getTracks().forEach(
            (track) => track.stop()
          );

          streamRef.current = null;

          return;
        }


        video.srcObject =
          stream;


        await video.play();


        if (!activoRef.current) {
          return;
        }


        setModelosListos(true);

        setEstado(
          "Colócate frente a la cámara."
        );


        iniciarAnalisis();

      } catch (err) {

        console.error(err);


        setError(
          "No se pudo iniciar la cámara o cargar los modelos faciales."
        );

        setEstado(
          "Reconocimiento facial no disponible."
        );

      }

    }


    iniciar();


    return () => {

      activoRef.current =
        false;


      streamRef.current
        ?.getTracks()
        .forEach(
          (track) =>
            track.stop()
        );


      streamRef.current = null;

    };

  }, []);


  // =======================================================
  // DETECCIÓN CONTINUA
  // =======================================================

  async function iniciarAnalisis() {

    const video =
      videoRef.current;


    if (!video) {
      return;
    }


    while (activoRef.current) {

      try {

        if (
          video.readyState >= 2
        ) {

          const resultado =
            await analizarRostro(
              video
            );


          if (
            !activoRef.current
          ) {
            break;
          }


          setAnalisis(
            resultado
          );


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


      // Evita saturar CPU/GPU
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            300
          )
      );

    }

  }


  // =======================================================
  // CAPTURAR MUESTRA
  // =======================================================

  function capturarMuestra() {

    if (
      !analisis?.valido ||
      !analisis.embedding
    ) {

      return;

    }


    const nuevasMuestras = [
      ...muestras,
      [...analisis.embedding],
    ];


    setMuestras(
      nuevasMuestras
    );


    // =====================================================
    // REGISTRO TERMINADO
    // =====================================================

    if (
      nuevasMuestras.length ===
      indicaciones.length
    ) {

      setEstado(
        "Registro facial completado correctamente."
      );


      onRegistroCompleto?.(
        nuevasMuestras
      );

    }

  }


  const registroCompleto =
    muestras.length >=
    indicaciones.length;


  const indicacionActual =
    registroCompleto
      ? "Registro completado."
      : indicaciones[
          muestras.length
        ];


  // =======================================================
  // UI
  // =======================================================

  return (

    <section className="face-recognition">


      <div className="face-camera-container">


        <video
          ref={videoRef}
          className="face-video"
          muted
          playsInline
        />


        <div className="face-guide">

          <div className="face-guide-frame" />

        </div>


        <div
          className={
            analisis?.valido
              ? "face-status-indicator face-status-valid"
              : "face-status-indicator"
          }
        >

          <ScanFace size={16} />

          {analisis?.valido
            ? "Rostro válido"
            : "Verificando..."}

        </div>

      </div>


      <div className="face-register-info">


        <div>

          <span className="face-step">
            Registro biométrico
          </span>

          <h3>
            {indicacionActual}
          </h3>

          <p>
            {estado}
          </p>

        </div>


        {/* ================================= */}
        {/* PROGRESO */}
        {/* ================================= */}

        <div className="face-progress">

          {indicaciones.map(
            (_, index) => (

              <div
                key={index}
                className={
                  index <
                  muestras.length
                    ? "face-progress-step completed"
                    : "face-progress-step"
                }
              >

                {index <
                muestras.length ? (

                  <CheckCircle2
                    size={16}
                  />

                ) : (

                  <span>
                    {index + 1}
                  </span>

                )}

              </div>

            )
          )}

        </div>


        {/* ================================= */}
        {/* MÉTRICAS */}
        {/* ================================= */}

        {analisis && (

          <div className="face-metrics">


            <div>

              <span>
                Detección
              </span>

              <strong>
                {(
                  analisis.confianza *
                  100
                ).toFixed(0)}
                %
              </strong>

            </div>


            <div>

              <span>
                Real
              </span>

              <strong>
                {(
                  analisis.real *
                  100
                ).toFixed(0)}
                %
              </strong>

            </div>


            <div>

              <span>
                Liveness
              </span>

              <strong>
                {(
                  analisis.live *
                  100
                ).toFixed(0)}
                %
              </strong>

            </div>


          </div>

        )}


        {/* ================================= */}
        {/* CAPTURA */}
        {/* ================================= */}

        {!registroCompleto && (

          <button
            type="button"
            className="primary-button face-capture-button"
            disabled={
              !modelosListos ||
              !analisis?.valido
            }
            onClick={
              capturarMuestra
            }
          >

            <Camera size={16} />

            Capturar muestra{" "}

            {muestras.length + 1}
            /
            {indicaciones.length}

          </button>

        )}


        {registroCompleto && (

          <div className="face-success">

            <ShieldCheck
              size={18}
            />

            <div>

              <strong>
                Rostro registrado
              </strong>

              <span>
                Se generaron{" "}
                {muestras.length}{" "}
                muestras biométricas.
              </span>

            </div>

          </div>

        )}


        {error && (

          <div className="message-error">
            {error}
          </div>

        )}

      </div>

    </section>

  );

}



export default FaceRecognition;
