import React from 'react';
import { Sparkles, Target, Compass, Award, Users, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#00E5FF]/30 text-xs text-[#00E5FF] font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Iniciativa Institucional</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Sobre BAM ON STAGE
        </h1>
        <p className="text-base sm:text-lg text-slate-300 italic font-display">
          «Donde el talento encuentra su escenario»
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-[#121020] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="font-display font-bold text-2xl text-white">
          Nuestra Misión y Propósito
        </h2>
        <div className="text-sm text-slate-300 space-y-4 leading-relaxed">
          <p>
            <strong>BAM ON STAGE</strong> nace de una convicción fundamental: en cada aula escolar conviven talentos extraordinarios que muchas veces pasan desapercibidos. Estudiantes que dominan el cálculo infinitesimal, programan videojuegos, componen música en sintetizadores o debaten con elocuencia en modelos internacionales.
          </p>
          <p>
            Nuestra plataforma crea un puente directo entre pares, transformando el aprendizaje en una experiencia colaborativa, dinámica y motivadora. Los estudiantes que necesitan refuerzo encuentran apoyo cercano de alguien que entiende exactamente sus inquietudes, mientras que los instructores desarrollan liderazgo, pedagogía y refuerzan su propio dominio.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Aprendizaje Entre Pares</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              La empatía generacional y el lenguaje cercano eliminan la barrera del miedo a preguntar, potenciando la comprensión profunda.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#FF4FD8]/20 text-[#FF4FD8] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Reconocimiento al Talento</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cada estudiante destacado recibe validación oficial de la coordinación académica, construyendo su portafolio temprano.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#A3FF6F]/20 text-[#A3FF6F] flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Transparencia y Seguridad</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Asesorías monitoreadas en espacios institucionales con agendas verificadas, sin pagos ficticios ni intermediarios oscuros.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#536DFF]/20 text-[#536DFF] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Exploración Vocacional</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Permite a los estudiantes descubrir nuevas pasiones antes de graduarse, explorando disciplinas científicas, humanísticas y artísticas.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
