import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { demoStore } from '../services/demoStore.js';
import { formatCurrencyCOP } from '../utils/bookingRules.ts';
import {
  Calendar,
  Clock,
  Check,
  X,
  Edit3,
  Plus,
  Trash2,
  Star,
  MapPin,
  Video,
  DollarSign,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function InstructorDashboardPage() {
  const { currentUser, role } = useAuth();
  const allInstructors = demoStore.getInstructors();
  const allBookings = demoStore.getBookings();
  const allReviews = demoStore.getReviews();

  // Find instructor profile (or Mateo Silva by default in demo mode)
  const instructor =
    allInstructors.find(i => i.userId === currentUser?.id || i.id === currentUser?.instructorId) ||
    allInstructors[0]; // Mateo Silva

  const [activeTab, setActiveTab] = useState('solicitudes'); // 'solicitudes' | 'proximas' | 'historial' | 'temas' | 'perfil' | 'disponibilidad'
  const [notice, setNotice] = useState('');

  // Perfil editable
  const [headline, setHeadline] = useState(instructor?.headline || '');
  const [biography, setBiography] = useState(instructor?.biography || '');
  const [basePrice, setBasePrice] = useState(instructor?.basePriceCop || 25000);
  const [selectedMode, setSelectedMode] = useState(instructor?.mode || 'ambas');
  const [locationName, setLocationName] = useState(instructor?.locationName || '');

  // Temas
  const [topics, setTopics] = useState(instructor?.topics || []);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicPrice, setNewTopicPrice] = useState('');

  // Reservas asociadas a este instructor
  const instructorBookings = allBookings.filter(b => b.instructorId === instructor.id);
  const pendingBookings = instructorBookings.filter(b => b.status === 'Pendiente');
  const upcomingBookings = instructorBookings.filter(b => b.status === 'Aceptada');
  const historyBookings = instructorBookings.filter(b => b.status === 'Completada' || b.status === 'Rechazada' || b.status === 'Cancelada');
  const instructorReviews = allReviews.filter(r => r.instructorId === instructor.id);

  const handleAcceptBooking = (bookingId) => {
    demoStore.updateBookingStatus(bookingId, 'Aceptada');
    setNotice('Solicitud aceptada. El estudiante verá el estado actualizado en Mis Reservas.');
    setTimeout(() => setNotice(''), 4000);
  };

  const handleRejectBooking = (bookingId) => {
    if (!confirm('¿Deseas rechazar esta solicitud de asesoría?')) return;
    demoStore.updateBookingStatus(bookingId, 'Rechazada');
    setNotice('Solicitud rechazada y horario liberado.');
    setTimeout(() => setNotice(''), 4000);
  };

  const handleCompleteBooking = (bookingId) => {
    demoStore.updateBookingStatus(bookingId, 'Completada');
    setNotice('Asesoría marcada como completada. El estudiante ahora podrá valorarla.');
    setTimeout(() => setNotice(''), 4000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    demoStore.updateInstructor({
      ...instructor,
      headline,
      biography,
      basePriceCop: Number(basePrice),
      mode: selectedMode,
      locationName
    });
    setNotice('Perfil público actualizado exitosamente.');
    setTimeout(() => setNotice(''), 4000);
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    const newTopic = {
      id: 'top-' + Date.now(),
      name: newTopicName.trim(),
      priceCop: Number(newTopicPrice) || Number(basePrice)
    };
    const updated = [...topics, newTopic];
    setTopics(updated);
    demoStore.updateInstructor({
      ...instructor,
      topics: updated
    });
    setNewTopicName('');
    setNewTopicPrice('');
    setNotice('Nuevo tema añadido a tu oferta educativa.');
    setTimeout(() => setNotice(''), 4000);
  };

  const handleDeleteTopic = (topicId) => {
    const updated = topics.filter(t => t.id !== topicId);
    setTopics(updated);
    demoStore.updateInstructor({
      ...instructor,
      topics: updated
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-semibold text-[#A3FF6F] uppercase tracking-widest">
            Panel de Gestión de Instructor
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mt-1">
            Gestión de Asesorías: {instructor.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Área: <strong className="text-white">{instructor.areaName}</strong> · Grado {instructor.grade} · Calificación {instructor.ratingAverage} / 5.0
          </p>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
            <span className="font-mono font-bold">{pendingBookings.length}</span> pendientes
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] text-xs">
            <span className="font-mono font-bold">{upcomingBookings.length}</span> agendadas
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {[
          { id: 'solicitudes', label: `Solicitudes pendientes (${pendingBookings.length})` },
          { id: 'proximas', label: `Próximas asesorías (${upcomingBookings.length})` },
          { id: 'historial', label: `Historial (${historyBookings.length})` },
          { id: 'temas', label: 'Temas y Tarifas' },
          { id: 'perfil', label: 'Editar Perfil Público' },
          { id: 'resenas', label: `Valoraciones (${instructorReviews.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#A3FF6F] text-[#0A0A10] shadow-[0_0_15px_rgba(163,255,111,0.3)]'
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Solicitudes pendientes */}
      {activeTab === 'solicitudes' && (
        <div className="space-y-4">
          {pendingBookings.length === 0 ? (
            <div className="text-center py-16 bg-[#121020] rounded-2xl border border-white/5 p-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-200 font-semibold text-sm">No tienes solicitudes pendientes por responder</p>
              <p className="text-xs text-slate-400 mt-1">Cuando los estudiantes agenden una sesión en tu perfil aparecerá aquí.</p>
            </div>
          ) : (
            pendingBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-[#121020] border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                      Nueva Solicitud
                    </span>
                    <span className="text-xs text-slate-400">{booking.date} · {booking.time} hrs</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white">
                    {booking.topicName}
                  </h3>

                  <p className="text-xs text-slate-300">
                    Estudiante: <strong className="text-white">{booking.studentName}</strong> ({booking.studentGrade}) · {booking.studentEmail}
                  </p>

                  <p className="text-xs text-slate-400">
                    Modalidad: <span className="capitalize text-slate-300">{booking.mode}</span> · Tarifa: <strong className="text-[#A3FF6F] font-mono">{formatCurrencyCOP(booking.priceCop)}</strong>
                  </p>

                  {booking.studentMessage && (
                    <div className="p-3 rounded-xl bg-white/[0.03] text-xs text-slate-300 italic border border-white/5">
                      "{booking.studentMessage}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleRejectBooking(booking.id)}
                    className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    <span>Rechazar</span>
                  </button>

                  <button
                    onClick={() => handleAcceptBooking(booking.id)}
                    className="px-5 py-2 rounded-xl bg-[#00E5FF] text-[#0A0A10] hover:bg-[#00E5FF]/90 text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aceptar Asesoría</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Próximas Asesorías */}
      {activeTab === 'proximas' && (
        <div className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-16 bg-[#121020] rounded-2xl border border-white/5 p-8">
              <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-200 font-semibold text-sm">No hay asesorías agendadas próximamente</p>
            </div>
          ) : (
            upcomingBookings.map(booking => (
              <div
                key={booking.id}
                className="bg-[#121020] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-bold uppercase">
                      Confirmada
                    </span>
                    <span className="text-xs font-semibold text-white">{booking.date} a las {booking.time} hrs</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white">{booking.topicName}</h3>
                  <p className="text-xs text-slate-300">
                    Estudiante: {booking.studentName} ({booking.studentEmail})
                  </p>
                  <p className="text-xs text-slate-400">
                    Lugar: {booking.locationName} · {formatCurrencyCOP(booking.priceCop)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCompleteBooking(booking.id)}
                    className="px-4 py-2 rounded-xl bg-[#A3FF6F] text-[#0A0A10] font-bold text-xs hover:bg-[#A3FF6F]/90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(163,255,111,0.3)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Marcar como Completada</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Historial */}
      {activeTab === 'historial' && (
        <div className="space-y-3">
          {historyBookings.length === 0 ? (
            <div className="text-center py-16 bg-[#121020] rounded-2xl border border-white/5 p-8 text-xs text-slate-400">
              Aún no hay historial de asesorías completadas o canceladas.
            </div>
          ) : (
            historyBookings.map(booking => (
              <div key={booking.id} className="p-4 rounded-xl bg-[#121020] border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{booking.topicName}</span>
                  <span className="text-slate-400 block">{booking.studentName} · {booking.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#A3FF6F]">{formatCurrencyCOP(booking.priceCop)}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    booking.status === 'Completada' ? 'bg-[#A3FF6F]/20 text-[#A3FF6F]' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Temas y Tarifas */}
      {activeTab === 'temas' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-white">Temas que Enseñas</h3>
            <div className="space-y-2">
              {topics.map(t => (
                <div key={t.id || t.name} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{t.name}</span>
                    <span className="text-[#A3FF6F] block font-mono font-bold mt-0.5">
                      {formatCurrencyCOP(t.priceCop || basePrice)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTopic(t.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                    title="Eliminar tema"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-white">Añadir Nuevo Tema</h3>
            <form onSubmit={handleAddTopic} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nombre del tema</label>
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Ej: Álgebra lineal, Taller de acuarela"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tarifa sugerida (COP)</label>
                <input
                  type="number"
                  step="1000"
                  value={newTopicPrice}
                  onChange={(e) => setNewTopicPrice(e.target.value)}
                  placeholder="Ej: 25000"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar tema</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: Editar Perfil Público */}
      {activeTab === 'perfil' && (
        <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-3xl">
          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Titular breve (Headline)</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Biografía y Metodología</label>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                rows={5}
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF] leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Precio base por sesión (COP)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Modalidad de Asesoría</label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                >
                  <option value="ambas" className="bg-[#121020]">Presencial y Virtual</option>
                  <option value="presencial" className="bg-[#121020]">Solo Presencial</option>
                  <option value="virtual" className="bg-[#121020]">Solo Virtual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Lugar de asesorías presenciales</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Ej: MakerSpace & Laboratorio de Robótica (Sala T-204)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              Guardar Cambios de Perfil
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: Valoraciones recibidas */}
      {activeTab === 'resenas' && (
        <div className="space-y-4">
          {instructorReviews.length === 0 ? (
            <div className="text-center py-16 bg-[#121020] rounded-2xl border border-white/5 p-8 text-xs text-slate-400">
              Aún no tienes opiniones registradas de estudiantes.
            </div>
          ) : (
            instructorReviews.map(r => (
              <div key={r.id} className="p-5 rounded-2xl bg-[#121020] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{r.studentName} ({r.studentGrade})</span>
                  <div className="flex items-center text-amber-400 gap-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono font-bold">{r.rating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>
                <p className="text-[10px] text-slate-500 font-mono">{r.date}</p>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
