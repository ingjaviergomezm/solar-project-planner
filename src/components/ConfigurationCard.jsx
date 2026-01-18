import { Sun, Zap, Battery, TrendingUp, Clock, DollarSign, Award, FileText, Star } from 'lucide-react';
import { formatCOP, formatNumber } from '../utils/calculations';

export default function ConfigurationCard({ configuracion, isRecomendada, onSelect }) {
    const {
        tipo,
        descripcion,
        panel,
        numPaneles,
        potenciaReal,
        areaRequerida,
        inversor,
        bateria,
        capacidadBateria,
        presupuesto,
        roi,
        puntuacion
    } = configuracion;

    const getBadgeColor = () => {
        if (tipo.includes('Costo') || tipo.includes('Precio')) return 'from-blue-500 to-blue-600';
        if (tipo.includes('Calidad')) return 'from-purple-500 to-purple-600';
        return 'from-green-500 to-green-600';
    };

    const getGlowColor = () => {
        if (tipo.includes('Costo') || tipo.includes('Precio')) return 'shadow-blue-500/20';
        if (tipo.includes('Calidad')) return 'shadow-purple-500/20';
        return 'shadow-green-500/20';
    };

    return (
        <div className={`card-premium hover-lift group relative overflow-hidden ${isRecomendada ? 'ring-2 ring-solar-500 ring-offset-2 ring-offset-cosmic-950' : ''} ${getGlowColor()}`}>
            {/* Ribbon de recomendada */}
            {isRecomendada && (
                <div className="ribbon">
                    <Award className="w-3 h-3" />
                    Recomendada
                </div>
            )}

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>

            {/* Header */}
            <div className="mb-6 relative z-10">
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getBadgeColor()} text-white px-4 py-2 rounded-xl text-sm font-bold mb-3 shadow-lg`}>
                    <Star className="w-4 h-4" />
                    {tipo}
                </div>
                <p className="text-cosmic-300 text-sm leading-relaxed">{descripcion}</p>
            </div>

            {/* Especificaciones Técnicas */}
            <div className="space-y-4 mb-6">
                {/* Paneles */}
                <div className="flex items-start gap-3 p-3 bg-cosmic-900/50 rounded-xl border border-cosmic-700/50 hover:border-solar-500/30 transition-colors duration-300">
                    <div className="p-2 bg-solar-500/10 rounded-lg">
                        <Sun className="w-5 h-5 text-solar-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-bold text-lg">{formatNumber(potenciaReal, 2)} kWp</p>
                        <p className="text-cosmic-300 text-sm font-medium">
                            {numPaneles}x {panel.marca} {panel.modelo}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-cosmic-400">{panel.potencia_w}W</span>
                            <span className="text-xs text-cosmic-500">•</span>
                            <span className="text-xs text-cosmic-400">{panel.tecnologia}</span>
                            <span className="text-xs text-cosmic-500">•</span>
                            <span className="text-xs text-solar-400 font-semibold">{panel.eficiencia}% eficiencia</span>
                        </div>
                    </div>
                </div>

                {/* Inversor */}
                <div className="flex items-start gap-3 p-3 bg-cosmic-900/50 rounded-xl border border-cosmic-700/50 hover:border-energy-500/30 transition-colors duration-300">
                    <div className="p-2 bg-energy-500/10 rounded-lg">
                        <Zap className="w-5 h-5 text-energy-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-bold">{inversor.marca} {inversor.modelo}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-cosmic-300">{inversor.potencia_kw}kW</span>
                            <span className="text-xs text-cosmic-500">•</span>
                            <span className="text-xs text-energy-400 font-semibold">{inversor.eficiencia}% eficiencia</span>
                        </div>
                        <p className="text-xs text-cosmic-400 mt-1">{inversor.tipo}</p>
                    </div>
                </div>

                {/* Baterías (si aplica) */}
                {bateria && (
                    <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-yellow-500/30 transition-colors duration-300">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Battery className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold">
                                {Math.ceil(capacidadBateria / bateria.capacidad_kwh)}x {bateria.marca}
                            </p>
                            <p className="text-slate-300 text-sm">{formatNumber(capacidadBateria, 1)} kWh total</p>
                            <p className="text-xs text-slate-400 mt-1">{bateria.tecnologia}</p>
                        </div>
                    </div>
                )}

                {/* Área requerida */}
                <div className="pt-3 border-t border-cosmic-700/50">
                    <p className="text-cosmic-400 text-sm">
                        Área requerida: <span className="text-white font-bold">{formatNumber(areaRequerida, 1)} m²</span>
                    </p>
                </div>
            </div>

            {/* Análisis Financiero */}
            <div className="bg-gradient-to-br from-cosmic-950/80 to-cosmic-900/80 rounded-xl p-5 space-y-3 mb-6 border border-cosmic-700/50">
                <div className="flex justify-between items-center">
                    <span className="text-cosmic-300 text-sm font-medium">Inversión Total</span>
                    <span className="text-white font-bold text-lg">{formatCOP(presupuesto.inversionTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-cosmic-400 text-sm">Costo por Wp</span>
                    <span className="text-slate-200 font-semibold">{formatCOP(presupuesto.costoPorWp)}</span>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-cosmic-600 to-transparent my-2"></div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-cosmic-800/50 rounded-lg p-3 border border-cosmic-700/30">
                        <div className="flex items-center gap-1 text-cosmic-400 text-xs mb-1">
                            <Clock className="w-3 h-3" />
                            Retorno
                        </div>
                        <p className="text-energy-400 font-bold text-lg">{roi.tiempoRetornoAnos} años</p>
                    </div>
                    <div className="bg-cosmic-800/50 rounded-lg p-3 border border-cosmic-700/30">
                        <div className="flex items-center gap-1 text-cosmic-400 text-xs mb-1">
                            <TrendingUp className="w-3 h-3" />
                            ROI (25 años)
                        </div>
                        <p className="text-solar-400 font-bold text-lg">{formatNumber(roi.roi, 0)}%</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
                    <div className="flex items-center gap-1 text-green-400 text-xs mb-1">
                        <DollarSign className="w-3 h-3" />
                        Ahorro Anual Estimado
                    </div>
                    <p className="text-green-300 font-bold text-lg">{formatCOP(roi.ahorroAnual)}</p>
                </div>
            </div>

            {/* Puntuación con barra animada */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-cosmic-300 text-sm font-medium">Puntuación General</span>
                    <span className="text-white font-bold">{formatNumber(puntuacion, 0)}/100</span>
                </div>
                <div className="relative w-full bg-cosmic-700/50 rounded-full h-3 overflow-hidden">
                    <div
                        className={`bg-gradient-to-r ${getBadgeColor()} h-3 rounded-full transition-all duration-1000 ease-out relative`}
                        style={{ width: `${puntuacion}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                </div>
            </div>

            {/* Botón de acción */}
            <button
                onClick={onSelect}
                className="w-full btn-secondary flex items-center justify-center gap-2 group/btn"
            >
                <FileText className="w-5 h-5 transition-transform duration-300 group-hover/btn:scale-110" />
                Ver Detalles y Generar PDF
            </button>
        </div>
    );
}
