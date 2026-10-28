/**
 * BAM ON STAGE - Almacén y Servicio de Datos
 * Funciona como réplica exacta de Supabase con persistencia en localStorage cuando
 * no se hayan suministrado las credenciales en .env.
 */

import avatarMateo from '/src/assets/images/avatar_student_mateo_1792180019979.jpg';
import avatarSarah from '/src/assets/images/avatar_student_sarah_1792180019043.jpg';
import avatarValeria from '/src/assets/images/avatar_student_valeria_1792180019613.jpg';

export const INITIAL_AREAS = [
  {
    id: 'area-mate',
    slug: 'matematicas',
    name: 'Matemáticas',
    description: 'Cálculo, álgebra, geometría, trigonometría y preparación para olimpiadas.',
    iconName: 'Calculator',
    neonColor: '#00E5FF',
    accentClass: 'text-[#00E5FF]',
    borderClass: 'border-[#00E5FF]/40',
    bgClass: 'bg-[#00E5FF]/10',
    instructorsCount: 4,
    order: 1
  },
  {
    id: 'area-prog',
    slug: 'tecnologia-programacion',
    name: 'Tecnología y programación',
    description: 'Desarrollo web, Python, robótica con Arduino, algoritmos e inteligencia artificial.',
    iconName: 'Terminal',
    neonColor: '#00E5FF',
    accentClass: 'text-[#00E5FF]',
    borderClass: 'border-[#00E5FF]/40',
    bgClass: 'bg-[#00E5FF]/10',
    instructorsCount: 5,
    order: 2
  },
  {
    id: 'area-ingles',
    slug: 'ingles',
    name: 'Inglés',
    description: 'Conversación fluida, gramática, preparación para pruebas TOEFL/IELTS y oratoria.',
    iconName: 'Globe',
    neonColor: '#536DFF',
    accentClass: 'text-[#536DFF]',
    borderClass: 'border-[#536DFF]/40',
    bgClass: 'bg-[#536DFF]/10',
    instructorsCount: 3,
    order: 3
  },
  {
    id: 'area-ciencias',
    slug: 'ciencias-naturales',
    name: 'Ciencias naturales',
    description: 'Biología molecular, química orgánica, física mecánica y método científico.',
    iconName: 'Atom',
    neonColor: '#A3FF6F',
    accentClass: 'text-[#A3FF6F]',
    borderClass: 'border-[#A3FF6F]/40',
    bgClass: 'bg-[#A3FF6F]/10',
    instructorsCount: 3,
    order: 4
  },
  {
    id: 'area-arte',
    slug: 'arte',
    name: 'Arte',
    description: 'Ilustración digital, dibujo de figura humana, teoría del color, técnicas de óleo y acuarela.',
    iconName: 'Palette',
    neonColor: '#FF4FD8',
    accentClass: 'text-[#FF4FD8]',
    borderClass: 'border-[#FF4FD8]/40',
    bgClass: 'bg-[#FF4FD8]/10',
    instructorsCount: 4,
    order: 5
  },
  {
    id: 'area-musica',
    slug: 'musica',
    name: 'Música',
    description: 'Guitarra, piano, técnica vocal, armonía contemporánea y producción musical.',
    iconName: 'Music',
    neonColor: '#FF4FD8',
    accentClass: 'text-[#FF4FD8]',
    borderClass: 'border-[#FF4FD8]/40',
    bgClass: 'bg-[#FF4FD8]/10',
    instructorsCount: 3,
    order: 6
  },
  {
    id: 'area-lengua',
    slug: 'lengua-literatura',
    name: 'Lengua y literatura',
    description: 'Redacción académica, ensayos argumentativos, comprensión crítica y escritura creativa.',
    iconName: 'BookOpen',
    neonColor: '#F59E0B',
    accentClass: 'text-[#F59E0B]',
    borderClass: 'border-[#F59E0B]/40',
    bgClass: 'bg-[#F59E0B]/10',
    instructorsCount: 2,
    order: 7
  },
  {
    id: 'area-sociales',
    slug: 'ciencias-sociales',
    name: 'Ciencias sociales',
    description: 'Historia universal, geografía política, filosofía y análisis de coyuntura.',
    iconName: 'Compass',
    neonColor: '#8B5CF6',
    accentClass: 'text-[#8B5CF6]',
    borderClass: 'border-[#8B5CF6]/40',
    bgClass: 'bg-[#8B5CF6]/10',
    instructorsCount: 2,
    order: 8
  },
  {
    id: 'area-deportes',
    slug: 'deportes',
    name: 'Deportes',
    description: 'Ajedrez de competencia, fundamentos de voleibol, acondicionamiento físico y táctica deportiva.',
    iconName: 'Trophy',
    neonColor: '#10B981',
    accentClass: 'text-[#10B981]',
    borderClass: 'border-[#10B981]/40',
    bgClass: 'bg-[#10B981]/10',
    instructorsCount: 2,
    order: 9
  },
  {
    id: 'area-liderazgo',
    slug: 'liderazgo',
    name: 'Liderazgo',
    description: 'Modelo de Naciones Unidas (MUN), debate competitivo, oratoria y trabajo en equipo.',
    iconName: 'Users',
    neonColor: '#EC4899',
    accentClass: 'text-[#EC4899]',
    borderClass: 'border-[#EC4899]/40',
    bgClass: 'bg-[#EC4899]/10',
    instructorsCount: 2,
    order: 10
  },
  {
    id: 'area-otras',
    slug: 'otras-habilidades',
    name: 'Otras habilidades',
    description: 'Finanzas para jóvenes, gestión del tiempo, oratoria y técnicas de estudio efectivas.',
    iconName: 'Sparkles',
    neonColor: '#6366F1',
    accentClass: 'text-[#6366F1]',
    borderClass: 'border-[#6366F1]/40',
    bgClass: 'bg-[#6366F1]/10',
    instructorsCount: 2,
    order: 11
  }
];

