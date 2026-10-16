import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#536DFF]/30 text-xs text-[#536DFF] font-semibold tracking-wide">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Atención a la Comunidad</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          Contacto & Coordinación
        </h1>
        <p className="text-sm text-slate-400">
          ¿Tienes dudas sobre las asesorías, el proceso de postulación a instructor o sugerencias para la plataforma?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Info Column */}
        <div className="lg:col-span-5 bg-[#121020] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-display font-bold text-lg text-white">Coordinación de Asesorías</h2>
          
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Oficina de Coordinación de Talentos</p>
                <p className="text-slate-400">Edificio Central, Segundo Piso, Oficina C-202</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#FF4FD8] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Correo Oficial</p>
                <p className="text-slate-400 font-mono">coordinacion@bam.edu.co</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#A3FF6F] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Horario de Atención Presencial</p>
                <p className="text-slate-400">Lunes a Viernes de 8:00 AM a 4:30 PM</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-normal">
            🛡️ <strong>Postulación para Instructores:</strong> Los estudiantes con promedio destacado en su área pueden solicitar la habilitación con el Prof. Alberto Rivas en coordinación.
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 bg-[#121020] border border-white/10 rounded-3xl p-6 sm:p-8">
          {isSent ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#A3FF6F] mx-auto" />
              <h3 className="font-display font-bold text-xl text-white">¡Mensaje Enviado con Éxito!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Gracias por comunicarte con la coordinación de BAM ON STAGE. Responderemos a tu correo en un plazo máximo de 24 horas hábiles.
              </p>
              <button
                onClick={() => {
                  setIsSent(false);
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300 hover:text-white"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Correo electrónico</label>
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
                <label className="block font-semibold text-slate-300 mb-1">Asunto</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ej: Solicitud para ser instructor, consulta sobre horario"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mensaje</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Escribe aquí tu consulta detallada..."
                  className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#00E5FF] text-[#0A0A10] font-bold text-xs hover:bg-[#00E5FF]/90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Mensaje</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
