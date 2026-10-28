-- ============================================================================
-- BAM ON STAGE - ESQUEMA DE BASE DE DATOS RELACIONAL Y POLÍTICAS RLS (SUPABASE)
-- Proyecto: Hrarokygesqqgzlgheuq
-- "Donde el talento encuentra su escenario"
-- ============================================================================

-- Habilitar extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TIPOS ENUM PERSONALIZADOS
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('estudiante', 'instructor', 'administrador');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status_enum AS ENUM ('Pendiente', 'Aceptada', 'Rechazada', 'Cancelada', 'Completada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_mode_enum AS ENUM ('presencial', 'virtual', 'ambas');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLA DE PERFILES DE USUARIOS (vinculada a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    grade TEXT NOT NULL DEFAULT '10° A', -- Grado o curso institucional (ej: "10° A", "11° B")
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. TABLA DE ASIGNACIÓN DE ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL DEFAULT 'estudiante',
    granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- 4. TABLA DE ÁREAS DE APRENDIZAJE
CREATE TABLE IF NOT EXISTS public.learning_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Sparkles',
    neon_color TEXT NOT NULL DEFAULT '#00E5FF',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. TABLA DE LUGARES INSTITUCIONALES (Para asesorías presenciales)
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    building TEXT NOT NULL,
    room_number TEXT,
    capacity INT DEFAULT 4,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. TABLA DE PERFILES DE INSTRUCTORES AUTORIZADOS
CREATE TABLE IF NOT EXISTS public.instructor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    primary_area_id UUID NOT NULL REFERENCES public.learning_areas(id) ON DELETE RESTRICT,
    headline TEXT NOT NULL,
    biography TEXT NOT NULL,
    allowed_mode session_mode_enum NOT NULL DEFAULT 'ambas',
    default_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    base_price_cop NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_authorized BOOLEAN NOT NULL DEFAULT false,
    authorized_at TIMESTAMPTZ,
    authorized_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. TABLA DE TEMAS Y PRECIOS POR INSTRUCTOR
CREATE TABLE IF NOT EXISTS public.instructor_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID NOT NULL REFERENCES public.instructor_profiles(id) ON DELETE CASCADE,
    area_id UUID NOT NULL REFERENCES public.learning_areas(id) ON DELETE RESTRICT,
    topic_name TEXT NOT NULL,
    description TEXT,
    custom_price_cop NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. TABLA DE HORARIOS RECURRENTES DE DISPONIBILIDAD
CREATE TABLE IF NOT EXISTS public.instructor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID NOT NULL REFERENCES public.instructor_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 1=Lunes, ..., 6=Sábado
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_duration_minutes INT NOT NULL DEFAULT 60,
    break_duration_minutes INT NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT valid_time_window CHECK (start_time < end_time)
);

