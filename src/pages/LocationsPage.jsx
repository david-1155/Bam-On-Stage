import React from 'react';
import { demoStore } from '../services/demoStore.js';
import { MapPin, Users, Building, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LocationsPage() {
  const locations = demoStore.getLocations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#00E5FF]/30 text-xs text-[#00E5FF] font-semibold tracking-wide">
          <MapPin className="w-3.5 h-3.5" />
          <span>Infraestructura Institucional</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          Lugares y Espacios de Aprendizaje
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Conoce los espacios físicos asignados dentro de la institución para llevar a cabo asesorías seguras, productivas y equipadas con el material necesario.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(loc => (
          <div
            key={loc.id}
            className="bg-[#121020] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00E5FF]/40 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-display font-bold text-lg text-white">{loc.name}</h3>
                <p className="text-xs text-[#00E5FF] font-medium">{loc.building} · {loc.room}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {loc.notes}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Capacidad máx: {loc.capacity} personas
              </span>
              <span className="text-emerald-400 font-semibold">Disponible</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-[#141224] border border-white/10 text-center space-y-2 max-w-2xl mx-auto">
        <h4 className="font-display font-bold text-base text-white">¿Asesoría Virtual?</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Si el instructor ofrece modalidad virtual o ambas, la asesoría se llevará a cabo mediante una sala institucional de Google Meet vinculada a las cuentas oficiales del colegio.
        </p>
      </div>

    </div>
  );
}
