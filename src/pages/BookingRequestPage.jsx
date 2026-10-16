import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { demoStore } from '../services/demoStore.js';
import {
  validateEmail,
  isDateInPast,
  isSlotConflicting,
  formatCurrencyCOP
} from '../utils/bookingRules.ts';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function BookingRequestPage() {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const instructor = demoStore.getInstructorById(instructorId);

  // Form states
  const [studentName, setStudentName] = useState(currentUser?.fullName || '');
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || '');
  const [studentGrade, setStudentGrade] = useState(currentUser?.grade || '10° A');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [selectedMode, setSelectedMode] = useState('presencial');
  const [studentMessage, setStudentMessage] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Sync if user updates or loads
  useEffect(() => {
    if (currentUser) {
      if (!studentName) setStudentName(currentUser.fullName || '');
      if (!studentEmail) setStudentEmail(currentUser.email || '');
      if (currentUser.grade) setStudentGrade(currentUser.grade);
    }
  }, [currentUser]);

  // Set default topic and mode from instructor
  useEffect(() => {
    if (instructor) {
      if (instructor.topics?.length > 0 && !selectedTopic) {
        setSelectedTopic(instructor.topics[0].name);
      }
      if (instructor.mode === 'virtual') {
        setSelectedMode('virtual');
      } else if (instructor.mode === 'presencial') {
        setSelectedMode('presencial');
      }
      
      // Default to tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isoTomorrow = tomorrow.toISOString().split('T')[0];
      setBookingDate(isoTomorrow);
    }
  }, [instructor]);

  if (!instructor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Instructor no encontrado</h2>
        <p className="text-xs text-slate-400">Por favor regresa al catálogo de talentos para seleccionar un instructor.</p>
        <Link to="/talentos" className="inline-block text-xs text-[#00E5FF] underline">
          Ver talentos
        </Link>
      </div>
    );
  }

  // Get current date for min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  // Available times for the instructor
  const availableTimes = ['14:00', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

  const selectedTopicObj = instructor.topics.find(t => t.name === selectedTopic);
  const sessionPrice = selectedTopicObj?.priceCop || instructor.basePriceCop;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Validaciones requeridas
    if (!studentName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if (!validateEmail(studentEmail)) {
      setErrorMsg('Por favor ingresa un correo electrónico institucional válido (ej: nombre@bam.edu.co).');
      return;
    }

    if (!studentGrade.trim()) {
      setErrorMsg('Por favor especifica tu grado o curso.');
      return;
    }

    if (!selectedTopic) {
      setErrorMsg('Por favor selecciona el tema de la asesoría.');
      return;
    }

    if (!bookingDate) {
      setErrorMsg('Por favor selecciona la fecha de la asesoría.');
      return;
    }

    if (isDateInPast(bookingDate)) {
      setErrorMsg('No es posible seleccionar una fecha anterior a hoy.');
      return;
    }

    if (!bookingTime) {
      setErrorMsg('Por favor selecciona una hora para la sesión.');
      return;
    }

    // 2. Verificar disponibilidad real para evitar solapamientos
    const existingBookings = demoStore.getBookings().filter(b => b.instructorId === instructor.id);
    const hasConflict = isSlotConflicting(existingBookings, bookingDate, bookingTime, 60);

    if (hasConflict) {
      setErrorMsg(`El instructor ya tiene una reserva pendiente o confirmada el día ${bookingDate} a las ${bookingTime}. Por favor elige otro horario.`);
      return;
    }

    // 3. Proceso de envío
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        demoStore.createBooking({
          studentId: currentUser?.id || 'guest-' + Date.now(),
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim(),
          studentGrade: studentGrade.trim(),
          instructorId: instructor.id,
          instructorName: instructor.name,
          instructorAvatar: instructor.avatarUrl,
          areaSlug: instructor.areaSlug,
          areaName: instructor.areaName,
          topicName: selectedTopic,
          date: bookingDate,
          time: bookingTime,
          durationMinutes: 60,
          mode: selectedMode,
          locationName: selectedMode === 'presencial' ? instructor.locationName : 'Enlace Virtual (Google Meet)',
          priceCop: sessionPrice,
          studentMessage: studentMessage.trim()
        });

        setIsSubmitting(false);
        setIsSubmittedSuccess(true);
      } catch (err) {
        setIsSubmitting(false);
        setErrorMsg('Ocurrió un error al registrar la solicitud: ' + (err.message || 'Error desconocido'));
      }
    }, 600);
  };

  // Pantalla de confirmación visual
  if (isSubmittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-[#121020] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,229,255,0.4)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
              ¡Solicitud Enviada con Éxito!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              «Tu solicitud fue enviada correctamente. El instructor revisará tu solicitud y podrá aceptarla o rechazarla. Puedes consultar el estado en Mis reservas».
            </p>
          </div>

          {/* Resumen de la reserva recién enviada */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-left space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-400">Instructor:</span>
              <span className="font-semibold text-white">{instructor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tema:</span>
              <span className="font-semibold text-white">{selectedTopic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fecha y hora:</span>
              <span className="font-semibold text-white">{bookingDate} a las {bookingTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Modalidad:</span>
              <span className="font-semibold text-white capitalize">{selectedMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Lugar:</span>
              <span className="font-semibold text-white">
                {selectedMode === 'presencial' ? instructor.locationName : 'Google Meet (Virtual)'}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/10 font-mono">
              <span className="text-slate-400">Tarifa acordada:</span>
              <span className="font-bold text-[#A3FF6F]">{formatCurrencyCOP(sessionPrice)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate('/mis-reservas')}
              className="px-6 py-3 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              Consultar en Mis Reservas
            </button>
            <Link
              to="/talentos"
              className="px-6 py-3 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              Explorar otros talentos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Back button */}
      <Link
        to={`/talentos/${instructor.id}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#00E5FF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al perfil de {instructor.name}</span>
      </Link>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#00E5FF]/30 text-xs text-[#00E5FF] font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Formulario de Solicitud</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          Solicitar Asesoría
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Diligencia los datos para agendar tu sesión de aprendizaje personalizado. El instructor revisará la solicitud antes de ser confirmada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Resumen del Instructor (4 cols) */}
        <div className="lg:col-span-4 bg-[#121020] border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="font-display font-bold text-base text-white border-b border-white/5 pb-3">
            Instructor Seleccionado
          </h2>

          <div className="flex items-center gap-4">
            <img
              src={instructor.avatarUrl}
              alt={instructor.name}
              className="w-16 h-16 rounded-2xl object-cover border border-[#00E5FF]/40 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-white text-base truncate">{instructor.name}</h3>
              <p className="text-xs text-slate-400">{instructor.grade} · {instructor.areaName}</p>
              <p className="text-xs font-mono font-bold text-[#A3FF6F] mt-1 tabular-nums">
                {formatCurrencyCOP(sessionPrice)}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs border-t border-white/5">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">
                Modalidad disponible
              </span>
              <span className="text-slate-200 capitalize">
                {instructor.mode === 'ambas' ? 'Presencial y Virtual' : instructor.mode}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">
                Lugar de sesión presencial
              </span>
              <span className="text-slate-200">
                {instructor.locationName || 'Sala acordada en biblioteca'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">
                Duración de cada sesión
              </span>
              <span className="text-slate-200">60 minutos</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-normal">
            💡 <strong>Nota:</strong> Tu solicitud quedará en estado «Pendiente». Podrás cancelarla en cualquier momento desde tu panel de reservas.
          </div>
        </div>

        {/* Right Column: Formulario (8 cols) */}
        <div className="lg:col-span-8 bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8">
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Datos del Estudiante */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nombre completo <span className="text-[#FF4FD8]">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo electrónico institucional <span className="text-[#FF4FD8]">*</span>
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="estudiante@bam.edu.co"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Grado o curso <span className="text-[#FF4FD8]">*</span>
                </label>
                <input
                  type="text"
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  placeholder="Ej: 10° A, 11° B"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Área seleccionada
                </label>
                <input
                  type="text"
                  value={instructor.areaName}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Tema de la Asesoría */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tema de la asesoría <span className="text-[#FF4FD8]">*</span>
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                required
              >
                {instructor.topics.map((t) => (
                  <option key={t.id || t.name} value={t.name} className="bg-[#121020] text-white">
                    {t.name} — {formatCurrencyCOP(t.priceCop || instructor.basePriceCop)}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Fecha deseada <span className="text-[#FF4FD8]">*</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E5FF] cursor-pointer"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Hora de inicio <span className="text-[#FF4FD8]">*</span>
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                  required
                >
                  <option value="" disabled className="bg-[#121020] text-slate-400">
                    Selecciona una hora disponible
                  </option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time} className="bg-[#121020] text-white">
                      {time} hrs
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modalidad de Asesoría */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Modalidad preferida <span className="text-[#FF4FD8]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedMode('presencial')}
                  disabled={instructor.mode === 'virtual'}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    selectedMode === 'presencial'
                      ? 'bg-[#FF4FD8]/15 border-[#FF4FD8] text-white shadow-[0_0_15px_rgba(255,79,216,0.3)]'
                      : instructor.mode === 'virtual'
                      ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-500'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#FF4FD8]" />
                  <span>Presencial en Campus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('virtual')}
                  disabled={instructor.mode === 'presencial'}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    selectedMode === 'virtual'
                      ? 'bg-[#536DFF]/15 border-[#536DFF] text-white shadow-[0_0_15px_rgba(83,109,255,0.3)]'
                      : instructor.mode === 'presencial'
                      ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-500'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#536DFF]" />
                  <span>Virtual (Google Meet)</span>
                </button>
              </div>
            </div>

            {/* Mensaje opcional */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ¿Qué necesitas aprender o reforzar? (Opcional)
              </label>
              <textarea
                value={studentMessage}
                onChange={(e) => setStudentMessage(e.target.value)}
                rows={3}
                placeholder="Cuéntale al instructor sobre temas específicos, dudas de un taller, preparación de parciales o material que vas a llevar..."
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] leading-relaxed"
              />
            </div>

            {/* Botón de Enviar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-sm text-[#0A0A10] bg-[#00E5FF] hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando disponibilidad y enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitud de Asesoría</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
