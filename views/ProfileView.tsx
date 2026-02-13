
import React from 'react';

const ProfileView: React.FC = () => {
  return (
    <div className="flex flex-col animate-in slide-in-from-bottom duration-500">
      {/* Header */}
      <header className="flex items-center p-4 pt-6 justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center p-2 rounded-lg hover:bg-primary/10 transition-colors text-slate-600">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Mi Perfil Médico</h1>
        </div>
        <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-slate-600">
          <span className="material-symbols-outlined text-2xl">settings</span>
        </button>
      </header>

      {/* Profile Bio */}
      <div className="px-6 py-4 flex items-center gap-5">
        <div className="relative">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
            <img src="https://picsum.photos/seed/doctor/300/300" alt="Juan Pérez" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white size-6 rounded-full flex items-center justify-center border-2 border-white">
            <span className="material-symbols-outlined text-[14px] font-bold">verified</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Juan Pérez</h2>
          <p className="text-sm text-primary font-semibold">MN-98234-P</p>
          <p className="text-xs text-slate-500">Miembro Pro desde 2023</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4">
        <button className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 group">
          <span className="material-symbols-outlined group-active:scale-90 transition-transform">picture_as_pdf</span>
          <span>Exportar Plan Maestro PDF</span>
        </button>
        <p className="text-[10px] text-center mt-2 text-slate-400 font-medium uppercase tracking-wider">
          Última actualización: Hoy, 09:45 AM
        </p>
      </div>

      {/* Medical Record */}
      <main className="px-6 space-y-6 mt-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <span className="material-symbols-outlined text-primary">clinical_notes</span>
              Expediente de Salud
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Cifrado</span>
          </div>
          
          <div className="space-y-3">
            {/* Card Comorbidities */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary text-xl">medical_information</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-slate-800">Comorbilidades</p>
                  <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-primary transition-colors">edit</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">Diabetes Tipo 2</span>
                  <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">Hipertensión (HTA)</span>
                </div>
              </div>
            </div>

            {/* Card Injuries */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary text-xl">personal_injury</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-slate-800">Lesiones</p>
                  <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-primary transition-colors">edit</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 italic">Ninguna lesión activa registrada.</p>
              </div>
            </div>

            {/* Card Medications */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary text-xl">prescriptions</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-slate-800">Medicamentos</p>
                  <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-primary transition-colors">edit</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-slate-700">
                    • Metformina 500mg <span className="font-normal text-slate-400">(1 al día)</span>
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    • Enalapril 10mg <span className="font-normal text-slate-400">(Cada 12hs)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="pb-10">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-4">
            <span className="material-symbols-outlined text-red-500">contact_emergency</span>
            Contacto de Emergencia
          </h3>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-900">María García</p>
              <p className="text-xs text-slate-500">Esposa • +54 9 11 1234-5678</p>
            </div>
            <button className="bg-red-500 text-white size-10 rounded-full flex items-center justify-center shadow-lg shadow-red-200 active:scale-90 transition-all">
              <span className="material-symbols-outlined">call</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileView;
