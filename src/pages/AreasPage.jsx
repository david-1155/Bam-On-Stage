import React, { useState } from 'react';
import { demoStore } from '../services/demoStore.js';
import AreaCard from '../components/common/AreaCard.jsx';
import { Search, Sparkles } from 'lucide-react';

export default function AreasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const allAreas = demoStore.getAreas();

  const filteredAreas = allAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#00E5FF]/30 text-xs text-[#00E5FF] font-medium tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>11 Áreas de Aprendizaje</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
            Áreas de Aprendizaje
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Descubre las distintas materias y disciplinas donde estudiantes instructores autorizados ofrecen asesorías personalizadas en el campus y de forma virtual.
          </p>
        </div>

        {/* Filter input */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por disciplina..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>
      </div>

      {/* Grid of Areas */}
      {filteredAreas.length === 0 ? (
        <div className="text-center py-16 bg-[#121020] rounded-2xl border border-white/5 p-8">
          <p className="text-slate-300 font-medium text-sm">No se encontraron áreas con el término "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-3 text-xs text-[#00E5FF] underline"
          >
            Limpiar filtro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAreas.map(area => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      )}

    </div>
  );
}
