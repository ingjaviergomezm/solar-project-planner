import { Home, PenTool, BarChart3, Settings, Plus, Sparkles } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(51, 65, 85, 0.5)',
            padding: '0.5rem 0'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                alignItems: 'end',
                height: '56px',
                maxWidth: '500px',
                margin: '0 auto',
                padding: '0 0.5rem'
            }}>
                {/* Proyecto */}
                <button
                    onClick={() => onTabChange('project')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: activeTab === 'project' ? '#f59e0b' : '#94a3b8',
                        transition: 'color 0.2s'
                    }}
                >
                    <Home style={{ width: 20, height: 20, marginBottom: 4 }} />
                    <span style={{ fontSize: 10, fontWeight: 500 }}>Proyecto</span>
                </button>

                {/* Diseño */}
                <button
                    onClick={() => onTabChange('results')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: activeTab === 'results' ? '#f59e0b' : '#94a3b8',
                        transition: 'color 0.2s'
                    }}
                >
                    <PenTool style={{ width: 20, height: 20, marginBottom: 4 }} />
                    <span style={{ fontSize: 10, fontWeight: 500 }}>Diseño</span>
                </button>

                {/* FAB Center Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => onTabChange('project')}
                        style={{
                            width: 48,
                            height: 48,
                            marginTop: -16,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
                        }}
                    >
                        <Plus style={{ width: 24, height: 24 }} strokeWidth={2.5} />
                    </button>
                </div>

                {/* IA */}
                <button
                    onClick={() => onTabChange('ai')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: activeTab === 'ai' ? '#f59e0b' : '#94a3b8',
                        transition: 'color 0.2s'
                    }}
                >
                    <Sparkles style={{ width: 20, height: 20, marginBottom: 4 }} />
                    <span style={{ fontSize: 10, fontWeight: 500 }}>IA</span>
                </button>

                {/* Config */}
                <button
                    onClick={() => onTabChange('settings')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: activeTab === 'settings' ? '#f59e0b' : '#94a3b8',
                        transition: 'color 0.2s'
                    }}
                >
                    <Settings style={{ width: 20, height: 20, marginBottom: 4 }} />
                    <span style={{ fontSize: 10, fontWeight: 500 }}>Config</span>
                </button>
            </div>
        </nav>
    );
}
