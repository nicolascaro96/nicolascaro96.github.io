// ============================================================
//  ALL SITE CONTENT LIVES HERE. Edit this file to update the CV.
//  Bilingual fields use { en: "...", es: "..." }.
// ============================================================

const SITE = {
  name: "Nicolás Caro",
  location: { en: "Barcelona, Spain", es: "Barcelona, España" },
  photo: "assets/img/profile.jpg",
  cvFile: "assets/cv/CV_Nicolas_Caro.pdf",

  role: {
    en: "Transport Engineer · Data Science for Smart Mobility",
    es: "Ingeniero de Transporte · Ciencia de Datos para la Movilidad",
  },
  tagline: {
    en: "I use data to understand and improve how cities move — from origin–destination matrices built on transit validations and mobile-phone data to GIS analysis and decision-ready dashboards.",
    es: "Uso los datos para entender y mejorar cómo se mueven las ciudades — desde matrices origen–destino construidas con validaciones de transporte público y datos de telefonía móvil hasta análisis SIG y cuadros de mando para la toma de decisiones.",
  },

  about: {
    en: [
      "I'm a Civil Engineer with a Master's in Urban Mobility, specialised in data science for smart mobility. My work includes developing OD matrix algorithms, mobility dashboards and analytical tools for transport planning projects across Europe, Latin America and the Middle East.",
      "With strong skills in Python, R, Power BI and GIS, I enjoy connecting data, technology and mobility to support smarter and more sustainable cities.",
    ],
    es: [
      "Soy Ingeniero Civil con un Máster en Movilidad Urbana, especializado en ciencia de datos aplicada a la movilidad inteligente. Mi trabajo incluye el desarrollo de algoritmos de matrices OD, cuadros de mando de movilidad y herramientas analíticas para proyectos de planificación del transporte en Europa, Latinoamérica y Oriente Medio.",
      "Con sólidas competencias en Python, R, Power BI y SIG, disfruto conectando datos, tecnología y movilidad para contribuir a ciudades más inteligentes y sostenibles.",
    ],
  },

  experience: [
    {
      company: "SENER",
      title: { en: "Transport Economics and Planning Engineer", es: "Ingeniero de Economía y Planificación del Transporte" },
      period: { en: "2022 – Present", es: "2022 – Actualidad" },
      location: "Barcelona, Spain",
      bullets: {
        en: [
          "Developed a Python-based algorithm to infer public transport origin–destination (OD) matrices using the trip-chaining method, integrating GIS-based zoning and interactive Power BI dashboards (Basque Country).",
          "Led analytical tasks for large-scale mobility studies, including the design of geographical zonings and the generation of OD matrices from public transport validations and mobile-phone data (Panama).",
          "Contributed to Girona's Sustainable Urban Mobility Plan (SUMP) with GIS-based maps, spatial analyses and scenario evaluations for public and private transport.",
          "Supported feasibility and integration studies for innovative and disruptive mobility services, providing data-driven insights for strategic planning (Saudi Arabia).",
          "Assisted as Lead Technical Advisor on the extension of the Red Line light rail (Jerusalem).",
        ],
        es: [
          "Desarrollé un algoritmo en Python para inferir matrices origen–destino (OD) de transporte público mediante el método de encadenamiento de viajes, integrando zonificación SIG y cuadros de mando interactivos en Power BI (País Vasco).",
          "Lideré tareas analíticas en estudios de movilidad a gran escala, incluyendo el diseño de zonificaciones y la generación de matrices OD a partir de validaciones de transporte público y datos de telefonía móvil (Panamá).",
          "Contribuí al Plan de Movilidad Urbana Sostenible (PMUS) de Girona con cartografía SIG, análisis espaciales y evaluación de escenarios para transporte público y privado.",
          "Apoyé estudios de viabilidad e integración de servicios de movilidad innovadores y disruptivos, aportando análisis de datos para la planificación estratégica (Arabia Saudí).",
          "Asistí como Asesor Técnico Principal en la extensión de la Línea Roja del tren ligero (Jerusalén).",
        ],
      },
    },
    {
      company: "WSP",
      title: { en: "Transport Engineer", es: "Ingeniero de Transporte" },
      period: { en: "2021 – 2022", es: "2021 – 2022" },
      location: "Bogotá, Colombia",
      bullets: {
        en: [
          "Led the multidisciplinary monthly report and KPI dashboards to review the performance and status of Bogotá Metro Line 1, using R Studio and Power BI.",
          "Compiled all project databases to provide a complete picture of items sent, received and in progress.",
        ],
        es: [
          "Lideré el informe mensual multidisciplinar y los cuadros de mando de KPI para el seguimiento del desempeño y estado de la Línea 1 del Metro de Bogotá, con R Studio y Power BI.",
          "Consolidé todas las bases de datos del proyecto para disponer de una visión completa de los elementos enviados, recibidos y en curso.",
        ],
      },
    },
  ],

  // interactive examples built with open data (each one is a standalone page under demos/)
  demos: [
    {
      title: { en: "Trips between districts in the València metropolitan area", es: "Viajes entre distritos del área metropolitana de València" },
      kicker: { en: "Open data · MITMA Big Data mobility study + GTFS", es: "Datos abiertos · Estudio de movilidad Big Data MITMA + GTFS" },
      description: {
        en: "Desire-line dashboard for an average weekday and weekend day (May 2025) across 105 MITMA districts, built from mobile-phone data downloaded with pySpainMobility. Filter by time of day and trip purpose, click a district to see its flows, and overlay the metro, tram, commuter-rail and intercity-bus networks from their GTFS feeds.",
        es: "Dashboard de líneas de deseo de un día promedio laboral y no laboral (mayo 2025) en 105 distritos MITMA, a partir de datos de telefonía móvil descargados con pySpainMobility. Permite filtrar por franja horaria y motivo, hacer clic en un distrito para ver sus flujos y superponer las redes de metro, tranvía, Cercanías y autobús interurbano a partir de sus GTFS.",
      },
      tags: ["OD matrices", "Mobile data", "GTFS", "Python", "Leaflet"],
      image: "assets/img/demo-valencia-od.jpg",
      link: "demos/valencia-od/",
    },
  ],

  // tags drive the filter buttons above the project grid
  projects: [
    {
      title: { en: "Public Transport OD Matrices by Trip Chaining", es: "Matrices OD de Transporte Público por Encadenamiento de Viajes" },
      client: "SENER · Basque Country",
      year: "",
      tags: ["OD matrices", "Python", "Power BI"],
      description: {
        en: "Python algorithm that infers origin–destination matrices from smart-card validations using trip chaining, with GIS zoning and interactive Power BI dashboards.",
        es: "Algoritmo en Python que infiere matrices origen–destino a partir de validaciones con tarjeta mediante encadenamiento de viajes, con zonificación SIG y cuadros de mando en Power BI.",
      },
      image: "",
      link: "",
    },
    {
      title: { en: "Panama Metropolitan Mobility Study", es: "Estudio de Movilidad del Área Metropolitana de Panamá" },
      client: "SENER · Panama",
      year: "",
      tags: ["OD matrices", "Mobile data", "GIS"],
      description: {
        en: "Design of the study zoning and generation of OD matrices combining public transport validations and mobile-phone data for a large-scale metropolitan mobility study.",
        es: "Diseño de la zonificación y generación de matrices OD combinando validaciones de transporte público y datos de telefonía móvil para un estudio de movilidad metropolitano a gran escala.",
      },
      image: "",
      link: "",
    },
    {
      title: { en: "Girona Sustainable Urban Mobility Plan", es: "Plan de Movilidad Urbana Sostenible de Girona" },
      client: "SENER · Spain",
      year: "",
      tags: ["GIS", "Planning"],
      description: {
        en: "GIS maps, spatial analysis and scenario evaluation for public and private transport within the city's SUMP.",
        es: "Cartografía SIG, análisis espacial y evaluación de escenarios de transporte público y privado dentro del PMUS de la ciudad.",
      },
      image: "",
      link: "",
    },
    {
      title: { en: "Innovative Mobility Services Feasibility", es: "Viabilidad de Servicios de Movilidad Innovadores" },
      client: "SENER · Saudi Arabia",
      year: "",
      tags: ["Planning", "Data analytics"],
      description: {
        en: "Feasibility and integration studies for disruptive mobility services, with data-driven insights for strategic planning.",
        es: "Estudios de viabilidad e integración de servicios de movilidad disruptivos, con análisis de datos para la planificación estratégica.",
      },
      image: "",
      link: "",
    },
    {
      title: { en: "Jerusalem Red Line LRT Extension", es: "Extensión de la Línea Roja del Tren Ligero de Jerusalén" },
      client: "SENER · Israel",
      year: "",
      tags: ["Rail", "Technical advisory"],
      description: {
        en: "Support as Lead Technical Advisor on the extension of the Red Line light rail.",
        es: "Apoyo como Asesor Técnico Principal en la extensión de la Línea Roja del tren ligero.",
      },
      image: "",
      link: "",
    },
    {
      title: { en: "Bogotá Metro Line 1 — KPI Reporting", es: "Metro de Bogotá Línea 1 — Seguimiento de KPI" },
      client: "WSP · Colombia",
      year: "2021–2022",
      tags: ["Rail", "Power BI", "Data analytics"],
      description: {
        en: "Monthly multidisciplinary reporting and KPI dashboards in R Studio and Power BI to track project performance and status.",
        es: "Informe mensual multidisciplinar y cuadros de mando de KPI en R Studio y Power BI para el seguimiento del desempeño y estado del proyecto.",
      },
      image: "",
      link: "",
    },
  ],

  skills: [
    {
      group: { en: "Transport & mobility", es: "Transporte y movilidad" },
      items: ["OD matrix development", "Transport & mobility analysis", "Urban & transport planning", "Scenario analysis", "Quantitative modelling"],
    },
    {
      group: { en: "Data & programming", es: "Datos y programación" },
      items: ["Python", "Pandas", "NumPy", "R Studio", "SQL", "Excel & VBA"],
    },
    {
      group: { en: "GIS & visualisation", es: "SIG y visualización" },
      items: ["QGIS", "ArcGIS", "GeoPandas", "Power BI"],
    },
    {
      group: { en: "Modelling & engineering tools", es: "Herramientas de modelación e ingeniería" },
      items: ["EMME", "PTV Vissim", "Revit", "Navisworks"],
    },
  ],

  education: [
    {
      degree: { en: "Master's Degree in Urban Mobility", es: "Máster en Movilidad Urbana" },
      school: "Universitat Politècnica de Catalunya · Barcelona, Spain",
      period: "2022 – 2024",
    },
    {
      degree: { en: "Bachelor of Civil Engineering, Business Minor", es: "Ingeniería Civil, opción en Administración" },
      school: "Universidad de los Andes · Bogotá, Colombia",
      period: "2016 – 2021",
    },
    {
      degree: { en: "Intensive French Course", es: "Curso Intensivo de Francés" },
      school: "Université Grenoble Alpes · Grenoble, France",
      period: "2015 – 2016",
    },
  ],

  courses: [
    { en: "Data Spaces for Mobility", es: "Espacios de Datos para la Movilidad" },
    { en: "PTV Vissim Modelling", es: "Modelación en PTV Vissim" },
    { en: "Modal Split Model Construction", es: "Construcción de Modelos de Reparto Modal" },
  ],

  languages: [
    { name: { en: "Spanish", es: "Español" }, level: { en: "Native", es: "Nativo" } },
    { name: { en: "English", es: "Inglés" }, level: { en: "Fluent", es: "Fluido" } },
    { name: { en: "French", es: "Francés" }, level: { en: "B2", es: "B2" } },
  ],

  contact: [
    { label: "Email", value: "nicolascaro1996@gmail.com", href: "mailto:nicolascaro1996@gmail.com" },
    { label: "LinkedIn", value: "linkedin.com/in/nicolascaro19", href: "https://www.linkedin.com/in/nicolascaro19" },
    // { label: "GitHub", value: "github.com/USERNAME", href: "https://github.com/USERNAME" },
  ],
};

