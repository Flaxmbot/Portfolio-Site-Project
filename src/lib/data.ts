
import type { Project } from "@/types";

// This file is now a backup and can be used for seeding the database.
// The app will fetch data from Firebase Firestore.
export const projects: Project[] = [
  {
    id: "zenith-solutions",
    title: "Zenith Solutions",
    description: "A complete brand overhaul and web platform for a leading tech consultancy.",
    tags: ["Branding", "Web Development", "UI/UX"],
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop",
    "data-ai-hint": "corporate tech",
    projectUrl: "#",
    caseStudy: {
      problem: "Zenith Solutions' online presence was outdated and did not reflect their market leadership.",
      solution: "We designed a modern, user-centric website with a powerful CMS and integrated marketing tools.",
      outcome: "Increased user engagement by 60% and doubled lead generation within the first quarter.",
      aiGeneratedDescription: "Leveraging a synergy of cutting-edge frameworks and a pixel-perfect design system, we catapulted Zenith Solutions to the forefront of the digital landscape. The new platform, a testament to agile development and user-centric philosophy, not only revitalized their brand identity but also established a robust, scalable architecture for future growth."
    },
  },
  {
    id: "nova-launch",
    title: "NovaLaunch",
    description: "Marketing campaign and asset creation for a new SaaS product launch.",
    tags: ["Marketing", "Content Creation", "Social Media"],
    imageUrl: "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1771&auto=format&fit=crop",
    "data-ai-hint": "startup saas",
    projectUrl: "#",
    caseStudy: {
      problem: "NovaLaunch needed to generate buzz and acquire early adopters for its innovative SaaS platform.",
      solution: "We developed a multi-channel marketing strategy, creating compelling content and running targeted ad campaigns.",
      outcome: "Exceeded launch-day sign-up goals by 150% and secured features in major tech publications.",
    },
  },
  {
    id: "fusion-eats",
    title: "Fusion Eats",
    description: "An interactive mobile app for a trendy restaurant chain, focusing on online orders and loyalty.",
    tags: ["Mobile App", "UI/UX", "E-commerce"],
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    "data-ai-hint": "food app",
    projectUrl: "#",
    caseStudy: {
      problem: "Fusion Eats wanted to streamline their ordering process and build a stronger connection with their customers.",
      solution: "We built a sleek, intuitive mobile app with features for ordering, reservations, and a point-based loyalty program.",
      outcome: "Boosted online orders by 40% and increased customer retention rates by 25%.",
      aiGeneratedDescription: "By architecting a seamless mobile experience, we transformed Fusion Eats' digital storefront. The application integrates a sophisticated backend with an intuitive user interface, facilitating a frictionless journey from menu browsing to checkout. This digital evolution empowered the brand to foster customer loyalty and tap into new revenue streams."
    },
  },
  {
    id: "quantum-analytics",
    title: "Quantum Analytics",
    description: "Data visualization dashboard for a complex financial analytics platform.",
    tags: ["Data Visualization", "Web App", "Fintech"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    "data-ai-hint": "finance dashboard",
    projectUrl: "#",
    caseStudy: {
      problem: "Clients found Quantum's raw data hard to interpret, hindering decision-making.",
      solution: "We created an interactive dashboard that transforms complex datasets into clear, actionable insights.",
      outcome: "Improved client satisfaction scores by 30% and reduced support ticket volume significantly.",
    },
  },
  {
    id: "eco-voyage",
    title: "EcoVoyage",
    description: "A booking platform for eco-friendly travel, connecting users with sustainable tour operators.",
    tags: ["Web Platform", "Marketplace", "Sustainability"],
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1770&auto=format&fit=crop",
    "data-ai-hint": "travel nature",
    projectUrl: "#",
    caseStudy: {
      problem: "There was no centralized platform for travelers to find and book genuinely sustainable travel experiences.",
      solution: "We built a two-sided marketplace with robust search filters, a secure booking system, and transparent impact reporting.",
      outcome: "Onboarded over 100 eco-certified partners and facilitated 5,000+ sustainable trips in the first year.",
    },
  },
  {
    id: "connect-sphere",
    title: "ConnectSphere",
    description: "A social networking app designed for professionals in creative industries.",
    tags: ["Mobile App", "Social Networking", "UI/UX"],
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop",
    "data-ai-hint": "social network",
    projectUrl: "#",
    caseStudy: {
      problem: "Creative professionals lacked a dedicated platform for networking and collaboration that went beyond a simple portfolio.",
      solution: "We developed a feature-rich app with project collaboration tools, event listings, and a sophisticated matching algorithm.",
      outcome: "Grew to 50,000 active users in 6 months, becoming the go-to app for creatives.",
    },
  },
];