export const INITIAL_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'MakerSpace & Laboratorio de Robótica',
    building: 'Edificio de Innovación Tecnológica',
    room: 'Sala T-204',
    capacity: 6,
    notes: 'Cuenta con mesas de trabajo, equipos con software de programación y prototipado.'
  },
  {
    id: 'loc-2',
    name: 'Biblioteca Central - Sala de Estudio B1',
    building: 'Edificio Central',
    room: 'Piso 2, Módulo Silencioso',
    capacity: 4,
    notes: 'Espacio óptimo para asesorías teóricas, matemáticas y lectura crítica.'
  },
  {
    id: 'loc-3',
    name: 'Taller de Artes Visuales',
    building: 'Bloque Cultural',
    room: 'Aula A-101',
    capacity: 8,
    notes: 'Iluminación natural, caballetes y conexiones para tabletas gráficas.'
  },
  {
    id: 'loc-4',
    name: 'Cabina de Ensayos y Producción Musical',
    building: 'Bloque Cultural',
    room: 'Cabina M-3',
    capacity: 3,
    notes: 'Insonorizada, amplificadores e interfaz de audio.'
  },
  {
    id: 'loc-5',
    name: 'Laboratorio de Ciencias Naturales 1',
    building: 'Edificio Científico',
    room: 'Lab C-102',
    capacity: 6,
    notes: 'Microscopios y reactivos seguros para prácticas guiadas.'
  },
  {
    id: 'loc-6',
    name: 'Terraza y Cafetería Estudiantil',
    building: 'Zona al Aire Libre',
    room: 'Mesas Sector Jardín',
    capacity: 5,
    notes: 'Espacio relajado para debates, conversación de idiomas y tutorías dinámicas.'
  }
];

