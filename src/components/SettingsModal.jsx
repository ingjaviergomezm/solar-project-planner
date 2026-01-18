import { useState, useEffect } from 'react';
import { Settings, X, Check } from 'lucide-react';
import { obtenerAPIKey, guardarAPIKey } from '../utils/gemini';

export default function SettingsModal({ isOpen, onClose }) {
    const [apiKey, setApiKey] = useState('');
    const [trm, setTrm] = useState(4200);
    const [tarifaKwh, setTarifaKwh] = useState(600);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Cargar configuración guardada
        const savedApiKey = obtenerAPIKey() || '';
        const savedTrm = localStorage.getItem('trm') || '4200';
        const savedTarifa = localStorage.getItem('tarifa_kwh') || '600';

        setApiKey(savedApiKey);
        setTrm(parseFloat(savedTrm));
        setTarifaKwh(parseFloat(savedTarifa));
    }, [isOpen]);

    const handleSave = () => {
        // Guardar configuración
        guardarAPIKey(apiKey);
        localStorage.setItem('trm', trm.toString());
        localStorage.setItem('tarifa_kwh', tarifaKwh.toString());

        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Settings className="w-6 h-6 text-solar-500" />
                        <h2 className="text-2xl font-bold text-white">Configuración</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* API Key de Gemini */}
                    <div>
                        <label className="label">
                            API Key de Gemini
                            <span className="text-red-400 ml-1">*</span>
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Ingresa tu API Key de Gemini"
                            className="input-field"
                        />
                        <p className="text-xs text-cosmic-400 mt-1">
                            Tu API Key se almacena localmente y nunca se comparte
                        </p>
                    </div>

                    {/* TRM */}
                    <div>
                        <label className="label">
                            TRM (Tasa Representativa del Mercado)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={trm}
                                onChange={(e) => setTrm(parseFloat(e.target.value) || 0)}
                                placeholder="4200"
                                className="input-field"
                                step="10"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cosmic-400">
                                COP/USD
                            </span>
                        </div>
                        <p className="text-xs text-cosmic-400 mt-1">
                            Valor por defecto: 4200 COP/USD
                        </p>
                    </div>

                    {/* Tarifa Eléctrica */}
                    <div>
                        <label className="label">
                            Tarifa Eléctrica Promedio
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={tarifaKwh}
                                onChange={(e) => setTarifaKwh(parseFloat(e.target.value) || 0)}
                                placeholder="600"
                                className="input-field"
                                step="10"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cosmic-400">
                                COP/kWh
                            </span>
                        </div>
                        <p className="text-xs text-cosmic-400 mt-1">
                            Valor por defecto: 600 COP/kWh
                        </p>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-2 bg-cosmic-800 hover:bg-cosmic-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                        {showSuccess ? (
                            <>
                                <Check className="w-5 h-5" />
                                Guardado
                            </>
                        ) : (
                            'Guardar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
