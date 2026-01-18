import { useState, useEffect } from 'react';
import { Settings, Key, TrendingUp, Zap, Info, Eye, EyeOff, Save, X } from 'lucide-react';

export default function SettingsTab() {
    const [apiKey, setApiKey] = useState('');
    const [trm, setTrm] = useState('4200');
    const [tarifa, setTarifa] = useState('600');
    const [showApiKey, setShowApiKey] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load saved values
        const savedApiKey = localStorage.getItem('gemini_api_key') || '';
        const savedTrm = localStorage.getItem('trm') || '4200';
        const savedTarifa = localStorage.getItem('tarifa_kwh') || '600';

        setApiKey(savedApiKey);
        setTrm(savedTrm);
        setTarifa(savedTarifa);
    }, []);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.setItem('trm', trm);
        localStorage.setItem('tarifa_kwh', tarifa);

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleCancel = () => {
        // Reset to saved values
        setApiKey(localStorage.getItem('gemini_api_key') || '');
        setTrm(localStorage.getItem('trm') || '4200');
        setTarifa(localStorage.getItem('tarifa_kwh') || '600');
    };

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gradient">Solar Planner</h1>
                <p className="text-xs text-slate-400 mt-1">Dimensionamiento inteligente</p>
            </div>

            {/* Configuration Card */}
            <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">Configuración</h2>
                </div>

                <div className="space-y-6">
                    {/* API Key */}
                    <div>
                        <label className="input-label flex items-center gap-1">
                            API Key de Gemini <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type={showApiKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Ingresa tu API Key"
                                className="input-field pl-10 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                            <span className="text-slate-600">🔒</span>
                            Tu API Key se almacena localmente y nunca se comparte.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-700/50 w-full" />

                    {/* TRM */}
                    <div>
                        <div className="flex justify-between items-end mb-1.5">
                            <label className="input-label mb-0">TRM (Tasa de Cambio)</label>
                            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                                COP/USD
                            </span>
                        </div>
                        <div className="relative">
                            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={trm}
                                onChange={(e) => setTrm(e.target.value)}
                                className="input-field pl-10 pr-24 font-mono"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <span className="text-[10px] text-slate-500">Default: 4200</span>
                            </div>
                        </div>
                    </div>

                    {/* Tarifa */}
                    <div>
                        <div className="flex justify-between items-end mb-1.5">
                            <label className="input-label mb-0">Tarifa Eléctrica Promedio</label>
                            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                                COP/kWh
                            </span>
                        </div>
                        <div className="relative">
                            <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={tarifa}
                                onChange={(e) => setTarifa(e.target.value)}
                                className="input-field pl-10 pr-24 font-mono"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <span className="text-[10px] text-slate-500">Default: 600</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="info-box mb-6">
                <Info className="w-5 h-5 icon flex-shrink-0 mt-0.5" />
                <p>
                    Estos valores afectan directamente el cálculo del ROI y el periodo de retorno de inversión de tus proyectos solares.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handleCancel}
                    className="btn-secondary"
                >
                    <X className="w-4 h-4" />
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    className="btn-primary"
                >
                    {saved ? '✓ Guardado' : (
                        <>
                            Guardar Cambios
                            <Save className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
