import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Brain, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export function AnalisisNLP() {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const procesarTexto = async () => {
    if (!texto.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/nlp/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
      });
      if (res.ok) {
        const json = await res.json();
        setResultado(json);
      }
    } catch (err) {
      console.error('Error al procesar NLTK:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Análisis de Lenguaje Natural (NLTK)"
        subtitle="Procesamiento inteligente de texto, tokenización y detección de sentimiento"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
            <Brain className="w-4 h-4 text-purple-600" />
            <span>Entrada de Texto</span>
          </div>
          <textarea
            rows={5}
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Escribe o pega aquí el comentario del cliente para analizar con NLTK..."
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all resize-none"
          />
          <button
            onClick={procesarTexto}
            disabled={loading || !texto.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-200"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Procesar con NLTK
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Resultados del Análisis</span>
              {resultado && (
                <span className="text-[10px] bg-purple-50 text-purple-700 font-extrabold px-2 py-0.5 rounded-md border border-purple-200">
                  Completado
                </span>
              )}
            </div>

            {resultado ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Sentimiento Detectado</span>
                  <span className="text-sm font-black text-slate-800 capitalize">{resultado.sentimiento || 'Neutral'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Tokens Relevantes</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resultado.tokens?.map((t: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">
                        {t}
                      </span>
                    )) || <span className="text-slate-400">Sin tokens</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center text-slate-400 space-y-2">
                <Brain className="w-8 h-8 text-slate-300" />
                <p className="text-xs font-medium">Ingresa un texto y presiona "Procesar" para ver la segmentación NLTK.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Modelo activo basado en SciPy / NLTK
          </div>
        </div>
      </div>
    </div>
  );
}