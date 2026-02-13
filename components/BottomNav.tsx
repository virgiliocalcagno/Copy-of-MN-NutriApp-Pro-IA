
import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'home', label: 'Mi Casa', icon: 'home' },
    { id: 'fitness', label: 'Zona Fit', icon: 'fitness_center' },
    { id: 'progress', label: 'Mi Progreso', icon: 'monitoring' },
    { id: 'profile', label: 'Perfil', icon: 'person' }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 flex justify-between items-center px-6 py-3 pb-6 z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentView(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentView === item.id ? 'text-primary' : 'text-slate-400'
          }`}
        >
          <span className={`material-symbols-outlined ${currentView === item.id ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
