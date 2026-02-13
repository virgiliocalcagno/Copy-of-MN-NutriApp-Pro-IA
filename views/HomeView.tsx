
import React from 'react';
import { Meal, PantryItem } from '../types';

const HomeView: React.FC = () => {
  const meals: Meal[] = [
    { id: '1', name: 'Desayuno', time: '08:00 AM', description: 'Tostadas con aguacate y huevo poché', kcal: 350, completed: true, icon: 'coffee' },
    { id: '2', name: 'Almuerzo', time: '02:00 PM', description: 'Pollo a la plancha con quinoa y vegetales', kcal: 550, completed: false, icon: 'restaurant' },
    { id: '3', name: 'Cena', time: '08:00 PM', description: 'Ensalada verde con salmón', kcal: 300, completed: false, icon: 'spa' }
  ];

  const pantry: PantryItem[] = [
    { id: '1', name: 'Cereales', status: 'STOCK BAJO', percentage: 25, color: 'bg-orange-500', icon: 'grain' },
    { id: '2', name: 'Proteínas', status: 'DISPONIBLE', percentage: 80, color: 'bg-green-500', icon: 'set_meal' },
    { id: '3', name: 'Lácteos', status: 'DISPONIBLE', percentage: 65, color: 'bg-primary', icon: 'water_drop' },
    { id: '4', name: 'Frutas/Veg', status: 'CRÍTICO', percentage: 10, color: 'bg-red-500', icon: 'eco' }
  ];

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
            <img src="https://picsum.photos/seed/user123/200/200" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Panel de Control</p>
            <h1 className="text-lg font-bold leading-none">¡Hola, Usuario!</h1>
          </div>
        </div>
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined text-slate-600">notifications</span>
          <span className="absolute top-2 right-2 size-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </header>

      <div className="p-4 space-y-8">
        {/* Shopping List CTA */}
        <section>
          <button className="w-full bg-primary text-white p-4 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <span className="material-symbols-outlined fill-1">shopping_basket</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-lg leading-none">Lista de Compras</p>
                <p className="text-white/80 text-sm mt-1">Tienes 5 artículos por comprar</p>
              </div>
            </div>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>
        </section>

        {/* Menu Timeline */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Menú de Hoy</h2>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">Lunes, 12 Oct</span>
          </div>
          <div className="relative space-y-6 before:absolute before:left-[19px] before:top-4 before:bottom-0 before:w-[2px] before:bg-slate-100">
            {meals.map((meal) => (
              <div key={meal.id} className="relative z-10 flex gap-4 items-start">
                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 shadow-md border-4 border-white ${meal.completed ? 'bg-primary' : 'bg-primary/30'}`}>
                  <span className={`material-symbols-outlined text-xl ${meal.completed ? 'text-white' : 'text-primary'}`}>
                    {meal.icon}
                  </span>
                </div>
                <div className={`flex-1 p-4 rounded-xl border ${meal.completed ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/50 border-dashed border-slate-200 opacity-80'}`}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800">{meal.name}</h3>
                    <span className="text-xs text-slate-400 font-medium">{meal.time}</span>
                  </div>
                  <p className={`text-slate-600 mt-1 ${!meal.completed ? 'italic' : ''}`}>{meal.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${meal.completed ? 'bg-slate-100 text-slate-500' : 'bg-primary/5 text-primary'}`}>
                      {meal.kcal} KCAL
                    </span>
                    {meal.completed && <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>}
                    {!meal.completed && meal.name === 'Almuerzo' && (
                      <button className="ml-auto text-xs font-bold text-primary hover:underline">Ver Receta</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pantry Summary */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Mi Despensa</h2>
            <button className="text-xs font-bold text-primary">Gestionar todo</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pantry.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    item.status === 'STOCK BAJO' ? 'bg-orange-100 text-orange-600' :
                    item.status === 'CRÍTICO' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>{item.status}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeView;
