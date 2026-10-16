import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { demoStore } from '../services/demoStore.js';
import {
  ArrowLeft,
  Star,
  MapPin,
  Video,
  Clock,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { formatCurrencyCOP } from '../utils/bookingRules.ts';

export default function InstructorProfilePage() {
  const { instructorId } = useParams();
  const instructor = demoStore.getInstructorById(instructorId);
  const reviews = demoStore.getReviews(instructorId);

  if (!instructor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Instructor no encontrado</h2>
        <p className="text-sm text-slate-400">El instructor solicitado no existe o ha sido desactivado.</p>
        <Link to="/talentos" className="inline-block text-xs font-semibold text-[#00E5FF] underline">
          Volver al catálogo de talentos
        </Link>
      </div>
    );
  }

  const {
    id,
    name,
    grade,
    areaName,
    avatarUrl,
    headline,
    biography,
    topics = [],
    basePriceCop,
    ratingAverage,
    reviewsCount,
    mode,
    locationName,
    availabilitySchedule = []
  } = instructor;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Back button */}
      <Link
        to="/talentos"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#00E5FF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a talentos</span>
      </Link>

      {/* Hero Card of the Instructor */}
      <div className="bg-[#121020] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#00E5FF]/10 via-[#FF4FD8]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-8">
          
          {/* Avatar and Main Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt={name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-2 border-[#00E5FF]/50 shadow-[0_0_30px_rgba(0,229,255,0.25)]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#0A0A10] border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="tabular-nums">{ratingAverage ? ratingAverage.toFixed(1) : '5.0'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] text-[11px] font-semibold">
                  {areaName}
                </span>
                <span className="text-slate-400 text-xs">· Grado {grade}</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium ml-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Autorizado
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
                {name}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {headline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Sesiones de 60 minutos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {mode === 'virtual' ? (
                    <Video className="w-3.5 h-3.5 text-[#536DFF]" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-[#FF4FD8]" />
                  )}
                  <span className="capitalize">{mode === 'ambas' ? 'Presencial y Virtual' : mode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div className="w-full lg:w-72 bg-[#17142A] border border-white/10 rounded-2xl p-6 space-y-4 shrink-0">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                Tarifa de asesoría
              </span>
              <p className="font-mono text-2xl sm:text-3xl font-black text-white mt-1 tabular-nums">
                {formatCurrencyCOP(basePriceCop)}
              </p>
              <span className="text-[11px] text-slate-400">por sesión / estudiante</span>
            </div>

            <Link
              to={`/reservar/${id}`}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-[#0A0A10] bg-[#00E5FF] hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2"
            >
              <span>Solicitar asesoría</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-slate-400 text-center leading-normal">
              No requiere pago inmediato. El instructor revisará tu solicitud y confirmará la disponibilidad.
            </p>
          </div>

        </div>
      </div>

      {/* Main Grid: Details & Schedule & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 spans): Bio, Topics, Location */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Biography */}
          <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#00E5FF]" />
              Sobre mí y metodología de enseñanza
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {biography}
            </p>
          </div>

          {/* Topics Offered */}
          <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#A3FF6F]" />
              Temas que puedo enseñarte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map(topic => (
                <div
                  key={topic.id || topic.name}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-white">{topic.name}</span>
                  <span className="text-xs font-mono text-[#A3FF6F] tabular-nums">
                    {formatCurrencyCOP(topic.priceCop || basePriceCop)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews section */}
          <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#FF4FD8]" />
                  Opiniones de Estudiantes ({reviews.length})
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Reseñas auténticas dejadas por compañeros tras completar sus asesorías.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-base">
                <Star className="w-5 h-5 fill-current" />
                <span className="tabular-nums font-mono">{ratingAverage ? ratingAverage.toFixed(1) : '5.0'}</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Actualmente no hay comentarios registrados para este instructor.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{review.studentName}</span>
                        <span className="text-[11px] text-slate-500">({review.studentGrade})</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{review.comment}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{review.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Schedule & Presencial Location */}
        <div className="space-y-6">
          
          {/* Horarios disponibles */}
          <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00E5FF]" />
              Horarios semanales
            </h3>
            
            {availabilitySchedule.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Actualmente no hay horarios publicados para este instructor.
              </p>
            ) : (
              <div className="space-y-3">
                {availabilitySchedule.map((slot, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                    <p className="text-xs font-semibold text-white">{slot.day}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {slot.times.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[11px] font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lugar presencial */}
          <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF4FD8]" />
              Lugar de asesorías presenciales
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {locationName || 'Sala de estudio en biblioteca institucional o espacio acordado.'}
            </p>
            <p className="text-[11px] text-slate-400">
              Para sesiones virtuales se genera un enlace de Google Meet al ser confirmada la reserva.
            </p>
          </div>

          {/* Secondary Action */}
          <Link
            to={`/reservar/${id}`}
            className="block text-center w-full py-3 rounded-xl font-bold text-xs text-[#0A0A10] bg-[#A3FF6F] hover:bg-[#A3FF6F]/90 transition-all shadow-[0_0_15px_rgba(163,255,111,0.3)]"
          >
            Solicitar asesoría con {name}
          </Link>

        </div>

      </div>

    </div>
  );
}