export const INITIAL_INSTRUCTORS = [
  {
    id: 'inst-mateo',
    userId: 'user-mateo',
    name: 'Mateo Silva',
    grade: '11° A',
    areaSlug: 'tecnologia-programacion',
    areaName: 'Tecnología y programación',
    avatarUrl: avatarMateo,
    headline: 'Desarrollador web, entusiasta de Python y robótica competitiva',
    biography: 'Llevo 3 años programando en Python y JavaScript. Fui subcampeón nacional en la competencia intercolegial de robótica VEX 2025. Mi metodología es 100% práctica: construimos proyectos reales paso a paso, desde tu primera página web hasta algoritmos para solucionar retos académicos.',
    topics: [
      { id: 'top-1', name: 'Fundamentos de Python y Lógica', priceCop: 22000 },
      { id: 'top-2', name: 'Desarrollo Web con React y HTML/CSS', priceCop: 25000 },
      { id: 'top-3', name: 'Robótica con Arduino y Sensores', priceCop: 26000 },
      { id: 'top-4', name: 'Estructuras de Datos y Algoritmos', priceCop: 24000 }
    ],
    mode: 'ambas', // presencial, virtual, ambas
    locationId: 'loc-1',
    locationName: 'MakerSpace & Laboratorio de Robótica',
    basePriceCop: 25000,
    nextAvailability: 'Mañana, 3:30 PM',
    ratingAverage: 4.9,
    reviewsCount: 14,
    availabilitySchedule: [
      { day: 'Lunes', dayIndex: 1, times: ['15:30', '16:30', '17:30'] },
      { day: 'Miércoles', dayIndex: 3, times: ['15:30', '16:30', '17:30'] },
      { day: 'Viernes', dayIndex: 5, times: ['14:00', '15:00', '16:00'] }
    ],
    isFeatured: true,
    isAuthorized: true
  },
  {
    id: 'inst-sarah',
    userId: 'user-sarah',
    name: 'Sarah Delgado',
    grade: '10° B',
    areaSlug: 'matematicas',
    areaName: 'Matemáticas',
    avatarUrl: avatarSarah,
    headline: 'Medallista de olimpiadas de matemáticas y mentora de cálculo',
    biography: 'Entiendo lo frustrante que pueden ser las matemáticas cuando no se entienden desde la raíz conceptual. Conmigo aprenderás trucos visuales, métodos deductivos y resolución de problemas sin memorizar fórmulas a ciegas. Preparo para parciales, exámenes de estado y olimpiadas.',
    topics: [
      { id: 'top-5', name: 'Cálculo Diferencial e Integral', priceCop: 20000 },
      { id: 'top-6', name: 'Trigonometría y Funciones', priceCop: 18000 },
      { id: 'top-7', name: 'Álgebra Lineal y Factorización', priceCop: 18000 },
      { id: 'top-8', name: 'Estrategias para Olimpiadas', priceCop: 22000 }
    ],
    mode: 'ambas',
    locationId: 'loc-2',
    locationName: 'Biblioteca Central - Sala de Estudio B1',
    basePriceCop: 20000,
    nextAvailability: 'Jueves, 4:00 PM',
    ratingAverage: 5.0,
    reviewsCount: 19,
    availabilitySchedule: [
      { day: 'Martes', dayIndex: 2, times: ['14:30', '15:30', '16:30'] },
      { day: 'Jueves', dayIndex: 4, times: ['16:00', '17:00'] },
      { day: 'Sábado', dayIndex: 6, times: ['10:00', '11:00'] }
    ],
    isFeatured: true,
    isAuthorized: true
  },
  {
    id: 'inst-valeria',
    userId: 'user-valeria',
    name: 'Valeria Gómez',
    grade: '11° C',
    areaSlug: 'arte',
    areaName: 'Arte',
    avatarUrl: avatarValeria,
    headline: 'Ilustradora digital, acuarelista y creadora de cómics',
    biography: 'El arte es un lenguaje que todos podemos dominar si practicamos la observación. Te enseño desde las bases anatómicas y la perspectiva hasta el uso avanzado de capas, pinceles y teoría de luz y sombra en Procreate o acuarela tradicional.',
    topics: [
      { id: 'top-9', name: 'Ilustración Digital en Procreate / Photoshop', priceCop: 22000 },
      { id: 'top-10', name: 'Anatomía Humana y Posición Dinámica', priceCop: 22000 },
      { id: 'top-11', name: 'Teoría del Color y Paletas Armónicas', priceCop: 19000 },
      { id: 'top-12', name: 'Acuarela Botánica y Retrato', priceCop: 20000 }
    ],
    mode: 'presencial',
    locationId: 'loc-3',
    locationName: 'Taller de Artes Visuales',
    basePriceCop: 22000,
    nextAvailability: 'Viernes, 2:30 PM',
    ratingAverage: 4.8,
    reviewsCount: 11,
    availabilitySchedule: [
      { day: 'Miércoles', dayIndex: 3, times: ['14:00', '15:30'] },
      { day: 'Viernes', dayIndex: 5, times: ['14:30', '16:00'] }
    ],
    isFeatured: true,
    isAuthorized: true
  },
  {
    id: 'inst-lucas',
    userId: 'user-lucas',
    name: 'Lucas Benítez',
    grade: '10° A',
    areaSlug: 'musica',
    areaName: 'Música',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    headline: 'Guitarrista solista y productor musical independiente',
    biography: 'Toco guitarra desde hace 6 años en la orquesta del colegio y bandas de rock contemporáneo. En nuestras sesiones aprenderás acordes, fingerpicking, solos con escalas pentatónicas y cómo grabar tus propias canciones con una interfaz casera.',
    topics: [
      { id: 'top-13', name: 'Guitarra Acústica & Eléctrica', priceCop: 24000 },
      { id: 'top-14', name: 'Armonía y Lectura de Tablaturas', priceCop: 20000 },
      { id: 'top-15', name: 'Producción Musical en Ableton/FL Studio', priceCop: 26000 }
    ],
    mode: 'ambas',
    locationId: 'loc-4',
    locationName: 'Cabina de Ensayos y Producción Musical',
    basePriceCop: 24000,
    nextAvailability: 'Martes, 5:00 PM',
    ratingAverage: 4.9,
    reviewsCount: 8,
    availabilitySchedule: [
      { day: 'Martes', dayIndex: 2, times: ['15:00', '16:00', '17:00'] },
      { day: 'Jueves', dayIndex: 4, times: ['15:00', '16:00'] }
    ],
    isFeatured: true,
    isAuthorized: true
  },
  {
    id: 'inst-andres',
    userId: 'user-andres',
    name: 'Andrés Mendoza',
    grade: '11° B',
    areaSlug: 'ingles',
    areaName: 'Inglés',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    headline: 'Nivel C1 certificado, club de debate y preparación TOEFL',
    biography: 'El inglés no se aprende llenando fotocopias, se aprende hablando. Mis asesorías se enfocan en ganar confianza en el acento, ampliar vocabulario natural y entender modismos para entrevistas o exámenes internacionales.',
    topics: [
      { id: 'top-16', name: 'Conversación Fluida y Pronunciación', priceCop: 18000 },
      { id: 'top-17', name: 'Preparación Pruebas Saber 11 / TOEFL', priceCop: 20000 },
      { id: 'top-18', name: 'Gramática y Ensayos en Inglés', priceCop: 18000 }
    ],
    mode: 'virtual',
    locationId: null,
    locationName: 'Enlace Virtual (Google Meet)',
    basePriceCop: 18000,
    nextAvailability: 'Miércoles, 6:00 PM',
    ratingAverage: 4.7,
    reviewsCount: 16,
    availabilitySchedule: [
      { day: 'Lunes', dayIndex: 1, times: ['18:00', '19:00'] },
      { day: 'Miércoles', dayIndex: 3, times: ['18:00', '19:00'] },
      { day: 'Viernes', dayIndex: 5, times: ['17:00', '18:00'] }
    ],
    isFeatured: false,
    isAuthorized: true
  },
  {
    id: 'inst-elena',
    userId: 'user-elena',
    name: 'Elena Restrepo',
    grade: '10° C',
    areaSlug: 'ciencias-naturales',
    areaName: 'Ciencias naturales',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    headline: 'Apasionada por la bioquímica y experimentos de laboratorio',
    biography: '¿Te cuesta balancear ecuaciones químicas o memorizar los ciclos celulares? Desmenuzamos cada concepto mediante mapas mentales y analogías prácticas para que las ciencias naturales sean tu materia favorita.',
    topics: [
      { id: 'top-19', name: 'Química Orgánica y Estequiometría', priceCop: 20000 },
      { id: 'top-20', name: 'Biología Celular y Genética Mendeliana', priceCop: 20000 },
      { id: 'top-21', name: 'Física Clásica: Cinemática y Fuerzas', priceCop: 22000 }
    ],
    mode: 'presencial',
    locationId: 'loc-5',
    locationName: 'Laboratorio de Ciencias Naturales 1',
    basePriceCop: 20000,
    nextAvailability: 'Lunes, 3:30 PM',
    ratingAverage: 5.0,
    reviewsCount: 7,
    availabilitySchedule: [
      { day: 'Lunes', dayIndex: 1, times: ['15:30', '16:30'] },
      { day: 'Jueves', dayIndex: 4, times: ['15:30', '16:30'] }
    ],
    isFeatured: false,
    isAuthorized: true
  },
  {
    id: 'inst-camilo',
    userId: 'user-camilo',
    name: 'Camilo Rojas',
    grade: '11° A',
    areaSlug: 'liderazgo',
    areaName: 'Liderazgo',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    headline: 'Secretario General del MUN del colegio y coach de oratoria',
    biography: 'Perder el miedo a hablar en público y estructurar argumentos contundentes es una habilidad que te abrirá puertas toda la vida. Te enseño lenguaje corporal, persuasión, refutación y resolución de crisis en comités.',
    topics: [
      { id: 'top-22', name: 'Oratoria y Manejo del Pánico Escénico', priceCop: 16000 },
      { id: 'top-23', name: 'Preparación para Modelos ONU (MUN)', priceCop: 18000 },
      { id: 'top-24', name: 'Técnicas de Negociación y Consenso', priceCop: 16000 }
    ],
    mode: 'ambas',
    locationId: 'loc-6',
    locationName: 'Terraza y Cafetería Estudiantil',
    basePriceCop: 16000,
    nextAvailability: 'Sábado, 9:00 AM',
    ratingAverage: 4.8,
    reviewsCount: 9,
    availabilitySchedule: [
      { day: 'Viernes', dayIndex: 5, times: ['15:00', '16:30'] },
      { day: 'Sábado', dayIndex: 6, times: ['09:00', '10:30'] }
    ],
    isFeatured: false,
    isAuthorized: true
  },
  {
    id: 'inst-juliana',
    userId: 'user-juliana',
    name: 'Juliana Pardo',
    grade: '10° B',
    areaSlug: 'lengua-literatura',
    areaName: 'Lengua y literatura',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    headline: 'Escritora escolar galardonada y correctora de estilo',
    biography: 'Escribir bien no es un don reservado para unos pocos, es una técnica de claridad. Te ayudo a estructurar tesis sólidas para tus ensayos, pulir tu sintaxis y redactar análisis literarios profundos con argumentos propios.',
    topics: [
      { id: 'top-25', name: 'Estructuración de Ensayos Argumentativos', priceCop: 18000 },
      { id: 'top-26', name: 'Análisis Crítico de Obras Literarias', priceCop: 16000 },
      { id: 'top-27', name: 'Taller de Cuento y Escritura Creativa', priceCop: 18000 }
    ],
    mode: 'virtual',
    locationId: null,
    locationName: 'Enlace Virtual (Google Meet)',
    basePriceCop: 18000,
    nextAvailability: 'Lunes, 4:00 PM',
    ratingAverage: 4.9,
    reviewsCount: 12,
    availabilitySchedule: [
      { day: 'Lunes', dayIndex: 1, times: ['16:00', '17:00'] },
      { day: 'Miércoles', dayIndex: 3, times: ['16:00', '17:00'] }
    ],
    isFeatured: false,
    isAuthorized: true
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    bookingId: 'book-completed-1',
    instructorId: 'inst-mateo',
    studentName: 'Camila Torres',
    studentGrade: '10° A',
    rating: 5,
    comment: 'Mateo es un crack explicando React y estados. En una sola sesión entendí lo que no pude en dos semanas de clase. ¡100% recomendado!',
    date: '2026-10-12'
  },
  {
    id: 'rev-2',
    bookingId: 'book-completed-2',
    instructorId: 'inst-sarah',
    studentName: 'Nicolás Vega',
    studentGrade: '11° B',
    rating: 5,
    comment: 'Sarah me salvó el examen de cálculo diferencial. Tiene una paciencia enorme y te explica gráficamente por qué funciona cada teorema.',
    date: '2026-10-10'
  },
  {
    id: 'rev-3',
    bookingId: 'book-completed-3',
    instructorId: 'inst-valeria',
    studentName: 'Daniela Castro',
    studentGrade: '9° C',
    rating: 5,
    comment: 'El taller de acuarelas fue increíble. Me enseñó a combinar tonos sin ensuciar el papel. Quiero repetir sesión pronto.',
    date: '2026-10-08'
  },
  {
    id: 'rev-4',
    bookingId: 'book-completed-4',
    instructorId: 'inst-mateo',
    studentName: 'Santiago Peña',
    studentGrade: '11° C',
    rating: 5,
    comment: 'Hicimos un circuito con sensores de distancia en Arduino. Mateo trajo los componentes al MakerSpace y funcionó a la primera.',
    date: '2026-10-05'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'book-1',
    studentId: 'user-camila',
    studentName: 'Camila Torres',
    studentEmail: 'camila.torres@bam.edu.co',
    studentGrade: '10° A',
    instructorId: 'inst-mateo',
    instructorName: 'Mateo Silva',
    instructorAvatar: avatarMateo,
    areaSlug: 'tecnologia-programacion',
    areaName: 'Tecnología y programación',
    topicName: 'Desarrollo Web con React y HTML/CSS',
    date: '2026-10-20',
    time: '15:30',
    durationMinutes: 60,
    mode: 'presencial',
    locationName: 'MakerSpace & Laboratorio de Robótica (Sala T-204)',
    priceCop: 25000,
    status: 'Pendiente',
    studentMessage: 'Necesito apoyo para entender cómo usar useEffect y conectar componentes con props en mi proyecto final.',
    createdAt: '2026-10-15T14:20:00Z'
  },
  {
    id: 'book-2',
    studentId: 'user-camila',
    studentName: 'Camila Torres',
    studentEmail: 'camila.torres@bam.edu.co',
    studentGrade: '10° A',
    instructorId: 'inst-sarah',
    instructorName: 'Sarah Delgado',
    instructorAvatar: avatarSarah,
    areaSlug: 'matematicas',
    areaName: 'Matemáticas',
    topicName: 'Cálculo Diferencial e Integral',
    date: '2026-10-22',
    time: '16:00',
    durationMinutes: 60,
    mode: 'presencial',
    locationName: 'Biblioteca Central - Sala de Estudio B1',
    priceCop: 20000,
    status: 'Aceptada',
    studentMessage: 'Quiero repasar optimización de funciones y máximos/mínimos para el simulacro.',
    createdAt: '2026-10-14T09:10:00Z'
  },
  {
    id: 'book-completed-1',
    studentId: 'user-camila',
    studentName: 'Camila Torres',
    studentEmail: 'camila.torres@bam.edu.co',
    studentGrade: '10° A',
    instructorId: 'inst-mateo',
    instructorName: 'Mateo Silva',
    instructorAvatar: avatarMateo,
    areaSlug: 'tecnologia-programacion',
    areaName: 'Tecnología y programación',
    topicName: 'Fundamentos de Python y Lógica',
    date: '2026-10-12',
    time: '16:30',
    durationMinutes: 60,
    mode: 'presencial',
    locationName: 'MakerSpace & Laboratorio de Robótica',
    priceCop: 22000,
    status: 'Completada',
    studentMessage: 'Sesión completada satisfactoriamente con ejercicios resueltos.',
    createdAt: '2026-10-10T11:00:00Z'
  }
];

