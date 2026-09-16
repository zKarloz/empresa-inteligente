import Human from "@vladmandic/human";

// Modelo de identidad FaceRes, más controles experimentales de presencia.
const human = new Human({
  backend: "webgl",
  modelBasePath: "https://vladmandic.github.io/human-models/models/",
  cacheSensitivity: 0,
  cacheModels: true,
  filter: { enabled: true, equalization: true, flip: false },
  face: {
    enabled: true,
    detector: { rotation: true, maxDetected: 2, return: true, skipFrames: 0, skipTime: 0 },
    mesh: { enabled: true },
    iris: { enabled: false },
    description: { enabled: true, skipFrames: 0, skipTime: 0 },
    emotion: { enabled: false },
    antispoof: { enabled: true, skipFrames: 0, skipTime: 0 },
    liveness: { enabled: true, skipFrames: 0, skipTime: 0 },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
});

export interface AnalisisFacial {
  valido: boolean;
  mensaje: string;
  confianza: number;
  real: number;
  live: number;
  embedding: number[] | null;
}

// Compartir una promesa evita cargar los modelos dos veces bajo React StrictMode.
let inicializacion: Promise<void> | null = null;
export function inicializarReconocimientoFacial(): Promise<void> {
  inicializacion ??= (async () => {
    await human.load();
    await human.warmup();
  })().catch((error: unknown) => {
    inicializacion = null;
    throw error;
  });
  return inicializacion;
}

// Human es una instancia compartida: nunca ejecutar dos inferencias simultáneas.
let cola: Promise<unknown> = Promise.resolve();
export function analizarRostro(video: HTMLVideoElement): Promise<AnalisisFacial> {
  const tarea = cola.then(() => analizar(video));
  cola = tarea.catch(() => undefined);
  return tarea;
}

async function analizar(video: HTMLVideoElement): Promise<AnalisisFacial> {
  if (video.readyState < 2 || video.paused) throw new Error("La cámara no está lista");
  const { face } = await human.detect(video);
  const rostro = face.length === 1 ? face[0] : null;
  const confianza = rostro?.faceScore ?? rostro?.boxScore ?? 0;
  const real = rostro?.real ?? 0;
  const live = rostro?.live ?? 0;
  const embedding = rostro?.embedding;
  let mensaje = "Rostro listo para capturar";
  if (!rostro)
    mensaje = face.length ? "Debe aparecer una sola persona" : "No se detecta un rostro";
  else if (!Number.isFinite(confianza) || confianza < 0.6) mensaje = "Mejora la iluminación";
  else if (Math.min(rostro.box[2], rostro.box[3]) < 224) mensaje = "Acércate un poco a la cámara";
  else if (!Number.isFinite(real) || real < 0.6) {
    // Diagnóstico temporal: esta puntuación no mide la coincidencia con tu identidad.
    const puntuacion = Number.isFinite(real) ? real.toFixed(3) : "inválida";
    mensaje = `No se pudo comprobar un rostro real. Antispoof: ${puntuacion}; mínimo: 0.600. Mira al frente con luz uniforme y evita el contraluz.`;
  } else if (!Number.isFinite(live) || live < 0.6)
    mensaje = `No se pudo confirmar presencia en vivo. Liveness: ${Number.isFinite(live) ? live.toFixed(3) : "inválida"}; mínimo: 0.600.`;
  else if (!embedding || embedding.length !== 1024 || !embedding.every(Number.isFinite)) {
    mensaje = "No se pudo generar el descriptor facial";
  }
  const valido = mensaje === "Rostro listo para capturar";
  return { valido, mensaje, confianza, real, live, embedding: valido ? [...embedding!] : null };
}