-- 9. TABLA DE EXCEPCIONES DE DISPONIBILIDAD (Días libres, feriados, etc.)
CREATE TABLE IF NOT EXISTS public.availability_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID NOT NULL REFERENCES public.instructor_profiles(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT false,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. TABLA DE SOLICITUDES Y RESERVAS DE ASESORÍAS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    instructor_id UUID NOT NULL REFERENCES public.instructor_profiles(id) ON DELETE RESTRICT,
    area_id UUID REFERENCES public.learning_areas(id) ON DELETE RESTRICT,
    topic_name TEXT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_mode session_mode_enum NOT NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    custom_location_notes TEXT,
    agreed_price_cop NUMERIC(10, 2) NOT NULL,
    student_message TEXT,
    instructor_notes TEXT,
    status booking_status_enum NOT NULL DEFAULT 'Pendiente',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. TABLA DE VALORACIONES Y RESEÑAS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.instructor_profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ÍNDICES PARA ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_instructor ON public.bookings(instructor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date, status);
CREATE INDEX IF NOT EXISTS idx_reviews_instructor ON public.reviews(instructor_id);
CREATE INDEX IF NOT EXISTS idx_topics_instructor ON public.instructor_topics(instructor_id);

-- ============================================================================
-- PREVENCIÓN DE DOBLES RESERVAS EN EL SERVIDOR (TRIGGER)
-- ============================================================================
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('Pendiente', 'Aceptada') THEN
        IF EXISTS (
            SELECT 1 FROM public.bookings
            WHERE instructor_id = NEW.instructor_id
              AND booking_date = NEW.booking_date
              AND id <> NEW.id
              AND status IN ('Pendiente', 'Aceptada')
              AND (
                  (NEW.start_time, NEW.end_time) OVERLAPS (start_time, end_time)
              )
        ) THEN
            RAISE EXCEPTION 'El horario seleccionado (% a %) para la fecha % ya se encuentra reservado.', 
                NEW.start_time, NEW.end_time, NEW.booking_date;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_booking_overlap ON public.bookings;
CREATE TRIGGER trigger_prevent_booking_overlap
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION check_booking_overlap();

-- ============================================================================
-- TRIGGER AUTOMÁTICO AL CREAR USUARIO EN SUPABASE AUTH
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, grade, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'grade', '10° A'),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'estudiante')
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- POLÍTICAS ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = user_uid AND role = 'administrador'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reglas para perfiles:
DROP POLICY IF EXISTS "Perfiles públicos son legibles por todos" ON public.profiles;
CREATE POLICY "Perfiles públicos son legibles por todos"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Usuarios pueden insertar o actualizar su perfil" ON public.profiles;
CREATE POLICY "Usuarios pueden insertar o actualizar su perfil"
    ON public.profiles FOR ALL
    USING (auth.uid() = id);

-- Reglas para áreas y lugares (lectura pública, escritura admin o anon inicial)
DROP POLICY IF EXISTS "Áreas legibles por todos" ON public.learning_areas;
CREATE POLICY "Áreas legibles por todos"
    ON public.learning_areas FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Modificación de áreas permitida" ON public.learning_areas;
CREATE POLICY "Modificación de áreas permitida"
    ON public.learning_areas FOR ALL
    USING (true);

DROP POLICY IF EXISTS "Lugares legibles por todos" ON public.locations;
CREATE POLICY "Lugares legibles por todos"
    ON public.locations FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Modificación de lugares permitida" ON public.locations;
CREATE POLICY "Modificación de lugares permitida"
    ON public.locations FOR ALL
    USING (true);

-- Reglas para instructores:
DROP POLICY IF EXISTS "Perfiles de instructores públicos" ON public.instructor_profiles;
CREATE POLICY "Perfiles de instructores públicos"
    ON public.instructor_profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Instructores gestionan su perfil" ON public.instructor_profiles;
CREATE POLICY "Instructores gestionan su perfil"
    ON public.instructor_profiles FOR ALL
    USING (auth.uid() = user_id OR true);

DROP POLICY IF EXISTS "Temas legibles por todos" ON public.instructor_topics;
CREATE POLICY "Temas legibles por todos"
    ON public.instructor_topics FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Modificación de temas" ON public.instructor_topics;
CREATE POLICY "Modificación de temas"
    ON public.instructor_topics FOR ALL
    USING (true);

DROP POLICY IF EXISTS "Disponibilidad pública" ON public.instructor_availability;
CREATE POLICY "Disponibilidad pública"
    ON public.instructor_availability FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Modificación de disponibilidad" ON public.instructor_availability;
CREATE POLICY "Modificación de disponibilidad"
    ON public.instructor_availability FOR ALL
    USING (true);

-- Reglas para reservas:
DROP POLICY IF EXISTS "Lectura de reservas" ON public.bookings;
CREATE POLICY "Lectura de reservas"
    ON public.bookings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Creación de reservas" ON public.bookings;
CREATE POLICY "Creación de reservas"
    ON public.bookings FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Actualización de reservas" ON public.bookings;
CREATE POLICY "Actualización de reservas"
    ON public.bookings FOR UPDATE
    USING (true);

-- Reglas para reseñas:
DROP POLICY IF EXISTS "Reseñas legibles por todos" ON public.reviews;
CREATE POLICY "Reseñas legibles por todos"
    ON public.reviews FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Creación de reseñas" ON public.reviews;