export const DEMO_USERS = [
  {
    id: 'user-camila',
    email: 'camila.torres@bam.edu.co',
    fullName: 'Camila Torres',
    grade: '10° A',
    role: 'estudiante', // 'estudiante' | 'instructor' | 'administrador'
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    bio: 'Estudiante de décimo grado apasionada por el diseño digital y la programación interactiva.'
  },
  {
    id: 'user-mateo',
    email: 'mateo.silva@bam.edu.co',
    fullName: 'Mateo Silva',
    grade: '11° A',
    role: 'instructor',
    instructorId: 'inst-mateo',
    avatarUrl: avatarMateo,
    bio: 'Instructor autorizado en Tecnología y Programación.'
  },
  {
    id: 'user-admin',
    email: 'coordinacion@bam.edu.co',
    fullName: 'Prof. Alberto Rivas',
    grade: 'Coordinación Académica',
    role: 'administrador',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    bio: 'Administrador general y coordinador del programa de talentos estudiantiles BAM ON STAGE.'
  }
];

// Almacenamiento local reactivo para persistencia entre recargas
const STORAGE_KEYS = {
  AREAS: 'bam_areas_v1',
  INSTRUCTORS: 'bam_instructors_v1',
  BOOKINGS: 'bam_bookings_v1',
  REVIEWS: 'bam_reviews_v1',
  LOCATIONS: 'bam_locations_v1',
  USERS: 'bam_users_v1',
  CURRENT_USER: 'bam_current_user_v1',
  TASKS: 'bam_tasks_v1',
  APPLICATIONS: 'bam_applications_v1'
};

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Resolver taller de derivadas por regla de la cadena (Puntos 1 al 15)',
    description: 'Practicar los ejercicios de cálculo acordados en la asesoría con Sarah. Enfatizar en simplificación algebraica.',
    areaSlug: 'matematicas',
    areaName: 'Matemáticas',
    priority: 'alta', // 'baja', 'media', 'alta'
    dueDate: '2026-10-24',
    completed: false,
    assignedBy: 'Sarah Delgado (Instructora)',
    assignedToUserId: 'student-1',
    resourceLink: 'https://campus.institucional.edu/talleres/calculo-taller3.pdf',
    createdAt: '2026-10-20T10:00:00.000Z'
  },
  {
    id: 'task-2',
    title: 'Implementar componente de tarjeta interactiva con Tailwind CSS',
    description: 'Crear el mockup del catálogo de robótica con efectos hover y props tipadas como vimos en la sesión de programación.',
    areaSlug: 'tecnologia-programacion',
    areaName: 'Tecnología y programación',
    priority: 'alta',
    dueDate: '2026-10-25',
    completed: false,
    assignedBy: 'Mateo Silva (Instructor)',
    assignedToUserId: 'student-1',
    resourceLink: 'https://github.com/bam-on-stage/practica-web',
    createdAt: '2026-10-20T14:30:00.000Z'
  },
  {
    id: 'task-3',
    title: 'Grabar audio de 3 minutos: Discurso de presentación en inglés',
    description: 'Enfocar en la entonación de conectores como "Furthermore", "In addition" y entonación de preguntas.',
    areaSlug: 'ingles',
    areaName: 'Inglés',
    priority: 'media',
    dueDate: '2026-10-27',
    completed: false,
    assignedBy: 'Valeria Restrepo (Instructora)',
    assignedToUserId: 'student-1',
    createdAt: '2026-10-21T09:00:00.000Z'
  },
  {
    id: 'task-4',
    title: 'Boceto a grafito de figura humana con técnica de 7 cabezas',
    description: 'Entregar dibujo exploratorio para corrección de proporciones antes de pasar a acuarelas.',
    areaSlug: 'arte',
    areaName: 'Arte',
    priority: 'baja',
    dueDate: '2026-10-29',
    completed: true,
    completedAt: '2026-10-21T11:00:00.000Z',
    assignedBy: 'Diego Morales (Instructor)',
    assignedToUserId: 'student-1',
    createdAt: '2026-10-18T16:00:00.000Z'
  },
  {
    id: 'task-5',
    title: 'Lectura del documento de posición para Modelo ONU (Comité DDHH)',
    description: 'Revisar antecedentes y resoluciones previas de la delegación asignada.',
    areaSlug: 'liderazgo',
    areaName: 'Liderazgo',
    priority: 'media',
    dueDate: '2026-10-28',
    completed: false,
    assignedBy: 'Personal (Meta propia)',
    assignedToUserId: 'student-1',
    createdAt: '2026-10-21T08:00:00.000Z'
  }
];

