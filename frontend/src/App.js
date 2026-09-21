/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Briefcase, Camera, Check, Mail, MapPin, Menu, Users, X } from "lucide-react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { ConciergeChat } from "./components/ConciergeChat";
import { serviceCatalog } from "./data/services";
import ServiceDetailPage from "./pages/ServiceDetailPage";

const logoUrl = "/main%20logo.PNG";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/thevisionhive16?igsi=MWY4b296a2s4dzdz", Icon: Camera },
  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61590595676030", Icon: Users },
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/richa-mali-228675282?utm_source=share_via&utm_content=profile&utm_medium=member_ios", Icon: Briefcase },
];

const processSteps = [
  ["01", "DISCOVER",   "Understand the business, audience, competitors and objectives."],
  ["02", "STRATEGIZE", "Build a clear roadmap based on data, positioning and business goals."],
  ["03", "CREATE",     "Design and develop the digital experience, campaigns and content."],
  ["04", "OPTIMIZE",   "Measure performance, test continuously and improve what matters."],
];

const work = [
  ["AMRUT",         "Fashion / 2026",  "A future case study will live here. Replace this with your project story, services and verified outcome.", "VIEW CASE STUDY", "/work/amrut.jpg",       "Amrut fashion brand logo"],
  ["COFFY-RICO",    "Coffee / 2026",   "A future case study will live here. Replace this with your project story, services and verified outcome.", "VIEW CASE STUDY", "/work/logo.svg",         "Coffy-Rico brand logo"],
  ["NIDHI SKINCARE","Skincare / 2026", "A future case study will live here. Replace this with your project story, services and verified outcome.", "VIEW CASE STUDY", "/work/nidhi-logo.avif",  "Nidhi Skincare brand logo"],
];

const insights = [
  ["01", "From Visibility to Sales: How a Strong Digital Marketing Strategy Converts Audiences into Customers", "A practical guide to moving audiences from awareness and engagement through trust to conversion.", "Digital Marketing", "https://medium.com/@richamali1601/from-visibility-to-sales-how-a-strong-digital-marketing-strategy-converts-audiences-into-customers-ca153d68bab8?sharedUserId=richamali1601"],
  ["02", "How Digital Marketing Can Help Startups Build a Strong Brand from Day One", "How startups can use branding, social media, content, SEO and paid marketing to build lasting visibility and trust.", "Brand Strategy", "https://medium.com/@richamali1601/how-digital-marketing-can-help-startups-build-a-strong-brand-from-day-one-d0784eff03f4?sharedUserId=richamali1601"],
  ["03", "From Activity to Momentum", "How ambitious teams can move beyond busywork and build a marketing rhythm that compounds.", "Growth"],
];

/* ─── Shared reveal animation wrapper ─────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ────────────────────────────────────────────── */
function Counter({ value, suffix = "", label, decimals = 0 }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const step = () => {
      frame += 1;
      const next = value * Math.min(frame / 30, 1);
      setCount(next);
      if (frame < 30) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, value]);
  return (
    <div
      ref={ref}
      className="border-l border-ink/25 pl-6"
      data-testid={`stat-${label.toLowerCase().replaceAll(" ", "-")}`}
    >
      <strong className="block text-[clamp(2.6rem,5vw,5rem)] font-bold leading-none tracking-[-0.08em]">
        {count.toFixed(decimals)}{suffix}
      </strong>
      <span className="block font-mono text-[11px] uppercase tracking-[0.12em] mt-2 text-[#596164]">
        {label}
      </span>
    </div>
  );
}

