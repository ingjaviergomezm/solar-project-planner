import { useState } from 'react';
import { Calculator, MapPin, Zap, DollarSign } from 'lucide-react';
import hspData from '../data/hsp.json';

export default function InputForm({ onCalculate }) {
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

        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
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

        if (!validate()) {
            return;
        }

        // Calcular consumo si se usa factura
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
        <form onSubmit={handleSubmit} className="card">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-solar-500" />
                Datos del Proyecto
            </h2>

            {/* Sección 1: Información del Proyecto */}
            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-cosmic-200 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-solar-500" />
                    Información General
                </h3>

                <div>
                    <label className="input-label">
                        Nombre del Proyecto <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="nombreProyecto"
                        value={formData.nombreProyecto}
                        onChange={handleChange}
                        placeholder="Ej: Sistema Solar Residencial Casa Campestre"
                        className={`input-field ${errors.nombreProyecto ? 'border-red-500' : ''}`}
                    />
                    {errors.nombreProyecto && (
                        <p className="text-red-400 text-sm mt-1">{errors.nombreProyecto}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="input-label">Tipo de Instalación</label>
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

                    <div>
                        <label className="input-label">Ubicación</label>
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

                <div>
                    <label className="input-label">Tipo de Conexión</label>
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

            {/* Sección 2: Datos de Consumo */}
            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-cosmic-200 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-solar-500" />
                    Consumo Energético
                </h3>

                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="checkbox"
                        id="usarFactura"
                        name="usarFactura"
                        checked={formData.usarFactura}
                        onChange={handleChange}
                        className="w-4 h-4 text-solar-500 bg-cosmic-800 border-cosmic-600 rounded focus:ring-solar-500 accent-solar-500"
                    />
                    <label htmlFor="usarFactura" className="text-sm text-cosmic-300">
                        Calcular a partir del valor de la factura
                    </label>
                </div>

                {formData.usarFactura ? (
                    <div>
                        <label className="input-label">
                            Valor Factura Mensual (COP) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            name="valorFactura"
                            value={formData.valorFactura}
                            onChange={handleChange}
                            placeholder="Ej: 300000"
                            className={`input-field ${errors.valorFactura ? 'border-red-500' : ''}`}
                        />
                        {errors.valorFactura && (
                            <p className="text-red-400 text-sm mt-1">{errors.valorFactura}</p>
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
                            placeholder="Ej: 500"
                            className={`input-field ${errors.consumoMensual ? 'border-red-500' : ''}`}
                        />
                        {errors.consumoMensual && (
                            <p className="text-red-400 text-sm mt-1">{errors.consumoMensual}</p>
                        )}
                    </div>
                )}

                <div>
                    <label className="input-label">
                        Autonomía Energética Deseada: <span className="text-solar-500 font-bold">{formData.autonomiaPct}%</span>
                    </label>
                    <input
                        type="range"
                        name="autonomiaPct"
                        min="20"
                        max="100"
                        step="10"
                        value={formData.autonomiaPct}
                        onChange={handleChange}
                        className="slider w-full"
                        style={{ '--value': `${((formData.autonomiaPct - 20) / 80) * 100}%` }}
                    />
                    <div className="flex justify-between text-xs text-cosmic-500 mt-1">
                        <span>20%</span>
                        <span>50%</span>
                        <span>80%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>

            {/* Sección 3: Preferencias */}
            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-cosmic-200 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-solar-500" />
                    Preferencias
                </h3>

                <div>
                    <label className="input-label">Presupuesto Máximo (COP) - Opcional</label>
                    <input
                        type="number"
                        name="presupuestoMaximo"
                        value={formData.presupuestoMaximo}
                        onChange={handleChange}
                        placeholder="Ej: 50000000"
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="input-label">Prioridad</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {['costo', 'calidad', 'sostenibilidad'].map(prioridad => (
                            <label
                                key={prioridad}
                                className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.prioridad === prioridad
                                    ? 'border-solar-500 bg-solar-500/10 text-solar-400'
                                    : 'border-cosmic-600 hover:border-cosmic-500 text-cosmic-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="prioridad"
                                    value={prioridad}
                                    checked={formData.prioridad === prioridad}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <span className="capitalize font-medium">{prioridad}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="requiereBaterias"
                            checked={formData.requiereBaterias}
                            onChange={handleChange}
                            className="w-4 h-4 text-solar-500 bg-cosmic-800 border-cosmic-600 rounded focus:ring-solar-500 accent-solar-500"
                        />
                        <span className="text-sm text-cosmic-300">¿Requiere baterías?</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="espacioLimitado"
                            checked={formData.espacioLimitado}
                            onChange={handleChange}
                            className="w-4 h-4 text-solar-500 bg-cosmic-800 border-cosmic-600 rounded focus:ring-solar-500 accent-solar-500"
                        />
                        <span className="text-sm text-cosmic-300">¿Espacio limitado en techo?</span>
                    </label>
                </div>
            </div>

            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" />
                Calcular Configuraciones
            </button>
        </form>
    );
}
