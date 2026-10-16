import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoStore } from '../../services/demoStore.js';
import { Search, X, User, ArrowRight, BookOpen } from 'lucide-react';
import { formatCurrencyCOP } from '../../utils/bookingRules.ts';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const instructors = demoStore.getInstructors();
  const areas = demoStore.getAreas();

  const q = query.trim().toLowerCase();

  const filteredInstructors = q
    ? instructors.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.areaName.toLowerCase().includes(q) ||
        i.topics.some(t => t.name.toLowerCase().includes(q))
      )
    : [];

  const filteredAreas = q
    ? areas.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscador global"
        className="relative w-full max-w-2xl bg-[#121020] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#00E5FF] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por estudiante, materia, tema (ej: Python, Cálculo, Sarah)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
              aria-label="Borrar texto"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p>Escribe para buscar talentos estudiantiles, asignaturas y temas disponibles.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setQuery('React')}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  React
                </button>
                <button
                  onClick={() => setQuery('Cálculo')}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cálculo
                </button>
                <button
                  onClick={() => setQuery('Arte')}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Arte
                </button>
                <button
                  onClick={() => setQuery('Inglés')}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Inglés
                </button>
              </div>
            </div>
          ) : filteredInstructors.length === 0 && filteredAreas.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No se encontraron coincidencias para "{query}". Prueba con otra materia o palabra clave.
            </div>
          ) : (
            <>
              {filteredInstructors.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Estudiantes Instructores ({filteredInstructors.length})
                  </p>
                  <div className="space-y-1.5">
                    {filteredInstructors.map(inst => (
                      <button
                        key={inst.id}
                        onClick={() => {
                          onClose();
                          navigate(`/talentos/${inst.id}`);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={inst.avatarUrl}
                            alt={inst.name}
                            className="w-9 h-9 rounded-full object-cover border border-[#00E5FF]/30 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-[#00E5FF] transition-colors truncate">
                              {inst.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {inst.grade} · {inst.areaName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <span className="text-xs font-mono text-[#A3FF6F]">
                            {formatCurrencyCOP(inst.basePriceCop)}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredAreas.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Áreas de aprendizaje ({filteredAreas.length})
                  </p>
                  <div className="space-y-1.5">
                    {filteredAreas.map(area => (
                      <button
                        key={area.id}
                        onClick={() => {
                          onClose();
                          navigate(`/areas/${area.slug}`);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${area.neonColor}15`, color: area.neonColor }}
                          >
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white group-hover:text-[#00E5FF] transition-colors truncate">
                              {area.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate">{area.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#00E5FF] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
