import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { demoStore } from '../services/demoStore.js';
import { formatCurrencyCOP } from '../utils/bookingRules.ts';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Star,
  Sparkles,
  RotateCcw,
  MessageSquare
} from 'lucide-react';

export default function MyBookingsPage() {
  const { currentUser } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('todas');
  const [reviewModalBooking, setReviewModalBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  // Cargar reservas
  const allBookings = demoStore.getBookings();
  const allReviews = demoStore.getReviews();

  // En modo demo o real, si hay usuario conectado filtramos por su ID/email, o mostramos sus reservas
  const myBookings = allBookings.filter(b => {
    if (!currentUser) return true;
    if (b.studentId === currentUser.id || b.studentEmail === currentUser.email) return true;
    // Si es demo y el usuario es Camila Torres, incluir las de Camila
    if (currentUser.fullName === 'Camila Torres' && (b.studentName === 'Camila Torres' || b.studentId === 'user-camila')) {
      return true;
    }
    return false;
  });

  const filteredBookings = myBookings.filter(b => {
    if (selectedStatus === 'todas') return true;
    return b.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  const handleCancelBooking = (bookingId) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta solicitud de asesoría?')) return;
    demoStore.updateBookingStatus(bookingId, 'Cancelada');
    setActionNotice('La asesoría ha sido cancelada correctamente.');
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleOpenReviewModal = (booking) => {
    setReviewModalBooking(booking);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewModalBooking) return;

    demoStore.createReview({
      bookingId: reviewModalBooking.id,
      instructorId: reviewModalBooking.instructorId,
      studentName: currentUser?.fullName || reviewModalBooking.studentName,
      studentGrade: currentUser?.grade || reviewModalBooking.studentGrade,
      rating: Number(reviewRating),
      comment: reviewComment.trim()
    });

    setReviewModalBooking(null);
    setActionNotice('¡Gracias por tu valoración! Ha sido registrada y sumada al perfil del instructor.');
    setTimeout(() => setActionNotice(''), 4000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendiente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Pendiente
          </span>
        );
      case 'Aceptada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Aceptada
          </span>
        );
      case 'Completada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#A3FF6F]/15 text-[#A3FF6F] border border-[#A3FF6F]/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completada
          </span>
        );
      case 'Cancelada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Cancelada
          </span>
        );
      case 'Rechazada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Rechazada
          </span>
        );
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#FF4FD8]/30 text-xs text-[#FF4FD8] font-medium tracking-wide mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Gestión Personal de Aprendizaje</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
            Mis Reservas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Consulta el estado de tus solicitudes, horarios acordados y califica asesorías completadas.
          </p>
        </div>

        <Link
          to="/talentos"
          className="px-4 py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] shrink-0"
        >
          Solicitar nueva asesoría
        </Link>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {[
          { id: 'todas', label: 'Todas las solicitudes' },
          { id: 'pendiente', label: 'Pendientes' },
          { id: 'aceptada', label: 'Aceptadas' },
          { id: 'completada', label: 'Completadas' },
          { id: 'cancelada', label: 'Canceladas' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedStatus === tab.id
                ? 'bg-white text-slate-950 font-bold'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List of Bookings */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-[#121020] rounded-3xl border border-white/10 p-8 space-y-4">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-display font-bold text-lg text-white">No hay reservas en esta categoría</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {selectedStatus === 'todas'
              ? 'Aún no has solicitado asesorías. Explora los perfiles de los instructores para agendar una sesión.'
              : `No tienes reservas con estado "${selectedStatus}".`}
          </p>
          <Link
            to="/talentos"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs"
          >
            Explorar catálogo de instructores
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => {
            const hasReview = allReviews.some(r => r.bookingId === booking.id);

            return (
              <div
                key={booking.id}
                className="bg-[#121020] border border-white/10 rounded-2xl p-6 transition-all hover:border-white/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Instructor info & topic */}
                <div className="flex items-start gap-4">
                  <img
                    src={booking.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={booking.instructorName}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#00E5FF]/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#00E5FF] uppercase tracking-wider">
                        {booking.areaName}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">ID #{booking.id.slice(-6)}</span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-white truncate">
                      {booking.topicName}
                    </h3>

                    <p className="text-xs text-slate-300">
                      Instructor: <strong className="text-white">{booking.instructorName}</strong>
                    </p>

                    {booking.studentMessage && (
                      <p className="text-xs text-slate-400 italic pt-1 line-clamp-1">
                        "{booking.studentMessage}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle: Date, Time, Mode & Location */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 text-xs py-3 lg:py-0 border-y lg:border-y-0 border-white/5">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Fecha y Hora</span>
                    <span className="font-semibold text-white">{booking.date}</span>
                    <span className="text-slate-400 block font-mono">{booking.time} hrs</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Modalidad</span>
                    <span className="font-semibold text-white capitalize">{booking.mode}</span>
                    <span className="text-slate-400 block truncate max-w-[150px]">{booking.locationName}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Tarifa acordada</span>
                    <span className="font-mono font-bold text-[#A3FF6F] text-sm tabular-nums">
                      {formatCurrencyCOP(booking.priceCop)}
                    </span>
                  </div>
                </div>

                {/* Right: Status badge & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                  {getStatusBadge(booking.status)}

                  <div className="flex items-center gap-2">
                    {/* Botón de Cancelar si está pendiente o aceptada */}
                    {(booking.status === 'Pendiente' || booking.status === 'Aceptada') && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}

                    {/* Botón de Valorar si está completada */}
                    {booking.status === 'Completada' && (
                      hasReview ? (
                        <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Valorada
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenReviewModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400 hover:text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Valorar Asesoría
                        </button>
                      )
                    )}

                    <Link
                      to={`/talentos/${booking.instructorId}`}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Perfil del instructor
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE VALORACIÓN (Review Modal) */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setReviewModalBooking(null)}
          />

          <div className="relative w-full max-w-lg bg-[#141224] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 z-10 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs uppercase font-semibold text-[#00E5FF] tracking-wider">
                Valorar Asesoría Completada
              </span>
              <h3 className="font-display font-bold text-xl text-white">
                ¿Cómo estuvo tu sesión con {reviewModalBooking.instructorName}?
              </h3>
              <p className="text-xs text-slate-400">
                Tema: {reviewModalBooking.topicName} ({reviewModalBooking.date})
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Calificación general (1 a 5 estrellas)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                      aria-label={`${star} estrellas`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating ? 'text-amber-400 fill-current' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-amber-400 ml-2 font-mono">
                    {reviewRating} de 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Comentario u opinión para tus compañeros (Opcional)
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  placeholder="Explica qué tal te pareció la metodología, claridad y paciencia del instructor..."
                  className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalBooking(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                >
                  Publicar Valoración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
