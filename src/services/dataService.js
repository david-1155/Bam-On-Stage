import { supabase, isSupabaseConfigured } from './supabase.js';
import { demoStore, INITIAL_AREAS, INITIAL_LOCATIONS, INITIAL_INSTRUCTORS } from './demoStore.js';

/**
 * Servicio unificado de datos que coordina entre Supabase (cuando está configurado)
 * y el almacenamiento local con respaldo resiliente.
 */
export const dataService = {
  /**
   * Obtiene las áreas de aprendizaje
   */
  async getAreas() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('learning_areas')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          // Mapear campos de base de datos a formato de la aplicación
          return data.map(item => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            description: item.description,
            iconName: item.icon_name || 'Sparkles',
            neonColor: item.neon_color || '#00E5FF',
            instructorsCount: item.instructors_count || 3,
            order: item.display_order
          }));
        }
      } catch (err) {
        console.warn('Fallo al consultar learning_areas en Supabase, utilizando catálogo base:', err);
      }
    }
    return demoStore.getAreas();
  },

  /**
   * Obtiene la lista completa de instructores
   */
  async getInstructors() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('instructor_profiles')
          .select(`
            id,
            user_id,
            headline,
            biography,
            allowed_mode,
            base_price_cop,
            is_authorized,
            profiles (
              full_name,
              grade,
              avatar_url
            ),
            learning_areas (
              name,
              slug
            ),
            locations (
              name
            ),
            instructor_topics (
              id,
              topic_name,
              custom_price_cop
            )
          `);

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            userId: item.user_id,
            name: item.profiles?.full_name || 'Instructor',
            grade: item.profiles?.grade || 'Estudiante',
            areaSlug: item.learning_areas?.slug || 'general',
            areaName: item.learning_areas?.name || 'General',
            avatarUrl: item.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            headline: item.headline,
            biography: item.biography,
            mode: item.allowed_mode || 'ambas',
            locationName: item.locations?.name || 'Campus Principal',
            basePriceCop: Number(item.base_price_cop) || 20000,
            topics: item.instructor_topics?.map(t => ({
              id: t.id,
              name: t.topic_name,
              priceCop: t.custom_price_cop || item.base_price_cop
            })) || [],
            ratingAverage: 5.0,
            reviewsCount: 1,
            nextAvailability: 'Disponible esta semana',
            isFeatured: true,
            isAuthorized: item.is_authorized
          }));
        }
      } catch (err) {
        console.warn('Fallo al consultar instructor_profiles en Supabase, utilizando catálogo base:', err);
      }
    }
    return demoStore.getInstructors();
  },

  /**
   * Obtiene un instructor por su ID
   */
  async getInstructorById(id) {
    const list = await this.getInstructors();
    return list.find(i => i.id === id || i.userId === id);
  },

  /**
   * Obtiene las reservas asociadas a un estudiante o instructor
   */
  async getBookings(userId = null) {
    if (isSupabaseConfigured() && supabase && userId) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            student_id,
            instructor_id,
            topic_name,
            booking_date,
            start_time,
            end_time,
            session_mode,
            agreed_price_cop,
            student_message,
            status,
            profiles:student_id (
              full_name,
              email,
              grade
            ),
            instructor_profiles:instructor_id (
              profiles (
                full_name,
                avatar_url
              ),
              learning_areas (
                name,
                slug
              )
            ),
            locations (
              name
            )
          `)
          .order('booking_date', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(b => ({
            id: b.id,
            studentId: b.student_id,
            studentName: b.profiles?.full_name || 'Estudiante',
            studentEmail: b.profiles?.email || '',
            studentGrade: b.profiles?.grade || '',
            instructorId: b.instructor_id,
            instructorName: b.instructor_profiles?.profiles?.full_name || 'Instructor',
            instructorAvatar: b.instructor_profiles?.profiles?.avatar_url,
            areaSlug: b.instructor_profiles?.learning_areas?.slug || 'general',
            areaName: b.instructor_profiles?.learning_areas?.name || 'General',
            topicName: b.topic_name,
            date: b.booking_date,
            time: b.start_time?.slice(0, 5) || '15:00',
            durationMinutes: 60,
            mode: b.session_mode,
            locationName: b.locations?.name || 'Campus Principal',
            priceCop: Number(b.agreed_price_cop) || 20000,
            status: b.status,
            studentMessage: b.student_message
          }));
        }
      } catch (err) {
        console.warn('Fallo al consultar bookings en Supabase, utilizando reservas locales:', err);
      }
    }
    return demoStore.getBookings();
  },

  /**
   * Registra una nueva reserva
   */
  async createBooking(bookingData) {
    let supabaseSaved = false;

    const isValidUUID = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    if (isSupabaseConfigured() && supabase && isValidUUID(bookingData.studentId) && isValidUUID(bookingData.instructorId)) {
      try {
        const { data, error } = await supabase.from('bookings').insert({
          student_id: bookingData.studentId,
          instructor_id: bookingData.instructorId,
          topic_name: bookingData.topicName,
          booking_date: bookingData.date,
          start_time: bookingData.time + ':00',
          end_time: (parseInt(bookingData.time.split(':')[0]) + 1) + ':' + bookingData.time.split(':')[1] + ':00',
          session_mode: bookingData.mode,
          agreed_price_cop: bookingData.priceCop,
          student_message: bookingData.studentMessage,
          status: 'Pendiente'
        }).select().single();

        if (!error && data) {
          supabaseSaved = true;
        }
      } catch (err) {
        console.warn('No se pudo guardar directamente en tabla Supabase:', err);
      }
    }

    // Siempre persistir también en demoStore reactivo para que la vista del usuario se actualice al instante
    const local = demoStore.createBooking(bookingData);
    return { ...local, supabaseSynced: supabaseSaved };
  },

  /**
   * Actualiza el estado de una reserva (Aceptada, Rechazada, Cancelada, Completada)
   */
  async updateBookingStatus(bookingId, newStatus) {
    const isValidUUID = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    if (isSupabaseConfigured() && supabase && isValidUUID(bookingId)) {
      try {
        await supabase
          .from('bookings')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', bookingId);
      } catch (err) {
        console.warn('Fallo al actualizar estado en Supabase:', err);
      }
    }
    return demoStore.updateBookingStatus(bookingId, newStatus);
  },

  /**
   * Obtiene lugares institucionales
   */
  async getLocations() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('locations').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(l => ({
            id: l.id,
            name: l.name,
            building: l.building,
            room: l.room_number,
            capacity: l.capacity,
            notes: l.notes
          }));
        }
      } catch (err) {
        console.warn('Fallo al consultar locations en Supabase:', err);
      }
    }
    return demoStore.getLocations();
  },

  /**
   * Semillero rápido para insertar las 11 áreas y lugares en Supabase
   */
  async seedSupabaseTables() {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase no está configurado.');
    }

    const results = { areas: 0, locations: 0 };

    // Insertar áreas
    const areasPayload = INITIAL_AREAS.map(a => ({
      slug: a.slug,
      name: a.name,
      description: a.description,
      icon_name: a.iconName,
      neon_color: a.neonColor,
      display_order: a.order
    }));

    const { error: areaError } = await supabase
      .from('learning_areas')
      .upsert(areasPayload, { onConflict: 'slug' });

    if (!areaError) results.areas = areasPayload.length;

    // Insertar ubicaciones
    const locationsPayload = INITIAL_LOCATIONS.map(l => ({
      name: l.name,
      building: l.building,
      room_number: l.room,
      capacity: l.capacity,
      notes: l.notes
    }));

    const { error: locError } = await supabase
      .from('locations')
      .upsert(locationsPayload, { onConflict: 'name' });

    if (!locError) results.locations = locationsPayload.length;

    return results;
  },

  /**
   * Obtiene las tareas y compromisos de estudio
   */
  async getTasks() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('advisory_tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            areaSlug: t.area_slug,
            areaName: t.area_name,
            priority: t.priority,
            dueDate: t.due_date,
            completed: t.is_completed,
            completedAt: t.completed_at,
            assignedBy: t.assigned_by,
            resourceLink: t.resource_link,
            createdAt: t.created_at
          }));
        }
      } catch (err) {
        // Fallback to demoStore
      }
    }
    return demoStore.getTasks();
  },

  /**
   * Crea una nueva tarea
   */
  async createTask(taskData) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('advisory_tasks')
          .insert({
            title: taskData.title,
            description: taskData.description,
            area_slug: taskData.areaSlug,
            area_name: taskData.areaName,
            priority: taskData.priority || 'media',
            due_date: taskData.dueDate,
            is_completed: false,
            assigned_by: taskData.assignedBy || 'Personal',
            resource_link: taskData.resourceLink
          })
          .select()
          .single();

        if (!error && data) {
          return demoStore.createTask({
            ...taskData,
            id: data.id
          });
        }
      } catch (err) {
        // Fallback to local
      }
    }
    return demoStore.createTask(taskData);
  },

  /**
   * Alterna estado completado de una tarea
   */
  async toggleTask(taskId) {
    const updated = demoStore.toggleTask(taskId);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('advisory_tasks')
          .update({
            is_completed: updated.completed,
            completed_at: updated.completedAt
          })
          .eq('id', taskId);
      } catch (err) {
        // ignore
      }
    }
    return updated;
  },

  /**
   * Elimina una tarea
   */
  async deleteTask(taskId) {
    demoStore.deleteTask(taskId);
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('advisory_tasks').delete().eq('id', taskId);
      } catch (err) {
        // ignore
      }
    }
    return true;
  }
};

