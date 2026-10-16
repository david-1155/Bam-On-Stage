import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Video, Calendar, ArrowRight } from 'lucide-react';
import { formatCurrencyCOP } from '../../utils/bookingRules.ts';

export default function InstructorCard({ instructor }) {
  const {
    id,
    name,
    grade,
    areaName,
    avatarUrl,
    headline,
    topics = [],
    basePriceCop,
    ratingAverage,
    reviewsCount,
    mode,
    nextAvailability,
    locationName
  } = instructor;

  return (
    <div className="group relative bg-[#131120] hover:bg-[#181528] border border-white/10 hover:border-[#00E5FF]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]">
      
      {/* Top row: Avatar + Name + Grade + Rating */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/10 group-hover:border-[#00E5FF]/60 transition-colors shadow-md"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display font-bold text-lg text-white group-hover:text-[#00E5FF] transition-colors truncate">
                {name}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center gap-1 shrink-0 text-amber-400 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="tabular-nums">{ratingAverage ? ratingAverage.toFixed(1) : '5.0'}</span>
                <span className="text-slate-400 font-normal text-[11px]">({reviewsCount || 0})</span>
              </div>
            </div>

            {/* Clean unboxed metadata (anti-slop, no capsule sandwich) */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span className="font-medium text-slate-300">{grade}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-[#00E5FF] font-medium truncate">{areaName}</span>
            </div>
          </div>
        </div>

        {/* Short Headline / Bio */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {headline}
        </p>

        {/* Temas que puede enseñar (chips sutiles minimalistas) */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Temas destacados
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topics.slice(0, 3).map((topic) => (
              <span
                key={topic.id || topic.name}
                className="text-[11px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/5 truncate max-w-[220px]"
              >
                {topic.name}
              </span>
            ))}
            {topics.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 text-slate-500">
                +{topics.length - 3} más
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom details: Modalidad + Disponibilidad + Tarifa + Botón Ver Perfil */}
      <div className="pt-4 border-t border-white/5 mt-2 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            {mode === 'virtual' ? (
              <Video className="w-3.5 h-3.5 text-[#536DFF]" />
            ) : mode === 'presencial' ? (
              <MapPin className="w-3.5 h-3.5 text-[#FF4FD8]" />
            ) : (
              <div className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3 h-3 text-[#FF4FD8]" />
                <span className="text-[10px]">/</span>
                <Video className="w-3 h-3 text-[#536DFF]" />
              </div>
            )}
            <span className="capitalize">{mode === 'ambas' ? 'Presencial / Virtual' : mode}</span>
          </div>

          {nextAvailability && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Calendar className="w-3 h-3" />
              <span>{nextAvailability}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
              Tarifa sugerida
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-white tabular-nums">
              {formatCurrencyCOP(basePriceCop)}
            </span>
          </div>

          <Link
            to={`/talentos/${id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#00E5FF] text-white hover:text-[#0A0A10] font-semibold text-xs transition-all duration-200 group/btn"
          >
            <span>Ver perfil</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>

    </div>
  );
}
