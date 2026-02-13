
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";

const data = [
  { name: '1 JUN', weight: 70 },
  { name: '5 JUN', weight: 69.5 },
  { name: '10 JUN', weight: 69.8 },
  { name: '15 JUN', weight: 69.2 },
  { name: '20 JUN', weight: 69.0 },
  { name: '25 JUN', weight: 68.7 },
  { name: 'HOY', weight: 68.5 },
];

const ProgressView: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleNutriScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { data: base64Data, mimeType: file.type } },
              { text: "Analiza esta comida. Identifica qué es, estima las calorías aproximadas y da un breve desglose nutricional (proteínas, carbohidratos, grasas). Devuelve un JSON estructurado." }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                foodName: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.STRING },
                carbs: { type: Type.STRING },
                fats: { type: Type.STRING },
                healthScore: { type: Type.NUMBER, description: "1-10 rating" }
              },
              required: ["foodName", "calories", "healthScore"]
            }
          }
        });

        const result = JSON.parse(response.text);
        setAnalysisResult(result);
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("AI Analysis failed", error);
      setAnalyzing(false);
    }
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

        {/* AI Result Overlay (Simple Modal simulation) */}
        {analysisResult && (
          <div className="bg-blue-50 border border-primary/20 rounded-xl p-4 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">auto_awesome</span>
                Resultado de Análisis
              </h3>
              <button onClick={() => setAnalysisResult(null)} className="text-slate-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-sm font-bold">{analysisResult.foodName}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-xs bg-white p-2 rounded border border-slate-100">
                <p className="text-slate-400 font-bold uppercase text-[9px]">Calorías</p>
                <p className="font-bold">{analysisResult.calories} kcal</p>
              </div>
              <div className="text-xs bg-white p-2 rounded border border-slate-100">
                <p className="text-slate-400 font-bold uppercase text-[9px]">Proteínas</p>
                <p className="font-bold">{analysisResult.protein}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Estadísticas Pro</h2>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">ÚLTIMOS 30 DÍAS</span>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Peso Actual</p>
                <p className="text-slate-900 text-3xl font-extrabold">68.5 <span className="text-lg font-medium text-slate-400">kg</span></p>
              </div>
              <div className="text-right">
                <p className="text-red-500 text-sm font-bold flex items-center justify-end gap-1">
                  <span className="material-symbols-outlined text-sm">trending_down</span>
                  -1.2%
                </p>
                <p className="text-slate-400 text-xs">Objetivo: 65kg</p>
              </div>
            </div>

            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e60f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#1e60f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="weight" stroke="#1e60f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                  <Tooltip />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between mt-4 border-t border-gray-50 pt-3">
              <p className="text-slate-400 text-[11px] font-bold">1 JUN</p>
              <p className="text-slate-400 text-[11px] font-bold">10 JUN</p>
              <p className="text-slate-400 text-[11px] font-bold">20 JUN</p>
              <p className="text-slate-400 text-[11px] font-bold">HOY</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">straighten</span>
                <p className="text-slate-400 text-[10px] font-bold uppercase">Cintura</p>
              </div>
              <p className="text-slate-900 text-xl font-bold">78.2 cm</p>
              <p className="text-green-600 text-[10px] font-bold">-0.5 cm esta semana</p>
            </div>
            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
                <p className="text-slate-400 text-[10px] font-bold uppercase">Músculo</p>
              </div>
              <p className="text-slate-900 text-xl font-bold">34.1 %</p>
              <p className="text-primary text-[10px] font-bold">+0.2% esta semana</p>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-xl font-bold mb-4">Tus Logros</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {[
              { id: '1', title: '7 días hidratado', subtitle: '¡Completado!', icon: 'water_drop', color: 'text-primary', bg: 'bg-primary/10', ring: 100 },
              { id: '2', title: 'Racha Registro', subtitle: '5 de 7 días', icon: 'local_fire_department', color: 'text-orange-600', bg: 'bg-orange-100', ring: 70 },
              { id: '3', title: 'Meta Proteína', subtitle: 'Bloqueado', icon: 'egg_alt', color: 'text-slate-400', bg: 'bg-gray-100', ring: 30 }
            ].map((ach) => (
              <div key={ach.id} className="flex flex-col items-center gap-3 min-w-[110px] text-center">
                <div className="relative flex size-20 items-center justify-center">
                  <svg className="absolute size-20 rotate-[-90deg]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f1f3f7" strokeWidth="6" />
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke={ach.ring === 100 ? '#1e60f1' : '#e0e4ec'} strokeWidth="6" 
                      strokeDasharray="283" strokeDashoffset={283 - (283 * ach.ring / 100)} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className={`size-14 rounded-full flex items-center justify-center ${ach.bg} ${ach.color}`}>
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
