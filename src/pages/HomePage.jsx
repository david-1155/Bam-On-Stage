import React from 'react';
import { Link } from 'react-router-dom';
import { demoStore } from '../services/demoStore.js';
import AreaCard from '../components/common/AreaCard.jsx';
import InstructorCard from '../components/talents/InstructorCard.jsx';
import heroImage from '/src/assets/images/hero_bam_stage_talent_1792180018042.jpg';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Search,
  CalendarCheck,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export default function HomePage() {
  const allAreas = demoStore.getAreas();
  const allInstructors = demoStore.getInstructors();
  const featuredInstructors = allInstructors.filter(i => i.isFeatured);

  return (
    <div className="space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#536DFF]/15 via-[#FF4FD8]/15 to-[#00E5FF]/15 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-[#00E5FF]/30 text-xs text-[#00E5FF] font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Donde el talento encuentra su escenario</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] [text-wrap:balance]">
                DESCUBRE TU TALENTO. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#FF4FD8] to-[#536DFF]">
                  COMPARTE LO QUE SABES.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Conecta con estudiantes de tu institución, explora nuevas áreas y encuentra personas que pueden ayudarte a desarrollar tus habilidades académicas, artísticas y tecnológicas.
              </p>

              {/* Botones de acción principales */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <Link
                  to="/talentos"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-[#0A0A10] bg-[#00E5FF] hover:bg-[#00E5FF]/90 transition-all duration-200 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 flex items-center gap-2"
                >
                  <span>Explorar talentos</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/areas"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all duration-200 hover:border-[#FF4FD8]/60 flex items-center gap-2"
                >
                  <span>Descubrir áreas</span>
                </Link>

                <Link
                  to="/dar-refuerzos"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-[#A3FF6F] bg-[#A3FF6F]/10 hover:bg-[#A3FF6F]/20 border border-[#A3FF6F]/40 transition-all duration-200 shadow-[0_0_20px_rgba(163,255,111,0.25)] hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#A3FF6F]" />
                  <span>Quiero dar refuerzos</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg text-xs">
                <div>
                  <p className="font-display font-black text-xl text-white font-mono tabular-nums">11</p>
                  <p className="text-slate-400 mt-0.5">Áreas de formación</p>
                </div>
                <div>
                  <p className="font-display font-black text-xl text-[#00E5FF] font-mono tabular-nums">100%</p>
                  <p className="text-slate-400 mt-0.5">Entre estudiantes</p>
                </div>
                <div>
                  <p className="font-display font-black text-xl text-[#A3FF6F] font-mono tabular-nums">4.9 / 5</p>
                  <p className="text-slate-400 mt-0.5">Satisfacción media</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Stage Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_0_40px_rgba(83,109,255,0.25)] group">
                <img
                  src={heroImage}
                  alt="Estudiantes en el escenario interactivo de BAM ON STAGE"
                  className="w-full h-[400px] lg:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A10] via-transparent to-transparent opacity-80" />
                
                {/* Stage Badge Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0A0A10]/80 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-white">Comunidad Colegial Activa</p>
                      <p className="text-xs text-slate-300">Asesorías presenciales en el campus y virtuales</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ÁREAS DE APRENDIZAJE DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#00E5FF] uppercase tracking-widest">
              Categorías
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
              Áreas de Aprendizaje
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Explora las diferentes disciplinas académicas, tecnológicas, artísticas y de desarrollo personal.
            </p>
          </div>

          <Link
            to="/areas"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#00E5FF] hover:underline"
          >
            <span>Ver todas las 11 áreas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allAreas.slice(0, 4).map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </section>

      {/* 3. TALENTOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#FF4FD8] uppercase tracking-widest">
              Instructores destacados
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
              Conoce Nuestros Talentos
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Estudiantes destacados con vocación de enseñanza listos para compartir sus conocimientos contigo.
            </p>
          </div>

          <Link
            to="/talentos"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FF4FD8] hover:underline"
          >
            <span>Explorar catálogo completo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredInstructors.map((inst) => (
            <InstructorCard key={inst.id} instructor={inst} />
          ))}
        </div>
      </section>

      {/* 4. ¿CÓMO FUNCIONA? (4 PASOS OBLIGATORIOS) */}
      <section className="relative py-16 bg-[#0E0C1B] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-[#A3FF6F] uppercase tracking-widest">
              Paso a paso
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              ¿Cómo funciona BAM ON STAGE?
            </h2>
            <p className="text-sm text-slate-400">
              Un proceso simple, seguro y transparente diseñado para potenciar las habilidades de toda la institución.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Paso 1 */}
            <div className="relative bg-[#141224] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] flex items-center justify-center font-display font-bold text-lg">
                1
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Explora las áreas
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Descubre asignaturas desde matemáticas y robótica hasta diseño, música y debate competitivo.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="relative bg-[#141224] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#536DFF]/15 border border-[#536DFF]/30 text-[#536DFF] flex items-center justify-center font-display font-bold text-lg">
                2
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Encuentra un instructor
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Revisa perfiles, experiencia, horarios disponibles, modalidad (presencial/virtual) y opiniones reales.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="relative bg-[#141224] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF4FD8]/15 border border-[#FF4FD8]/30 text-[#FF4FD8] flex items-center justify-center font-display font-bold text-lg">
                3
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Solicita una asesoría
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Elige la fecha, la hora y el tema que necesitas reforzar. El instructor revisará y responderá tu solicitud.
              </p>
            </div>

            {/* Paso 4 */}
            <div className="relative bg-[#141224] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#A3FF6F]/15 border border-[#A3FF6F]/30 text-[#A3FF6F] flex items-center justify-center font-display font-bold text-lg">
                4
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Aprende y desarrolla tus habilidades
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Asiste a tu sesión en el campus o por videollamada, resuelve dudas prácticas y valora tu experiencia.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SECCIÓN ESPECIAL: INSCRIBIRSE PARA DAR REFUERZOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-[#121020] via-[#1a1436] to-[#0d162a] border border-[#A3FF6F]/30 shadow-[0_0_35px_rgba(163,255,111,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A3FF6F]/15 border border-[#A3FF6F]/30 text-xs text-[#A3FF6F] font-bold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Convocatoria Abierta para Estudiantes</span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
                ¿Dominas una materia o tienes un talento? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3FF6F] via-[#00E5FF] to-[#FF4FD8]">
                  Inscríbete para dar refuerzos y genera ingresos
                </span>
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Elige en cuál de las 11 áreas quieres dar refuerzos (matemáticas, programación, inglés, ciencias, arte, música y más), estipula tus propios días y horarios de disponibilidad, y fija tu tarifa en pesos colombianos.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-bold text-[#A3FF6F] block text-sm">1. Elige tu Área</span>
                  <span className="text-slate-400 text-[11px]">Enfócate en la materia o habilidad que mejor dominas.</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-bold text-[#00E5FF] block text-sm">2. Fija tu Horario</span>
                  <span className="text-slate-400 text-[11px]">Los estudiantes solo reservarán en tus franjas autorizadas.</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-bold text-[#FF4FD8] block text-sm">3. Gana en COP</span>
                  <span className="text-slate-400 text-[11px]">Establece tus tarifas justas por cada sesión de 60 minutos.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center gap-4 text-center">
              <Link
                to="/dar-refuerzos"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-black text-sm text-[#0A0A10] bg-[#A3FF6F] hover:bg-[#A3FF6F]/90 transition-all duration-200 shadow-[0_0_25px_rgba(163,255,111,0.4)] hover:scale-105 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#0A0A10]" />
                <span>Inscribirme para Dar Refuerzos</span>
              </Link>
              <p className="text-[11px] text-slate-400">
                Aprobación inmediata en la plataforma colegial
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-[#17132F] via-[#101935] to-[#121A28] border border-white/15 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              ¿Listo para subirte al escenario?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tanto si quieres aprender algo nuevo como si quieres compartir tus conocimientos como instructor autorizado, BAM ON STAGE es tu comunidad.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                to="/talentos"
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#0A0A10] bg-[#00E5FF] hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              >
                Comenzar a explorar
              </Link>
              <Link
                to="/sobre-nosotros"
                className="px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Conocer más del proyecto
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
