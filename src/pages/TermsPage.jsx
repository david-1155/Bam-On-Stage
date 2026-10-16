import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#00E5FF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al inicio</span>
      </Link>

      <div className="bg-[#121020] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <ShieldCheck className="w-8 h-8 text-[#00E5FF]" />
          <div>
            <h1 className="font-display font-black text-2xl text-white">Términos y Condiciones de Uso</h1>
            <p className="text-slate-400">Plataforma Educativa BAM ON STAGE · Vigencia 2026</p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="font-bold text-white text-sm">1. Propósito Educativo</h2>
          <p>
            BAM ON STAGE es una plataforma concebida exclusivamente para el intercambio de conocimientos y asesorías académicas entre estudiantes de la institución. No constituye una entidad comercial ni una relación laboral.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white text-sm">2. Tarifas y Valores Informados</h2>
          <p>
            Los precios publicados en los perfiles de los instructores corresponden a valores sugeridos de reconocimiento entre estudiantes acordados voluntariamente. La plataforma no procesa transacciones bancarias directas ni retiene comisiones económicas.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white text-sm">3. Conducta y Convivencia Escolar</h2>
          <p>
            Todas las sesiones presenciales y virtuales se rigen por el Manual de Convivencia de la institución. Cualquier falta de respeto, agresión o conducta impropia conllevará la revocación inmediata del acceso y reporte ante la coordinación académica.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white text-sm">4. Cancelaciones y Horarios</h2>
          <p>
            Las cancelaciones deben efectuarse con al menos 2 horas de anticipación a través del sistema para permitir que el horario sea liberado para otro estudiante.
          </p>
        </section>
      </div>
    </div>
  );
}
