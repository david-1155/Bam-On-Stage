import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Menu, Search, X, User, LogOut, Calendar, Shield, BookOpen, Layers, CheckSquare, GraduationCap } from 'lucide-react';

export default function Navbar({ onOpenSidebar, onOpenSearch }) {
  const { currentUser, role, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A10]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#536DFF] via-[#FF4FD8] to-[#00E5FF] p-[2px] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <div className="w-full h-full bg-[#0A0A10] rounded-[10px] flex items-center justify-center">
                <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#FF4FD8] text-lg tracking-wider">
                  B
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-2xl tracking-tighter text-white">
                BAM
              </span>
              <span className="font-display font-bold text-xs tracking-widest text-[#00E5FF] uppercase">
                ON STAGE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
              Donde el talento encuentra su escenario
            </span>
          </div>
        </Link>

        {/* Zone 2: Primary Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors whitespace-nowrap ${
              isActive('/') ? 'text-[#00E5FF] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/talentos"
            className={`transition-colors whitespace-nowrap ${
              isActive('/talentos') ? 'text-[#00E5FF] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Talentos
          </Link>
          <Link
            to="/areas"
            className={`transition-colors whitespace-nowrap ${
              isActive('/areas') ? 'text-[#00E5FF] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Áreas
          </Link>
          <Link
            to="/horarios"
            className={`transition-colors whitespace-nowrap ${
              isActive('/horarios') ? 'text-[#00E5FF] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Horarios
          </Link>
          <Link
            to="/sobre-nosotros"
            className={`transition-colors whitespace-nowrap ${
              isActive('/sobre-nosotros') ? 'text-[#00E5FF] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Sobre nosotros
          </Link>
        </nav>

        {/* Zone 3: Actions + Search + User + Drawer Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Dar Refuerzos CTA button */}
          <Link
            to="/dar-refuerzos"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A3FF6F]/10 hover:bg-[#A3FF6F]/20 text-[#A3FF6F] border border-[#A3FF6F]/30 text-xs font-bold transition-all shadow-[0_0_12px_rgba(163,255,111,0.2)]"
            title="Inscríbete para dar refuerzos académicos"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Dar refuerzos</span>
          </Link>

          {/* Quick Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-lg text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
            aria-label="Buscar talentos o materias"
            title="Buscar talentos o materias"
          >
            <Search className="w-5 h-5 text-slate-300" />
          </button>

          {/* User Account / Profile button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                aria-expanded={profileDropdownOpen}
                aria-label="Menú de usuario"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-[#00E5FF]/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#536DFF] to-[#FF4FD8] flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-medium text-slate-200 max-w-[120px] truncate">
                  {currentUser.fullName}
                </span>
                <span className={`hidden sm:inline px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                  role === 'administrador'
                    ? 'bg-[#A3FF6F]/20 text-[#A3FF6F] border border-[#A3FF6F]/30'
                    : role === 'instructor'
                    ? 'bg-[#FF4FD8]/20 text-[#FF4FD8] border border-[#FF4FD8]/30'
                    : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30'
                }`}>
                  {role}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#141224] border border-white/10 shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="font-semibold text-white truncate">{currentUser.fullName}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-[#00E5FF] mt-1 font-mono uppercase">Rol: {role}</p>
                  </div>

                  <Link
                    to="/perfil"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#00E5FF]" />
                    Mi Perfil
                  </Link>

                  <Link
                    to="/mis-reservas"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#FF4FD8]" />
                    Mis Reservas
                  </Link>

                  <Link
                    to="/tareas"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <CheckSquare className="w-4 h-4 text-[#00E5FF]" />
                    Mis Tareas
                  </Link>

                  <Link
                    to="/dar-refuerzos"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[#A3FF6F] hover:text-white hover:bg-[#A3FF6F]/10 transition-colors font-medium"
                  >
                    <GraduationCap className="w-4 h-4 text-[#A3FF6F]" />
                    Inscribirme para Dar Refuerzos
                  </Link>

                  {(role === 'instructor' || role === 'administrador') && (
                    <Link
                      to="/instructor"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-[#A3FF6F]" />
                      Panel del Instructor
                    </Link>
                  )}

                  {role === 'administrador' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[#A3FF6F] hover:text-white hover:bg-[#A3FF6F]/10 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Panel de Administración
                    </Link>
                  )}

                  <div className="my-1 border-t border-white/10"></div>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Ingresar
              </Link>
              <Link
                to="/registro"
                className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold text-[#0A0A10] bg-[#00E5FF] hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:scale-105"
              >
                Registrarme
              </Link>
            </div>
          )}

          {/* Hamburger Drawer Trigger */}
          <button
            onClick={onOpenSidebar}
            className="p-2.5 rounded-lg text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
            aria-label="Abrir menú de navegación lateral"
            title="Abrir menú"
          >
            <Menu className="w-6 h-6 text-slate-200" />
          </button>
        </div>

      </div>
    </header>
  );
}
