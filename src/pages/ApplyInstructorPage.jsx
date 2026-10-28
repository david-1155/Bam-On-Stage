import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { demoStore } from '../services/demoStore.js';
import { formatCurrencyCOP } from '../utils/bookingRules.ts';
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Video,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react';

const WEEKDAYS = [
  { day: 'Lunes', dayIndex: 1 },
  { day: 'Martes', dayIndex: 2 },
  { day: 'Miércoles', dayIndex: 3 },
  { day: 'Jueves', dayIndex: 4 },
  { day: 'Viernes', dayIndex: 5 },
  { day: 'Sábado', dayIndex: 6 }
];

const DEFAULT_HOURS = ['14:00', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

export default function ApplyInstructorPage() {
  const navigate = useNavigate();
  const { currentUser, updateRole } = useAuth();
  const allAreas = demoStore.getAreas();

  // Form states
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [grade, setGrade] = useState(currentUser?.grade || '11° A');
  const [phone, setPhone] = useState('310 987 6543');
  
  // Area selection
  const [selectedAreaSlug, setSelectedAreaSlug] = useState('tecnologia-programacion');
  
  // Headline & Biography
  const [headline, setHeadline] = useState('Apasionado por compartir conocimientos y apoyar a mis compañeros');
  const [biography, setBiography] = useState('Me encanta explicar conceptos paso a paso de forma visual y con ejemplos cotidianos. Mi objetivo es que comprendas la materia a fondo sin estrés.');
  
  // Modality & Location
  const [selectedMode, setSelectedMode] = useState('ambas'); // 'presencial', 'virtual', 'ambas'
  const [locationName, setLocationName] = useState('Biblioteca Central - Módulo Silencioso');
  const [basePriceCop, setBasePriceCop] = useState(25000);

  // Topics with prices
  const [topics, setTopics] = useState([
    { id: 't-1', name: 'Refuerzo de conceptos básicos y resolución de dudas', priceCop: 22000 },
    { id: 't-2', name: 'Preparación para parciales y talleres evaluativos', priceCop: 25000 },
    { id: 't-3', name: 'Ejercicios avanzados y proyectos prácticos', priceCop: 28000 }
  ]);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicPrice, setNewTopicPrice] = useState('25000');

  // Availability schedule
  const [selectedDays, setSelectedDays] = useState(['Lunes', 'Miércoles', 'Viernes']);
  const [dayTimes, setDayTimes] = useState({
    Lunes: ['15:30', '16:30'],
    Martes: ['16:00'],
    Miércoles: ['15:30', '16:30'],
    Jueves: ['16:00'],
    Viernes: ['14:00', '15:00'],
    Sábado: ['09:00', '10:00']
  });

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [createdProfile, setCreatedProfile] = useState(null);

  // Sync auth
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.fullName || '');
      if (!email) setEmail(currentUser.email || '');
      if (currentUser.grade) setGrade(currentUser.grade);
    }
  }, [currentUser]);

  // Adjust default topics when area changes
  const handleSelectArea = (areaSlug) => {
    setSelectedAreaSlug(areaSlug);
    const chosenArea = allAreas.find(a => a.slug === areaSlug);
    if (chosenArea) {
      setTopics([
        { id: 't-1', name: `Fundamentos y conceptos clave de ${chosenArea.name}`, priceCop: 22000 },
        { id: 't-2', name: `Preparación de parciales y tareas de ${chosenArea.name}`, priceCop: 25000 },
        { id: 't-3', name: `Nivel avanzado y retos prácticos en ${chosenArea.name}`, priceCop: 28000 }
      ]);
    }
  };

  const handleToggleDay = (dayName) => {
    if (selectedDays.includes(dayName)) {
      if (selectedDays.length === 1) {
        alert('Debes mantener al menos un día disponible para que los estudiantes puedan agendarte.');
        return;
      }
      setSelectedDays(selectedDays.filter(d => d !== dayName));
    } else {
      setSelectedDays([...selectedDays, dayName]);
    }
  };

  const handleToggleTimeForDay = (dayName, time) => {
    const currentTimes = dayTimes[dayName] || [];
    let updated;
    if (currentTimes.includes(time)) {
      if (currentTimes.length === 1) {
        alert(`Debes dejar al menos una hora disponible para el ${dayName}.`);
        return;
      }
      updated = currentTimes.filter(t => t !== time);
    } else {
      updated = [...currentTimes, time].sort();
    }
    setDayTimes({ ...dayTimes, [dayName]: updated });
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    const priceNum = Number(newTopicPrice) || basePriceCop;
    setTopics([...topics, { id: 'top-' + Date.now(), name: newTopicName.trim(), priceCop: priceNum }]);
    setNewTopicName('');
    setNewTopicPrice(String(basePriceCop));
  };

  const handleRemoveTopic = (id) => {
    if (topics.length <= 1) {
      alert('Debes incluir al menos un tema que ofrezcas en tu asesoría.');
      return;
    }
    setTopics(topics.filter(t => t.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Por favor indica tu nombre completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor indica un correo institucional válido.');
      return;
    }
    if (!grade.trim()) {
      setErrorMsg('Por favor especifica tu grado o curso escolar.');
      return;
    }
    if (!selectedAreaSlug) {
      setErrorMsg('Por favor selecciona el área en la que deseas dar refuerzos.');
      return;
    }
    if (topics.length === 0) {
      setErrorMsg('Por favor añade al menos un tema de refuerzo.');
      return;
    }
    if (selectedDays.length === 0) {
      setErrorMsg('Por favor selecciona al menos un día de la semana con disponibilidad.');
      return;
    }

    const chosenArea = allAreas.find(a => a.slug === selectedAreaSlug) || allAreas[0];

    // Build structured availability schedule
    const availabilitySchedule = selectedDays.map(dayName => {
      const dayInfo = WEEKDAYS.find(w => w.day === dayName);
      return {
        day: dayName,
        dayIndex: dayInfo?.dayIndex ?? 1,
        times: dayTimes[dayName] && dayTimes[dayName].length > 0 ? dayTimes[dayName] : ['15:30', '16:30']
      };
    });

    try {
      const result = demoStore.createInstructorApplication({
        userId: currentUser?.id,
        fullName: fullName.trim(),
        email: email.trim(),
        grade: grade.trim(),
        phone: phone.trim(),
        areaSlug: chosenArea.slug,
        areaName: chosenArea.name,
        headline: headline.trim(),
        biography: biography.trim(),
        mode: selectedMode,
        locationName: selectedMode !== 'virtual' ? locationName.trim() : 'Google Meet (Virtual)',
        basePriceCop: Number(basePriceCop),
        topics: topics,
        availabilitySchedule
      });

      // Update auth role if logged in as student to grant instructor privileges
      if (currentUser && currentUser.role === 'estudiante') {
        updateRole('instructor');
      }

      setCreatedProfile(result.instructor);
    } catch (err) {
      setErrorMsg('Error al registrar la postulación: ' + (err.message || 'Error desconocido'));
    }
  };

  // SUCCESS SCREEN
  if (createdProfile) {
    const chosenArea = allAreas.find(a => a.slug === createdProfile.areaSlug);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="bg-[#121020] border border-[#A3FF6F]/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-[0_0_35px_rgba(163,255,111,0.15)]">
          <div className="w-16 h-16 rounded-full bg-[#A3FF6F]/20 border border-[#A3FF6F]/50 text-[#A3FF6F] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(163,255,111,0.4)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase font-bold text-[#A3FF6F] tracking-widest">
              ¡Bienvenido al Escenario BAM!
            </span>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
              ¡Tu Inscripción ha Sido Aprobada!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Felicitaciones, <strong>{createdProfile.name}</strong>. Ya estás registrado como instructor estudiantil de refuerzos en <strong>{createdProfile.areaName}</strong>. Tus compañeros ya pueden encontrarte y solicitar asesorías con tus horarios y tarifas estipuladas.
            </p>
          </div>

          {/* Resumen del perfil registrado */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-left space-y-4 max-w-lg mx-auto text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] flex items-center justify-center font-bold">
                {createdProfile.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{createdProfile.name}</p>
                <p className="text-slate-400">{createdProfile.grade} · {createdProfile.areaName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Modalidad</span>
                <span className="text-slate-200 capitalize font-medium">{createdProfile.mode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Tarifa base</span>
                <span className="text-[#A3FF6F] font-mono font-bold">{formatCurrencyCOP(createdProfile.basePriceCop)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase">Días estipulados</span>
                <span className="text-slate-200">
                  {createdProfile.availabilitySchedule?.map(s => `${s.day} (${s.times.join(', ')})`).join(' · ')}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase">Temas ofrecidos</span>
                <span className="text-slate-200">
                  {createdProfile.topics?.map(t => `${t.name} (${formatCurrencyCOP(t.priceCop)})`).join(' · ')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/instructor"
              className="px-6 py-3 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
            >
              <span>Ir a mi Panel de Instructor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={`/talentos/${createdProfile.id}`}
              className="px-6 py-3 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              Ver mi Perfil Público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedAreaObj = allAreas.find(a => a.slug === selectedAreaSlug) || allAreas[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A3FF6F]/10 border border-[#A3FF6F]/30 text-xs text-[#A3FF6F] font-medium tracking-wide">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Conviértete en Instructor Estudiantil</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
          Inscríbete para Dar Refuerzos
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          «Comparte tu talento, enseña a tus compañeros y genera ingresos en BAM ON STAGE». Elige tu área de especialidad, estipula tus horarios y define tus propias tarifas en pesos colombianos.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* PASO 1: Datos Personales del Estudiante */}
        <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <span className="text-[11px] font-bold text-[#00E5FF] uppercase tracking-wider">Paso 1 de 5</span>
            <h2 className="font-display font-bold text-lg text-white mt-0.5">Tus Datos de Estudiante</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Nombre completo <span className="text-[#FF4FD8]">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Camila Torres, Mateo Silva"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Correo institucional <span className="text-[#FF4FD8]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="estudiante@bam.edu.co"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Grado o curso <span className="text-[#FF4FD8]">*</span>
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Ej: 10° B, 11° A"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Teléfono de contacto (WhatsApp)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="310 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          </div>
        </div>

        {/* PASO 2: Selección del Área donde darás Refuerzos (Requerimiento Clave) */}
        <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <span className="text-[11px] font-bold text-[#FF4FD8] uppercase tracking-wider">Paso 2 de 5</span>
            <h2 className="font-display font-bold text-lg text-white mt-0.5">
              ¿En qué área quieres dar refuerzos? <span className="text-[#FF4FD8]">*</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Selecciona una de las 11 áreas oficiales de BAM ON STAGE donde compartirás tus habilidades y apoyarás a otros estudiantes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allAreas.map(area => {
              const isSelected = selectedAreaSlug === area.slug;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => handleSelectArea(area.slug)}
                  className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-white/10 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.3)] scale-[1.02]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: area.neonColor, boxShadow: isSelected ? `0 0 10px ${area.neonColor}` : 'none' }}
                    />
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold text-[#00E5FF] px-1.5 py-0.5 rounded bg-[#00E5FF]/20">
                        Elegida
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xs text-white leading-snug">{area.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{area.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-[#A3FF6F] shrink-0" />
            <span>
              Área seleccionada: <strong className="text-white">{selectedAreaObj.name}</strong>. Podrás impartir asesorías presenciales en el campus o virtuales.
            </span>
          </div>
        </div>

        {/* PASO 3: Temas que Enseñarás y Tarifas Estipuladas */}
        <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <span className="text-[11px] font-bold text-[#A3FF6F] uppercase tracking-wider">Paso 3 de 5</span>
            <h2 className="font-display font-bold text-lg text-white mt-0.5">
              Temas que Enseñarás y Tarifas por Sesión (COP)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Estipula el valor en pesos colombianos para cada temática. Los estudiantes solo podrán reservar sobre estos temas y valores.
            </p>
          </div>

          <div className="space-y-3">
            {topics.map((t, idx) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex-1">
                  <span className="text-slate-400 font-mono text-[10px] block">Tema #{idx + 1}</span>
                  <span className="font-semibold text-white text-xs">{t.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">Tarifa:</span>
                    <input
                      type="number"
                      step="1000"
                      value={t.priceCop}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTopics(topics.map(item => item.id === t.id ? { ...item, priceCop: val } : item));
                      }}
                      className="w-28 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[#A3FF6F] font-mono font-bold text-xs focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(t.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                    title="Quitar tema"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario rápido para agregar otro tema */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
            <span className="font-bold text-white block">Añadir otro tema específico</span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Ej: Álgebra lineal, Taller de ensayos, Sintaxis de JavaScript"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
              <div className="sm:col-span-4 flex gap-2">
                <input
                  type="number"
                  step="1000"
                  value={newTopicPrice}
                  onChange={(e) => setNewTopicPrice(e.target.value)}
                  placeholder="25000"
                  className="w-28 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-[#A3FF6F] font-mono font-bold focus:outline-none focus:border-[#00E5FF]"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-3 py-2 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold shrink-0 hover:bg-[#00E5FF]/90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 4: Disponibilidad Estipulada y Modalidad */}
        <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <span className="text-[11px] font-bold text-[#536DFF] uppercase tracking-wider">Paso 4 de 5</span>
            <h2 className="font-display font-bold text-lg text-white mt-0.5">
              Días y Horarios Estipulados de Disponibilidad
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Selecciona únicamente los días de la semana y las horas en que atenderás asesorías. Así el estudiante solo podrá agendar en tus franjas autorizadas.
            </p>
          </div>

          {/* Días activos */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Días de la semana disponibles <span className="text-[#FF4FD8]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {WEEKDAYS.map(w => {
                const isActive = selectedDays.includes(w.day);
                return (
                  <button
                    key={w.day}
                    type="button"
                    onClick={() => handleToggleDay(w.day)}
                    className={`p-3 rounded-xl text-center text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-white shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span>{w.day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horas estipuladas por cada día seleccionado */}
          <div className="space-y-4 pt-2 border-t border-white/5">
            <label className="block text-xs font-semibold text-slate-300">
              Horarios estipulados para cada día habilitado
            </label>
            <div className="space-y-3">
              {selectedDays.map(dayName => (
                <div key={dayName} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{dayName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(dayTimes[dayName] || []).length} horas fijadas
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {DEFAULT_HOURS.map(hour => {
                      const isTimeActive = (dayTimes[dayName] || []).includes(hour);
                      return (
                        <button
                          key={hour}
                          type="button"
                          onClick={() => handleToggleTimeForDay(dayName, hour)}
                          className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all border ${
                            isTimeActive
                              ? 'bg-[#A3FF6F]/20 border-[#A3FF6F] text-[#A3FF6F]'
                              : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                          }`}
                        >
                          {hour}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modalidad y Lugar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-white/5">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Modalidad de Asesoría</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
              >
                <option value="ambas" className="bg-[#121020]">Presencial y Virtual</option>
                <option value="presencial" className="bg-[#121020]">Solo Presencial</option>
                <option value="virtual" className="bg-[#121020]">Solo Virtual (Meet)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Lugar presencial propuesto</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Ej: MakerSpace, Biblioteca Central, Lab de Ciencias"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          </div>
        </div>

        {/* PASO 5: Propuesta, Headline y Metodología */}
        <div className="bg-[#121020] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/5 pb-3">
            <span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">Paso 5 de 5</span>
            <h2 className="font-display font-bold text-lg text-white mt-0.5">Tu Propuesta y Metodología</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Titular breve (Headline) <span className="text-[#FF4FD8]">*</span>
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ej: Experto en derivadas y física mecánica con método práctico"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Biografía y Metodología de Refuerzo <span className="text-[#FF4FD8]">*</span>
              </label>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                rows={4}
                placeholder="Cuéntale a tus compañeros cómo abordas las dudas, tu experiencia en la materia y por qué tus explicaciones funcionan..."
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF] leading-relaxed"
                required
              />
            </div>
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-xs text-slate-400">
            Al registrarte aceptas los lineamientos pedagógicos y de convivencia institucional de <strong>BAM ON STAGE</strong>.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-black text-sm text-[#0A0A10] bg-[#00E5FF] hover:bg-[#00E5FF]/90 transition-all duration-200 shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Enviar Solicitud e Inscribirme</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
}
