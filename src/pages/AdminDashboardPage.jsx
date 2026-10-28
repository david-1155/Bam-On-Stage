import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { demoStore } from '../services/demoStore.js';
import { formatCurrencyCOP } from '../utils/bookingRules.ts';
import {
  Shield,
  Users,
  Grid,
  MapPin,
  Calendar,
  Star,
  Check,
  X,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Database,
  Copy
} from 'lucide-react';
import { isSupabaseConfigured, cleanSupabaseUrl, testSupabaseConnection } from '../services/supabase.js';
import { dataService } from '../services/dataService.js';

export default function AdminDashboardPage() {
  const { role, currentUser } = useAuth();

  const [activeModule, setActiveModule] = useState('instructores'); // 'instructores' | 'usuarios' | 'areas' | 'reservas' | 'lugares' | 'valoraciones'
  const [searchTerm, setSearchTerm] = useState('');
  const [notice, setNotice] = useState('');

  // Estados locales cargados desde el almacén
  const [instructors, setInstructors] = useState(demoStore.getInstructors());
  const [users, setUsers] = useState(demoStore.getUsers());
  const [areas, setAreas] = useState(demoStore.getAreas());
  const [locations, setLocations] = useState(demoStore.getLocations());
  const [bookings, setBookings] = useState(demoStore.getBookings());
  const [reviews, setReviews] = useState(demoStore.getReviews());

  // Formulario nuevo lugar
  const [newLocName, setNewLocName] = useState('');
  const [newLocBuilding, setNewLocBuilding] = useState('');
  const [newLocRoom, setNewLocRoom] = useState('');

  // Formulario nueva área
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDesc, setNewAreaDesc] = useState('');
  const [newAreaColor, setNewAreaColor] = useState('#00E5FF');

  // Estado Supabase
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleToggleAuthorization = (instructorId) => {
    const updated = instructors.map(i => {
      if (i.id === instructorId) {
        return { ...i, isAuthorized: !i.isAuthorized };
      }
      return i;
    });
    setInstructors(updated);
    demoStore.updateInstructor(updated.find(i => i.id === instructorId));
    setNotice('Estado de autorización del instructor actualizado.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleChangeRole = (userId, newRole) => {
    const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updated);
    demoStore.updateUserRole(userId, newRole);
    setNotice(`Rol del usuario actualizado a ${newRole}.`);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleCreateLocation = (e) => {
    e.preventDefault();
    if (!newLocName.trim()) return;
    const newLoc = {
      id: 'loc-' + Date.now(),
      name: newLocName.trim(),
      building: newLocBuilding.trim(),
      room: newLocRoom.trim(),
      capacity: 6,
      notes: 'Espacio institucional para tutorías'
    };
    const updated = [...locations, newLoc];
    setLocations(updated);
    demoStore.saveLocations(updated);
    setNewLocName('');
    setNewLocBuilding('');
    setNewLocRoom('');
    setNotice('Lugar institucional añadido exitosamente.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleDeleteLocation = (id) => {
    const updated = locations.filter(l => l.id !== id);
    setLocations(updated);
    demoStore.saveLocations(updated);
    setNotice('Lugar eliminado.');
    setTimeout(() => setNotice(''), 3000);
  };

  const handleCreateArea = (e) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    const slug = newAreaName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newArea = {
      id: 'area-' + Date.now(),
      slug,
      name: newAreaName.trim(),
      description: newAreaDesc.trim() || 'Área de aprendizaje y desarrollo de talentos.',
      iconName: 'Sparkles',
      neonColor: newAreaColor,
      instructorsCount: 0,
      order: areas.length + 1
    };
    const updated = [...areas, newArea];
    setAreas(updated);
    demoStore.saveAreas(updated);
    setNewAreaName('');
    setNewAreaDesc('');
    setNotice('Área de aprendizaje creada con éxito.');
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Top Banner & Security Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A3FF6F]/10 border border-[#A3FF6F]/30 text-xs text-[#A3FF6F] font-semibold tracking-wide mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Módulo Administrativo Seguro</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
            Panel de Control Institucional
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestión centralizada de instructores, usuarios, disciplinas, reservas globales y espacios físicos.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
          <p className="font-semibold text-white">Sesión activa como:</p>
          <p className="text-slate-400">{currentUser?.fullName || 'Administrador'} ({currentUser?.role || role})</p>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Module Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {[
          { id: 'instructores', label: `Instructores (${instructors.length})`, icon: Users },
          { id: 'usuarios', label: `Usuarios & Roles (${users.length})`, icon: Shield },
          { id: 'reservas', label: `Reservas Globales (${bookings.length})`, icon: Calendar },
          { id: 'areas', label: `Áreas (${areas.length})`, icon: Grid },
          { id: 'lugares', label: `Espacios (${locations.length})`, icon: MapPin },
          { id: 'valoraciones', label: `Moderación Reseñas (${reviews.length})`, icon: Star },
          { id: 'supabase', label: 'Supabase & Nube', icon: Database }
        ].map(mod => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeModule === mod.id
                  ? 'bg-white text-slate-950 font-bold shadow-lg'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mod.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULO 1: GESTIÓN DE INSTRUCTORES */}
      {activeModule === 'instructores' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-white">Instructores Autorizados y Aspirantes</h2>
            <span className="text-xs text-slate-400">
              Solo instructores con estado "Autorizado" aparecen listados públicamente en el catálogo.
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121020]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="p-4">Estudiante</th>
                  <th className="p-4">Grado</th>
                  <th className="p-4">Área</th>
                  <th className="p-4">Tarifa base</th>
                  <th className="p-4">Valoración</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {instructors.map(inst => (
                  <tr key={inst.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={inst.avatarUrl}
                        alt={inst.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#00E5FF]/40"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-semibold text-white">{inst.name}</span>
                    </td>
                    <td className="p-4">{inst.grade}</td>
                    <td className="p-4 text-[#00E5FF]">{inst.areaName}</td>
                    <td className="p-4 font-mono">{formatCurrencyCOP(inst.basePriceCop)}</td>
                    <td className="p-4 font-mono text-amber-400">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current inline" />
                        <span>{inst.ratingAverage}</span>
                        <span className="text-slate-500 font-normal">({inst.reviewsCount})</span>
                      </span>
                    </td>
                    <td className="p-4">
                      {inst.isAuthorized ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Autorizado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          En Revisión
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleAuthorization(inst.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          inst.isAuthorized
                            ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500 hover:text-white'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-bold'
                        }`}
                      >
                        {inst.isAuthorized ? 'Revocar' : 'Autorizar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULO 2: USUARIOS Y ROLES */}
      {activeModule === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-white">Control de Usuarios y Roles</h2>
            <span className="text-xs text-slate-400">
              Todos los usuarios registrados inician con rol de estudiante por defecto.
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121020]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Correo</th>
                  <th className="p-4">Grado / Cargo</th>
                  <th className="p-4">Rol Asignado</th>
                  <th className="p-4 text-right">Modificar Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-semibold text-white">{u.fullName}</td>
                    <td className="p-4 font-mono text-slate-400">{u.email}</td>
                    <td className="p-4">{u.grade}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        u.role === 'administrador'
                          ? 'bg-[#A3FF6F]/20 text-[#A3FF6F]'
                          : u.role === 'instructor'
                          ? 'bg-[#FF4FD8]/20 text-[#FF4FD8]'
                          : 'bg-[#00E5FF]/20 text-[#00E5FF]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                      >
                        <option value="estudiante" className="bg-[#121020]">Estudiante</option>
                        <option value="instructor" className="bg-[#121020]">Instructor</option>
                        <option value="administrador" className="bg-[#121020]">Administrador</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULO 3: RESERVAS GLOBALES */}
      {activeModule === 'reservas' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-white">Historial y Monitor de Reservas del Sistema</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121020]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 font-semibold border-b border-white/10">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Estudiante</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Tema</th>
                  <th className="p-4">Fecha y Hora</th>
                  <th className="p-4">Tarifa</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-slate-500">#{b.id.slice(-5)}</td>
                    <td className="p-4 font-medium text-white">{b.studentName}</td>
                    <td className="p-4 text-[#00E5FF]">{b.instructorName}</td>
                    <td className="p-4">{b.topicName}</td>
                    <td className="p-4 font-mono">{b.date} {b.time}</td>
                    <td className="p-4 font-mono text-[#A3FF6F]">{formatCurrencyCOP(b.priceCop)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.status === 'Aceptada'
                          ? 'bg-[#00E5FF]/20 text-[#00E5FF]'
                          : b.status === 'Completada'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : b.status === 'Pendiente'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULO 4: GESTIÓN DE ÁREAS */}
      {activeModule === 'areas' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-4">
            <h2 className="font-display font-bold text-lg text-white">Áreas de Aprendizaje Activas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {areas.map(a => (
                <div key={a.id} className="p-4 rounded-xl bg-[#121020] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{a.name}</span>
                    <span className="text-[11px] text-slate-400">{a.instructorsCount} instructores</span>
                  </div>
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: a.neonColor, boxShadow: `0 0 8px ${a.neonColor}` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-white">Añadir Nueva Área</h3>
            <form onSubmit={handleCreateArea} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Nombre del área</label>
                <input
                  type="text"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  placeholder="Ej: Robótica Submarina, Debate"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Descripción corta</label>
                <textarea
                  value={newAreaDesc}
                  onChange={(e) => setNewAreaDesc(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Color neón identificativo</label>
                <input
                  type="color"
                  value={newAreaColor}
                  onChange={(e) => setNewAreaColor(e.target.value)}
                  className="w-full h-9 rounded-xl bg-transparent cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold hover:bg-[#00E5FF]/90 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Área</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODULO 5: ESPACIOS INSTITUCIONALES */}
      {activeModule === 'lugares' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 space-y-4">
            <h2 className="font-display font-bold text-lg text-white">Lugares y Salas del Campus</h2>
            <div className="space-y-3">
              {locations.map(loc => (
                <div key={loc.id} className="p-4 rounded-xl bg-[#121020] border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white text-sm block">{loc.name}</span>
                    <span className="text-slate-400">{loc.building} · {loc.room}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400"
                    title="Eliminar lugar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-white">Registrar Espacio Físico</h3>
            <form onSubmit={handleCreateLocation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Nombre del espacio</label>
                <input
                  type="text"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  placeholder="Ej: Sala de Robótica MakerSpace"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Edificio o Bloque</label>
                <input
                  type="text"
                  value={newLocBuilding}
                  onChange={(e) => setNewLocBuilding(e.target.value)}
                  placeholder="Ej: Edificio Central"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Salón o Módulo</label>
                <input
                  type="text"
                  value={newLocRoom}
                  onChange={(e) => setNewLocRoom(e.target.value)}
                  placeholder="Ej: Aula 204"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#A3FF6F] text-[#0A0A10] font-bold hover:bg-[#A3FF6F]/90 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Guardar Lugar</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODULO 6: MODERACIÓN DE RESEÑAS */}
      {activeModule === 'valoraciones' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-white">Comentarios y Calificaciones</h2>
          <div className="space-y-3">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-xl bg-[#121020] border border-white/10 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{rev.studentName} ({rev.studentGrade})</span>
                    <span className="text-slate-500">· {rev.date}</span>
                    <span className="inline-flex items-center gap-1 text-amber-400 font-bold ml-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{rev.rating}.0</span>
                    </span>
                  </div>
                  <p className="text-slate-300">{rev.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULO 7: GESTIÓN DE SUPABASE & NUBE */}
      {activeModule === 'supabase' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-white">Configuración del Proyecto Supabase</h2>
              <p className="text-xs text-slate-400">
                Detalles del backend PostgreSQL, claves públicas de API y sincronización de datos.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ● Proyecto Conectado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm">Credenciales del Proyecto</h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-500 text-[10px] uppercase block">Project ID:</span>
                  <span className="text-emerald-400 font-bold text-sm">Hrarokygesqqgzlgheuq</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-500 text-[10px] uppercase block">Base API URL:</span>
                  <span className="text-white select-all break-all">{cleanSupabaseUrl}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-500 text-[10px] uppercase block">Public Publishable Key:</span>
                  <span className="text-slate-300 select-all break-all">sb_publishable_Gs2cyQDFxiumAb3siMYAqA_lFAixtCx</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    setTesting(true);
                    setTestResult(null);
                    const res = await testSupabaseConnection();
                    setTestResult(res);
                    setTesting(false);
                  }}
                  disabled={testing}
                  className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all flex items-center justify-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  <span>{testing ? 'Comprobando conexión...' : 'Testear Conexión con Supabase'}</span>
                </button>
              </div>

              {testResult && (
                <div className={`p-3.5 rounded-xl text-xs ${
                  testResult.connected && testResult.tablesReady
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                }`}>
                  <p className="font-semibold">{testResult.message}</p>
                  {testResult.error && (
                    <p className="text-[11px] text-amber-400 font-mono mt-1">{testResult.error}</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-sm">Poblado de Tablas y Migración SQL</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Si aún no has corrido el script en el <strong>SQL Editor</strong> de tu proyecto Supabase, ejecuta el archivo de migración que contiene el esquema relacional con extensiones UUID, prevención de dobles reservas y Row Level Security:
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="truncate">supabase/migrations/20261016_initial_schema.sql</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('supabase/migrations/20261016_initial_schema.sql');
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="ml-2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] shrink-0 flex items-center gap-1"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    setSeeding(true);
                    try {
                      const res = await dataService.seedSupabaseTables();
                      setNotice(`¡Sincronización completada! Se insertaron ${res.areas} áreas y ${res.locations} espacios en Supabase.`);
                    } catch (err) {
                      setNotice(`Aviso: ${err.message}. Asegúrate de haber ejecutado primero la migración SQL en Supabase.`);
                    }
                    setSeeding(false);
                    setTimeout(() => setNotice(''), 5000);
                  }}
                  disabled={seeding}
                  className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{seeding ? 'Sincronizando...' : 'Insertar 11 Áreas y Espacios en Supabase'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
