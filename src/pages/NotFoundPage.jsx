import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#00E5FF]">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display font-black text-4xl text-white">404</h1>
        <h2 className="font-display font-bold text-xl text-slate-200">Página no encontrada</h2>
        <p className="text-xs text-slate-400">
          La ruta solicitada no existe o fue trasladada a otra sección del escenario.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a la Página Principal</span>
      </Link>
    </div>
  );
}
