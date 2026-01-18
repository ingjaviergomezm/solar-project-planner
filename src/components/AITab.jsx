import { useState } from 'react';
import { Sparkles, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { tieneAPIKey, obtenerAPIKey, generarAnalisisCliente } from '../utils/gemini';

export default function AITab({ configuracion, datosProyecto }) {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [error, setError] = useState('');

    const generateAnalysis = async () => {
        if (!tieneAPIKey()) {
            setError('Por favor configura tu API Key de Gemini en la pestaña de Configuración');
            return;
        }

        if (!configuracion) {
            setError('Primero debes calcular una configuración en la pestaña Proyecto');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const apiKey = obtenerAPIKey();
            const result = await generarAnalisisCliente(datosProyecto, configuracion, apiKey);
            setAnalysis(result);
        } catch (err) {
            console.error('Error generating analysis:', err);
            setError('Error al generar el análisis. Verifica tu API Key e intenta de nuevo.');
        }

        setLoading(false);
    };

    // Styles
    const containerStyle = {
        padding: '1rem',
        paddingBottom: '6rem',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem'
    };

    const titleStyle = {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'white',
        margin: 0
    };

    const cardStyle = {
        background: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '1rem',
        border: '1px solid rgba(148, 163, 184, 0.1)'
    };

    const buttonStyle = {
        width: '100%',
        padding: '1rem 1.5rem',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: 'none',
        borderRadius: '0.75rem',
        color: 'white',
        fontWeight: 600,
        fontSize: '1rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        opacity: loading ? 0.7 : 1,
        transition: 'all 0.2s',
        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
    };

    const errorStyle = {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '0.75rem',
        padding: '1rem',
        color: '#fca5a5',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginBottom: '1rem'
    };

    const analysisStyle = {
        color: '#e2e8f0',
        lineHeight: 1.7,
        fontSize: '0.95rem'
    };

    // Empty state when no config
    if (!configuracion) {
        return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <Sparkles style={{ width: 24, height: 24, color: '#f59e0b' }} />
                    <h1 style={titleStyle}>Análisis con IA</h1>
                </div>

                <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        background: 'rgba(148, 163, 184, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Zap style={{ width: 32, height: 32, color: '#64748b' }} />
                    </div>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Sin configuración
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                        Primero calcula una configuración solar en la pestaña <strong>Proyecto</strong> para generar el análisis con inteligencia artificial.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <Sparkles style={{ width: 24, height: 24, color: '#f59e0b' }} />
                <h1 style={titleStyle}>Análisis con IA</h1>
            </div>

            {/* Project Summary Card */}
            <div style={{ ...cardStyle, borderLeft: '4px solid #f59e0b' }}>
                <h3 style={{ color: '#f59e0b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 0, marginBottom: '0.75rem' }}>
                    Configuración Analizada
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Potencia</span>
                        <p style={{ color: 'white', fontWeight: 600, margin: '0.25rem 0 0' }}>
                            {configuracion.potenciaReal?.toFixed(2) || '0'} kWp
                        </p>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Paneles</span>
                        <p style={{ color: 'white', fontWeight: 600, margin: '0.25rem 0 0' }}>
                            {configuracion.numPaneles || '0'} unidades
                        </p>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Inversión</span>
                        <p style={{ color: 'white', fontWeight: 600, margin: '0.25rem 0 0' }}>
                            ${configuracion.presupuesto?.inversionTotal?.toLocaleString('es-CO') || '0'} COP
                        </p>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Retorno</span>
                        <p style={{ color: '#10b981', fontWeight: 600, margin: '0.25rem 0 0' }}>
                            {configuracion.roi?.tiempoRetornoAnos || '0'} años
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div style={errorStyle}>
                    <AlertCircle style={{ width: 20, height: 20, flexShrink: 0, marginTop: 2 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Generate Button */}
            <button
                onClick={generateAnalysis}
                disabled={loading}
                style={buttonStyle}
            >
                {loading ? (
                    <>
                        <RefreshCw style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
                        Generando análisis...
                    </>
                ) : (
                    <>
                        <Sparkles style={{ width: 20, height: 20 }} />
                        Generar Análisis con IA
                    </>
                )}
            </button>

            {/* Analysis Result */}
            {analysis && (
                <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
                    <style>{`
                        .ai-analysis .ai-section {
                            margin-bottom: 1.25rem;
                            padding-bottom: 1rem;
                            border-bottom: 1px solid rgba(148, 163, 184, 0.1);
                        }
                        .ai-analysis .ai-section:last-child {
                            margin-bottom: 0;
                            padding-bottom: 0;
                            border-bottom: none;
                        }
                        .ai-analysis h3 {
                            color: #f59e0b;
                            font-size: 1rem;
                            font-weight: 600;
                            margin: 0 0 0.75rem 0;
                        }
                        .ai-analysis p {
                            color: #e2e8f0;
                            line-height: 1.6;
                            margin: 0 0 0.5rem 0;
                        }
                        .ai-analysis ul {
                            margin: 0.5rem 0;
                            padding-left: 1.25rem;
                        }
                        .ai-analysis li {
                            color: #cbd5e1;
                            margin-bottom: 0.5rem;
                            line-height: 1.5;
                        }
                        .ai-analysis strong {
                            color: #f59e0b;
                        }
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                    <div
                        className="ai-analysis"
                        style={analysisStyle}
                        dangerouslySetInnerHTML={{ __html: analysis }}
                    />
                </div>
            )}

            {/* Footer */}
            <p style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.75rem',
                marginTop: '2rem'
            }}>
                Análisis generado por Gemini AI • Máximo 300 palabras
            </p>
        </div>
    );
}