function getStored(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export const demoStore = {
  getAreas() {
    return getStored(STORAGE_KEYS.AREAS, INITIAL_AREAS);
  },
  saveAreas(areas) {
    setStored(STORAGE_KEYS.AREAS, areas);
  },
  getLocations() {
    return getStored(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
  },
  saveLocations(locations) {
    setStored(STORAGE_KEYS.LOCATIONS, locations);
  },
  getInstructors() {
    return getStored(STORAGE_KEYS.INSTRUCTORS, INITIAL_INSTRUCTORS);
  },
  getInstructorById(id) {
    const list = this.getInstructors();
    return list.find(i => i.id === id || i.userId === id);
  },
  updateInstructor(updated) {
    const list = this.getInstructors().map(i => i.id === updated.id ? { ...i, ...updated } : i);
    setStored(STORAGE_KEYS.INSTRUCTORS, list);
    return updated;
  },
  getBookings() {
    return getStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },
  createBooking(newBooking) {
    const list = this.getBookings();
    const created = {
      ...newBooking,
      id: 'book-' + Date.now(),
      status: 'Pendiente',
      createdAt: new Date().toISOString()
    };
    list.unshift(created);
    setStored(STORAGE_KEYS.BOOKINGS, list);
    return created;
  },
  updateBookingStatus(bookingId, newStatus) {
    const list = this.getBookings().map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return b;
    });
    setStored(STORAGE_KEYS.BOOKINGS, list);
    return list.find(b => b.id === bookingId);
  },
  getReviews(instructorId = null) {
    const list = getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (!instructorId) return list;
    return list.filter(r => r.instructorId === instructorId);
  },
  createReview(review) {
    const list = this.getReviews();
    const created = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    list.unshift(created);
    setStored(STORAGE_KEYS.REVIEWS, list);

    // Recalcular promedio en el instructor
    const instReviews = list.filter(r => r.instructorId === review.instructorId);
    const sum = instReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round((sum / instReviews.length) * 10) / 10;
    
    const instructors = this.getInstructors().map(inst => {
      if (inst.id === review.instructorId) {
        return { ...inst, ratingAverage: avg, reviewsCount: instReviews.length };
      }
      return inst;
    });
    setStored(STORAGE_KEYS.INSTRUCTORS, instructors);

    return created;
  },
  getUsers() {
    return getStored(STORAGE_KEYS.USERS, DEMO_USERS);
  },
  updateUserRole(userId, newRole) {
    const users = this.getUsers().map(u => u.id === userId ? { ...u, role: newRole } : u);
    setStored(STORAGE_KEYS.USERS, users);
    return users.find(u => u.id === userId);
  },
  getCurrentUser() {
    return getStored(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
  },
  setCurrentUser(user) {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  },
  getTasks() {
    return getStored(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  },
  createTask(taskData) {
    const list = this.getTasks();
    const created = {
      ...taskData,
      id: 'task-' + Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(created);
    setStored(STORAGE_KEYS.TASKS, list);
    return created;
  },
  updateTask(taskId, updates) {
    const list = this.getTasks().map(t => {
      if (t.id === taskId) {
        return { ...t, ...updates, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    setStored(STORAGE_KEYS.TASKS, list);
    return list.find(t => t.id === taskId);
  },
  toggleTask(taskId) {
    const list = this.getTasks().map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : null
        };
      }
      return t;
    });
    setStored(STORAGE_KEYS.TASKS, list);
    return list.find(t => t.id === taskId);
  },
  deleteTask(taskId) {
    const list = this.getTasks().filter(t => t.id !== taskId);
    setStored(STORAGE_KEYS.TASKS, list);
    return true;
  },
  getApplications() {
    return getStored(STORAGE_KEYS.APPLICATIONS, []);
  },
  createInstructorApplication(application) {
    const list = this.getApplications();
    const createdApp = {
      ...application,
      id: 'app-' + Date.now(),
      status: 'Aprobada',
      createdAt: new Date().toISOString()
    };
    list.unshift(createdApp);
    setStored(STORAGE_KEYS.APPLICATIONS, list);

    // Registrar al nuevo instructor para que quede disponible de inmediato en la plataforma
    const instructors = this.getInstructors();
    const existingIdx = instructors.findIndex(i =>
      (application.userId && i.userId === application.userId) ||
      i.name.toLowerCase() === application.fullName.toLowerCase()
    );

    const newInstructor = {
      id: existingIdx >= 0 ? instructors[existingIdx].id : 'inst-' + Date.now(),
      userId: application.userId || 'user-' + Date.now(),
      name: application.fullName,
      grade: application.grade || '10° Grado',
      areaSlug: application.areaSlug,
      areaName: application.areaName,
      avatarUrl: application.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      headline: application.headline || `Instructor en ${application.areaName}`,
      biography: application.biography || `Estudiante con talento para dar refuerzos y asesorías pedagógicas en ${application.areaName}.`,
      topics: application.topics && application.topics.length > 0
        ? application.topics
        : [{ id: 'top-' + Date.now(), name: `Refuerzo General en ${application.areaName}`, priceCop: application.basePriceCop || 20000 }],
      mode: application.mode || 'ambas',
      locationId: 'loc-1',
      locationName: application.locationName || 'MakerSpace o Biblioteca Central',
      basePriceCop: application.basePriceCop || 20000,
      nextAvailability: 'Esta semana',
      ratingAverage: 5.0,
      reviewsCount: 1,
      availabilitySchedule: application.availabilitySchedule && application.availabilitySchedule.length > 0
        ? application.availabilitySchedule
        : [
            { day: 'Lunes', dayIndex: 1, times: ['15:00', '16:00', '17:00'] },
            { day: 'Miércoles', dayIndex: 3, times: ['15:00', '16:00', '17:00'] },
            { day: 'Viernes', dayIndex: 5, times: ['14:00', '15:00', '16:00'] }
          ],
      isFeatured: true,
      isAuthorized: true
    };

    if (existingIdx >= 0) {
      instructors[existingIdx] = { ...instructors[existingIdx], ...newInstructor };
    } else {
      instructors.unshift(newInstructor);
    }
    setStored(STORAGE_KEYS.INSTRUCTORS, instructors);

    return { application: createdApp, instructor: newInstructor };
  },
  resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.AREAS);
    localStorage.removeItem(STORAGE_KEYS.INSTRUCTORS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.LOCATIONS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
  }
};

