import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Terminal,
  Globe,
  Atom,
  Palette,
  Music,
  BookOpen,
  Compass,
  Trophy,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const ICON_MAP = {
  Calculator,
  Terminal,
  Globe,
  Atom,
  Palette,
  Music,
  BookOpen,
  Compass,
  Trophy,
  Users,
  Sparkles
};

export default function AreaCard({ area }) {
  const IconComponent = ICON_MAP[area.iconName] || Sparkles;

  return (
    <Link
      to={`/areas/${area.slug}`}
      className="group relative bg-[#12101F] hover:bg-[#18152B] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden"
      style={{
        boxShadow: `0 0 0 1px ${area.neonColor}15`
      }}
    >
      {/* Background subtle neon radial wash on hover */}
      <div
        className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: area.neonColor }}
      />

      <div>
        {/* Top: Icon + Instructor Count */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
            style={{
              backgroundColor: `${area.neonColor}18`,
              color: area.neonColor,
              border: `1px solid ${area.neonColor}35`
            }}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <span className="text-[11px] font-medium text-slate-400">
            {area.instructorsCount} {area.instructorsCount === 1 ? 'instructor' : 'instructores'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg text-white group-hover:text-[#00E5FF] transition-colors mb-2">
          {area.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-6">
          {area.description}
        </p>
      </div>

      {/* Bottom link */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
        <span style={{ color: area.neonColor }}>Consultar instructores</span>
        <ArrowRight
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: area.neonColor }}
        />
      </div>
    </Link>
  );
}
