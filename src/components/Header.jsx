import { Settings, Sun } from 'lucide-react';

export default function Header({ onOpenSettings }) {
    return (
        <header className="sticky top-0 z-50 safe-area-top">
            {/* Background with blur */}
            <div className="absolute inset-0 bg-dark-500/95 backdrop-blur-xl border-b border-cosmic-600/50" />

            <div className="relative container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        {/* Solar Icon Logo */}
                        <div className="relative">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-solar-500 to-solar-600 rounded-xl flex items-center justify-center shadow-glow-sm">
                                <Sun className="w-5 h-5 md:w-6 md:h-6 text-dark-500" strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gradient">
                                Solar Planner
                            </h1>
                            <p className="text-[10px] md:text-xs text-cosmic-400 hidden sm:block">
                                Dimensionamiento y presupuestación solar
                            </p>
                        </div>
                    </div>

                    {/* Settings Button */}
                    <button
                        onClick={onOpenSettings}
                        className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-cosmic-800/50 hover:bg-cosmic-700/60 text-cosmic-200 hover:text-white rounded-xl transition-all duration-300 border border-cosmic-700/50 hover:border-solar-500/50"
                        aria-label="Abrir configuración"
                    >
                        <Settings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                        <span className="hidden md:inline font-medium text-sm">Configuración</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
