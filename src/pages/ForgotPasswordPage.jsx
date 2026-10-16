import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateEmail } from '../utils/bookingRules.ts';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMsg('Por favor ingresa un correo electrónico institucional válido.');
      return;
    }
    setErrorMsg('');
    setIsSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      <Link
        to="/login"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#00E5FF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al inicio de sesión</span>
      </Link>

      <div className="bg-[#121020] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-2">
          <h1 className="font-display font-black text-2xl text-white">
            Recuperar Contraseña
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingresa tu correo electrónico registrado y te enviaremos un enlace seguro para restablecer tu acceso.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSent ? (
          <div className="p-5 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-[#00E5FF] mx-auto" />
            <h3 className="font-bold text-white text-sm">Enlace Enviado</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hemos enviado las instrucciones a <strong>{email}</strong>. Revisa tu bandeja de entrada o spam.
            </p>
            <Link
              to="/login"
              className="inline-block px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold mt-2"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="estudiante@bam.edu.co"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Enviar enlace de recuperación</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
