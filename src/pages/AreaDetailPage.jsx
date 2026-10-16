import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { demoStore } from '../services/demoStore.js';
import InstructorCard from '../components/talents/InstructorCard.jsx';
import { ArrowLeft, Search, Filter, Sparkles, BookOpen } from 'lucide-react';

export default function AreaDetailPage() {
  const { areaSlug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('todas');

  const areas = demoStore.getAreas();
  const area = areas.find(a => a.slug === areaSlug) || areas[0];
  const allInstructors = demoStore.getInstructors();

  // Filtrar instructores que pertenezcan a esta área
  const areaInstructors = allInstructors.filter(inst => {
    const matchesArea = inst.areaSlug === area.slug || inst.areaName.toLowerCase() === area.name.toLowerCase();
    if (!matchesArea) return false;

    if (modeFilter !== 'todas') {
      if (modeFilter === 'presencial' && inst.mode === 'virtual') return false;
      if (modeFilter === 'virtual' && inst.mode === 'presencial') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inst.name.toLowerCase().includes(q);
      const matchTopic = inst.topics.some(t => t.name.toLowerCase().includes(q));
      if (!matchName && !matchTopic) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Back button */}
      <Link
        to="/areas"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#00E5FF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a todas las áreas</span>
      </Link>

      {/* Area Banner Header */}
      <div
        className="relative rounded-3xl p-8 sm:p-10 border border-white/10 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${area.neonColor}15, #0D0B18 70%)`
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: area.neonColor, boxShadow: `0 0 10px ${area.neonColor}` }}
              />
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: area.neonColor }}>
                Área de Aprendizaje
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
              {area.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {area.description}
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
            <p className="font-display font-black text-3xl text-white font-mono tabular-nums">
              {areaInstructors.length}
            </p>
            <p className="text-xs text-slate-400">Instructores disponibles</p>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#121020] border border-white/5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar por nombre o tema de ${area.name}...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        {/* Modalidad Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-slate-400 mr-1 hidden md:inline">Modalidad:</span>
          {['todas', 'presencial', 'virtual'].map((m) => (
            <button
              key={m}
              onClick={() => setModeFilter(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                modeFilter === m
                  ? 'bg-white text-slate-950 font-semibold'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Instructors list */}
      {areaInstructors.length === 0 ? (
        <div className="text-center py-16 bg-[#121020] rounded-2xl border border-white/5 p-8 space-y-4">
          <p className="text-slate-300 font-medium text-sm">
            Actualmente no hay instructores que coincidan con estos filtros en el área de {area.name}.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setModeFilter('todas');
              }}
              className="text-xs text-[#00E5FF] underline"
            >
              Restablecer filtros
            </button>
            <span className="text-slate-600">·</span>
            <Link to="/talentos" className="text-xs text-slate-400 hover:text-white underline">
              Ver todos los talentos
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areaInstructors.map(instructor => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      )}

    </div>
  );
}