// UI strings (normally no need to edit)
const UI = {
  nav: {
    about: { en: "About", es: "Sobre mí" },
    experience: { en: "Experience", es: "Experiencia" },
    projects: { en: "Projects", es: "Proyectos" },
    demos: { en: "Live demos", es: "Ejemplos" },
    skills: { en: "Skills", es: "Habilidades" },
    education: { en: "Education", es: "Formación" },
    contact: { en: "Contact", es: "Contacto" },
  },
  cta: {
    contact: { en: "Get in touch", es: "Contactar" },
    cv: { en: "Download CV", es: "Descargar CV" },
  },
  coursesTitle: { en: "Training courses", es: "Cursos de formación" },
  languagesTitle: { en: "Languages", es: "Idiomas" },
  contactText: {
    en: "Open to new projects and collaborations. The best way to reach me is by email or LinkedIn.",
    es: "Abierto a nuevos proyectos y colaboraciones. La mejor forma de contactarme es por correo o LinkedIn.",
  },
  all: { en: "All", es: "Todos" },
  demos: {
    title: { en: "Interactive examples", es: "Ejemplos interactivos" },
    intro: {
      en: "Working examples of the kind of analysis I do in projects, rebuilt with open data so they can be shared.",
      es: "Ejemplos funcionales del tipo de análisis que hago en los proyectos, reconstruidos con datos abiertos para poder compartirlos.",
    },
    open: { en: "Open dashboard ↗", es: "Abrir dashboard ↗" },
  },
};
