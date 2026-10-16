import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Sparkles, Shield, UserCheck, GraduationCap, RefreshCw } from 'lucide-react';
import { demoStore } from '../../services/demoStore.js';

export default function DemoBanner() {
  const { isSupabase, role, switchDemoUser, currentUser } = useAuth();

  if (isSupabase) return null;

  return (
    <div className="bg-[#12101C] border-b border-purple-500/20 px-4 py-2 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-medium text-[#00E5FF]">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            Modo Demostración Activo
          </span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="hidden sm:inline text-slate-400">
            Base de datos local con persistencia en navegador
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[11px]">Probar como:</span>
          
          <button
            onClick={() => switchDemoUser('estudiante')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
              role === 'estudiante'
                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
            title="Cambiar a cuenta de estudiante Camila Torres"
          >
            <GraduationCap className="w-3 h-3" />
            Estudiante
          </button>

          <button
            onClick={() => switchDemoUser('instructor')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
              role === 'instructor'
                ? 'bg-[#FF4FD8]/20 text-[#FF4FD8] border border-[#FF4FD8]/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
            title="Cambiar a cuenta de instructor Mateo Silva"
          >
            <UserCheck className="w-3 h-3" />
            Instructor
          </button>

          <button
            onClick={() => switchDemoUser('administrador')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
              role === 'administrador'
                ? 'bg-[#A3FF6F]/20 text-[#A3FF6F] border border-[#A3FF6F]/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
            title="Cambiar a cuenta de administrador Prof. Alberto Rivas"
          >
            <Shield className="w-3 h-3" />
            Admin
          </button>

          <button
            onClick={() => {
              if (confirm('¿Restablecer los datos de demostración iniciales?')) {
                demoStore.resetDemoData();
                window.location.reload();
              }
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 ml-1"
            title="Restablecer datos demo"
            aria-label="Restablecer datos demo"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
