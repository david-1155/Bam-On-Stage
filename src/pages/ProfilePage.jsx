import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { User, Mail, GraduationCap, Shield, BookOpen, Calendar, CheckCircle2, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, role, logout, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [grade, setGrade] = useState(currentUser?.grade || '10° A');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [notice, setNotice] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No has iniciado sesión</h2>
        <Link to="/login" className="inline-block text-xs text-[#00E5FF] underline">
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim(),
      grade: grade.trim(),
      bio: bio.trim()
    });
    setNotice('Perfil actualizado exitosamente.');
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#00E5FF]/50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#536DFF] to-[#00E5FF] flex items-center justify-center font-bold text-xl text-white">
                {currentUser.fullName?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-white">{currentUser.fullName}</h1>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
              role === 'administrador'
                ? 'bg-[#A3FF6F]/20 text-[#A3FF6F]'
                : role === 'instructor'
                ? 'bg-[#FF4FD8]/20 text-[#FF4FD8]'
                : 'bg-[#00E5FF]/20 text-[#00E5FF]'
            }`}>
              Rol: {role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Grid: Edit form & Direct Accesses */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Edit profile form */}
        <div className="md:col-span-8 bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-lg text-white">Información de la Cuenta</h2>
          
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Nombre completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Correo institucional</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Grado o curso</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Breve descripción personal</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Cuéntanos sobre tus intereses y lo que más te apasiona aprender..."
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF] leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              Guardar Cambios
            </button>
          </form>
        </div>

        {/* Right: Quick shortcuts */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-3">
            <h3 className="font-display font-bold text-base text-white">Accesos Directos</h3>
            
            <Link
              to="/mis-reservas"
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FF4FD8]" />
                Mis reservas
              </span>
              <span>→</span>
            </Link>

            {(role === 'instructor' || role === 'administrador') && (
              <Link
                to="/instructor"
                className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#A3FF6F]" />
                  Panel del instructor
                </span>
                <span>→</span>
              </Link>
            )}

            {role === 'administrador' && (
              <Link
                to="/admin"
                className="w-full p-3 rounded-xl bg-[#A3FF6F]/10 hover:bg-[#A3FF6F]/20 text-xs font-semibold text-[#A3FF6F] flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Panel de administración
                </span>
                <span>→</span>
              </Link>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
