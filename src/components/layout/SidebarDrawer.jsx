import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Home,
  Users,
  Grid,
  Clock,
  MapPin,
  Info,
  Mail,
  Calendar,
  BookOpen,
  Shield,
  LogIn,
  UserPlus,
  User,
  LogOut,
  X,
  Sparkles
} from 'lucide-react';

export default function SidebarDrawer({ isOpen, onClose }) {
  const { currentUser, role, logout } = useAuth();
  const location = useLocation();

  // Cerrar el drawer al cambiar de ruta
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Cerrar al presionar Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className="relative w-full max-w-sm sm:max-w-md bg-[#0D0B18] border-l border-white/10 shadow-2xl h-full flex flex-col z-10 overflow-y-auto animate-in slide-in-from-right duration-200"
        aria-label="Menú principal de navegación"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#536DFF] to-[#00E5FF] p-[2px]">
              <div className="w-full h-full bg-[#0D0B18] rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#FF4FD8] text-base">
                  B
                </span>
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-white tracking-wide">BAM ON STAGE</p>
              <p className="text-[11px] text-slate-400">Navegación institucional</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
            aria-label="Cerrar menú lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current user badge in drawer */}
        {currentUser && (
          <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex items-center gap-3">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-10 h-10 rounded-full object-cover border border-[#00E5FF]/40"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#536DFF] to-[#00E5FF] flex items-center justify-center text-sm font-bold text-white">
                {currentUser.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{currentUser.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser.grade || currentUser.email}</p>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
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
        )}

        {/* Navigation Links */}
        <div className="p-6 space-y-6 flex-1">
          {/* Sección Principal */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
              Exploración
            </p>
            <nav className="space-y-1">
              <Link
                to="/"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive('/')
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Home className="w-4 h-4 text-[#00E5FF]" />
                Inicio
              </Link>

              <Link
                to="/talentos"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive('/talentos')
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4 text-[#536DFF]" />
                Conoce nuestros talentos
              </Link>

              <Link
                to="/areas"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive('/areas')
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Grid className="w-4 h-4 text-[#FF4FD8]" />
                Áreas de aprendizaje
              </Link>

              <Link
                to="/horarios"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive('/horarios')
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Clock className="w-4 h-4 text-[#A3FF6F]" />
                Horarios y disponibilidad
              </Link>

              <Link
                to="/lugares"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive('/lugares')
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#00E5FF]" />
                Lugares institucionales
              </Link>
            </nav>
          </div>

          {/* Sección Institucional */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
              Institución
            </p>
            <nav className="space-y-1">
              <Link
                to="/sobre-nosotros"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive('/sobre-nosotros')
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Info className="w-4 h-4 text-slate-400" />
                Sobre el proyecto
              </Link>

              <Link
                to="/contacto"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive('/contacto')
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mail className="w-4 h-4 text-slate-400" />
                Contacto
              </Link>
            </nav>
          </div>

          {/* Gestión de Asesorías & Roles Privados */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
              Mi Espacio & Gestión
            </p>
            <nav className="space-y-1">
              {currentUser ? (
                <>
                  <Link
                    to="/mis-reservas"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive('/mis-reservas')
                        ? 'bg-[#FF4FD8]/10 text-[#FF4FD8] border border-[#FF4FD8]/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-[#FF4FD8]" />
                    Mis reservas
                  </Link>

                  <Link
                    to="/perfil"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive('/perfil')
                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#00E5FF]" />
                    Mi perfil
                  </Link>

                  {(role === 'instructor' || role === 'administrador') && (
                    <Link
                      to="/instructor"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive('/instructor')
                          ? 'bg-[#A3FF6F]/10 text-[#A3FF6F] border border-[#A3FF6F]/30'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-[#A3FF6F]" />
                      Panel del instructor
                    </Link>
                  )}

                  {role === 'administrador' && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive('/admin')
                          ? 'bg-[#A3FF6F]/10 text-[#A3FF6F] border border-[#A3FF6F]/30'
                          : 'text-[#A3FF6F] hover:bg-[#A3FF6F]/10'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-[#A3FF6F]" />
                      Panel de administración
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive('/login')
                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LogIn className="w-4 h-4 text-[#00E5FF]" />
                    Iniciar sesión
                  </Link>

                  <Link
                    to="/registro"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive('/registro')
                        ? 'bg-[#FF4FD8]/10 text-[#FF4FD8] border border-[#FF4FD8]/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 text-[#FF4FD8]" />
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Footer info in drawer */}
        <div className="p-6 border-t border-white/10 bg-black/40">
          <p className="text-xs text-slate-500 italic">
            «Donde el talento encuentra su escenario»
          </p>
          <p className="text-[11px] text-slate-600 mt-1">
            BAM ON STAGE &copy; 2026. Plataforma Educativa.
          </p>
        </div>
      </aside>
    </div>
  );
}
