import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Sparkles, Shield, UserCheck, GraduationCap, RefreshCw, Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, X } from 'lucide-react';
import { demoStore } from '../../services/demoStore.js';
import { isSupabaseConfigured, cleanSupabaseUrl, testSupabaseConnection } from '../../services/supabase.js';
import { dataService } from '../../services/dataService.js';

export default function DemoBanner() {
  const { isSupabase, role, switchDemoUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setTesting(false);
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await dataService.seedSupabaseTables();
      setSeedResult({ success: true, message: `¡Éxito! Se insertaron ${res.areas} áreas y ${res.locations} espacios en tu base de datos de Supabase.` });
    } catch (err) {
      setSeedResult({ success: false, message: err.message || 'Error al poblar tablas. Verifica que ejecutaste la migración SQL primero.' });
    }
    setSeeding(false);
  };

  const handleCopySqlPath = () => {
    navigator.clipboard.writeText('supabase/migrations/20261016_initial_schema.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <>
      <div className="bg-[#12101C] border-b border-purple-500/20 px-4 py-2 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {isSupabase ? (
              <button
                onClick={() => {
                  setModalOpen(true);
                  handleTestConnection();
                }}
                className="flex items-center gap-1.5 font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">Supabase Conectado</span>
                <span className="text-slate-500 font-mono text-[11px]">(Hrarokygesqqgzlgheuq)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 ml-1 group-hover:bg-emerald-500/20">
                  Ver estado
                </span>
              </button>
            ) : (
              <span className="flex items-center gap-1.5 font-medium text-[#00E5FF]">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                Modo Demostración Activo
              </span>
            )}
            
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-400">
              {isSupabase ? 'Base de datos PostgreSQL en la nube' : 'Persistencia local en navegador'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-[11px]">Probar como:</span>
            
            <button
              onClick={() => switchDemoUser('estudiante')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                role === 'estudiante'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
              title="Cambiar a cuenta de estudiante Camila Torres"
            >
              <GraduationCap className="w-3 h-3" />
              Estudiante
            </button>

            <button
              onClick={() => switchDemoUser('instructor')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                role === 'instructor'
                  ? 'bg-[#FF4FD8]/20 text-[#FF4FD8] border border-[#FF4FD8]/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
              title="Cambiar a cuenta de instructor Mateo Silva"
            >
              <UserCheck className="w-3 h-3" />
              Instructor
            </button>

            <button
              onClick={() => switchDemoUser('administrador')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                role === 'administrador'
                  ? 'bg-[#A3FF6F]/20 text-[#A3FF6F] border border-[#A3FF6F]/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
              title="Cambiar a cuenta de administrador Prof. Alberto Rivas"
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>

            <button
              onClick={() => {
                if (confirm('¿Restablecer los datos locales?')) {
                  demoStore.resetDemoData();
                  window.location.reload();
                }
              }}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 ml-1"
              title="Restablecer datos locales"
              aria-label="Restablecer datos"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DETALLES SUPABASE */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#141224] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 z-10 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Integración con Supabase</h3>
                  <p className="text-xs text-slate-400">Proyecto: <strong className="text-emerald-400 font-mono">Hrarokygesqqgzlgheuq</strong></p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Datos de configuración */}
            <div className="space-y-3 text-xs bg-white/[0.02] border border-white/5 rounded-2xl p-4 font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">API Endpoint:</span>
                <span className="text-slate-200 select-all truncate block">{cleanSupabaseUrl}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Public Key:</span>
                <span className="text-slate-300 font-mono text-[11px] select-all block truncate">
                  sb_publishable_Gs2cyQDFxiumAb3siMYAqA_lFAixtCx
                </span>
              </div>
            </div>

            {/* Estado de conexión */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Estado de la Base de Datos:</span>
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="text-xs text-[#00E5FF] hover:underline disabled:opacity-50"
                >
                  {testing ? 'Comprobando...' : 'Verificar conexión'}
                </button>
              </div>

              {testResult && (
                <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                  testResult.connected && testResult.tablesReady
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                }`}>
                  {testResult.connected && testResult.tablesReady ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">{testResult.message}</p>
                    {testResult.error && (
                      <p className="text-[11px] text-amber-400 font-mono">{testResult.error}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Guía de migración SQL */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 text-xs">
              <span className="font-bold text-white block">Instrucciones para activar tablas y RLS:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Abre el <strong className="text-white">SQL Editor</strong> en tu panel de Supabase y ejecuta el script completo que preparamos en el archivo:
              </p>
              
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-slate-300">
                <span className="truncate">supabase/migrations/20261016_initial_schema.sql</span>
                <button
                  onClick={handleCopySqlPath}
                  className="ml-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] shrink-0 flex items-center gap-1"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'Copiado' : 'Copiar ruta'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSeedData}
                  disabled={seeding}
                  className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Database className="w-4 h-4" />
                  <span>{seeding ? 'Poblando tablas...' : 'Poblar áreas y lugares en Supabase'}</span>
                </button>
              </div>

              {seedResult && (
                <p className={`text-[11px] mt-2 font-medium ${seedResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {seedResult.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
