import { useState } from 'react';
import { MapPin, Zap, DollarSign, Calculator, ChevronDown } from 'lucide-react';
import hspData from '../data/hsp.json';

export default function ProjectTab({ onCalculate, isCalculating }) {
    const [formData, setFormData] = useState({
        nombreProyecto: '',
        tipoInstalacion: 'residencial',
        ciudad: 'Bogotá',
        tipoConexion: 'on-grid',
        consumoMensual: '',
        valorFactura: '',
        usarFactura: false,
        autonomiaPct: 100,
        presupuestoMaximo: '',
        prioridad: 'sostenibilidad',
        requiereBaterias: false,
        espacioLimitado: false
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSliderChange = (value) => {
        setFormData(prev => ({ ...prev, autonomiaPct: parseInt(value) }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nombreProyecto.trim()) {
            newErrors.nombreProyecto = 'El nombre del proyecto es requerido';
        }

        if (formData.usarFactura) {
            if (!formData.valorFactura || parseFloat(formData.valorFactura) <= 0) {
                newErrors.valorFactura = 'Ingresa un valor de factura válido';
            }
        } else {
            if (!formData.consumoMensual || parseFloat(formData.consumoMensual) <= 0) {
                newErrors.consumoMensual = 'Ingresa un consumo mensual válido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        let consumoMensual = parseFloat(formData.consumoMensual);
        if (formData.usarFactura) {
            const tarifaKwh = parseFloat(localStorage.getItem('tarifa_kwh') || '600');
            consumoMensual = parseFloat(formData.valorFactura) / tarifaKwh;
        }

        const datosProyecto = {
            ...formData,
            consumoMensual,
            hsp: hspData.hsp_colombia[formData.ciudad],
            tarifaKwh: parseFloat(localStorage.getItem('tarifa_kwh') || '600'),
            trm: parseFloat(localStorage.getItem('trm') || '4200')
        };

        onCalculate(datosProyecto);
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in space-y-4">
            {/* Page Title */}
            <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-accent-teal" />
                <h2 className="text-xl font-bold text-white">Datos del Proyecto</h2>
            </div>

            {/* Section 1: General Information */}
            <div className="section-card teal">
                <div className="flex items-center gap-2 mb-4 text-accent-teal font-medium">
                    <MapPin className="w-4 h-4" />
                    <h3>Información General</h3>
                </div>

                <div className="space-y-4">
                    {/* Project Name */}
                    <div>
                        <label className="input-label">
                            Nombre del Proyecto <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombreProyecto"
                            value={formData.nombreProyecto}
                            onChange={handleChange}
                            placeholder="Ej: Sistema Solar Residencial"
                            className={`input-field ${errors.nombreProyecto ? 'border-red-500' : ''}`}
                        />
                        {errors.nombreProyecto && (
                            <p className="text-red-400 text-xs mt-1">{errors.nombreProyecto}</p>
                        )}
                    </div>

                    {/* Installation Type */}
                    <div>
                        <label className="input-label">Tipo de Instalación</label>
                        <div className="select-wrapper">
                            <select
                                name="tipoInstalacion"
                                value={formData.tipoInstalacion}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="residencial">Residencial</option>
                                <option value="comercial">Comercial</option>
                                <option value="industrial">Industrial</option>
                            </select>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="input-label">Ubicación</label>
                        <div className="select-wrapper">
                            <select
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {Object.keys(hspData.hsp_colombia).map(ciudad => (
                                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Connection Type */}
                    <div>
                        <label className="input-label">Tipo de Conexión</label>
                        <div className="select-wrapper">
                            <select
                                name="tipoConexion"
                                value={formData.tipoConexion}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="on-grid">On-Grid (Conectado a la red)</option>
                                <option value="off-grid">Off-Grid (Autónomo)</option>
                                <option value="hibrido">Híbrido</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Energy Consumption */}
            <div className="section-card purple">
                <div className="flex items-center gap-2 mb-4 text-accent-purple font-medium">
                    <Zap className="w-4 h-4" />
                    <h3>Consumo Energético</h3>
                </div>

                <div className="space-y-5">
                    {/* Use Invoice Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="usarFactura"
                            checked={formData.usarFactura}
                            onChange={handleChange}
                            className="mt-1 w-5 h-5 rounded text-accent-purple bg-slate-800 border-slate-600 focus:ring-accent-purple"
                        />
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                            Calcular a partir del valor de la factura
                        </span>
                    </label>

                    {/* Invoice or Consumption Input */}
                    {formData.usarFactura ? (
                        <div>
                            <label className="input-label">
                                Valor Factura Mensual (COP) <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input
                                    type="number"
                                    name="valorFactura"
                                    value={formData.valorFactura}
                                    onChange={handleChange}
                                    placeholder="320000"
                                    className={`input-field pl-8 ${errors.valorFactura ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {errors.valorFactura && (
                                <p className="text-red-400 text-xs mt-1">{errors.valorFactura}</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="input-label">
                                Consumo Mensual (kWh) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                name="consumoMensual"
                                value={formData.consumoMensual}
                                onChange={handleChange}
                                placeholder="500"
                                className={`input-field ${errors.consumoMensual ? 'border-red-500' : ''}`}
                            />
                            {errors.consumoMensual && (
                                <p className="text-red-400 text-xs mt-1">{errors.consumoMensual}</p>
                            )}
                        </div>
                    )}

                    {/* Autonomy Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="input-label mb-0">Autonomía Deseada</label>
                            <span className="text-sm font-bold text-accent-purple">{formData.autonomiaPct}%</span>
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="100"
                            step="10"
                            value={formData.autonomiaPct}
                            onChange={(e) => handleSliderChange(e.target.value)}
                            className="slider w-full"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                            <span>20%</span>
                            <span>50%</span>
                            <span>80%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calculate Button - Fixed at bottom */}
            <button
                type="submit"
                disabled={isCalculating}
                className="w-full btn-primary py-4"
            >
                {isCalculating ? (
                    <>
                        <span className="animate-spin">⟳</span>
                        Calculando...
                    </>
                ) : (
                    <>
                        <Calculator className="w-5 h-5" />
                        Calcular Configuraciones
                    </>
                )}
            </button>

            {/* Section 3: Preferences */}
            <div className="section-card amber">
                <div className="flex items-center gap-2 mb-4 text-primary font-medium">
                    <DollarSign className="w-4 h-4" />
                    <h3>Preferencias</h3>
                </div>

                <div className="space-y-4">
                    {/* Budget */}
                    <div>
                        <label className="input-label">
                            Presupuesto Máximo (COP) - Opcional
                        </label>
                        <input
                            type="number"
                            name="presupuestoMaximo"
                            value={formData.presupuestoMaximo}
                            onChange={handleChange}
                            placeholder="Ej: 50000000"
                            className="input-field"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="input-label mb-2">Prioridad</label>
                        <div className="flex flex-wrap gap-4">
                            {['costo', 'calidad', 'sostenibilidad'].map((priority) => (
                                <label key={priority} className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="prioridad"
                                        value={priority}
                                        checked={formData.prioridad === priority}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary bg-slate-800 border-slate-600 focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-slate-300 capitalize">{priority}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="requiereBaterias"
                                checked={formData.requiereBaterias}
                                onChange={handleChange}
                                className="w-4 h-4 rounded text-primary bg-slate-800 border-slate-600 focus:ring-primary"
                            />
                            <span className="text-sm text-slate-300">¿Requiere baterías?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="espacioLimitado"
                                checked={formData.espacioLimitado}
                                onChange={handleChange}
                                className="w-4 h-4 rounded text-primary bg-slate-800 border-slate-600 focus:ring-primary"
                            />
                            <span className="text-sm text-slate-300">¿Espacio limitado en techo?</span>
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
}
