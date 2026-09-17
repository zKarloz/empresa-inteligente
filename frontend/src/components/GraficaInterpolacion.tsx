import { useId } from "react";
import type { ValorInterpolado } from "../services/scipy";

interface Props {
    conocidos: { x: number; y: number }[];
    estimados: ValorInterpolado[];
}

const formato = (valor: number) => new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 2, notation: Math.abs(valor) >= 1000000 ? "compact" : "standard",
}).format(valor);

export default function GraficaInterpolacion({ conocidos, estimados }: Props) {
    const tituloId = useId();
    const descripcionId = useId();
    const puntos = [...conocidos].sort((a, b) => a.x - b.x);
    if (puntos.length < 2) return null;

    // Escalas normalizadas para evitar desbordamientos con magnitudes grandes.
    const xs = puntos.map(p => p.x);
    const ys = [...puntos.map(p => p.y), ...estimados.map(p => p.valor_estimado)];
    const escalaX = Math.max(...xs.map(Math.abs), 1);
    const escalaY = Math.max(...ys.map(Math.abs), 1);
    const minX = Math.min(...xs) / escalaX;
    const maxX = Math.max(...xs) / escalaX;
    const minY = Math.min(...ys) / escalaY;
    const maxY = Math.max(...ys) / escalaY;
    const margenY = (maxY - minY || 0.2) * 0.1;
    const inferior = minY - margenY;
    const superior = maxY + margenY;
    const xGrafica = (x: number) => 100 + ((x / escalaX - minX) / (maxX - minX)) * 570;
    const yGrafica = (y: number) => 285 - ((y / escalaY - inferior) / (superior - inferior)) * 240;
    const linea = puntos.map(p => `${xGrafica(p.x)},${yGrafica(p.y)}`).join(" ");

    return (
        <figure className="interpolation-chart">
            <figcaption>
                <strong>Interpolación lineal</strong>
                <p>Los círculos son valores conocidos ingresados; los rombos son estimaciones.
                    La línea une los puntos conocidos. No es una predicción fuera del intervalo.</p>
            </figcaption>
            <div className="interpolation-chart-scroll">
                <svg viewBox="0 0 720 350" role="img" aria-labelledby={`${tituloId} ${descripcionId}`}>
                    <title id={tituloId}>Puntos conocidos y valores estimados de X e Y</title>
                    <desc id={descripcionId}>Gráfica de interpolación lineal con {puntos.length} puntos conocidos
                        y {estimados.length} estimaciones. Los valores exactos están en las tablas debajo.</desc>
                    {[0, 1, 2, 3, 4].map(i => {
                        const proporcion = i / 4;
                        const x = 100 + proporcion * 570;
                        // Las etiquetas usan el rango real de Y para mantener cifras finitas.
                        const valorY = (minY * (1 - proporcion) + maxY * proporcion) * escalaY;
                        const tickY = yGrafica(valorY);
                        return <g key={i}>
                            {(minY !== maxY || i === 0) && <>
                                <line x1="100" x2="670" y1={tickY} y2={tickY} className="interpolation-chart-grid" />
                                <text x="90" y={tickY + 4} textAnchor="end">{formato(valorY)}</text>
                            </>}
                            <text x={x} y="308" textAnchor="middle">{formato((minX * (1 - proporcion) + maxX * proporcion) * escalaX)}</text>
                            <line x1={x} x2={x} y1="285" y2="290" className="interpolation-chart-axis" />
                        </g>;
                    })}
                    <line x1="100" x2="100" y1="40" y2="285" className="interpolation-chart-axis" />
                    <line x1="100" x2="670" y1="285" y2="285" className="interpolation-chart-axis" />
                    <text x="385" y="339" textAnchor="middle">X (variable de entrada)</text>
                    <text x="100" y="24">Y (valor)</text>
                    <polyline points={linea} className="interpolation-chart-line" />
                    {puntos.map(p => <circle key={p.x} cx={xGrafica(p.x)} cy={yGrafica(p.y)} r="5"
                        className="interpolation-chart-known"><title>{`Conocido: X=${p.x}, Y=${p.y}`}</title></circle>)}
                    {estimados.map(p => <path key={p.x}
                        d={`M ${xGrafica(p.x)} ${yGrafica(p.valor_estimado) - 7} l 7 7 l -7 7 l -7 -7 Z`}
                        className="interpolation-chart-estimate"><title>{`Estimado: X=${p.x}, Y=${p.valor_estimado}`}</title></path>)}
                </svg>
            </div>
            <p className="interpolation-chart-legend">● Conocido ingresado · ◆ Estimado por SciPy</p>
            <details>
                <summary>Ver valores utilizados en la gráfica</summary>
                <div className="table-container">
                    <table className="data-table">
                        <thead><tr><th>Tipo</th><th>X</th><th>Y</th></tr></thead>
                        <tbody>
                            {puntos.map(p => <tr key={`c-${p.x}`}><td>Conocido ingresado</td><td>{p.x}</td><td>{p.y}</td></tr>)}
                            {estimados.map(p => <tr key={`e-${p.x}`}><td>Estimado</td><td>{p.x}</td><td>{p.valor_estimado}</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </details>
        </figure>
    );
}
