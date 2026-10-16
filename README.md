# BAM ON STAGE 🚀
> «Donde el talento encuentra su escenario»

**BAM ON STAGE** es una plataforma educativa interactiva diseñada para conectar a estudiantes de una institución escolar o universitaria, permitiéndoles descubrir talentos, intercambiar conocimientos entre pares, explorar diversas áreas de aprendizaje y solicitar asesorías académicas, artísticas o tecnológicas con estudiantes autorizados como instructores.

---

## 🌟 Características Principales

1. **Catálogo de Talentos y Filtros Inteligentes**:
   - Búsqueda en tiempo real por nombre, área o tema.
   - Filtros por 11 disciplinas, modalidad (Presencial en campus o Virtual vía Google Meet) y rango de tarifas en pesos colombianos (COP).
   - Ordenamiento por mejor valoración o tarifas.

2. **Perfiles Completos de Instructores**:
   - Resumen biográfico, grado escolar, temas específicos ofrecidos con tarifas individuales.
   - Franjas de disponibilidad semanal y ubicación presencial asignada en el campus (MakerSpace, Biblioteca, Laboratorio de Ciencias, etc.).
   - Sistema de opiniones y calificaciones promedio verificadas (1 a 5 estrellas).

3. **Sistema de Reservas y Prevención de Solapamientos**:
   - Formulario de solicitud con resumen del instructor seleccionado.
   - Bloqueo de fechas pasadas y verificación en tiempo real para impedir reservas duplicadas en el mismo horario.
   - Estados de solicitud: `Pendiente`, `Aceptada`, `Rechazada`, `Cancelada` y `Completada`.

4. **Panel del Instructor**:
   - Revisión inmediata de solicitudes entrantes con capacidad de aceptar o rechazar con un clic.
   - Marcado de asesorías completadas para habilitar la valoración del estudiante.
   - Gestión de temas, precios por hora y edición del perfil público.

5. **Panel de Administración**:
   - Módulo seguro para la coordinación institucional.
   - Autorización o revocación de instructores estudiantiles.
   - Asignación de roles (`estudiante`, `instructor`, `administrador`).
   - Monitor global de todas las reservas y administración de espacios físicos.

6. **Doble Modo de Operación**:
   - **Modo Demostración Reactivo**: Si no se configuran credenciales en `.env`, la aplicación funciona automáticamente con persistencia en `localStorage`, cargando cuentas preconfiguradas (Estudiante, Instructor, Administrador) y datos iniciales completos.
   - **Modo Supabase en Producción**: Conexión nativa con Supabase Auth, base de datos PostgreSQL, extensiones UUID y políticas de seguridad Row Level Security (RLS).

---

## 🎨 Identidad Visual Futurista

- **Negro Espacial**: `#0A0A10`
- **Morado Nocturno**: `#121020` / `#191329`
- **Cian Neón**: `#00E5FF`
- **Fucsia Neón**: `#FF4FD8`
- **Verde Neón**: `#A3FF6F`
- **Azul Eléctrico**: `#536DFF`
- Tipografía moderna: **Outfit** para titulares y **Plus Jakarta Sans** para cuerpo de texto.

---

## 📁 Estructura del Proyecto

