import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { demoStore } from '../services/demoStore.js';
import { Clock, Calendar, MapPin, Video, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrencyCOP } from '../utils/bookingRules.ts';

export default function ScheduleAvailabilityPage() {
  const instructors = demoStore.getInstructors();
  const [selectedDay, setSelectedDay] = useState('todos');

  const daysList = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const filteredInstructors = instructors.filter(inst => {
    if (selectedDay === 'todos') return true;
    return inst.availabilitySchedule?.some(s => s.day.toLowerCase() === selectedDay.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-white/10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#A3FF6F]/30 text-xs text-[#A3FF6F] font-semibold tracking-wide">
          <Clock className="w-3.5 h-3.5" />
          <span>Agenda Institucional</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          Horarios y Disponibilidad
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Consulta qué estudiantes instructores tienen franjas de asesoría publicadas según el día de la semana. Las sesiones tienen una duración de 60 minutos con pausas entre turnos.
        </p>
      </div>

      {/* Filter by Day */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        <button
          onClick={() => setSelectedDay('todos')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedDay === 'todos'
              ? 'bg-white text-slate-950 font-bold'
              : 'bg-white/5 text-slate-300 hover:text-white'
          }`}
        >
          Todos los días
        </button>
        {daysList.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDay === day
                ? 'bg-[#A3FF6F] text-[#0A0A10] font-bold shadow-[0_0_15px_rgba(163,255,111,0.3)]'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Instructor schedules cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map(inst => (
          <div
            key={inst.id}
            className="bg-[#121020] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#A3FF6F]/40 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={inst.avatarUrl}
                  alt={inst.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#00E5FF]/40 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-base truncate">{inst.name}</h3>
                  <p className="text-xs text-[#00E5FF]">{inst.areaName}</p>
                  <p className="text-[11px] text-slate-400">{inst.grade}</p>
                </div>
              </div>

              {/* Weekly schedule badges */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Días y horas de atención:
                </span>
                {inst.availabilitySchedule?.map((slot, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{slot.day}</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {slot.times.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-[#A3FF6F]/10 text-[#A3FF6F] font-mono text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#A3FF6F]">
                {formatCurrencyCOP(inst.basePriceCop)}
              </span>
              <Link
                to={`/reservar/${inst.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#00E5FF] transition-colors"
              >
                <span>Agendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