/* ─── HomePage ────────────────────────────────────────────────────── */
function HomePage() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [sent,       setSent]       = useState(false);
  const [sending,    setSending]    = useState(false);
  const [form,       setForm]       = useState({ name: "", email: "", company: "", message: "" });
  const [formError,  setFormError]  = useState("");

  const go = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  useEffect(() => {
    if (!location.state?.scrollTo) return;
    const { scrollTo, contactPrefill = "" } = location.state;
    if (contactPrefill) setForm(c => ({ ...c, message: contactPrefill }));
    const timer = window.setTimeout(() => {
      go(scrollTo);
      navigate("/", { replace: true, state: null });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location.state, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      const msg = "Please complete the required fields.";
      setFormError(msg);
      toast.error(msg);
      return;
    }
    setSending(true);
    try {
      const accessKey = process.env.REACT_APP_WEB3FORMS_ACCESS_KEY || "60c6c2d0-27b0-460f-a0ff-3f14ff7c05a0";
      const formData = new FormData();
      formData.append("access_key", accessKey);
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("company", form.company.trim() || "Not provided");
      formData.append("message", form.message.trim());
      formData.append("subject", `New project brief from ${form.name.trim()}`);
      formData.append("from_name", "The Vision Hive Website");

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm({ name: "", email: "", company: "", message: "" });
        setSent(true);
        toast.success("Message sent successfully! We'll be in touch soon.");
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      const msg = err.message && err.message !== "Submission failed"
        ? err.message
        : "Failed to send message. Please try again or email us directly at thevisionhive16@gmail.com.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleChatNavigate = ({ target, prefill = "" }) => {
    if (target === "service") { navigate(`/services/${prefill}`); return; }
    if (target === "contact") { setSent(false); if (prefill) setForm(c => ({ ...c, message: c.message || prefill })); }
    go(target);
  };

  const nav = [["Services","services"],["Work","work"],["About","about"],["Insights","insights"],["Contact","contact"]];

  return (
    <div className="overflow-hidden">
      <Toaster position="bottom-right" theme="dark" />
      <ConciergeChat onNavigate={handleChatNavigate} />

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <header
        className="h-[78px] fixed z-20 top-0 left-0 right-0 flex items-center justify-between px-[5vw] bg-ink/[0.62] backdrop-blur-[18px] border-b border-transparent"
        data-testid="site-navigation"
      >
        {/* Logo */}
        <button
          className="border-0 bg-transparent p-0 w-[160px] h-[52px] flex items-center justify-center shrink-0 cursor-pointer"
          onClick={() => go("top")}
          data-testid="nav-logo"
        >
          <img src={logoUrl} alt="The Vision Hive logo" className="w-full h-full object-contain" style={{ mixBlendMode: "screen" }} />
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 ml-auto mr-[42px]">
          {nav.map(([label, id]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="border-0 bg-transparent text-muted font-manrope font-medium text-[12px] cursor-pointer transition-colors duration-200 hover:text-teal"
              data-testid={`nav-link-${id}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button
          className="hidden md:inline-flex border border-teal bg-teal text-ink px-[18px] py-[13px] items-center gap-[14px] font-manrope font-bold text-[12px] uppercase cursor-pointer rounded-[2px] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgba(18,219,229,0.17)]"
          onClick={() => go("contact")}
          data-testid="nav-lets-talk-button"
        >
          Let's Talk <ArrowUpRight size={15} />
        </button>

        {/* Hamburger */}
        <button
          className="md:hidden border-0 bg-transparent text-paper cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          data-testid="mobile-menu-toggle"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* ── MOBILE MENU ──────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            className="fixed inset-0 z-[15] bg-ink/[0.98] px-[9vw] pt-[120px] pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-testid="mobile-menu-overlay"
          >
            <div className="flex flex-col gap-[22px]">
              {nav.map(([label, id], i) => (
                <motion.button
                  key={id}
                  onClick={() => go(id)}
                  className="flex justify-between bg-transparent border-0 text-paper text-[2.5rem] tracking-[-0.06em] text-left cursor-pointer"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  data-testid={`mobile-nav-link-${id}`}
                >
                  {label}<ArrowUpRight size={18} />
                </motion.button>
              ))}
              <button
                className="mt-5 border border-teal bg-teal text-ink px-[18px] py-[13px] flex items-center justify-center gap-[14px] font-manrope font-bold text-[12px] uppercase cursor-pointer"
                onClick={() => go("contact")}
                data-testid="mobile-lets-talk-button"
              >
                Let's Talk <ArrowUpRight size={17} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="top">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="min-h-screen relative pt-[130px] flex items-center px-[9vw] pb-[150px]">
          {/* Decorative orbs */}
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:"42vw", height:"42vw", right:"-15vw", top:"16vh", filter:"blur(2px)",
              background:"radial-gradient(circle at 35% 35%,rgba(18,219,229,.32),transparent 65%)" }} />
          <div className="absolute rounded-full pointer-events-none"
            style={{ width:"25vw", height:"25vw", left:"-15vw", bottom:"4vh", filter:"blur(2px)",
              background:"radial-gradient(circle,rgba(18,219,229,.12),transparent 65%)" }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-35"
            style={{ backgroundImage:"linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)",
              backgroundSize:"90px 90px", maskImage:"linear-gradient(to bottom,black,transparent 80%)" }} />

          {/* Copy */}
          <div className="relative z-[1] max-w-[980px]">
            <Reveal>
              <p className="font-mono font-medium text-[11px] tracking-[0.2em] text-teal uppercase mb-7">
                CREATIVE DIGITAL AGENCY <span className="text-muted ml-3">●</span>
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1
                className="text-[clamp(2.7rem,min(6.1vw,9.2vh),6.6rem)] leading-[0.91] tracking-[-0.075em] max-w-[1100px] mb-[38px] [&_em]:not-italic [&_em]:text-teal"
                data-testid="hero-heading"
              >
                BUILDING DIGITAL <em>EXPERIENCES</em><br /> THAT MOVE<br /> BUSINESSES <em>FORWARD.</em>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="text-[16px] leading-[1.75] text-muted max-w-[500px] mb-[36px]">
                We combine strategy, design, technology and performance marketing to create digital experiences that attract attention, generate leads and accelerate growth.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex gap-3 flex-wrap">
                <button
                  className="border border-teal bg-teal text-ink px-[18px] py-[13px] inline-flex items-center gap-[14px] font-manrope font-bold text-[12px] uppercase cursor-pointer transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgba(18,219,229,0.17)]"
                  onClick={() => go("contact")}
                  data-testid="hero-start-project-button"
                >
                  Start a Project <ArrowUpRight size={17} />
                </button>
                <button
                  className="border border-line bg-transparent text-paper px-[18px] py-[13px] inline-flex items-center gap-[14px] font-manrope font-bold text-[12px] uppercase cursor-pointer transition-all duration-200 hover:-translate-y-[3px]"
                  onClick={() => go("work")}
                  data-testid="hero-explore-work-button"
                >
                  Explore Our Work <ArrowDownRight size={17} />
                </button>
              </div>
            </Reveal>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-12 left-[9vw] flex items-center gap-[15px] font-mono text-[11px] text-muted uppercase tracking-[0.12em]">
            <span>Scroll to explore</span>
            <span className="block w-[70px] h-px bg-teal" />
          </div>
          <div className="absolute right-[9vw] bottom-12 text-teal font-mono text-[12px]">
            01 <span className="text-muted mx-[7px]">/</span> 08
          </div>
        </section>

        {/* ── MARQUEE ──────────────────────────────────────────── */}
        <div
          className="whitespace-nowrap overflow-hidden bg-teal text-ink py-[19px] text-[13px] font-bold uppercase tracking-[0.08em] group"
          data-testid="service-marquee"
        >
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            {[...Array(2)].flatMap((_, i) =>
              serviceCatalog.map(s => (
                <span key={`${i}-${s.number}`} className="mx-[23px]">
                  {s.title} <b className="text-[17px] ml-[45px]">✦</b>
                </span>
              ))
            )}
          </div>
        </div>

        {/* ── ABOUT / INTRO ─────────────────────────────────────── */}
        <section id="about" className="bg-paper text-ink px-[9vw] py-[150px]">
          <Reveal>
            <p className="font-mono font-medium text-[11px] tracking-[0.2em] text-[#008b91] uppercase mb-7">
              WHAT WE DO <span className="text-muted ml-3">—</span>
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.75fr] gap-[9vw] mt-4">
            <Reveal delay={0.05}>
              <h2 className="text-[clamp(2.7rem,5.7vw,6.2rem)] tracking-[-0.07em] leading-[0.94] m-0 [&_em]:not-italic [&_em]:text-[#008b91]">
                WE BUILD DIGITAL SYSTEMS THAT TURN <em>ATTENTION</em> INTO GROWTH.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div>
                <p className="text-[16px] leading-[1.75] text-[#596164] max-w-[400px]">
                  We don't just create websites or run campaigns. We combine strategy, creative, technology and performance to build digital systems designed around measurable business outcomes.
                </p>
                <button
                  className="inline-flex items-center gap-3 p-0 bg-transparent border-0 text-ink font-manrope font-bold text-[12px] uppercase cursor-pointer mt-[22px]"
                  onClick={() => go("services")}
                  data-testid="intro-services-link"
                >
                  Explore our capabilities <ArrowUpRight size={16} />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────── */}
        <section className="bg-[#dfe5e2] text-ink px-[9vw] py-[68px]" data-testid="results-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-[20px]">
            <Counter value={10}  suffix="+"   label="Projects delivered" />
            <Counter value={95}  suffix="+"   label="Performance score" />
            <Counter value={4.9} suffix="/5"  decimals={1} label="Client satisfaction" />
            <Counter value={5}   suffix="+"   label="Industries served" />
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────── */}
        <section id="services" className="bg-ink px-[9vw] py-[150px]">
          <Reveal>
            <p className="font-mono font-medium text-[11px] tracking-[0.2em] text-teal uppercase mb-7">
              OUR CAPABILITIES <span className="text-muted ml-3">—</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.75fr] gap-[9vw] mb-[85px]">
              <h2 className="text-[clamp(2.7rem,5.7vw,6.2rem)] tracking-[-0.07em] leading-[0.94] m-0 [&_em]:not-italic [&_em]:text-teal">
                FULL-SERVICE<br /><em>DIGITAL GROWTH.</em>
              </h2>
              <p className="text-[16px] leading-[1.75] text-muted max-w-[400px] self-end">
                Explore each capability in depth, then choose the right path for your next stage of growth.
              </p>
            </div>
          </Reveal>
          <div className="border-t border-line">
            {serviceCatalog.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.04}>
                <Link
                  className="w-full grid grid-cols-[35px_1fr_35px] md:grid-cols-[70px_1.1fr_1fr_45px] items-center text-left gap-[10px] md:gap-[25px] bg-transparent text-paper no-underline border-b border-line py-[22px] md:py-[28px] px-[0px] md:px-2 cursor-pointer transition-all duration-300 hover:bg-panel hover:px-[22px] group"
                  to={`/services/${service.slug}`}
                  data-testid={`service-card-${service.number}`}
                >
                  <span className="font-mono text-[12px] text-teal">{service.number}</span>
                  <span className="text-[clamp(1.2rem,2.3vw,2rem)] font-bold tracking-[-0.04em]">{service.title}</span>
                  <span className="hidden md:block text-[13px] leading-[1.6] text-muted max-w-[420px]" id={`service-description-${service.number}`}>{service.short}</span>
                  <span className="justify-self-end text-teal transition-transform duration-300 group-hover:translate-x-[5px] group-hover:-translate-y-[5px]">
                    <ArrowUpRight size={22} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PROCESS ──────────────────────────────────────────── */}
        <section className="bg-panel px-[9vw] py-[150px]">
          <Reveal>
            <p className="font-mono font-medium text-[11px] tracking-[0.2em] text-teal uppercase mb-7">
              OUR PROCESS <span className="text-muted ml-3">—</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.75fr] gap-[9vw] mb-[85px]">
              <h2 className="text-[clamp(2.7rem,5.7vw,6.2rem)] tracking-[-0.07em] leading-[0.94] m-0 [&_em]:not-italic [&_em]:text-teal">
                HOW WE CREATE<br /><em>GROWTH.</em>
              </h2>
              <p className="text-[16px] leading-[1.75] text-muted max-w-[400px] self-end">
                A strategy-first process designed to turn ideas into measurable results.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-line mt-[22px]">
            {processSteps.map((p, i) => (
              <Reveal key={p[0]} delay={i * 0.08}>
                <div className="bg-panel p-[30px_25px] min-h-[255px] md:min-h-[255px]" data-testid={`process-step-${p[0]}`}>
                  <span className="font-mono text-[12px] text-teal">{p[0]}</span>
                  <h3 className="text-[21px] mt-[60px] mb-[15px] tracking-[-0.04em]">{p[1]}</h3>
                  <p className="text-[13px] leading-[1.65] text-muted">{p[2]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── WORK ─────────────────────────────────────────────── */}
        <section id="work" className="bg-paper text-ink px-[9vw] py-[150px]">
          <Reveal>
            <p className="font-mono font-medium text-[11px] tracking-[0.2em] text-[#008b91] uppercase mb-7">
              SELECTED WORK <span className="text-muted ml-3">—</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.75fr] gap-[9vw] mb-[85px]">
              <h2 className="text-[clamp(2.7rem,5.7vw,6.2rem)] tracking-[-0.07em] leading-[0.94] m-0 [&_em]:not-italic [&_em]:text-[#008b91]">
                PROOF, NOT<br /><em>PROMISES.</em>
              </h2>
              <p className="text-[16px] leading-[1.75] text-[#596164] max-w-[400px] self-end">
                Real stories will replace these placeholders as the Vision Hive portfolio takes shape.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
            {work.map((w, i) => (
              <Reveal key={w[0]} delay={i * 0.1}>
                <article
                  className="bg-[#ebe8e1] border border-ink/[0.08] flex flex-col group transition-all duration-300 hover:border-[#008b91]/40 hover:shadow-[0_18px_38px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                  data-testid={`work-card-${i + 1}`}
                >
                  {/* Card showcase area */}
                  <div className="relative aspect-[1.25/1] overflow-hidden flex items-center justify-center bg-[#f0ede6] border-b border-ink/[0.06] p-6">
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(#008b91_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

                    {/* Ambient glow */}
                    <div className="absolute w-36 h-36 rounded-full bg-teal/20 blur-xl transition-all duration-700 ease-out group-hover:scale-150 group-hover:bg-teal/35 pointer-events-none" />

                    {/* Concentric geometric rings */}
                    <div className="absolute w-44 h-44 rounded-full border border-teal/30 transition-all duration-700 ease-out group-hover:scale-110 group-hover:border-teal/60 pointer-events-none" />
                    <div className="absolute w-56 h-56 rounded-full border border-dashed border-[#008b91]/25 transition-all duration-1000 ease-out group-hover:rotate-45 group-hover:border-[#008b91]/50 pointer-events-none" />

                    {/* Elevated brand logo plate */}
                    <div className="relative z-10 w-[200px] h-[120px] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-black/[0.06] flex items-center justify-center p-5 transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)]">
                      {w[4] ? (
                        <img
                          src={w[4]}
                          alt={w[5]}
                          className="max-w-full max-h-full object-contain filter transition-transform duration-500"
                        />
                      ) : (
                        <span className="font-mono text-[10px] tracking-[0.15em] text-[#008b91]">PLACEHOLDER</span>
                      )}
                    </div>

                    {/* Card number badge */}
                    <span className="absolute right-4 top-4 font-mono text-[11px] font-semibold tracking-wider text-[#008b91] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded border border-black/[0.05] shadow-sm z-20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Card info */}
                  <div className="p-[28px_24px_24px] flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-mono font-medium text-[11px] tracking-[0.18em] text-[#008b91] uppercase mb-2.5">{w[1]}</p>
                      <h3 className="text-[22px] font-bold tracking-[-0.04em] text-ink mb-2.5">{w[0]}</h3>
                      <p className="text-[13px] leading-[1.65] text-[#596164] min-h-[55px] mb-4">{w[2]}</p>
                    </div>
                    <button
                      className="border-0 bg-transparent p-0 inline-flex items-center gap-2 font-manrope font-bold text-[11px] uppercase cursor-pointer text-ink tracking-wider transition-colors duration-200 group-hover:text-[#008b91]"
                      onClick={() => go("contact")}
                      data-testid={`work-case-study-${i + 1}`}
                    >
                      <span>{w[3]}</span>
                      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PRINCIPLES ───────────────────────────────────────── */}
        <section className="bg-panel px-[9vw] py-[150px]">
          <Reveal>
            <p className="font-mono font-medium text-[11px] tracking-[0.2em] text-teal uppercase mb-7">
              WHY THE VISION HIVE <span className="text-muted ml-3">—</span>
            </p>
            <h2 className="text-[clamp(2.7rem,5.7vw,6.2rem)] tracking-[-0.07em] leading-[0.94] max-w-[850px] [&_em]:not-italic [&_em]:text-teal">
              BUILT FOR <em>AMBITIOUS</em> BRANDS.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-[90px]">
            {[
              ["01","Strategy First",            "Every decision starts with the business objective."],
              ["02","Designed to Convert",        "Design should not only look beautiful — it should drive action."],
              ["03","Technology That Performs",   "Fast, accessible and scalable digital experiences."],
              ["04","Always Improving",           "Launch is not the finish line. We continuously test and optimize."],
            ].map((p, i) => (
              <Reveal key={p[0]} delay={i * 0.08}>
                <div
                  className="border-t border-line py-[28px] pr-[5vw] pb-[45px] min-h-[190px]"
                  data-testid={`principle-${p[0]}`}
                >
                  <span className="font-mono text-[12px] text-teal">{p[0]}</span>
                  <h3 className="text-[21px] mt-8 mb-[10px] tracking-[-0.04em]">{p[1]}</h3>
                  <p className="text-[13px] leading-[1.65] text-muted">{p[2]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── INSIGHTS ─────────────────────────────────────────── */}
        <section id="insights" className="bg-[#e8e7e1] text-ink px-[9vw] py-[150px]">
          <Reveal>
            <p className="font-mono font-medium text-[11px] tracking-[0.2em] text-[#008b91] uppercase mb-7">
              INSIGHTS <span className="text-muted ml-3">—</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.75fr] gap-[9vw] mb-[85px]">
              <h2 className="text-[clamp(2.7rem,5.7vw,6.2rem)] tracking-[-0.07em] leading-[0.94] m-0 [&_em]:not-italic [&_em]:text-[#008b91]">
                THOUGHTS FOR<br /><em>FORWARD MOTION.</em>
              </h2>
              <p className="text-[16px] leading-[1.75] text-[#596164] max-w-[400px] self-end">
                Original perspectives on strategy, experience and the systems behind meaningful growth.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
            {insights.map((article, i) => (
              <Reveal key={article[0]} delay={i * 0.08}>
                <article
                  className="bg-[#f3f1eb] border border-ink/[0.12] transition-transform duration-300 hover:-translate-y-[7px] hover:shadow-[0_18px_35px_rgba(10,13,16,0.1)]"
                  data-testid={`insight-card-${i + 1}`}
                >
                  <div
                    className={`h-[190px] relative p-5 flex items-end justify-between ${
                      i === 1 ? "bg-[#b9c9c4] text-[#102d30]" : i === 2 ? "bg-[#d4b692] text-[#142323]" : "bg-[#132528] text-teal"
                    }`}
                  >
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase">{article[3]}</span>
                    <b className="text-[clamp(4rem,8vw,7rem)] leading-[0.7] tracking-[-0.1em] font-medium opacity-80">{article[0]}</b>
                  </div>
                  <div className="p-[27px]">
                    <p className="font-mono font-medium text-[9px] tracking-[0.2em] text-[#008b91] uppercase mb-[22px]">5 MIN READ</p>
                    <h3 className="text-[25px] leading-[1.05] tracking-[-0.05em] mb-[15px]">{article[1]}</h3>
                    <p className="text-[13px] leading-[1.65] text-[#596164] min-h-[65px]">{article[2]}</p>
                    {article[4]
                      ? <a href={article[4]} target="_blank" rel="noreferrer" className="inline-flex gap-[10px] items-center font-manrope font-bold text-[11px] uppercase text-ink no-underline" data-testid={`insight-read-button-${i + 1}`}>Read article <ArrowUpRight size={16} /></a>
                      : <button onClick={() => toast.info("Article preview — full editorial coming soon.")} className="border-0 bg-transparent p-0 inline-flex gap-[10px] items-center font-manrope font-bold text-[11px] uppercase cursor-pointer text-ink" data-testid={`insight-read-button-${i + 1}`}>Read article <ArrowUpRight size={16} /></button>
                    }
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIAL ──────────────────────────────────────── */}
        <section className="bg-ink text-center px-[9vw] py-[150px]">
          <Reveal>
            <p className="font-mono font-medium text-[11px] tracking-[0.2em] text-teal uppercase mb-[60px]">
              A NOTE FROM THE FUTURE <span className="text-muted ml-3">—</span>
            </p>
            <blockquote className="text-[clamp(2rem,4.5vw,5rem)] leading-[1.04] tracking-[-0.07em] max-w-[1080px] mx-auto mb-12">
              "The most valuable digital experiences don't shout for attention. They earn it, then turn it into momentum."
            </blockquote>
            <p className="text-[12px] leading-[1.7] text-teal">
              Vision Hive editorial placeholder<br />
              <span className="text-muted">Replace with a verified client testimonial</span>
            </p>
          </Reveal>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────── */}
        <section id="contact" className="bg-teal text-ink px-[9vw] py-[150px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[10vw]">
            <Reveal>
              <p className="font-mono font-medium text-[11px] tracking-[0.2em] text-ink uppercase mb-7">
                START THE CONVERSATION <span className="ml-3">—</span>
              </p>
              <h2 className="text-[clamp(3rem,6.5vw,7rem)] leading-[0.9] tracking-[-0.08em] mb-[35px]">
                LET'S BUILD<br />SOMETHING<br /><em className="not-italic">THAT MATTERS.</em>
              </h2>
              <p className="text-[16px] leading-[1.7] max-w-[390px]">
                Tell us where you want to go. We'll help you find the smartest digital path to get there.
              </p>
              <div className="border-t border-ink/35 mt-[65px] pt-[22px]">
                <p className="font-mono text-[12px] my-[11px]" data-testid="contact-email-detail">
                  <span className="inline-block w-[90px] uppercase text-[#36575a]">Email</span>
                  <a href="mailto:thevisionhive16@gmail.com" className="text-ink" data-testid="contact-email-link">thevisionhive16@gmail.com</a>
                </p>
                <p className="font-mono text-[12px] my-[11px]" data-testid="contact-location-detail">
                  <span className="inline-block w-[90px] uppercase text-[#36575a]">Location</span>
                  Vesu, Surat, 395007
                </p>
                <div className="flex gap-4 mt-4" aria-label="Social media links">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-ink font-bold text-[11px] uppercase no-underline"
                      aria-label={`Visit The Vision Hive on ${label}`}
                      data-testid={`contact-social-${label.toLowerCase()}`}
                    >
                      <Icon size={16} />{label}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-ink text-paper p-[38px]">
                {sent ? (
                  <div className="text-center py-[80px] px-[15px]" data-testid="contact-success-message">
                    <div className="w-[52px] h-[52px] border border-teal text-teal flex items-center justify-center mx-auto mb-5"><Check /></div>
                    <h3 className="text-[30px]">Brief received.</h3>
                    <p className="text-muted text-[14px]">Thank you for reaching out. We'll be in touch soon.</p>
                    <button className="inline-flex items-center gap-3 border-0 bg-transparent text-teal font-manrope font-bold text-[12px] uppercase cursor-pointer mt-4" onClick={() => setSent(false)} data-testid="submit-another-inquiry">Submit another inquiry <ArrowUpRight size={16} /></button>
                  </div>
                ) : (
                  <form onSubmit={submit} data-testid="contact-form">
                    <p className="font-mono text-[11px] tracking-[0.2em] text-teal mb-[34px]">PROJECT BRIEF</p>
                    {[
                      { lbl: "Name *",        key: "name",    type: "text",  placeholder: "Your name",         req: true,  min: 2,  max: 120,  testId: "contact-form-name" },
                      { lbl: "Work email *",  key: "email",   type: "email", placeholder: "you@company.com",   req: true,                      testId: "contact-form-email" },
                      { lbl: "Company",       key: "company", type: "text",  placeholder: "Company name",      req: false,          max: 160,  testId: "contact-form-company" },
                    ].map(f => (
                      <label key={f.key} className="block font-mono text-[11px] text-muted uppercase mb-[21px]">
                        {f.lbl}
                        <input
                          type={f.type}
                          name={f.key}
                          value={form[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          required={f.req}
                          minLength={f.min}
                          maxLength={f.max}
                          className="block w-full border-0 border-b border-line bg-transparent text-paper py-3 font-manrope text-[15px] outline-none transition-colors duration-200 placeholder:text-[#5d6668] focus:border-teal"
                          data-testid={f.testId}
                        />
                      </label>
                    ))}
                    <label className="block font-mono text-[11px] text-muted uppercase mb-[21px]">
                      How can we help? *
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us what you're building..."
                        required
                        minLength={10}
                        maxLength={5000}
                        className="block w-full border-0 border-b border-line bg-transparent text-paper py-3 font-manrope text-[15px] outline-none resize-y min-h-[78px] transition-colors duration-200 placeholder:text-[#5d6668] focus:border-teal"
                        data-testid="contact-form-message"
                      />
                    </label>
                    {formError && <p className="text-[#ff9898] text-[12px] leading-[1.5] mb-[14px]" role="alert" data-testid="contact-form-error">{formError}</p>}
                    <button
                      className="mt-2 w-full border border-teal bg-teal text-ink py-[13px] px-[18px] flex items-center justify-center gap-[14px] font-manrope font-bold text-[12px] uppercase cursor-pointer transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgba(18,219,229,0.17)] disabled:cursor-wait disabled:opacity-65 disabled:transform-none disabled:shadow-none"
                      disabled={sending}
                      type="submit"
                      data-testid="contact-form-submit-button"
                    >
                      {sending ? "Sending brief..." : "Send project brief"} <ArrowUpRight size={17} />
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="bg-[#060809] px-[9vw] pt-[75px] pb-[27px]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-[28px] md:gap-[50px] pb-[70px] border-b border-line">
          <div className="flex items-center justify-center w-[190px] h-[76px]">
            <img src={logoUrl} alt="The Vision Hive logo" className="w-full h-full object-contain" style={{ mixBlendMode: "screen" }} data-testid="footer-logo" />
          </div>
          <p className="text-muted text-[14px] max-w-[280px] m-0 md:mr-auto">Strategy, design, technology and digital growth — working together.</p>
          <button
            className="w-full md:w-auto border border-teal bg-teal text-ink px-[18px] py-[13px] flex items-center justify-center gap-[14px] font-manrope font-bold text-[12px] uppercase cursor-pointer transition-all duration-200 hover:-translate-y-[3px]"
            onClick={() => go("contact")}
            data-testid="footer-contact-button"
          >
            Start a Project <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-[10px] md:gap-[25px] pt-[25px] font-mono text-[10px] text-[#707a7d]">
          <span data-testid="footer-copyright">© 2026 The Vision Hive. All rights reserved.</span>
          <div className="flex flex-col md:flex-row gap-[10px] md:gap-[25px]">
            <a href="mailto:thevisionhive16@gmail.com" className="inline-flex items-center gap-2 text-[#707a7d] no-underline hover:text-teal" data-testid="footer-email-link"><Mail size={13} />thevisionhive16@gmail.com</a>
            <span className="inline-flex items-center gap-2 text-teal" data-testid="footer-location"><MapPin size={13} />Vesu, Surat, 395007</span>
          </div>
          <div className="flex gap-4" aria-label="Footer social media links">
            {socialLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#707a7d] no-underline hover:text-teal" aria-label={`Visit The Vision Hive on ${label}`} data-testid={`footer-social-${label.toLowerCase()}`}>
                <Icon size={14} /><span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/"               element={<HomePage />} />
      <Route path="/services/:slug" element={<ServiceDetailPage />} />
      <Route path="*"               element={<HomePage />} />
    </Routes>
  );
}