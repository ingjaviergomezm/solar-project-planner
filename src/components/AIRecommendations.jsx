import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { analizarConfiguracion, tieneAPIKey } from '../utils/gemini';

export default function AIRecommendations({ datosProyecto, configuracion }) {
    const [recomendaciones, setRecomendaciones] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalizar = async () => {
        if (!tieneAPIKey()) {
            setError('Por favor configura tu API Key de Gemini en el menú de configuración');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const apiKey = localStorage.getItem('gemini_api_key');
            const resultado = await analizarConfiguracion(datosProyecto, configuracion, apiKey);
            setRecomendaciones(resultado);
        } catch (err) {
            setError(err.message || 'Error al obtener recomendaciones de IA');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-solar-500" />
                    Análisis con IA
                </h3>
                {!recomendaciones && (
                    <button
                        onClick={handleAnalizar}
                        disabled={loading}
                        className="btn-primary flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Analizando...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Solicitar Análisis
                            </>
                        )}
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 font-semibold">Error</p>
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {recomendaciones && (
                <div className="bg-gradient-to-br from-cosmic-800/50 to-cosmic-900/50 rounded-lg p-6 border border-cosmic-700/50">
                    <div className="prose prose-invert prose-sm max-w-none">
                        <div className="text-cosmic-300 whitespace-pre-wrap leading-relaxed">
                            {recomendaciones}
                        </div>
                    </div>
                    <button
                        onClick={handleAnalizar}
                        disabled={loading}
                        className="mt-4 text-solar-400 hover:text-solar-300 text-sm flex items-center gap-1 transition-colors w-full md:w-auto justify-center md:justify-start"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generar nuevo análisis
                    </button>
                </div>
            )}

            {!recomendaciones && !error && !loading && (
                <div className="text-center py-8 text-cosmic-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Haz clic en "Solicitar Análisis" para obtener recomendaciones personalizadas con IA</p>
                </div>
            )}
        </div>
    );
}
