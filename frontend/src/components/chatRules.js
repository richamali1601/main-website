export const QUICK_PROMPTS = [
  "I need a new website",
  "I want more leads",
  "Help me improve SEO",
  "I want to start a project",
];

const serviceRules = [
  { name: "Website Development", terms: ["website", "web design", "web development", "landing page", "ecommerce", "e-commerce"] },
  { name: "SEO", terms: ["seo", "search engine", "google ranking", "organic traffic", "rank higher"] },
  { name: "Performance Marketing", terms: ["more leads", "paid leads", "generate leads", "lead generation", "customer acquisition", "paid traffic", "paid ads", "advertising", "performance", "conversion", "google ads", "meta ads"] },
  { name: "Digital Marketing", terms: ["digital marketing", "campaign", "marketing strategy", "growth plan"] },
  { name: "Social Media Marketing", terms: ["social media", "instagram", "linkedin", "content calendar", "social content"] },
  { name: "Branding & Strategy", terms: ["branding", "brand identity", "logo", "positioning", "brand strategy"] },
  { name: "UI/UX Design", terms: ["ui", "ux", "user experience", "interface", "product design"] },
  { name: "AI & Automation", terms: ["automation", "chatbot", "workflow", "artificial intelligence", " ai "] },
];

const hasAny = (message, terms) => terms.some(term => message.includes(term));

const buildServiceReply = (service) => ({
  text: `${service} sounds like the strongest place to start. I can take you to the relevant capabilities or help you open a project brief.`,
  service,
  actions: [
    { label: "View capabilities", target: "services" },
    { label: "Start a project", target: "contact", prefill: `I'm interested in ${service}. ` },
  ],
});

export const getBotReply = (rawMessage, currentService = "") => {
  const message = ` ${rawMessage.toLowerCase().trim()} `;
  const matchedService = serviceRules.find(rule => hasAny(message, rule.terms));
  if (matchedService) return buildServiceReply(matchedService.name);

  if (hasAny(message, ["contact", "talk", "speak", "quote", "proposal", "pricing", "price", "budget", "hire", "start a project", "get started", "book a call"])) {
    const serviceLine = currentService ? ` about ${currentService}` : "";
    return {
      text: `Absolutely. I'll take you to the project brief${serviceLine}. Add your name and work email there so the team can reply directly.`,
      service: currentService,
      actions: [{
        label: "Open project brief",
        target: "contact",
        prefill: currentService ? `I'm interested in ${currentService}. ${rawMessage}` : rawMessage,
      }],
    };
  }

  if (hasAny(message, ["work", "portfolio", "case study", "case studies", "projects", "results"])) {
    return {
      text: "You can review the selected work area for the agency's project direction and then start a conversation when you're ready.",
      service: currentService,
      actions: [{ label: "Explore selected work", target: "work" }],
    };
  }

  if (hasAny(message, ["about", "agency", "team", "why vision hive", "how you work", "process"])) {
    return {
      text: "The Vision Hive combines strategy, design, technology and performance around measurable business outcomes.",
      service: currentService,
      actions: [{ label: "Why The Vision Hive", target: "about" }],
    };
  }

  if (hasAny(message, ["insight", "article", "blog", "learn", "ideas"])) {
    return {
      text: "The insights section covers strategy, experience and the systems behind sustainable digital growth.",
      service: currentService,
      actions: [{ label: "Browse insights", target: "insights" }],
    };
  }

  if (hasAny(message, ["hello", "hi", "hey", "help", "what do you do", "services"])) {
    return {
      text: "I can guide you through websites, SEO, paid growth, social media, branding, UI/UX, or automation. What are you trying to improve?",
      service: currentService,
      actions: [{ label: "See all services", target: "services" }],
    };
  }

  return {
    text: "I can help you find the right service. Is your priority a better website, more leads, stronger search visibility, branding, or automation?",
    service: currentService,
    actions: [{ label: "Explore capabilities", target: "services" }],
  };
};