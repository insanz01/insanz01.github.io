import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "id";

interface Translations {
  nav: {
    profile: string;
    workbench: string;
    commerce: string;
    overview: string;
    projects: string;
    experience: string;
    mentoring: string;
    apps: string;
    practice: string;
    produk: string;
    jualan: string;
    contact: string;
    search: string;
  };
  home: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    headlineAccent: string;
    summary: string;
    coreExpertise: string;
    fullExperience: string;
    selectedProjects: string;
    allProjects: string;
    workbenchTitle: string;
    openPlayground: string;
    getInTouch: string;
    contactPage: string;
    copyEmail: string;
    copied: string;
    mentoringBanner: string;
    learnMore: string;
    practiceTitle: string;
    practiceDesc: string;
  };
  projects: {
    title: string;
    subtitle: string;
  };
  experience: {
    title: string;
    subtitle: string;
    workHistory: string;
    skillsTitle: string;
    educationTitle: string;
  };
  mentoring: {
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    subtitle: string;
    whoTitle: string;
    whatTitle: string;
    formatTitle: string;
    bookCta: string;
    copiedEmail: string;
  };
  produk: {
    eyebrow: string;
    title: string;
    subtitle: string;
    visit: string;
  };
  jualan: {
    eyebrow: string;
    title: string;
    subtitle: string;
    openAt: string;
  };
  contact: {
    title: string;
    subtitle: string;
    copyEmail: string;
    copied: string;
  };
  apps: {
    title: string;
    subtitle: string;
  };
  practice: {
    title: string;
    subtitle: string;
    solved: string;
    resetStarter: string;
    runSample: string;
    submit: string;
    defaultPrompt: string;
  };
}

