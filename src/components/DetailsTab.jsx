import { FileText, Receipt, TrendingUp, Sparkles, ChevronRight, Sun } from 'lucide-react';
import PDFGenerator from './PDFGenerator';

export default function DetailsTab({ configuracion, datosProyecto, recomendacionesIA }) {
    if (!configuracion) {
        return (
            <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Receipt className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sin configuración seleccionada</h3>
                <p className="text-sm text-slate-400 max-w-xs">
                    Selecciona una configuración en la pestaña "Diseño" para ver el desglose de costos.
                </p>
            </div>
        );
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    const costItems = [
        { label: 'Paneles Solares', value: configuracion.presupuesto?.costoPaneles },
        { label: 'Inversor', value: configuracion.presupuesto?.costoInversor },
        { label: 'Estructura de Montaje', value: configuracion.presupuesto?.costoEstructura },
        { label: 'Protecciones DC', value: configuracion.presupuesto?.costoProteccionesDC },
        { label: 'Protecciones AC', value: configuracion.presupuesto?.costoProteccionesAC },
        { label: 'Puesta a Tierra RETIE', value: configuracion.presupuesto?.costoPuestaATierra },
        { label: 'Cableado Fotovoltaico', value: configuracion.presupuesto?.costoCableado },
        { label: 'Mano de Obra', value: configuracion.presupuesto?.costoManoObra },
        { label: 'Ingeniería y Diseño', value: configuracion.presupuesto?.costoIngenieria },
        { label: 'Trámites Operador', value: configuracion.presupuesto?.costoTramitesOperador },
        { label: 'Certificación RETIE', value: configuracion.presupuesto?.costoCertificacionRETIE },
    ].filter(item => item.value > 0);

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sun className="w-6 h-6 text-primary" />
                    <h1 className="text-lg font-bold text-white">Solar Planner</h1>
                </div>
            </div>

            {/* Title */}
            <div>
                <h2 className="text-2xl font-bold text-white">Detalles de la Configuración</h2>
                <p className="text-sm text-slate-400 mt-1">
                    <span className="text-accent-teal font-medium">↘ {configuracion.tipo}</span>
                    {' - '}
                    {configuracion.descripcion || 'Configuración optimizada seleccionada'}
                </p>
            </div>

            {/* PDF Button */}
            <PDFGenerator
                datosProyecto={datosProyecto}
                configuracion={configuracion}
                recomendacionesIA={recomendacionesIA}
            />

            {/* Cost Breakdown Card */}
            <div className="section-card">
                <div className="flex items-center gap-2 mb-4">
                    <Receipt className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-semibold text-white">Desglose de Costos</h3>
                </div>

                <ul className="space-y-0">
                    {costItems.map((item, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center py-2.5 border-b border-slate-700/50 last:border-0"
                        >
                            <span className="text-sm text-slate-400">{item.label}</span>
                            <span className="text-sm font-medium text-white">{formatCurrency(item.value)}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-4 pt-3 border-t border-slate-600 flex justify-between items-center">
                    <span className="font-semibold text-white">Inversión Total</span>
                    <span className="text-xl font-bold text-primary">
                        {formatCurrency(configuracion.presupuesto?.inversionTotal)}
                    </span>
                </div>
            </div>

            {/* Savings Projection Card */}
            <div className="section-card">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-accent-teal" />
                    <h3 className="text-lg font-semibold text-white">Proyección de Ahorros</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="metric-card">
                        <p className="metric-label">Ahorro Mensual</p>
                        <p className="metric-value teal">{formatCurrency(configuracion.roi?.ahorroMensual)}</p>
                    </div>
                    <div className="metric-card">
                        <p className="metric-label">Retorno (ROI)</p>
                        <p className="metric-value">
                            {configuracion.roi?.tiempoRetornoAnos}
                            <span className="text-sm font-normal text-slate-500 ml-1">años</span>
                        </p>
                    </div>
                    <div className="metric-card col-span-2 flex justify-between items-center">
                        <div>
                            <p className="metric-label">Ganancia Neta (25 años)</p>
                            <p className="metric-value teal text-xl">{formatCurrency(configuracion.roi?.gananciaTotal)}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-accent-teal/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-accent-teal" />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                    <div className="px-2 py-1 bg-slate-800 rounded-md">
                        ROI: <span className="text-white font-medium">{configuracion.roi?.roi}%</span>
                    </div>
                    <div className="px-2 py-1 bg-slate-800 rounded-md">
                        VPN: <span className="text-white font-medium">{formatCurrency(configuracion.roi?.vpn)}</span>
                    </div>
                    <div className="px-2 py-1 bg-slate-800 rounded-md">
                        TIR: <span className="text-white font-medium">{configuracion.roi?.tir || 0}%</span>
                    </div>
                </div>
            </div>

            {/* AI Analysis Preview Card */}
            {configuracion.justificacionHTML && (
                <div className="ai-card">
                    <div className="ai-card-inner">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                Análisis con IA
                            </h3>
                        </div>
                        <div
                            className="text-sm text-slate-300 leading-relaxed prose prose-invert prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: configuracion.justificacionHTML.substring(0, 300) + '...'
                            }}
                        />
                        <button className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-purple-400 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                            Leer análisis completo
                        </button>
                    </div>
                </div>
            )}

            {/* Footer Note */}
            <p className="text-xs text-center text-slate-600 pb-4">
                * Incluye degradación 0.5%/año, inflación energía 5%/año.
                <br />
                Solar Project Planner © 2026
            </p>
        </div>
    );
}