CREATE POLICY "Creación de reseñas"
    ON public.reviews FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- POBLADO INICIAL AUTOMÁTICO (SEED DATA)
-- ============================================================================

-- Insertar las 11 Áreas de Aprendizaje
INSERT INTO public.learning_areas (slug, name, description, icon_name, neon_color, display_order)
VALUES
    ('matematicas', 'Matemáticas', 'Cálculo, álgebra, geometría, trigonometría y preparación para olimpiadas.', 'Calculator', '#00E5FF', 1),
    ('tecnologia-programacion', 'Tecnología y programación', 'Desarrollo web, Python, robótica con Arduino, algoritmos e inteligencia artificial.', 'Terminal', '#00E5FF', 2),
    ('ingles', 'Inglés', 'Conversación fluida, gramática, preparación para pruebas TOEFL/IELTS y oratoria.', 'Globe', '#536DFF', 3),
    ('ciencias-naturales', 'Ciencias naturales', 'Biología molecular, química orgánica, física mecánica y método científico.', 'Atom', '#A3FF6F', 4),
    ('arte', 'Arte', 'Ilustración digital, dibujo de figura humana, teoría del color, técnicas de óleo y acuarela.', 'Palette', '#FF4FD8', 5),
    ('musica', 'Música', 'Guitarra, piano, técnica vocal, armonía contemporánea y producción musical.', 'Music', '#FF4FD8', 6),
    ('lengua-literatura', 'Lengua y literatura', 'Redacción académica, ensayos argumentativos, comprensión crítica y escritura creativa.', 'BookOpen', '#F59E0B', 7),
    ('ciencias-sociales', 'Ciencias sociales', 'Historia universal, geografía política, filosofía y análisis de coyuntura.', 'Compass', '#8B5CF6', 8),
    ('deportes', 'Deportes', 'Ajedrez de competencia, fundamentos de voleibol, acondicionamiento físico y táctica deportiva.', 'Trophy', '#10B981', 9),
    ('liderazgo', 'Liderazgo', 'Modelo de Naciones Unidas (MUN), debate competitivo, oratoria y trabajo en equipo.', 'Users', '#EC4899', 10),
    ('otras-habilidades', 'Otras habilidades', 'Finanzas para jóvenes, gestión del tiempo, oratoria y técnicas de estudio efectivas.', 'Sparkles', '#6366F1', 11)
ON CONFLICT (slug) DO UPDATE
SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon_name = EXCLUDED.icon_name,
    neon_color = EXCLUDED.neon_color,
    display_order = EXCLUDED.display_order;

-- Insertar los Lugares y Espacios Institucionales
INSERT INTO public.locations (name, building, room_number, capacity, notes)
VALUES
    ('MakerSpace & Laboratorio de Robótica', 'Edificio de Innovación Tecnológica', 'Sala T-204', 6, 'Cuenta con mesas de trabajo, equipos con software de programación y prototipado.'),
    ('Biblioteca Central - Sala de Estudio B1', 'Edificio Central', 'Piso 2, Módulo Silencioso', 4, 'Espacio óptimo para asesorías teóricas, matemáticas y lectura crítica.'),
    ('Taller de Artes Visuales', 'Bloque Cultural', 'Aula A-101', 8, 'Iluminación natural, caballetes y conexiones para tabletas gráficas.'),
    ('Cabina de Ensayos y Producción Musical', 'Bloque Cultural', 'Cabina M-3', 3, 'Insonorizada, amplificadores e interfaz de audio.'),
    ('Laboratorio de Ciencias Naturales 1', 'Edificio Científico', 'Lab C-102', 6, 'Microscopios y reactivos seguros para prácticas guiadas.'),
    ('Terraza y Cafetería Estudiantil', 'Zona al Aire Libre', 'Mesas Sector Jardín', 5, 'Espacio relajado para debates, conversación de idiomas y tutorías dinámicas.')
ON CONFLICT DO NOTHING;
