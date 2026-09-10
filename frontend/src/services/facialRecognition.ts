import Human, {
  type Config,
} from "@vladmandic/human";


// =========================================================
// CONFIGURACIÓN
// =========================================================

const humanConfig: Partial<Config> = {
  backend: "webgl",

  // Para empezar usamos los modelos oficiales remotamente.
  // Más adelante podemos alojarlos dentro del proyecto.
  modelBasePath:
    "https://vladmandic.github.io/human-models/models/",

  cacheSensitivity: 0.01,
  cacheModels: true,

  filter: {
    enabled: true,
    equalization: true,
    flip: false,
  },

  face: {
    enabled: true,

    detector: {
      rotation: true,
      maxDetected: 2,
      return: true,
    },

    mesh: {
      enabled: true,
    },

    iris: {
      enabled: true,
    },

    description: {
      enabled: true,
    },

    emotion: {
      enabled: false,
    },

    antispoof: {
      enabled: true,
    },

    liveness: {
      enabled: true,
    },
  },

  body: {
    enabled: false,
  },

  hand: {
    enabled: false,
  },

  object: {
    enabled: false,
  },

  gesture: {
    enabled: true,
  },
};


export const human = new Human(humanConfig);


// =========================================================
// TIPOS
// =========================================================

export interface AnalisisFacial {
  valido: boolean;

  mensaje: string;

  confianza: number;

  real: number;

  live: number;

  tamaño: number;

  embedding: number[] | null;
}


// =========================================================
// ESTADO INTERNO
// =========================================================

let inicializado = false;


// =========================================================
// INICIALIZAR MODELOS
// =========================================================

export async function inicializarReconocimientoFacial() {

  if (inicializado) {
    return;
  }

  console.log(
    "Cargando modelos de reconocimiento facial..."
  );

  await human.load();

  console.log(
    "Modelos cargados. Inicializando..."
  );

  await human.warmup();

  inicializado = true;

  console.log(
    "Reconocimiento facial listo."
  );
}


// =========================================================
// ANALIZAR UN FRAME DE VIDEO
// =========================================================

export async function analizarRostro(
  video: HTMLVideoElement
): Promise<AnalisisFacial> {

  const resultado =
    await human.detect(video);


  // =======================================================
  // CANTIDAD DE ROSTROS
  // =======================================================

  if (resultado.face.length === 0) {

    return {
      valido: false,
      mensaje: "No se detecta ningún rostro.",
      confianza: 0,
      real: 0,
      live: 0,
      tamaño: 0,
      embedding: null,
    };

  }


  if (resultado.face.length > 1) {

    return {
      valido: false,
      mensaje:
        "Debe aparecer solamente una persona en cámara.",
      confianza: 0,
      real: 0,
      live: 0,
      tamaño: 0,
      embedding: null,
    };

  }


  const rostro =
    resultado.face[0];


  // =======================================================
  // MÉTRICAS
  // =======================================================

  const confianza =
    rostro.faceScore ??
    rostro.boxScore ??
    0;


  const real =
    rostro.real ?? 0;


  const live =
    rostro.live ?? 0;


  const tamaño =
    Math.min(
      rostro.box[2],
      rostro.box[3]
    );


  const embedding =
    rostro.embedding ?? null;


  // =======================================================
  // VALIDACIONES
  // =======================================================

  if (confianza < 0.6) {

    return {
      valido: false,
      mensaje:
        "Rostro poco claro. Mejora la iluminación.",
      confianza,
      real,
      live,
      tamaño,
      embedding: null,
    };

  }


  if (tamaño < 224) {

    return {
      valido: false,
      mensaje:
        "Acércate un poco más a la cámara.",
      confianza,
      real,
      live,
      tamaño,
      embedding: null,
    };

  }


  if (real < 0.6) {

    return {
      valido: false,
      mensaje:
        "No se pudo comprobar que sea un rostro real.",
      confianza,
      real,
      live,
      tamaño,
      embedding: null,
    };

  }


  if (live < 0.6) {

    return {
      valido: false,
      mensaje:
        "No se pudo confirmar presencia en vivo.",
      confianza,
      real,
      live,
      tamaño,
      embedding: null,
    };

  }


  if (!embedding || embedding.length === 0) {

    return {
      valido: false,
      mensaje:
        "No se pudo generar la huella facial.",
      confianza,
      real,
      live,
      tamaño,
      embedding: null,
    };

  }


  return {
    valido: true,

    mensaje:
      "Rostro válido. Puedes capturar la muestra.",

    confianza,
    real,
    live,
    tamaño,
    embedding,
  };
}


// =========================================================
// COMPARAR DOS ROSTROS
// =========================================================

export function compararRostros(
  rostroRegistrado: number[],
  rostroActual: number[]
) {

  return human.match.similarity(
    rostroRegistrado,
    rostroActual
  );

}


// =========================================================
// COMPARAR CONTRA VARIAS MUESTRAS
// =========================================================

export function buscarMejorCoincidencia(
  muestrasRegistradas: number[][],
  rostroActual: number[]
) {

  if (muestrasRegistradas.length === 0) {
    return 0;
  }


  const similitudes =
    muestrasRegistradas.map(
      (muestra) =>
        compararRostros(
          muestra,
          rostroActual
        )
    );


  return Math.max(
    ...similitudes
  );

}