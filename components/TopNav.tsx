import React from 'react';
import { View } from '../types';

interface TopNavProps {
    currentView: View;
    setCurrentView: (view: View) => void;
}

const TopNav: React.FC<TopNavProps> = ({ currentView, setCurrentView }) => {
    const navItems = [
        { id: 'home', label: 'Mi Casa', icon: 'home' },
        { id: 'fitness', label: 'Zona Fit', icon: 'fitness_center' },
        { id: 'progress', label: 'Mi Progreso', icon: 'monitoring' },
        { id: 'profile', label: 'Perfil', icon: 'person' }
    ] as const;

    return (
        <header className="sticky top-0 z-50 bg-primary text-white shadow-lg shadow-primary/20">
            {/* App Branding */}
            <div className="px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-extrabold tracking-tight">MN NutriApp</h1>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-white/80">search</span>
                    <span className="material-symbols-outlined text-white/80">more_vert</span>
                </div>
            </div>

            {/* WhatsApp Style Tabs */}
            <nav className="flex w-full overflow-x-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`flex-1 min-w-[80px] py-3 flex flex-col items-center justify-center gap-1 transition-all relative ${isActive ? 'text-white' : 'text-white/60'
                                }`}
                        >
                            <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
                                {item.label}
                            </span>

                            {/* Active Indicator Line */}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full transition-all duration-300"></div>
                            )}
                        </button>
                    );
                })}
            </nav>
        </header>
    );
};

export default TopNav;
