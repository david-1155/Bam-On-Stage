import React, { useState, useMemo } from 'react';
import { demoStore } from '../services/demoStore.js';
import InstructorCard from '../components/talents/InstructorCard.jsx';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { formatCurrencyCOP } from '../utils/bookingRules.ts';

export default function TalentsPage() {
  const allInstructors = demoStore.getInstructors();
  const allAreas = demoStore.getAreas();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('todas');
  const [selectedMode, setSelectedMode] = useState('todas');
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sortBy, setSortBy] = useState('rating_desc'); // rating_desc, price_asc, price_desc, name_asc

  // Filtered and sorted list
  const filteredInstructors = useMemo(() => {
    return allInstructors.filter(inst => {
      // 1. Search query (name, area, topic)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = inst.name.toLowerCase().includes(q);
        const matchArea = inst.areaName.toLowerCase().includes(q);
        const matchTopic = inst.topics.some(t => t.name.toLowerCase().includes(q));
        if (!matchName && !matchArea && !matchTopic) return false;
      }

      // 2. Area
      if (selectedArea !== 'todas') {
        if (inst.areaSlug !== selectedArea) return false;
      }

      // 3. Modality
      if (selectedMode !== 'todas') {
        if (selectedMode === 'presencial' && inst.mode === 'virtual') return false;
        if (selectedMode === 'virtual' && inst.mode === 'presencial') return false;
      }

      // 4. Max Price
      if (inst.basePriceCop > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating_desc') {
        return (b.ratingAverage || 0) - (a.ratingAverage || 0);
      }
      if (sortBy === 'price_asc') {
        return a.basePriceCop - b.basePriceCop;
      }
      if (sortBy === 'price_desc') {
        return b.basePriceCop - a.basePriceCop;
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [allInstructors, searchTerm, selectedArea, selectedMode, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedArea('todas');
    setSelectedMode('todas');
    setMaxPrice(30000);
    setSortBy('rating_desc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#536DFF]/30 text-xs text-[#536DFF] font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Comunidad Estudiantil de Asesorías</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          Conoce Nuestros Talentos
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Encuentra a estudiantes instructores autorizados por su excelencia y pedagogía para asesorías individuales presenciales en el colegio o por videollamada.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-6">
        
        {/* Top: Search + Sorting */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por estudiante, asignatura o tema (ej. Mateo, Álgebra, Python, Procreate)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
            >
              <option value="rating_desc" className="bg-[#121020] text-white">Mejor valoración</option>
              <option value="price_asc" className="bg-[#121020] text-white">Precio: Menor a Mayor</option>
              <option value="price_desc" className="bg-[#121020] text-white">Precio: Mayor a Menor</option>
              <option value="name_asc" className="bg-[#121020] text-white">Nombre A-Z</option>
            </select>
          </div>
        </div>

        {/* Second row: Area, Modality & Price range */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/5 items-center">
          
          {/* Selector de Área */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Área de Aprendizaje
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
            >
              <option value="todas" className="bg-[#121020] text-white">Todas las áreas</option>
              {allAreas.map(area => (
                <option key={area.id} value={area.slug} className="bg-[#121020] text-white">
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          {/* Modalidad */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Modalidad de Asesoría
            </label>
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
              {['todas', 'presencial', 'virtual'].map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  className={`flex-1 py-1 rounded-lg text-xs capitalize transition-colors font-medium ${
                    selectedMode === m
                      ? 'bg-white text-slate-900 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de Precio Máximo */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Precio máx:
              </label>
              <span className="text-xs font-mono font-bold text-[#A3FF6F]">
                {formatCurrencyCOP(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="30000"
              step="2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#00E5FF] cursor-pointer"
            />
          </div>

        </div>

        {/* Active filters count & reset button */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>
            Mostrando <strong className="text-white">{filteredInstructors.length}</strong> {filteredInstructors.length === 1 ? 'instructor' : 'instructores'} disponibles
          </span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#00E5FF] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer filtros</span>
          </button>
        </div>

      </div>

      {/* Instructors Grid */}
      {filteredInstructors.length === 0 ? (
        <div className="text-center py-20 bg-[#121020] rounded-3xl border border-white/10 p-8 space-y-4">
          <p className="font-display font-bold text-lg text-white">No se encontraron instructores</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Ningún instructor cumple actualmente con los criterios seleccionados. Prueba ampliando el rango de precio o buscando otra área.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all"
          >
            Ver todos los instructores
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map(instructor => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      )}

    </div>
  );
}
