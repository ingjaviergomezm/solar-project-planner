import { Award, TrendingUp, DollarSign } from 'lucide-react';
import ConfigurationCard from './ConfigurationCard';

export default function ResultsDisplay({ configuraciones, datosProyecto, onSelectConfig }) {
    if (!configuraciones || configuraciones.length === 0) {
        return null;
    }

    // Determinar configuración recomendada según prioridad
    const getRecomendada = () => {
        const prioridad = datosProyecto.prioridad;
        return configuraciones.find(config => config.prioridad === prioridad) || configuraciones[0];
    };

    const recomendada = getRecomendada();

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Award className="w-6 h-6 text-solar-500" />
                    Configuraciones Optimizadas
                </h2>
                <p className="text-cosmic-400">
                    Hemos generado {configuraciones.length} configuraciones optimizadas para tu proyecto.
                    La configuración recomendada según tu prioridad ({datosProyecto.prioridad}) está destacada.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {configuraciones.map((config, index) => (
                    <ConfigurationCard
                        key={index}
                        configuracion={config}
                        isRecomendada={config.tipo === recomendada.tipo}
                        onSelect={() => onSelectConfig(config)}
                    />
                ))}
            </div>
        </div>
    );
}
