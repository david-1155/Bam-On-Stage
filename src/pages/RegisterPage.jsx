import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { validateEmail } from '../utils/bookingRules.ts';
import { User, Mail, Lock, GraduationCap, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('10° A');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Por favor ingresa un correo electrónico válido (ej: estudiante@bam.edu.co).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Debes aceptar los términos y la política de privacidad para continuar.');
      return;
    }

    setIsLoading(true);

    try {
      await signup({ fullName: fullName.trim(), email: email.trim(), password, grade });
      setIsLoading(false);
      navigate('/mis-reservas');
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Error al crear la cuenta.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#FF4FD8]/30 text-xs text-[#FF4FD8] font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Únete a BAM ON STAGE</span>
        </div>
        <h1 className="font-display font-black text-3xl text-white">
          Crear Cuenta
        </h1>
        <p className="text-xs text-slate-400">
          Descubre tus talentos y accede a asesorías académicas entre compañeros
        </p>
      </div>

      <div className="bg-[#121020] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre y Apellido"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Correo Institucional
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

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Grado o Curso
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121020] border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="9° A">9° Grado - A</option>
                <option value="9° B">9° Grado - B</option>
                <option value="10° A">10° Grado - A</option>
                <option value="10° B">10° Grado - B</option>
                <option value="10° C">10° Grado - C</option>
                <option value="11° A">11° Grado - A</option>
                <option value="11° B">11° Grado - B</option>
                <option value="11° C">11° Grado - C</option>
              </select>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Rol inicial: <strong>Estudiante</strong> (los instructores son autorizados por coordinación).
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded accent-[#00E5FF] cursor-pointer"
              />
              <span className="text-slate-400 text-[11px] leading-relaxed">
                Acepto los{' '}
                <Link to="/terminos" className="text-[#00E5FF] hover:underline">
                  Términos de servicio
                </Link>{' '}
                y la{' '}
                <Link to="/privacidad" className="text-[#00E5FF] hover:underline">
                  Política de privacidad
                </Link>{' '}
                de BAM ON STAGE.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Completar Registro</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-[#00E5FF] font-semibold hover:underline">
            Inicia sesión
          </Link>
        </div>

      </div>

    </div>
  );
}
