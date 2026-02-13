
import React, { useState } from 'react';
import { Exercise } from '../types';

const FitnessView: React.FC = () => {
  const [hydration, setHydration] = useState(1.2);
  const meta = 2.5;

  const exercises: Exercise[] = [
    { id: '1', name: 'Sentadillas con Salto', reps: '3 series de 15 repeticiones', level: 'Intermedio', image: 'https://picsum.photos/seed/squats/600/400', completed: false },
    { id: '2', name: 'Plancha Abdominal', reps: '45 segundos (Descanso 30s)', level: 'Principiante', image: 'https://picsum.photos/seed/plank/600/400', completed: true },
    { id: '3', name: 'Zancadas Laterales', reps: '12 repeticiones por pierna', level: 'Intermedio', image: 'https://picsum.photos/seed/lunges/600/400', completed: false }
  ];

  const handleAddWater = () => {
    setHydration(prev => Math.min(prev + 0.25, meta));
  };

  const handleRemoveWater = () => {
    setHydration(prev => Math.max(prev - 0.25, 0));
  };

  const hydrationPercent = (hydration / meta) * 100;

  return (
    <div className="flex flex-col animate-in slide-in-from-right duration-500">
      <header className="p-6 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-800 text-slate-900">Zona Fit</h1>
            <p className="text-sm text-slate-500 font-medium">¡Vamos por tus objetivos hoy!</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">notifications</span>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Hydration Widget */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-bold">Control de Hidratación</h2>
            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">Meta: {meta}L</span>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-40 rounded-full border-4 border-slate-100 flex items-center justify-center overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 w-full bg-primary/80 transition-all duration-700" 
                style={{ height: `${hydrationPercent}%` }}
              ></div>
              <div className="relative z-10 text-center">
                <span className="text-3xl font-800">{hydration.toFixed(1)}<span className="text-lg font-bold">L</span></span>
                <p className="text-xs font-medium text-slate-500">Consumido</p>
              </div>
              <span className="material-symbols-outlined absolute top-4 text-primary/30 text-3xl">water_drop</span>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <button onClick={handleRemoveWater} className="size-12 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary/5 active:scale-95 transition-all">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Añadir 250ml</p>
              </div>
              <button onClick={handleAddWater} className="size-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-95 transition-all">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </section>

        {/* Plan Header */}
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-xl font-800">Tu Plan del Día</h2>
            <p className="text-sm text-slate-500">Lunes, 12 de Octubre</p>
          </div>
          <button className="text-primary text-sm font-bold flex items-center gap-1">
            Ver Calendario <span className="material-symbols-outlined text-sm">calendar_today</span>
          </button>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group">
              <div className="relative aspect-video bg-slate-200">
                <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="size-12 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-lg">
                    <span className="material-symbols-outlined text-3xl">play_arrow</span>
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-white text-[10px] font-bold uppercase rounded-md ${
                    ex.level === 'Intermedio' ? 'bg-orange-500' : 'bg-green-500'
                  }`}>
                    {ex.level}
                  </span>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">{ex.name}</h3>
                  <p className="text-sm text-slate-500">{ex.reps}</p>
                </div>
                <div className={`size-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                  ex.completed ? 'bg-primary border-primary' : 'border-slate-200'
                }`}>
                  <span className="material-symbols-outlined text-white text-lg">{ex.completed ? 'check' : ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Card */}
        <div className="bg-primary p-6 rounded-xl text-white shadow-lg shadow-primary/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Progreso del Entrenamiento</h3>
            <span className="text-xl font-800">33%</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full" style={{ width: '33%' }}></div>
          </div>
          <p className="text-xs mt-4 text-white/80 font-medium italic">¡Ya terminaste 1 de 3 ejercicios! Sigue así.</p>
        </div>
      </main>
    </div>
  );
};

export default FitnessView;
