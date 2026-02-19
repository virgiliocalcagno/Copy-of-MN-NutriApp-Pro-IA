import React, { useState, useRef } from 'react';
import { useStore } from '@/src/context/StoreContext';
import { analyzeImageWithGemini } from '@/src/utils/ai';

const FitnessView: React.FC = () => {
  const { store, saveStore } = useStore();
  const [activeTab, setActiveTab] = useState<'fit' | 'scan'>('fit');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Fit Logic (from CP002) ---
  const meta = store.profile?.metaAgua || 2800;
  const currentWater = store.water || 0;
  const hydration = currentWater / 1000;
  const metaLiters = meta / 1000;
  const hydrationPercent = Math.min((currentWater / meta) * 100, 100);

  const handleUpdateWater = (amount: number) => {
    const newWater = Math.max(0, Math.min(currentWater + amount, meta));
    saveStore({ ...store, water: newWater });
  };

  const dias = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
  const todayName = dias[new Date().getDay()];
  const displayDay = store.selectedDay || todayName;
  const exKey = Object.keys(store.exercises || {}).find(k => k.toUpperCase() === displayDay) || displayDay;
  const exercisesList = store.exercises?.[exKey] || [];
  const completedList = store.doneEx?.[displayDay] || [];

  const toggleExercise = (idx: number) => {
    const newDone = [...completedList];
    const pos = newDone.indexOf(idx);
    if (pos === -1) newDone.push(idx);
    else newDone.splice(pos, 1);
    saveStore({ ...store, doneEx: { ...store.doneEx, [displayDay]: newDone } });
  };

  // --- NutriScan Logic (from CP006) ---
  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsScanning(true);
      try {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          // Note: In a real app, API key would be central, here we call our utility
          const result = await analyzeImageWithGemini(base64);
          setScanResult(result);
          setIsScanning(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error(err);
        setIsScanning(false);
        alert("Error al analizar la imagen.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Header Tabs */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-100">
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setActiveTab('fit')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'fit' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="material-symbols-outlined text-lg">fitness_center</span>
            RUTINA
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'scan' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="material-symbols-outlined text-lg">photo_camera</span>
            NUTRISCAN
          </button>
        </div>
      </div>

      <main className="p-4 pb-20 overflow-y-auto">
        {activeTab === 'fit' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
            {/* Hydration */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-6xl text-primary font-fill">water_drop</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Hidratación</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Status: {hydrationPercent === 100 ? 'Meta lograda' : 'En progreso'}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary">{hydration.toFixed(1)}<span className="text-sm">L</span></span>
                  <p className="text-[10px] text-slate-400 font-bold">META: {metaLiters}L</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-700" style={{ width: `${hydrationPercent}%` }}></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateWater(-250)} className="size-10 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-lg">remove</span>
                  </button>
                  <button onClick={() => handleUpdateWater(250)} className="size-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Daily Plan Headers */}
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold text-slate-900">Entrenamiento</h3>
              <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase">{displayDay}</span>
            </div>

            {/* Exercises */}
            <div className="space-y-3">
              {exercisesList.length > 0 ? exercisesList.map((ex: any, idx: number) => {
                const isCompleted = completedList.includes(idx);
                return (
                  <div key={idx} onClick={() => toggleExercise(idx)} className={`p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all active:scale-[0.98] ${isCompleted ? 'opacity-60 bg-slate-50/50' : ''}`}>
                    <div className={`size-12 rounded-xl flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      <span className="material-symbols-outlined">{isCompleted ? 'check_circle' : 'fitness_center'}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-slate-900 ${isCompleted ? 'line-through text-slate-400' : ''}`}>{ex.n}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{ex.i}</p>
                    </div>
                    {ex.link && (
                      <a href={ex.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">play_circle</span>
                      </a>
                    )}
                  </div>
                )
              }) : (
                <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">hotel</span>
                  <p className="text-sm font-bold text-slate-400 italic">Día de recuperación.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300 px-2">
            {/* Camera Trigger */}
            <div className="relative aspect-[4/3] rounded-3xl bg-slate-200 overflow-hidden group shadow-inner flex items-center justify-center border-2 border-dashed border-slate-300">
              <input type="file" ref={fileInputRef} onChange={handleScan} accept="image/*" className="hidden" />

              {isScanning ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-primary font-black text-sm tracking-widest uppercase">Escaneando...</p>
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-3 active:scale-95 transition-all">
                  <div className="size-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl font-fill">photo_camera</span>
                  </div>
                  <p className="text-slate-500 font-bold text-sm">Toma una foto de tu comida</p>
                </button>
              )}
            </div>

            {/* Results Placeholder/Actual */}
            {scanResult ? (
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 animate-in zoom-in-95">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl">Análisis de Comida</h3>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${scanResult.impacto === 'Rojo' ? 'bg-red-50 text-red-500' :
                    scanResult.impacto === 'Amarillo' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                    Semaforo: {scanResult.impacto}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Proteína</p>
                    <p className="text-lg font-bold text-slate-700">{scanResult.macros?.p || '---'}g</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Calorías</p>
                    <p className="text-lg font-bold text-slate-700">{scanResult.macros?.kcal || '---'} kcal</p>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex gap-4">
                  <div className="bg-primary text-white size-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">psychology</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary uppercase mb-1">Criterio Nutricional</p>
                    <p className="text-sm text-slate-600 italic">"{scanResult.hack || 'No hay consejo disponible.'}"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p className="text-xs font-medium italic">Sube una imagen para ver el análisis nutricional en tiempo real.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default FitnessView;
