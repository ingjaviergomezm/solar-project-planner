import { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import SettingsTab from './components/SettingsTab';
import ProjectTab from './components/ProjectTab';
import ResultsTab from './components/ResultsTab';
import DetailsTab from './components/DetailsTab';
import AITab from './components/AITab';

import { calcularConfiguraciones } from './utils/calculations';
import { tieneAPIKey, obtenerAPIKey, analizarConfiguracion } from './utils/gemini';

function App() {
    const [activeTab, setActiveTab] = useState('project');
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState(null);

    // Project data
    const [datosProyecto, setDatosProyecto] = useState(null);
    const [configuraciones, setConfiguraciones] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState(null);

    // AI Analysis
    const [recomendacionesIA, setRecomendacionesIA] = useState('');

    // Check API key on mount
    useEffect(() => {
        if (!tieneAPIKey()) {
            console.log('No API Key configured');
        }
    }, []);

    // Handle calculation
    const handleCalculate = async (formData) => {
        setIsCalculating(true);
        setError(null);

        try {
            const configs = calcularConfiguraciones(formData);
            setConfiguraciones(configs);
            setDatosProyecto(formData);

            // Auto-select first config
            if (configs.length > 0) {
                setSelectedConfig(configs[0]);
            }

            // Generate AI analysis if API key exists
            if (tieneAPIKey() && configs.length > 0) {
                const apiKey = obtenerAPIKey();
                try {
                    const recomendaciones = await analizarConfiguracion(
                        formData,
                        configs[0],
                        apiKey
                    );
                    setRecomendacionesIA(recomendaciones);
                } catch (aiError) {
                    console.error('Error generating AI analysis:', aiError);
                }
            }

            // Navigate to results
            setActiveTab('results');
        } catch (err) {
            setError(err.message);
            console.error('Calculation error:', err);
        }

        setIsCalculating(false);
    };

    // Handle configuration selection
    const handleSelectConfig = async (config) => {
        setSelectedConfig(config);

        // Generate specific recommendations for selected config
        if (tieneAPIKey()) {
            try {
                const apiKey = obtenerAPIKey();
                const recomendaciones = await analizarConfiguracion(
                    datosProyecto,
                    config,
                    apiKey
                );
                setRecomendacionesIA(recomendaciones);
            } catch (err) {
                console.error('Error generating recommendations:', err);
            }
        }

        // Navigate to details
        setActiveTab('details');
    };

    // Render active tab content
    const renderContent = () => {
        switch (activeTab) {
            case 'settings':
                return <SettingsTab />;

            case 'project':
                return (
                    <ProjectTab
                        onCalculate={handleCalculate}
                        isCalculating={isCalculating}
                    />
                );

            case 'results':
                return (
                    <ResultsTab
                        configuraciones={configuraciones}
                        datosProyecto={datosProyecto}
                        onSelectConfig={handleSelectConfig}
                        aiAnalysis={recomendacionesIA}
                    />
                );

            case 'details':
                return (
                    <DetailsTab
                        configuracion={selectedConfig}
                        datosProyecto={datosProyecto}
                        recomendacionesIA={recomendacionesIA}
                    />
                );

            case 'ai':
                return (
                    <AITab
                        configuracion={selectedConfig}
                        datosProyecto={datosProyecto}
                    />
                );

            default:
                return <ProjectTab onCalculate={handleCalculate} />;
        }
    };

    return (
        <div className="bg-app min-h-screen flex flex-col">
            {/* Error Banner */}
            {error && (
                <div className="fixed top-0 left-0 right-0 bg-red-500/90 text-white text-sm p-3 text-center z-50 animate-slide-up">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-4 underline"
                    >
                        Cerrar
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 px-4 pt-8 pb-nav max-w-md mx-auto w-full overflow-y-auto">
                {renderContent()}
            </main>

            {/* Bottom Navigation */}
            <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </div>
    );
}

export default App;
