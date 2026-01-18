import { Sparkles, Clock, TrendingUp, DollarSign, ChevronDown, Star, Cpu, Zap, Settings } from 'lucide-react';

export default function ResultsTab({
    configuraciones,
    datosProyecto,
    onSelectConfig,
    comparativaHTML,
    aiAnalysis
}) {
    if (!configuraciones || configuraciones.length === 0) {
        return (
            <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Cpu className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sin configuraciones</h3>
                <p className="text-sm text-slate-400 max-w-xs">
                    Ingresa los datos de tu proyecto en la pestaña "Proyecto" y calcula las configuraciones.
                </p>
            </div>
        );
    }

    const formatCurrency = (value) => {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        }
        return `$${(value / 1000).toFixed(0)}k`;
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Solar Planner</h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Proyecto: {datosProyecto?.nombreProyecto || 'Sin nombre'} - {datosProyecto?.ciudad}
                    </p>
                </div>
                <button className="p-2 rounded-full hover:bg-slate-800 transition-colors">
                    <Settings className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Configuraciones Optimizadas
                </h2>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
                    {configuraciones.length} Generadas
                </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed -mt-2">
                Hemos generado {configuraciones.length} configuraciones optimizadas. La recomendación basada en tu prioridad está destacada.
            </p>

            {/* Configuration Cards */}
            {configuraciones.map((config, index) => (
                <div
                    key={index}
                    className={`result-card ${index === 0 ? 'recommended' : ''}`}
                >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-primary" />
                                <h3 className="font-bold text-lg text-white">{config.tipo}</h3>
                            </div>
                            <p className="text-xs text-slate-400">{config.descripcion || 'Configuración optimizada'}</p>
                        </div>
                        {index === 0 && (
                            <span className="badge badge-primary">RECOMENDADO</span>
                        )}
                    </div>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="metric-card">
                            <span className="metric-label">Capacidad</span>
                            <span className="metric-value">
                                {config.potenciaReal?.toFixed(2) || '0.00'}
                                <span className="text-sm font-normal text-slate-500 ml-1">kWp</span>
                            </span>
                        </div>
                        <div className="metric-card">
                            <span className="metric-label">Inversión</span>
                            <span className="metric-value">
                                {formatCurrency(config.presupuesto?.inversionTotal || 0)}
                            </span>
                        </div>
                    </div>

                    {/* Component Details */}
                    <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                <Cpu className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="font-medium text-sm text-white">
                                    {config.numPaneles}x {config.panel?.modelo || 'Panel Solar'}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {config.panel?.potencia_w}W • {config.panel?.tecnologia || 'Monocristalino'} • {config.panel?.eficiencia}% ef.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-medium text-sm text-white">
                                    {config.inversor?.modelo || 'Inversor'}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {config.inversor?.potencia_kw}kW • {config.inversor?.eficiencia}% eficiencia
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Badges */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                        <div className="badge badge-green flex items-center gap-1.5 flex-shrink-0">
                            <TrendingUp className="w-3 h-3" />
                            <div className="flex flex-col">
                                <span className="text-[8px] opacity-80">ROI (25a)</span>
                                <span className="font-bold">{config.roi?.roi || 0}%</span>
                            </div>
                        </div>
                        <div className="badge badge-blue flex items-center gap-1.5 flex-shrink-0">
                            <Clock className="w-3 h-3" />
                            <div className="flex flex-col">
                                <span className="text-[8px] opacity-80">Retorno</span>
                                <span className="font-bold">{config.roi?.tiempoRetornoAnos || 0} años</span>
                            </div>
                        </div>
                        <div className="badge badge-purple flex items-center gap-1.5 flex-shrink-0">
                            <DollarSign className="w-3 h-3" />
                            <div className="flex flex-col">
                                <span className="text-[8px] opacity-80">Ahorro Mensual</span>
                                <span className="font-bold">{formatCurrency(config.roi?.ahorroMensual || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="btn-secondary text-sm py-2.5">
                            <Cpu className="w-4 h-4" />
                            Detalles
                        </button>
                        <button
                            onClick={() => onSelectConfig(config)}
                            className="btn-primary text-sm py-2.5"
                        >
                            Seleccionar
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                        </button>
                    </div>
                </div>
            ))}

            {/* Collapsed configs */}
            {configuraciones.length > 1 && (
                <div className="glass rounded-2xl p-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-800 p-2 rounded-lg">
                                <Sparkles className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Ver más opciones</h3>
                                <p className="text-xs text-slate-400">{configuraciones.length - 1} configuraciones adicionales</p>
                            </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            )}

            {/* AI Analysis Preview */}
            {aiAnalysis && (
                <div className="border-t border-slate-800 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-accent-purple" />
                        <h2 className="font-semibold text-white">Análisis con IA</h2>
                    </div>
                    <div className="glass rounded-xl p-4 text-sm leading-relaxed text-slate-300">
                        <p className="mb-2">
                            <span className="text-accent-purple font-medium">Observación Clave:</span> {aiAnalysis.substring(0, 200)}...
                        </p>
                        <button className="flex items-center gap-2 text-xs font-medium text-accent-purple hover:text-accent-purple/80 transition mt-2">
                            <Sparkles className="w-4 h-4" />
                            Ver análisis completo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
