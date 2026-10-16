import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, switchDemoUser, isSupabase } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await login(email, password);
      setIsLoading(false);
      navigate('/mis-reservas');
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleQuickDemoLogin = (role) => {
    switchDemoUser(role);
    if (role === 'instructor') {
      navigate('/instructor');
    } else if (role === 'administrador') {
      navigate('/admin');
    } else {
      navigate('/mis-reservas');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#00E5FF]/30 text-xs text-[#00E5FF] font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Acceso Estudiantil</span>
        </div>
        <h1 className="font-display font-black text-3xl text-white">
          Iniciar Sesión
        </h1>
        <p className="text-xs text-slate-400">
          Ingresa a tu cuenta de BAM ON STAGE para gestionar tus asesorías
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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-300">
                Contraseña
              </label>
              <Link to="/recuperar-clave" className="text-[#00E5FF] hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Ingresar a la plataforma</span>
          </button>
        </form>

        {/* Demo Fast Access */}
        {!isSupabase && (
          <div className="pt-4 border-t border-white/5 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block text-center uppercase tracking-wider">
              Acceso Rápido Modo Demostración:
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('estudiante')}
                className="p-2 rounded-xl bg-white/5 hover:bg-[#00E5FF]/20 text-slate-300 hover:text-[#00E5FF] border border-white/5 transition-colors font-medium text-center"
              >
                Camila (Est.)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('instructor')}
                className="p-2 rounded-xl bg-white/5 hover:bg-[#FF4FD8]/20 text-slate-300 hover:text-[#FF4FD8] border border-white/5 transition-colors font-medium text-center"
              >
                Mateo (Inst.)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('administrador')}
                className="p-2 rounded-xl bg-white/5 hover:bg-[#A3FF6F]/20 text-slate-300 hover:text-[#A3FF6F] border border-white/5 transition-colors font-medium text-center"
              >
                Alberto (Admin)
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 text-center text-xs text-slate-400">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/registro" className="text-[#00E5FF] font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </div>

      </div>

    </div>
  );
}
