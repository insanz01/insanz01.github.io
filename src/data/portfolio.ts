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
  description: string;
}

export interface StackCategory {
  label: string;
  items: string;
}

export const PROFILE = {
  name: "Insan Kamil",
  role: "Software Engineer",
  location: "Indonesia",
  email: "insankamil002@gmail.com",
  github: "https://github.com/insanz01",
  linkedin: "https://linkedin.com/in/",
  twitter: "https://x.com/",
};

export const PROJECTS: Project[] = [
  {
    id: "memofy",
    title: "Memofy",
    description:
      "Lightweight note-taking and personal knowledge workspace with fast full-text search, keyboard-first navigation, and markdown export.",
    stack: "TypeScript · React · PostgreSQL",
    year: "2026",
    url: "https://github.com/insanz01",
  },
  {
    id: "pulse",
    title: "Pulse API Gateway",
    description:
      "Reverse proxy and rate-limiting service with per-tenant token buckets, circuit breaking, and structured JSON logs.",
    stack: "Go · Redis · Docker",
    year: "2025",
    url: "https://github.com/insanz01",
  },
  {
    id: "ledger",
    title: "Ledger CLI",
    description:
      "Plain-text expense tracker that parses CSV bank exports, categorizes recurring transactions, and generates monthly summaries.",
    stack: "Node.js · SQLite",
    year: "2025",
    url: "https://github.com/insanz01",
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Full-Stack Software Engineer",
    company: "Independent / Freelance",
    period: "2024 — Present",
    description:
      "Designed and shipped end-to-end web products, REST/GraphQL backends, and automated CI/CD pipelines for small teams and early-stage founders.",
  },
  {
    role: "Software Engineer",
    company: "Product Studio",
    period: "2022 — 2024",
    description:
      "Built internal dashboards, payment integrations, and data-heavy React interfaces while improving API response times and test coverage.",
  },
];

export const STACK: StackCategory[] = [
  { label: "Languages", items: "TypeScript, JavaScript, Go, SQL, Python" },
  { label: "Frontend", items: "HTML/CSS, React, Next.js, Tailwind CSS" },
  { label: "Backend & Data", items: "Node.js, PostgreSQL, Redis, REST, GraphQL" },
  { label: "Infrastructure", items: "Docker, GitHub Actions, Linux, Nginx" },
];