const DICT: Record<Lang, Translations> = {
  en: {
    nav: {
      profile: "Profile",
      workbench: "Workbench",
      commerce: "Commerce",
      overview: "Overview",
      projects: "Projects",
      experience: "Experience",
      mentoring: "Mentoring",
      apps: "Mini Apps",
      practice: "Coding Practice",
      produk: "Produk",
      jualan: "Jualan",
      contact: "Contact",
      search: "Search",
    },
    home: {
      eyebrow: "9 Years · Go · Node.js · Python",
      headlineLine1: "Building fast,",
      headlineLine2: "scalable",
      headlineAccent: "backend systems.",
      summary:
        "Backend Engineer with 9 years of professional experience since 2017, evolving from Frontend development into a specialized Backend expert and Technical Lead. Proficient in architecting high-scale systems, microservices, and AI-driven automation using Go, Node.js, and Python.",
      coreExpertise: "Core Expertise",
      fullExperience: "Full experience",
      selectedProjects: "Selected Projects",
      allProjects: "All projects",
      workbenchTitle: "Interactive Workbench",
      openPlayground: "Open playground",
      getInTouch: "Get in Touch",
      contactPage: "Contact page",
      copyEmail: "Copy email",
      copied: "Copied",
      mentoringBanner: "Looking for 1-on-1 Private Mentoring in AI-era product development?",
      learnMore: "Learn more",
      practiceTitle: "Coding Practice →",
      practiceDesc: "HackerRank-style algorithm challenges with sample & hidden test cases.",
    },
    projects: {
      title: "Projects",
      subtitle:
        "Production web platforms, CMS systems, and management tools I've architected and shipped.",
    },
    experience: {
      title: "Experience",
      subtitle:
        "9 years of engineering experience across backend architecture, microservices migration, AI integration, and technical leadership.",
      workHistory: "Work History",
      skillsTitle: "Skills & Technologies",
      educationTitle: "Education",
    },
    mentoring: {
      eyebrow: "1-on-1 Private Mentoring",
      titleStart: "Build & ship products",
      titleAccent: "independently in the AI era.",
      subtitle:
        "Hands-on technical mentoring drawing from 9 years of building production systems, microservices, and AI-driven products. Focused on real code, clear architecture, and practical shipping—not theory slides.",
      whoTitle: "Who This Is For",
      whatTitle: "What We Cover",
      formatTitle: "Session Formats & Booking",
      bookCta: "Request Mentoring via Email",
      copiedEmail: "Copied email!",
    },
    produk: {
      eyebrow: "Personal Products & Services",
      title: "Products",
      subtitle: "Personal digital products and SaaS services built and operated independently.",
      visit: "Visit",
    },
    jualan: {
      eyebrow: "Store & Merchandise",
      title: "Store",
      subtitle: "Curated items for sale. Click any card to go directly to the store page.",
      openAt: "Open on",
    },
    contact: {
      title: "Contact",
      subtitle:
        "Open to Senior Backend, Tech Lead, and system architecture collaborations. Based in Jakarta, Indonesia.",
      copyEmail: "Copy email",
      copied: "Copied",
    },
    apps: {
      title: "Playground · Mini Apps",
      subtitle: "Small, practical tools running entirely in your browser with zero backend or tracking.",
    },
    practice: {
      title: "Coding Practice",
      subtitle: "Algorithm & data-structure challenges evaluated directly in your browser.",
      solved: "solved",
      resetStarter: "Reset starter",
      runSample: "Run Sample",
      submit: "Submit",
      defaultPrompt: "Write your JavaScript solution and click Run Sample or Submit.",
    },
  },
  id: {
    nav: {
      profile: "Profil",
      workbench: "Workbench",
      commerce: "Komersial",
      overview: "Ringkasan",
      projects: "Proyek",
      experience: "Pengalaman",
      mentoring: "Mentoring",
      apps: "Mini Apps",
      practice: "Latihan Coding",
      produk: "Produk",
      jualan: "Jualan",
      contact: "Kontak",
      search: "Cari",
    },
    home: {
      eyebrow: "9 Tahun · Go · Node.js · Python",
      headlineLine1: "Membangun sistem",
      headlineLine2: "backend yang",
      headlineAccent: "cepat & skalabel.",
      summary:
        "Backend Engineer dengan total 9 tahun jam terbang profesional sejak 2017, berevolusi dari Frontend developer menjadi ahli Backend dan Technical Lead. Memiliki spesialisasi dalam membangun sistem berskala besar, arsitektur microservices, dan otomasi AI menggunakan Go, Node.js, dan Python.",
      coreExpertise: "Keahlian Utama",
      fullExperience: "Lihat semua pengalaman",
      selectedProjects: "Proyek Pilihan",
      allProjects: "Semua proyek",
      workbenchTitle: "Workbench Interaktif",
      openPlayground: "Buka playground",
      getInTouch: "Hubungi Saya",
      contactPage: "Halaman kontak",
      copyEmail: "Salin email",
      copied: "Tersalin",
      mentoringBanner: "Butuh Private Mentoring 1-on-1 untuk membangun produk mandiri di era AI?",
      learnMore: "Selengkapnya",
      practiceTitle: "Latihan Coding →",
      practiceDesc: "Tantangan algoritma ala HackerRank dengan sample & hidden test cases.",
    },
    projects: {
      title: "Proyek",
      subtitle:
        "Platform web produksi, sistem CMS, dan aplikasi manajemen yang telah dirancang dan dirilis.",
    },
    experience: {
      title: "Pengalaman",
      subtitle:
        "9 tahun pengalaman rekayasa perangkat lunak di bidang arsitektur backend, migrasi microservices, integrasi AI, dan kepemimpinan teknis.",
      workHistory: "Riwayat Kerja",
      skillsTitle: "Keahlian & Teknologi",
      educationTitle: "Pendidikan",
    },
    mentoring: {
      eyebrow: "Private Mentoring 1-on-1",
      titleStart: "Bangun & rilis produk",
      titleAccent: "secara mandiri di era AI.",
      subtitle:
        "Mentoring teknis praktis berdasarkan 9 tahun pengalaman membangun sistem produksi, microservices, dan produk berbasis AI. Fokus pada kode nyata, arsitektur yang rapi, dan eksekusi sampai rilis.",
      whoTitle: "Cocok Untuk Siapa",
      whatTitle: "Materi yang Dibahas",
      formatTitle: "Format Sesi & Pendaftaran",
      bookCta: "Daftar Mentoring via Email",
      copiedEmail: "Email tersalin!",
    },
    produk: {
      eyebrow: "Produk & Layanan Pribadi",
      title: "Produk",
      subtitle: "Produk digital dan layanan SaaS milik pribadi yang dibangun dan dikelola mandiri.",
      visit: "Kunjungi",
    },
    jualan: {
      eyebrow: "Toko & Barang Dagangan",
      title: "Jualan",
      subtitle: "Daftar barang dagangan. Klik card barang untuk langsung diarahkan ke halaman toko.",
      openAt: "Buka di",
    },
    contact: {
      title: "Kontak",
      subtitle:
        "Terbuka untuk kolaborasi Senior Backend, Tech Lead, arsitektur sistem, maupun mentoring. Berdomisili di Jakarta, Indonesia.",
      copyEmail: "Salin email",
      copied: "Tersalin",
    },
    apps: {
      title: "Playground · Mini Apps",
      subtitle: "Alat bantu praktis yang berjalan sepenuhnya di browser tanpa backend maupun tracking.",
    },
    practice: {
      title: "Latihan Coding",
      subtitle: "Tantangan algoritma & struktur data yang dievaluasi langsung di browser.",
      solved: "selesai",
      resetStarter: "Reset kode awal",
      runSample: "Uji Sample",
      submit: "Submit",
      defaultPrompt: "Tulis solusi JavaScript kamu lalu klik Uji Sample atau Submit.",
    },
  },
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("kamil_lang");
      return saved === "id" || saved === "en" ? saved : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("kamil_lang", lang);
    } catch {
      // ignore storage errors
    }
  }, [lang]);

  const toggleLang = () => setLangState((prev) => (prev === "en" ? "id" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState, toggleLang, t: DICT[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
