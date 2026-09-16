import { useCallback, useEffect, useRef, useState } from "react";
import {
    analizarRostro,
    inicializarReconocimientoFacial,
    type AnalisisFacial,
} from "../services/facialRecognition";

export function useCamaraFacial(automatica = false) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const stream = useRef<MediaStream | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const generacion = useRef(0);
    const montado = useRef(false);
    const [activa, setActiva] = useState(false);
    const [iniciando, setIniciando] = useState(false);
    const [analisis, setAnalisis] = useState<AnalisisFacial | null>(null);
    const [error, setError] = useState("");

    // Invalidar tareas pendientes además de apagar físicamente la cámara.
    const liberar = useCallback(() => {
        generacion.current += 1;
        if (timer.current) clearTimeout(timer.current);
        stream.current?.getTracks().forEach((track) => track.stop());
        stream.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
    }, []);
    const detener = useCallback(() => {
        liberar();
        if (montado.current) {
            setActiva(false);
            setIniciando(false);
            setAnalisis(null);
        }
    }, [liberar]);

    const iniciar = useCallback(async () => {
        liberar();
        const id = generacion.current;
        const vigente = () => montado.current && generacion.current === id;
        setIniciando(true);
        setActiva(false);
        setAnalisis(null);
        setError("");
        try {
            await inicializarReconocimientoFacial();
            if (!vigente()) return;
            const nueva = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
                audio: false,
            });
            if (!vigente() || !videoRef.current) {
                nueva.getTracks().forEach((track) => track.stop());
                return;
            }
            stream.current = nueva;
            const video = videoRef.current;
            video.srcObject = nueva;
            await video.play();
            if (!vigente()) return;
            setActiva(true);
            // Un único ciclo; comprobar identidad sigue siendo una acción manual.
            const observar = async () => {
                try {
                    const resultado = await analizarRostro(video);
                    if (vigente()) setAnalisis(resultado);
                } catch {
                    if (vigente()) setAnalisis(null);
                }
                if (vigente()) timer.current = setTimeout(observar, 500);
            };
            void observar();
        } catch {
            if (vigente()) {
                detener();
                setError(
                    "No se pudo iniciar la cámara o cargar los modelos. Revisa permisos y conexión.",
                );
            }
        } finally {
            if (vigente()) setIniciando(false);
        }
    }, [liberar, detener]);

    // Cada clic analiza un fotograma nuevo; no envía el último resultado almacenado.
    const capturar = useCallback(async () => {
        const id = generacion.current;
        if (!stream.current || !videoRef.current) throw new Error("Enciende la cámara");
        const resultado = await analizarRostro(videoRef.current);
        if (!montado.current || id !== generacion.current)
            throw new Error("La captura fue cancelada");
        // Mostrar el resultado de ESTE clic, aunque difiera del análisis de vista previa.
        setAnalisis(resultado);
        if (!resultado.valido || !resultado.embedding) throw new Error(resultado.mensaje);
        return resultado.embedding;
    }, []);

    useEffect(() => {
        montado.current = true;
        if (automatica) void iniciar();
        return () => {
            montado.current = false;
            liberar();
        };
    }, [automatica, iniciar, liberar]);
    return { videoRef, activa, iniciando, analisis, error, iniciar, detener, capturar };
}
