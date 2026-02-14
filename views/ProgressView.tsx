import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../src/context/StoreContext';

const ProgressView: React.FC = () => {
  const { store } = useStore();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const { profile, medals } = store;
  const currentWeight = parseFloat(profile.peso || '0');
  const targetWeight = parseFloat(profile.pesoIdeal || '0');

  // Mock history for chart (since store history format is unknown/complex)
  const data = [
    { name: 'Inicio', weight: currentWeight + 2 },
    { name: 'HOY', weight: currentWeight },
  ];

  const handleNutriScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    alert("Funcionalidad NutriScan AI en mantenimiento. Pronto disponible.");
  };

  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <header className="flex items-center bg-white/80 sticky top-0 z-10 backdrop-blur-md p-4 justify-between border-b border-gray-100">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">account_circle</span>
        </div>
        <h1 className="text-lg font-bold flex-1 text-center font-display">Mi Progreso</h1>
        <button className="size-10 rounded-full bg-gray-50 flex items-center justify-center">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <main className="p-4 space-y-6">
        {/* NutriScan IA Hero */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#0e49c7] p-6 shadow-xl shadow-primary/20">
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-white text-2xl font-extrabold">NutriScan IA</h2>
              <p className="text-blue-100 text-sm font-medium">Escaneo inteligente con visión artificial</p>
            </div>

            <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 shadow-inner hover:scale-105 transition-all">
              <input type="file" accept="image/*" className="hidden" onChange={handleNutriScan} disabled={analyzing} />
              <div className={`absolute inset-0 rounded-full bg-white/10 ${analyzing ? 'animate-ping' : ''}`}></div>
              <span className="material-symbols-outlined text-white text-5xl font-light">
                {analyzing ? 'hourglass_empty' : 'camera_enhance'}
              </span>
            </label>

            <button className="flex min-w-[160px] items-center justify-center rounded-full h-12 px-6 bg-white text-primary text-base font-bold shadow-lg active:scale-95 transition-all">
              {analyzing ? 'Analizando...' : 'Analizar Comida'}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Estadísticas Pro</h2>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">ACTUAL</span>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Peso Actual</p>
                <p className="text-slate-900 text-3xl font-extrabold">{currentWeight} <span className="text-lg font-medium text-slate-400">kg</span></p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs">Objetivo: {targetWeight}kg</p>
              </div>
            </div>

            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e60f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1e60f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="weight" stroke="#1e60f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                  <Tooltip />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">straighten</span>
                <p className="text-slate-400 text-[10px] font-bold uppercase">Cintura</p>
              </div>
              <p className="text-slate-900 text-xl font-bold">{profile.cintura || '--'} cm</p>
            </div>
            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
                <p className="text-slate-400 text-[10px] font-bold uppercase">Medallas</p>
              </div>
              <p className="text-slate-900 text-xl font-bold flex gap-2">
                <span>🥇 {medals?.gold || 0}</span>
                <span>🥈 {medals?.silver || 0}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-xl font-bold mb-4">Tus Logros</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {[
              { id: '1', title: 'Oro', subtitle: `${medals?.gold || 0} Medallas`, icon: 'workspace_premium', color: 'text-yellow-600', bg: 'bg-yellow-100', ring: 100 },
              { id: '2', title: 'Plata', subtitle: `${medals?.silver || 0} Medallas`, icon: 'military_tech', color: 'text-slate-500', bg: 'bg-slate-200', ring: 100 },
            ].map((ach) => (
              <div key={ach.id} className="flex flex-col items-center gap-3 min-w-[110px] text-center">
                <div className="relative flex size-20 items-center justify-center">
                  <div className={`size-14 rounded-full flex items-center justify-center ${ach.bg} ${ach.color} shadow-sm`}>
                    <span className="material-symbols-outlined text-3xl">{ach.icon}</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold leading-tight">{ach.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{ach.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProgressView;
