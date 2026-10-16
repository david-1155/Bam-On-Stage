-- ============================================================================
-- BAM ON STAGE - ESQUEMA DE BASE DE DATOS RELACIONAL Y POLÍTICAS RLS (SUPABASE)
-- "Donde el talento encuentra su escenario"
-- ============================================================================

-- Extensión para generación de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    grade TEXT NOT NULL, -- Grado o curso institucional (ej: "10° A", "11° B")
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. TABLA DE ASIGNACIÓN DE ROLES
-- Garantiza que cada usuario tenga al menos el rol de 'estudiante' por defecto.
-- Solo un administrador puede elevar a 'instructor' o 'administrador'.
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
    headline TEXT NOT NULL, -- Breve descripción o slogan del instructor
    biography TEXT NOT NULL,
    allowed_mode session_mode_enum NOT NULL DEFAULT 'ambas',
    default_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    base_price_cop NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_authorized BOOLEAN NOT NULL DEFAULT false, -- Solo admin puede autorizar
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
    custom_price_cop NUMERIC(10, 2), -- Precio específico para este tema, o null para usar base_price
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
    area_id UUID NOT NULL REFERENCES public.learning_areas(id) ON DELETE RESTRICT,
    topic_name TEXT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_mode session_mode_enum NOT NULL,
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    custom_location_notes TEXT,
    agreed_price_cop NUMERIC(10, 2) NOT NULL, -- Preserva el precio histórico acordado
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
-- PREVENCIÓN DE DOBLES RESERVAS EN EL SERVIDOR
-- ============================================================================
CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo verificar solapamiento si la reserva está Pendiente o Aceptada
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

-- Funciones auxiliares de seguridad
CREATE OR REPLACE FUNCTION public.is_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = user_uid AND role = 'administrador'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Reglas para perfiles:
CREATE POLICY "Perfiles públicos son legibles por todos"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. Reglas para áreas y ubicaciones:
CREATE POLICY "Áreas legibles por todos"
    ON public.learning_areas FOR SELECT
    USING (true);

CREATE POLICY "Lugares legibles por todos"
    ON public.locations FOR SELECT
    USING (true);

CREATE POLICY "Solo administradores pueden modificar áreas"
    ON public.learning_areas FOR ALL
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Solo administradores pueden modificar lugares"
    ON public.locations FOR ALL
    USING (public.is_admin(auth.uid()));

-- 3. Reglas para instructores:
CREATE POLICY "Perfiles de instructores públicos"
    ON public.instructor_profiles FOR SELECT
    USING (true);

CREATE POLICY "Instructores pueden actualizar su propio perfil"
    ON public.instructor_profiles FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Temas y disponibilidad legibles por todos"
    ON public.instructor_topics FOR SELECT
    USING (true);

CREATE POLICY "Disponibilidad recurrente pública"
    ON public.instructor_availability FOR SELECT
    USING (true);

-- 4. Reglas para reservas:
CREATE POLICY "Estudiantes ven sus propias reservas"
    ON public.bookings FOR SELECT
    USING (
        auth.uid() = student_id 
        OR auth.uid() IN (SELECT user_id FROM public.instructor_profiles WHERE id = bookings.instructor_id)
        OR public.is_admin(auth.uid())
    );

CREATE POLICY "Estudiantes pueden crear solicitudes"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Actualización de reservas según rol"
    ON public.bookings FOR UPDATE
    USING (
        auth.uid() = student_id 
        OR auth.uid() IN (SELECT user_id FROM public.instructor_profiles WHERE id = bookings.instructor_id)
        OR public.is_admin(auth.uid())
    );

-- 5. Reglas para reseñas:
CREATE POLICY "Reseñas legibles por todos"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Solo estudiantes con reserva completada pueden reseñar"
    ON public.reviews FOR INSERT
    WITH CHECK (
        auth.uid() = student_id 
        AND EXISTS (
            SELECT 1 FROM public.bookings
            WHERE id = reviews.booking_id
              AND student_id = auth.uid()
              AND status = 'Completada'
        )
    );
