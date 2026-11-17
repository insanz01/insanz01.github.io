export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
  year: string;
  url: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  stack?: string;
  highlights: string[];
}

export interface ExpertiseItem {
  title: string;
  description: string;
}

export interface StackCategory {
  label: string;
  items: string;
}

export interface EducationItem {
  degree: string;
  school: string;
}

export interface OwnProductItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  url: string;
}

export interface StoreItem {
  id: string;
  name: string;
  platform: string;
  description: string;
  url: string;
}

export const PROFILE = {
  name: "Muhammad Insan Kamil",
  shortName: "Insan Kamil",
  role: "Senior Backend Engineer & Tech Lead",
  location: "Jakarta, Indonesia",
  email: "insankamil002@gmail.com",
  github: "https://github.com/insanz01",
  linkedin: "https://linkedin.com/in/",
  summary:
    "Backend Engineer with 9 years of professional experience since 2017, evolving from Frontend development into a specialized Backend expert and Technical Lead. Proficient in architecting high-scale systems, microservices, and AI-driven automation using Go, Node.js, and Python.",
};

export const CORE_EXPERTISE: ExpertiseItem[] = [
  {
    title: "AI & Automation",
    description:
      "RAG systems, LLM fine-tuning (Gemini/OpenAI), and AI-driven business logic accuracy.",
  },
  {
    title: "Performance Backend",
    description:
      "High-concurrency systems in Golang & Node.js with optimized query engines and low latency.",
  },
  {
    title: "System Modernization",
    description:
      "Strategic migration from legacy monoliths to scalable microservices with zero downtime.",
  },
  {
    title: "Engineering Leadership",
    description:
      "Establishing CI/CD standards, mentoring dev teams, and architecting long-term tech roadmaps.",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "crm-coster",
    title: "CRM Coster",
    description:
      "Advanced Customer Relationship Management system with automated lead tracking and real-time sales analytics.",
    stack: "Node.js · PostgreSQL · React",
    year: "Live",
    url: "https://crm.coster.id",
  },
  {
    id: "beranda-toko",
    title: "Beranda Toko CMS",
    description:
      "Modular Content Management System optimized for high-performance e-commerce storefronts and multi-channel catalogs.",
    stack: "Headless CMS · REST API · Tailwind CSS",
    year: "Live",
    url: "https://cms.berandatoko.com",
  },
  {
    id: "stq-alkautsar",
    title: "Sekolah Tahfidzul Al Kautsar",
    description:
      "Digital management platform for tracking Quranic memorization progress and student academic records.",
    stack: "Full-Stack Web · MySQL",
    year: "Live",
    url: "https://stqalkautsar.com",
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Senior Backend Engineer",
    company: "Periksa.ID (Jakarta)",
    period: "Apr 2024 – Present",
    stack: "Golang (Gin), MySQL, MongoDB, Gemini AI, OpenAI, WebSockets, RAG, LLM Fine-tuning",
    highlights: [
      "Engineered Gemini AI & OpenAI services with RAG, improving clinical response accuracy by 85%.",
      "Orchestrated Medical, HR, and Reporting migration from Node.js to Golang (3x faster processing).",
      "Designed intelligent rate limiter & caching layers, reducing annual third-party API costs by 30%.",
      "Built WhatsApp Medical Bots & WebSocket infrastructure handling thousands of concurrent sessions.",
    ],
  },
  {
    role: "Freelance Backend Engineer",
    company: "Hudoro Solusi Digital",
    period: "Feb 2024 – Aug 2024",
    stack: "Node.js, MySQL, Google Pub/Sub",
    highlights: [
      "Developed TUV NORD Central & Budgeting App backend in Node.js with 99.9% uptime.",
      "Implemented Google Pub/Sub for real-time asynchronous communication across microservices.",
      "Streamlined budgeting reconciliation, reducing manual data entry errors by 40%.",
    ],
  },
  {
    role: "Full Stack Engineer",
    company: "Skyshi",
    period: "Feb 2024 – Jun 2024",
    stack: "React.js, Tailwind CSS, Node.js, MongoDB, Redis",
    highlights: [
      "Optimized AcuityQuick & Moladin (Mofi Engine) with Redis caching, cutting API latency by 60% (sub-200ms).",
      "Implemented Microfrontend architecture, boosting squad independence and dev velocity by 30%.",
    ],
  },
  {
    role: "Full Stack Engineer & Tech Lead",
    company: "Memofy Dev Studio",
    period: "Sep 2020 – Sep 2023",
    stack: "Node.js, React, Socket.io, WebRTC, MySQL, Redis",
    highlights: [
      "Built Rekmed (Medical Records) with RBAC & encryption (50% faster retrieval) and MEMODUL headless CMS.",
      "Delivered SAHABATMU (WebRTC/Socket.io), Smart Attendance (99% unauthorized reduction), and Digiteller POS (50+ stores).",
      "Architected Forma handling 10,000+ responses/hour and mentored a team of 5+ developers with CI/CD standards.",
    ],
  },
  {
    role: "Full Stack & Backend Engineer",
    company: "Jatis Mobile",
    period: "Apr 2022 – Aug 2023",
    stack: "Golang (Gin/Echo), PostgreSQL, RabbitMQ, Next.js",
    highlights: [
      "Built high-concurrency Golang APIs and WhatsApp Business API workflows for Bakuul & Chat Commerce.",
      "Designed an idempotency layer for Jessie (Lotte Service) multi-channel payment gateways.",
      "Engineered RabbitMQ data pipelines for CRM Electrolux handling 100k+ mass record imports.",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "PT ID Metafora (Yogyakarta)",
    period: "Jan 2020 – Mar 2020",
    stack: "CodeIgniter 4, Express.js, Vue.js, React.js",
    highlights: [
      "Developed scalable crowdfunding systems, online store catalogs, and mobile hybrid applications.",
    ],
  },
  {
    role: "Frontend Engineer",
    company: "PT Santara Daya Inspiratama (Yogyakarta)",
    period: "Jan 2019 – Jun 2019",
    stack: "Vue.js, Vuetify",
    highlights: [
      "Led system rewrite of Santara.co.id & Photostory Dashboard from AngularJS to Vue.js.",
      "Optimized dividend calculation logic and real-time investment portfolio tracking.",
    ],
  },
];

export const STACK: StackCategory[] = [
  { label: "Languages", items: "PHP, Node.js, Python, Golang, Java" },
  { label: "Frontend", items: "Vue.js, React.js, HTML5/CSS3, Tailwind, Svelte, Next.js, Nuxt.js" },
  { label: "Data & Cache", items: "MySQL, MongoDB, PostgreSQL, Redis" },
  { label: "Architecture", items: "Microservices, RESTful API, gRPC, RabbitMQ, Google Pub/Sub, Docker, Git, Agile/Scrum" },
];

export const EDUCATION: EducationItem[] = [
  { degree: "Bachelor of Informatics (S1)", school: "Universitas Ahmad Dahlan Yogyakarta" },
  { degree: "High School (IPA)", school: "Islamic Center Binbaz Yogyakarta" },
];

export const OWN_PRODUCTS: OwnProductItem[] = [
  {
    id: "jualink",
    name: "jualink.id",
    tagline: "Link-in-bio & micro-storefront untuk jualan online",
    description:
      "Layanan SaaS pribadi untuk membuat halaman katalog, link jualan, dan etalase digital yang cepat, ringan, dan siap pakai bagi kreator maupun UMKM.",
    category: "SaaS · Micro-Commerce",
    url: "https://jualink.id",
  },
];

export const STORE_ITEMS: StoreItem[] = [
  {
    id: "tokopedia-1",
    name: "Produk Pilihan di Tokopedia",
    platform: "Tokopedia",
    description: "Klik card ini untuk langsung menuju halaman produk di toko Tokopedia.",
    url: "https://tk.tokopedia.com/ZSpnJuUnX/",
  },
];
