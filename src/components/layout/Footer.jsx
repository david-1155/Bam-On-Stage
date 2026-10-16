import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#07060C] border-t border-white/10 text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Columna 1: Marca y Eslogan */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-xl tracking-tighter text-white">
                BAM
              </span>
              <span className="font-display font-bold text-xs tracking-widest text-[#00E5FF] uppercase">
                ON STAGE
              </span>
            </div>
            <p className="text-slate-300 italic text-sm">
              «Donde el talento encuentra su escenario»
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma institucional para conectar a estudiantes, descubrir vocaciones y democratizar el aprendizaje entre pares.
            </p>
          </div>

          {/* Columna 2: Plataforma */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Plataforma
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/talentos" className="hover:text-[#00E5FF] transition-colors">
                  Conoce nuestros talentos
                </Link>
              </li>
              <li>
                <Link to="/areas" className="hover:text-[#00E5FF] transition-colors">
                  Áreas de aprendizaje
                </Link>
              </li>
              <li>
                <Link to="/horarios" className="hover:text-[#00E5FF] transition-colors">
                  Horarios y disponibilidad
                </Link>
              </li>
              <li>
                <Link to="/lugares" className="hover:text-[#00E5FF] transition-colors">
                  Espacios y lugares
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Institucional */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Institución
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre-nosotros" className="hover:text-[#00E5FF] transition-colors">
                  Sobre el proyecto
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-[#00E5FF] transition-colors">
                  Contacto & Coordinación
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-[#00E5FF] transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-[#00E5FF] transition-colors">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Accesos Rápidos */}
          <div>
            <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-3">
              Para Instructores
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              ¿Quieres ser instructor estudiantil? Solicita la autorización al coordinador o explora cómo funciona.
            </p>
            <Link
              to="/instructor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              Acceso a Instructores
            </Link>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            &copy; 2026 BAM ON STAGE. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Desarrollado con React, Vite y arquitectura Supabase
            </span>
            <span className="text-slate-400">·</span>
            <Link to="/admin" className="hover:text-[#A3FF6F] transition-colors">
              Panel Administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
