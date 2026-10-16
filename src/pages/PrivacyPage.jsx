import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
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
          <Lock className="w-8 h-8 text-[#FF4FD8]" />
          <div>
            <h1 className="font-display font-black text-2xl text-white">Política de Privacidad y Tratamiento de Datos</h1>
            <p className="text-slate-400">Protección de Datos de la Comunidad Estudiantil</p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="font-bold text-white text-sm">1. Datos Personales Recolectados</h2>
          <p>
            BAM ON STAGE recopila exclusivamente el nombre, correo institucional, grado escolar y los temas académicos solicitados u ofrecidos. No solicitamos datos bancarios, domiciliarios ni sensibles ajenos al ámbito escolar.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white text-sm">2. Uso de la Información</h2>
          <p>
            La información se utiliza estrictamente para coordinar las asesorías entre compañeros, validar la condición de estudiante activo y permitir la asignación de espacios físicos dentro del campus escolar.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white text-sm">3. Seguridad y Confidencialidad</h2>
          <p>
            Las credenciales de acceso se protegen mediante protocolos seguros de autenticación Supabase y cifrado estándar de la industria. Ningún dato es transferido ni comercializado con terceros.
          </p>
        </section>
      </div>
    </div>
  );
}
