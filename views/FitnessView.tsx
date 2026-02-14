import React from 'react';
import { useStore } from '../src/context/StoreContext';
import { normalizeMealName } from '../src/utils/helpers';

const FitnessView: React.FC = () => {
  const { store, saveStore } = useStore();

  // Hydration Logic
  const meta = store.profile?.metaAgua || 2800; // ml
  const currentWater = store.water || 0;
  const hydration = currentWater / 1000; // Convert to Liters for display
  const metaLiters = meta / 1000;
  const hydrationPercent = Math.min((currentWater / meta) * 100, 100);

  const handleUpdateWater = (amount: number) => {
    const newWater = Math.max(0, Math.min(currentWater + amount, meta));
    saveStore({ ...store, water: newWater });
  };

  // Exercise Logic
  const dias = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
  const todayName = dias[new Date().getDay()];
  const displayDay = store.selectedDay || todayName;

  // Find key in exercises (flexible matching)
  const exKey = Object.keys(store.exercises || {}).find(k => k.toUpperCase() === displayDay) || displayDay;
  const exercisesList = store.exercises?.[exKey] || [];
  const completedList = store.doneEx?.[displayDay] || [];

  const toggleExercise = (idx: number) => {
    const newDone = [...completedList];
    const pos = newDone.indexOf(idx);
    if (pos === -1) newDone.push(idx);
    else newDone.splice(pos, 1);

    // Update store
    const newDoneEx = { ...store.doneEx, [displayDay]: newDone };
    saveStore({ ...store, doneEx: newDoneEx });
  };

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
            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">Meta: {metaLiters}L</span>
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
              <button onClick={() => handleUpdateWater(-250)} className="size-12 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary/5 active:scale-95 transition-all">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Añadir 250ml</p>
              </div>
              <button onClick={() => handleUpdateWater(250)} className="size-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-95 transition-all">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </section>

        {/* Plan Header */}
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-xl font-800">Tu Plan del Día</h2>
            <p className="text-sm text-slate-500">{displayDay}</p>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4">
          {exercisesList.length > 0 ? exercisesList.map((ex: any, idx: number) => {
            const isCompleted = completedList.includes(idx);
            return (
              <div key={idx} onClick={() => toggleExercise(idx)} className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer transition-all ${isCompleted ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                <div className="p-4 flex justify-between items-center gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                      <span className="material-symbols-outlined">{isCompleted ? 'check_circle' : 'fitness_center'}</span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-slate-900 ${isCompleted ? 'line-through decoration-slate-400' : ''}`}>{ex.n}</h3>
                      <p className="text-sm text-slate-500">{ex.i}</p>
                      {ex.link && (
                        <a href={ex.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs font-bold text-primary mt-1 inline-block hover:underline">
                          VER VIDEO ↗
                        </a>
                      )}
                    </div>
                  </div>
                  <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted ? 'bg-primary border-primary' : 'border-slate-200'
                    }`}>
                    <span className="material-symbols-outlined text-white text-xs">{isCompleted ? 'check' : ''}</span>
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">hotel</span>
              <p className="text-slate-400 font-medium">¡Día de Descanso!</p>
              <p className="text-xs text-slate-400 mt-1">O no tienes rutina asignada para {displayDay}.</p>
            </div>
          )}
        </div>

        {/* Progress Card */}
        {exercisesList.length > 0 && (
          <div className="bg-primary p-6 rounded-xl text-white shadow-lg shadow-primary/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Progreso del Entrenamiento</h3>
              <span className="text-xl font-800">
                {Math.round((completedList.length / exercisesList.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="bg-white h-full transition-all duration-500" style={{ width: `${(completedList.length / exercisesList.length) * 100}%` }}></div>
            </div>
            <p className="text-xs mt-4 text-white/80 font-medium italic">
              {completedList.length === exercisesList.length ? '¡Rutina completada! Felicidades.' : '¡Sigue así, tú puedes!'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FitnessView;

