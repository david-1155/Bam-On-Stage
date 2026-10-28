import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { dataService } from '../services/dataService.js';
import {
  CheckSquare,
  Square,
  Plus,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Layers,
  ArrowRight,
  X,
  Tag,
  BookOpen
} from 'lucide-react';

export default function TasksPage() {
  const { currentUser, role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [statusFilter, setStatusFilter] = useState('todas'); // 'todas', 'pendientes', 'completadas'
  const [areaFilter, setAreaFilter] = useState('todas');
  const [priorityFilter, setPriorityFilter] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal para agregar tarea
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAreaSlug, setNewAreaSlug] = useState('matematicas');
  const [newPriority, setNewPriority] = useState('media');
  const [newDueDate, setNewDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [newAssignorType, setNewAssignorType] = useState('personal'); // 'personal', 'instructor'
  const [newInstructorName, setNewInstructorName] = useState('');
  const [newResourceLink, setNewResourceLink] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [loadedTasks, loadedAreas] = await Promise.all([
          dataService.getTasks(),
          dataService.getAreas()
        ]);
        setTasks(loadedTasks);
        setAreas(loadedAreas);
      } catch (err) {
        console.error('Error cargando datos de tareas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleToggleCompleted = async (taskId) => {
    const updated = await dataService.toggleTask(taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    showNotice(updated.completed ? '¡Tarea completada! Buen trabajo 🎯' : 'Tarea marcada como pendiente.');
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('¿Eliminar esta tarea de tu lista?')) {
      await dataService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      showNotice('Tarea eliminada correctamente.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedArea = areas.find(a => a.slug === newAreaSlug);
    const assignedBy = newAssignorType === 'instructor' && newInstructorName.trim()
      ? `${newInstructorName.trim()} (Instructor)`
      : 'Personal (Meta propia)';

    const taskPayload = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      areaSlug: newAreaSlug,
      areaName: selectedArea?.name || 'General',
      priority: newPriority,
      dueDate: newDueDate,
      assignedBy,
      resourceLink: newResourceLink.trim() || null,
      assignedToUserId: currentUser?.id || 'student-1'
    };

    const created = await dataService.createTask(taskPayload);
    setTasks(prev => [created, ...prev]);

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewPriority('media');
    setNewResourceLink('');
    setNewInstructorName('');
    setIsModalOpen(false);
    showNotice('¡Nueva tarea agregada exitosamente! ✨');
  };

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  // Cálculo de estadísticas
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityCount = tasks.filter(t => !t.completed && t.priority === 'alta').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtrado reactivo
  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'pendientes' && task.completed) return false;
    if (statusFilter === 'completadas' && !task.completed) return false;
    if (areaFilter !== 'todas' && task.areaSlug !== areaFilter) return false;
    if (priorityFilter !== 'todas' && task.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchArea = task.areaName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchArea) return false;
    }
    return true;
  });

  const getDaysRemaining = (dueDateStr) => {
    if (!dueDateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr + 'T00:00:00');
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Toast Notification */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#191329] border border-[#00E5FF]/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-3">
          <Sparkles className="w-4 h-4 text-[#00E5FF]" />
          <span>{notice}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold mb-3">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Gestión Académica</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Tareas y Metas de Aprendizaje
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Registra y haz seguimiento a los compromisos prácticos acordados en tus asesorías, entregas de proyectos y metas personales de estudio.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start md:self-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#536DFF] to-[#FF4FD8] text-white font-bold text-sm hover:opacity-95 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Agregar Tarea</span>
        </button>
      </div>

      {/* MÉTRICAS & PROGRESO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#141224] border border-white/10 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Total de Tareas</span>
          <p className="font-display font-black text-3xl text-white">{totalCount}</p>
          <p className="text-[11px] text-slate-500">Asignadas o registradas</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141224] border border-[#00E5FF]/30 space-y-2">
          <span className="text-xs text-[#00E5FF] font-medium">Pendientes por Entregar</span>
          <p className="font-display font-black text-3xl text-[#00E5FF]">{pendingCount}</p>
          <p className="text-[11px] text-slate-400">Requieren tu atención</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141224] border border-[#A3FF6F]/30 space-y-2">
          <span className="text-xs text-[#A3FF6F] font-medium">Tareas Completadas</span>
          <div className="flex items-baseline gap-2">
            <p className="font-display font-black text-3xl text-[#A3FF6F]">{completedCount}</p>
            <span className="text-xs text-slate-400">({progressPercent}%)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00E5FF] to-[#A3FF6F] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#141224] border border-[#FF4FD8]/30 space-y-2">
          <span className="text-xs text-[#FF4FD8] font-medium">Urgentes / Alta Prioridad</span>
          <p className="font-display font-black text-3xl text-[#FF4FD8]">{highPriorityCount}</p>
          <p className="text-[11px] text-slate-400">Próximas a fecha límite</p>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="p-4 rounded-2xl bg-[#121020] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Filtros de estado (Pills) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setStatusFilter('todas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'todas'
                ? 'bg-white text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('pendientes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'pendientes'
                ? 'bg-[#00E5FF] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('completadas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'completadas'
                ? 'bg-[#A3FF6F] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completadas ({completedCount})
          </button>
        </div>

        {/* Búsqueda y Selectores */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 md:justify-end">
          {/* Buscador */}
          <div className="relative flex-1 sm:w-64 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tareas..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          {/* Filtro por Área */}
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#141224] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="todas">Todas las áreas</option>
            {areas.map(a => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </select>

          {/* Filtro por Prioridad */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#141224] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="todas">Cualquier prioridad</option>
            <option value="alta">Prioridad Alta</option>
            <option value="media">Prioridad Media</option>
            <option value="baja">Prioridad Baja</option>
          </select>
        </div>
      </div>

      {/* LISTA DE TARJETAS DE TAREAS */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Cargando tareas y asignaciones...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-white/10 bg-[#121020] p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 mx-auto flex items-center justify-center text-[#00E5FF]">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-white">No hay tareas con estos filtros</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {searchQuery || areaFilter !== 'todas' || priorityFilter !== 'todas' || statusFilter !== 'todas'
                ? 'Intenta restablecer tus filtros de búsqueda para ver más resultados.'
                : 'Empieza agregando tu primer compromiso académico o tarea de asesoría.'}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#00E5FF] text-slate-950 font-bold text-xs hover:bg-[#00E5FF]/90 transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Tarea Ahora</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const daysLeft = getDaysRemaining(task.dueDate);
            const isOverdue = daysLeft !== null && daysLeft < 0 && !task.completed;
            const isDueToday = daysLeft === 0 && !task.completed;

            return (
              <div
                key={task.id}
                className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-[#12101F]/60 border-white/5 opacity-75'
                    : isOverdue
                    ? 'bg-[#191018] border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                    : 'bg-[#141224] border-white/10 hover:border-[#00E5FF]/40 hover:bg-[#161328]'
                }`}
              >
                {/* Checkbox + Info principal */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleCompleted(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                  >
                    {task.completed ? (
                      <div className="w-6 h-6 rounded-lg bg-[#A3FF6F] text-slate-950 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(163,255,111,0.4)]">
                        <CheckSquare className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg border-2 border-slate-500 hover:border-[#00E5FF] flex items-center justify-center transition-colors">
                        <Square className="w-3.5 h-3.5 opacity-0 hover:opacity-100 text-[#00E5FF]" />
                      </div>
                    )}
                  </button>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-sm transition-all ${
                        task.completed ? 'text-slate-400 line-through' : 'text-white'
                      }`}>
                        {task.title}
                      </h3>

                      {/* Pill de prioridad */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        task.priority === 'alta'
                          ? 'bg-[#FF4FD8]/20 text-[#FF4FD8] border border-[#FF4FD8]/40'
                          : task.priority === 'media'
                          ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                          : 'bg-[#A3FF6F]/20 text-[#A3FF6F] border border-[#A3FF6F]/40'
                      }`}>
                        {task.priority}
                      </span>

                      {/* Pill de área */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-slate-300 border border-white/10">
                        {task.areaName}
                      </span>
                    </div>

                    {task.description && (
                      <p className={`text-xs leading-relaxed max-w-3xl ${
                        task.completed ? 'text-slate-500 line-through' : 'text-slate-300'
                      }`}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap pt-1">
                      {task.assignedBy && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <BookOpen className="w-3 h-3 text-[#536DFF]" />
                          <span>{task.assignedBy}</span>
                        </span>
                      )}

                      {task.resourceLink && (
                        <a
                          href={task.resourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[#00E5FF] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Material / Ejercicios</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fecha límite + Acciones a la derecha */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-300 font-mono">
                      {task.dueDate}
                    </span>

                    {/* Badge de estado relativo */}
                    {task.completed ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#A3FF6F]/10 text-[#A3FF6F] border border-[#A3FF6F]/30">
                        Completada
                      </span>
                    ) : isOverdue ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                        ¡Vencida!
                      </span>
                    ) : isDueToday ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Vence hoy
                      </span>
                    ) : daysLeft !== null && daysLeft <= 2 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">
                        En {daysLeft} días
                      </span>
                    ) : null}
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Eliminar tarea"
                    aria-label="Eliminar tarea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CREAR TAREA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#141224] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 z-10 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Agregar Nueva Tarea</h3>
                  <p className="text-xs text-slate-400">Asigna un compromiso de estudio o meta práctica</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              {/* Título */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Título de la tarea <span className="text-[#FF4FD8]">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Resolver ejercicios de cálculo diferencial (Pág. 45)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              {/* Área y Prioridad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Área de Aprendizaje</label>
                  <select
                    value={newAreaSlug}
                    onChange={(e) => setNewAreaSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0D0B18] border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                  >
                    {areas.map(a => (
                      <option key={a.slug} value={a.slug}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prioridad</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewPriority('baja')}
                      className={`py-2 rounded-lg font-bold text-[11px] transition-all ${
                        newPriority === 'baja'
                          ? 'bg-[#A3FF6F] text-slate-950 shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      Baja
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPriority('media')}
                      className={`py-2 rounded-lg font-bold text-[11px] transition-all ${
                        newPriority === 'media'
                          ? 'bg-[#00E5FF] text-slate-950 shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      Media
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPriority('alta')}
                      className={`py-2 rounded-lg font-bold text-[11px] transition-all ${
                        newPriority === 'alta'
                          ? 'bg-[#FF4FD8] text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      Alta
                    </button>
                  </div>
                </div>
              </div>

              {/* Fecha Límite */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fecha Límite de Entrega</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              {/* Origen de la tarea */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipo de Tarea</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setNewAssignorType('personal')}
                    className={`py-2 px-3 rounded-xl text-left border transition-all ${
                      newAssignorType === 'personal'
                        ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-white font-semibold'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    Meta de estudio personal
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAssignorType('instructor')}
                    className={`py-2 px-3 rounded-xl text-left border transition-all ${
                      newAssignorType === 'instructor'
                        ? 'bg-[#FF4FD8]/20 border-[#FF4FD8] text-white font-semibold'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    Asignada por instructor
                  </button>
                </div>

                {newAssignorType === 'instructor' && (
                  <input
                    type="text"
                    value={newInstructorName}
                    onChange={(e) => setNewInstructorName(e.target.value)}
                    placeholder="Nombre del instructor (ej: Sarah Delgado, Mateo Silva)"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4FD8]"
                  />
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción o Instrucciones</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalles sobre lo que debes investigar, resolver o practicar..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] resize-none"
                />
              </div>

              {/* Enlace opcional a recursos */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Enlace a recurso o documento (Opcional)</label>
                <input
                  type="url"
                  value={newResourceLink}
                  onChange={(e) => setNewResourceLink(e.target.value)}
                  placeholder="https://drive.google.com/... o enlace a ejercicios"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#FF4FD8] text-white font-bold hover:opacity-95 shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Tarea</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