```text
├── index.html                      # Punto de entrada HTML con metadatos y fuentes
├── metadata.json                   # Metadatos del applet en AI Studio
├── package.json                    # Dependencias del proyecto (React 19, Vite, Lucide, Tailwind)
├── supabase/
│   └── migrations/
│       └── 20261016_initial_schema.sql  # Esquema relacional, triggers y políticas RLS
├── src/
│   ├── assets/images/              # Fotografías de estudiantes y visual de escenario
│   ├── components/
│   │   ├── common/
│   │   │   ├── AreaCard.jsx        # Tarjeta interactiva con color neón
│   │   │   ├── DemoBanner.jsx      # Selector rápido de roles en modo demo
│   │   │   └── SearchModal.jsx     # Buscador global instantáneo
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Barra superior con contrato de 3 zonas
│   │   │   ├── SidebarDrawer.jsx   # Panel lateral desplegable
│   │   │   └── Footer.jsx          # Pie de página institucional
│   │   └── talents/
│   │       └── InstructorCard.jsx  # Tarjeta de instructor con tipografía anti-slop
│   ├── context/
│   │   └── AuthContext.jsx         # Contexto de autenticación para Supabase y Demo
│   ├── pages/
│   │   ├── HomePage.jsx            # Portada con 4 pasos y talentos destacados
│   │   ├── TalentsPage.jsx         # Catálogo completo con filtros y ordenamiento
│   │   ├── InstructorProfilePage.jsx# Perfil individual con reseñas y horarios
│   │   ├── AreasPage.jsx           # Las 11 disciplinas de aprendizaje
│   │   ├── AreaDetailPage.jsx      # Instructores especializados por área
│   │   ├── ScheduleAvailabilityPage.jsx # Agenda semanal por días
│   │   ├── LocationsPage.jsx       # Espacios del campus (MakerSpace, Biblioteca, etc.)
│   │   ├── BookingRequestPage.jsx  # Formulario validado de solicitud
│   │   ├── MyBookingsPage.jsx      # Gestión de reservas y calificación de sesiones
│   │   ├── InstructorDashboardPage.jsx # Panel privado del instructor
│   │   ├── AdminDashboardPage.jsx  # Panel protegido de coordinación
│   │   ├── LoginPage.jsx           # Inicio de sesión con accesos rápidos demo
│   │   ├── RegisterPage.jsx        # Registro con validación y grado escolar
│   │   ├── ForgotPasswordPage.jsx  # Recuperación de contraseña
│   │   ├── ProfilePage.jsx         # Perfil del usuario autenticado
│   │   ├── AboutPage.jsx           # Misión institucional y 4 pilares
│   │   ├── ContactPage.jsx         # Formulario de atención y ubicación física
│   │   ├── TermsPage.jsx           # Términos y condiciones
│   │   ├── PrivacyPage.jsx         # Política de privacidad
│   │   └── NotFoundPage.jsx        # Manejo de rutas 404
│   ├── services/
│   │   ├── supabase.js             # Cliente oficial de Supabase
│   │   └── demoStore.js            # Base de datos local reactiva con datos semilla
│   ├── utils/
│   │   ├── bookingRules.ts         # Reglas puras de solapamiento y validación
│   │   └── bookingRules.test.ts    # Pruebas unitarias nativas con node:test
│   ├── App.tsx                     # Enrutador principal de React Router
│   ├── index.css                   # Utilidades de Tailwind y resplandor neón
│   └── main.tsx                    # Montaje de la aplicación
```

---

## 🚀 Instalación y Ejecución Local

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

3. **Ejecutar pruebas unitarias de lógica de negocio**:
   ```bash
   node --test src/utils/bookingRules.test.ts
   ```

---

## 🗄️ Conexión con Supabase (Opcional para Producción)

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Dirígete a **SQL Editor** y ejecuta el script completo ubicado en:
   ```text
   supabase/migrations/20261016_initial_schema.sql
   ```
3. En tu archivo `.env` añade tus claves públicas:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_publica
   ```
4. Reinicia el servidor de desarrollo. La aplicación detectará automáticamente la conexión a Supabase y utilizará la base de datos PostgreSQL remota.

---

## 👥 Cuentas de Prueba en Modo Demostración

En la barra superior encontrarás un selector de rol con 1 clic para alternar entre:
- **Estudiante**: Camila Torres (`camila.torres@bam.edu.co` - 10° A)
- **Instructor**: Mateo Silva (`mateo.silva@bam.edu.co` - 11° A, Tecnología y Programación)
- **Administrador**: Prof. Alberto Rivas (`coordinacion@bam.edu.co` - Coordinación)
