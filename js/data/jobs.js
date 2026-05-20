// ============================================================
// JOBS — open role catalog
// Edit this array to add/remove/modify built-in roles.
// (Custom roles created via the admin Role Management panel are
//  stored separately in localStorage.)
// ============================================================

export const JOBS = [
  {
    id: 1,
    title: "Growth Intern",
    category: "growth",
    type: "internship",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹8,000/mo",
    description: "Drive user acquisition, retention, and engagement experiments for our growing platform. You'll work alongside the founding team to design and execute growth loops that scale.",
    responsibilities: [
      "Design and run A/B experiments across acquisition channels",
      "Own social media growth and community distribution",
      "Analyze funnel data and identify drop-off points",
      "Collaborate with content to build growth flywheels",
      "Report weekly growth metrics to the founding team"
    ],
    requirements: [
      "Strong analytical mindset — comfortable with numbers",
      "Prior experience with any growth or marketing project",
      "Ability to write clearly and communicate ideas fast",
      "Curiosity about startups and the founder ecosystem"
    ],
    skills: ["Growth Marketing", "Analytics", "Copywriting", "Experiments", "SEO"],
  },
  {
    id: 2,
    title: "Founder's Office Intern",
    category: "growth",
    type: "internship",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹10,000/mo",
    description: "Work directly in the founder's office — the nerve center of The Startup School. You'll get unparalleled exposure to how a fast-moving startup is built, operated, and scaled.",
    responsibilities: [
      "Support founders with research, decks, and strategic planning",
      "Manage internal projects and cross-team communication",
      "Handle outreach, partnerships, and ecosystem relationships",
      "Draft content, emails, and internal documentation",
      "Own special projects that span the entire organisation"
    ],
    requirements: [
      "Exceptional written and verbal communication",
      "Extremely organised and self-directed",
      "High sense of urgency and ownership",
      "Interest in startups, entrepreneurship, and strategy"
    ],
    skills: ["Strategy", "Operations", "Research", "Communication", "Project Management"],
  },
  {
    id: 3,
    title: "Community Manager",
    category: "community",
    type: "fulltime",
    location: "Remote",
    duration: "Full-time",
    stipend: "₹25,000/mo",
    description: "Own and grow the most engaged founder community in India. You'll build spaces where founders feel seen, heard, and supported — online and offline.",
    responsibilities: [
      "Moderate and grow our founder WhatsApp, Discord, and online forums",
      "Plan and execute virtual and in-person community events",
      "Onboard new founders and ensure they get early value",
      "Create community rituals, challenges, and weekly programming",
      "Surface community insights to product and content teams"
    ],
    requirements: [
      "Genuine love for building communities and connecting people",
      "Prior experience managing an online or offline community",
      "Strong empathy and communication skills",
      "Ability to handle conflicts and build positive culture"
    ],
    skills: ["Community Building", "Event Management", "Communication", "Social Media", "Empathy"],
  },
  {
    id: 4,
    title: "Content Creator",
    category: "content",
    type: "internship",
    location: "Remote",
    duration: "3–6 Months",
    stipend: "₹8,000/mo",
    description: "Create content that actually moves people — not corporate fluff. You'll write, script, shoot (or brief), and distribute content that builds The Startup School's voice across channels.",
    responsibilities: [
      "Write long-form articles, LinkedIn posts, and newsletters",
      "Script short-form video content and reels",
      "Research and interview founders for case studies",
      "Maintain a consistent content calendar",
      "Analyse content performance and iterate quickly"
    ],
    requirements: [
      "Strong, opinionated writing style",
      "Portfolio of content work (personal blog, LinkedIn, essays)",
      "Interest in startups and entrepreneurship",
      "Ability to adapt tone across formats and channels"
    ],
    skills: ["Writing", "Scripting", "SEO", "LinkedIn", "Storytelling"],
  },
  {
    id: 5,
    title: "Full Stack Developer Intern",
    category: "tech",
    type: "internship",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹12,000/mo",
    description: "Build, iterate, and ship features on The Startup School's platform. You'll work with modern web technologies in a small, fast-moving engineering environment with zero bureaucracy.",
    responsibilities: [
      "Build and maintain features across frontend and backend",
      "Integrate third-party APIs and tools",
      "Write clean, tested, and documented code",
      "Participate in product design discussions",
      "Optimise performance and user experience"
    ],
    requirements: [
      "Solid grasp of JavaScript/TypeScript (frontend + backend)",
      "Experience with React and a Node.js framework",
      "Familiarity with REST APIs and basic database design",
      "GitHub profile or portfolio with shipped projects"
    ],
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "APIs", "Git"],
  },
  {
    id: 6,
    title: "AI Automation Intern",
    category: "tech",
    type: "internship",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹10,000/mo",
    description: "Help us build the AI-powered nervous system of The Startup School. You'll design and implement automations, LLM-powered workflows, and internal tools that 10x our team's output.",
    responsibilities: [
      "Build automations using Make, Zapier, or custom scripts",
      "Develop LLM-powered workflows using OpenAI / Claude APIs",
      "Create internal AI tools that save hours of manual work",
      "Document automations for team handoff",
      "Experiment with new AI tools and propose improvements"
    ],
    requirements: [
      "Strong foundation in Python or JavaScript",
      "Hands-on experience with AI APIs (OpenAI, Anthropic, etc.)",
      "Familiar with automation platforms (Make, Zapier, n8n)",
      "Systems thinking — ability to design end-to-end workflows"
    ],
    skills: ["Python", "LLMs", "Make/Zapier", "OpenAI API", "Prompt Engineering", "Automation"],
  },
  {
    id: 7,
    title: "Startup Research Analyst",
    category: "research",
    type: "internship",
    location: "Remote",
    duration: "2–3 Months",
    stipend: "₹6,000/mo",
    description: "Produce sharp, insight-driven research on startups, markets, and founder trends. Your work will shape the curriculum, content, and strategy of The Startup School.",
    responsibilities: [
      "Research emerging startup trends and ecosystem movements",
      "Write concise, insight-heavy research reports and memos",
      "Analyse competitor platforms and benchmark best practices",
      "Interview founders to extract qualitative insights",
      "Create data visualisations and research summaries"
    ],
    requirements: [
      "Strong reading, synthesis, and writing ability",
      "Curiosity about startups, markets, and entrepreneurship",
      "Comfort with secondary research and data interpretation",
      "Ability to produce clean, well-structured documents"
    ],
    skills: ["Research", "Writing", "Analysis", "Data Viz", "Strategy"],
  }
];
