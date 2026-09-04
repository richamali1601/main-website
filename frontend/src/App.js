/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { ConciergeChat } from "./components/ConciergeChat";

const logoUrl = "/logo.png";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

if (!backendUrl) throw new Error("REACT_APP_BACKEND_URL is required");

const services = [
  ["01", "Website Development", "Digital platforms with a sharp point of view, engineered for speed, clarity and conversion."],
  ["02", "Digital Marketing", "Connected campaigns that put the right message in front of the right people at the right moment."],
  ["03", "SEO", "A durable search strategy built on technical precision, useful content and earned authority."],
  ["04", "Performance Marketing", "Smarter acquisition systems that turn spend into a compounding growth engine."],
  ["05", "Social Media Marketing", "Distinctive stories and daily momentum that make your brand impossible to ignore."],
  ["06", "Branding & Strategy", "Positioning, language and identity that give ambitious businesses a memorable advantage."],
  ["07", "UI/UX Design", "Interfaces that feel intuitive, considered and unmistakably yours across every touchpoint."],
  ["08", "AI & Automation", "Practical intelligent systems that remove friction and create more room for meaningful work."],
];

const processSteps = [
  ["01", "DISCOVER", "Understand the business, audience, competitors and objectives."],
  ["02", "STRATEGIZE", "Build a clear roadmap based on data, positioning and business goals."],
  ["03", "CREATE", "Design and develop the digital experience, campaigns and content."],
  ["04", "OPTIMIZE", "Measure performance, test continuously and improve what matters."],
];

const work = [
  ["PROJECT PLACEHOLDER 01", "Industry / Year", "A future case study will live here. Replace this with your project story, services and verified outcome.", "VIEW CASE STUDY"],
  ["PROJECT PLACEHOLDER 02", "Industry / Year", "A future case study will live here. Replace this with your project story, services and verified outcome.", "VIEW CASE STUDY"],
  ["PROJECT PLACEHOLDER 03", "Industry / Year", "A future case study will live here. Replace this with your project story, services and verified outcome.", "VIEW CASE STUDY"],
];

const insights = [
  ["01", "The New Digital Advantage", "Why the brands that win next will design their website, content and growth engine as one system.", "Strategy"],
  ["02", "Designing for the Decisive Moment", "A practical look at the small interface choices that turn curious visitors into confident customers.", "Experience"],
  ["03", "From Activity to Momentum", "How ambitious teams can move beyond busywork and build a marketing rhythm that compounds.", "Growth"],
];

function Reveal({ children, className = "", delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Counter({ value, suffix = "", label }) {
  const ref = useRef(null); const visible = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => { if (!visible) return; let start = 0; const step = () => { start += Math.ceil(value / 30); if (start >= value) { setCount(value); return; } setCount(start); requestAnimationFrame(step); }; requestAnimationFrame(step); }, [visible, value]);
  return <div ref={ref} className="stat" data-testid={`stat-${label.toLowerCase().replaceAll(" ", "-")}`}><strong>{count}{suffix}</strong><span>{label}</span></div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false); const [active, setActive] = useState(0); const [sent, setSent] = useState(false); const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [formError, setFormError] = useState("");
  const go = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      const message = "Please complete the required fields.";
      setFormError(message);
      toast.error(message);
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          message: form.message.trim(),
        }),
      });

      if (!response.ok) {
        const message = response.status === 422
          ? "Please check your details and use a valid work email."
          : "We couldn't send your brief right now. Please try again.";
        throw new Error(message);
      }

      setForm({ name: "", email: "", company: "", message: "" });
      setSent(true);
      toast.success("Your project brief has been sent to the Vision Hive team.");
    } catch (error) {
      const message = error.message || "We couldn't send your brief right now. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setSending(false);
    }
  };
  const handleChatNavigate = ({ target, prefill = "" }) => {
    if (target === "contact") {
      setSent(false);
      if (prefill) setForm(current => ({ ...current, message: current.message || prefill }));
    }
    go(target);
  };
  const nav = [["Services", "services"], ["Work", "work"], ["About", "about"], ["Insights", "insights"], ["Contact", "contact"]];
  return <div className="site-shell">
    <Toaster position="bottom-right" theme="dark" />
    <ConciergeChat onNavigate={handleChatNavigate} />
    <header className="nav" data-testid="site-navigation"><button className="brand" onClick={() => go("top")} data-testid="nav-logo"><img src={logoUrl} alt="The Vision Hive logo" /></button><nav className="desktop-nav">{nav.map(([label, id]) => <button key={id} onClick={() => go(id)} data-testid={`nav-link-${id}`}>{label}</button>)}</nav><button className="nav-cta" onClick={() => go("contact")} data-testid="nav-lets-talk-button">Let's Talk <ArrowUpRight size={15} /></button><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation" data-testid="mobile-menu-toggle">{menuOpen ? <X /> : <Menu />}</button></header>
    <AnimatePresence>{menuOpen && <motion.div id="mobile-navigation" className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-testid="mobile-menu-overlay"><div className="mobile-menu-inner">{nav.map(([label, id], i) => <motion.button key={id} onClick={() => go(id)} initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .07 }} data-testid={`mobile-nav-link-${id}`}>{label}<ArrowUpRight size={18} /></motion.button>)}<button className="button button-accent" onClick={() => go("contact")} data-testid="mobile-lets-talk-button">Let's Talk <ArrowUpRight size={17} /></button></div></motion.div>}</AnimatePresence>

    <main id="top">
      <section className="hero section-pad"><div className="hero-orb orb-one" /><div className="hero-orb orb-two" /><div className="hero-grid" /><div className="hero-copy"><Reveal><p className="eyebrow">CREATIVE DIGITAL AGENCY <span>●</span></p></Reveal><Reveal delay={.08}><h1 data-testid="hero-heading">BUILDING DIGITAL <em>EXPERIENCES</em><br /> THAT MOVE<br /> BUSINESSES <em>FORWARD.</em></h1></Reveal><Reveal delay={.16}><p className="hero-body">We combine strategy, design, technology and performance marketing to create digital experiences that attract attention, generate leads and accelerate growth.</p></Reveal><Reveal delay={.24}><div className="hero-actions"><button className="button button-accent" onClick={() => go("contact")} data-testid="hero-start-project-button">Start a Project <ArrowUpRight size={17} /></button><button className="button button-ghost" onClick={() => go("work")} data-testid="hero-explore-work-button">Explore Our Work <ArrowDownRight size={17} /></button></div></Reveal></div><div className="hero-meta"><span>Scroll to explore</span><span className="scroll-line" /></div><div className="hero-index">01 <span>/</span> 08</div></section>

      <div className="marquee" data-testid="service-marquee"><div className="marquee-track">{[...Array(2)].flatMap((_, i) => services.map(s => <span key={`${i}-${s[0]}`}>{s[1]} <b>✦</b></span>))}</div></div>

      <section id="about" className="section-pad intro"><Reveal><p className="eyebrow">WHAT WE DO <span>—</span></p></Reveal><div className="intro-layout"><Reveal delay={.05}><h2>WE BUILD DIGITAL SYSTEMS THAT TURN <em>ATTENTION</em> INTO GROWTH.</h2></Reveal><Reveal delay={.12}><div><p>We don't just create websites or run campaigns. We combine strategy, creative, technology and performance to build digital systems designed around measurable business outcomes.</p><button className="text-link" onClick={() => go("services")} data-testid="intro-services-link">Explore our capabilities <ArrowUpRight size={16} /></button></div></Reveal></div></section>

      <section className="stats-band" data-testid="results-section"><div className="stats-grid"><Counter value={100} suffix="+" label="Projects delivered" /><Counter value={95} suffix="+" label="Performance score" /><Counter value={49} suffix="/5" label="Client satisfaction" /><Counter value={10} suffix="+" label="Industries served" /></div><p className="placeholder-note">Illustrative benchmarks — replace with verified Vision Hive results.</p></section>

      <section id="services" className="section-pad services-section"><Reveal><p className="eyebrow">OUR CAPABILITIES <span>—</span></p><div className="section-heading"><h2>FULL-SERVICE<br /><em>DIGITAL GROWTH.</em></h2><p>Everything you need to build, launch and grow your digital presence.</p></div></Reveal><div className="services-list">{services.map((s, i) => <Reveal key={s[0]} delay={i * .04}><button className={`service-row ${active === i ? "active" : ""}`} onClick={() => setActive(active === i ? -1 : i)} aria-expanded={active === i} aria-controls={`service-description-${s[0]}`} data-testid={`service-card-${s[0]}`}><span className="service-no">{s[0]}</span><span className="service-title">{s[1]}</span><span className="service-desc" id={`service-description-${s[0]}`}>{s[2]}</span><span className="service-arrow"><ArrowUpRight size={22} /></span></button></Reveal>)}</div></section>

      <section className="process-section"><div className="section-pad"><Reveal><p className="eyebrow">OUR PROCESS <span>—</span></p><div className="section-heading"><h2>HOW WE CREATE<br /><em>GROWTH.</em></h2><p>A strategy-first process designed to turn ideas into measurable results.</p></div></Reveal><div className="process-grid">{processSteps.map((p, i) => <Reveal key={p[0]} delay={i * .08}><div className="process-card" data-testid={`process-step-${p[0]}`}><span>{p[0]}</span><h3>{p[1]}</h3><p>{p[2]}</p></div></Reveal>)}</div></div></section>

      <section id="work" className="section-pad work-section"><Reveal><p className="eyebrow">SELECTED WORK <span>—</span></p><div className="section-heading"><h2>PROOF, NOT<br /><em>PROMISES.</em></h2><p>Real stories will replace these placeholders as the Vision Hive portfolio takes shape.</p></div></Reveal><div className="work-grid">{work.map((w, i) => <Reveal key={w[0]} delay={i * .1}><article className="work-card" data-testid={`work-card-${i + 1}`}><div className={`work-visual visual-${i + 1}`}><span>PLACEHOLDER</span><i>{String(i + 1).padStart(2, "0")}</i></div><div className="work-info"><p className="eyebrow">{w[1]}</p><h3>{w[0]}</h3><p>{w[2]}</p><button onClick={() => go("contact")} data-testid={`work-case-study-${i + 1}`}>{w[3]} <ArrowUpRight size={16} /></button></div></article></Reveal>)}</div></section>

      <section className="principles-section"><div className="section-pad"><Reveal><p className="eyebrow">WHY THE VISION HIVE <span>—</span></p><h2>BUILT FOR <em>AMBITIOUS</em> BRANDS.</h2></Reveal><div className="principles-grid">{[["01", "Strategy First", "Every decision starts with the business objective."], ["02", "Designed to Convert", "Design should not only look beautiful — it should drive action."], ["03", "Technology That Performs", "Fast, accessible and scalable digital experiences."], ["04", "Always Improving", "Launch is not the finish line. We continuously test and optimize."]].map((p, i) => <Reveal key={p[0]} delay={i * .08}><div className="principle" data-testid={`principle-${p[0]}`}><span>{p[0]}</span><h3>{p[1]}</h3><p>{p[2]}</p></div></Reveal>)}</div></div></section>

      <section id="insights" className="insights-section section-pad"><Reveal><p className="eyebrow">INSIGHTS <span>—</span></p><div className="section-heading"><h2>THOUGHTS FOR<br /><em>FORWARD MOTION.</em></h2><p>Original perspectives on strategy, experience and the systems behind meaningful growth.</p></div></Reveal><div className="insights-grid">{insights.map((article, i) => <Reveal key={article[0]} delay={i * .08}><article className="insight-card" data-testid={`insight-card-${i + 1}`}><div className="insight-art"><span>{article[3]}</span><b>{article[0]}</b></div><div className="insight-content"><p className="eyebrow">5 MIN READ</p><h3>{article[1]}</h3><p>{article[2]}</p><button onClick={() => toast.info("Article preview — full editorial coming soon.")} data-testid={`insight-read-button-${i + 1}`}>Read article <ArrowUpRight size={16} /></button></div></article></Reveal>)}</div></section>

      <section className="testimonial section-pad"><Reveal><p className="eyebrow">A NOTE FROM THE FUTURE <span>—</span></p><blockquote>“The most valuable digital experiences don't shout for attention. They earn it, then turn it into momentum.”</blockquote><p className="testimonial-credit">Vision Hive editorial placeholder<br /><span>Replace with a verified client testimonial</span></p></Reveal></section>

      <section id="contact" className="contact-section section-pad"><div className="contact-layout"><Reveal><p className="eyebrow">START THE CONVERSATION <span>—</span></p><h2>LET'S BUILD<br />SOMETHING<br /><em>THAT MATTERS.</em></h2><p className="contact-copy">Tell us where you want to go. We'll help you find the smartest digital path to get there.</p><div className="contact-details"><p><span>Email</span> contact@thevisionhive.placeholder</p><p><span>Phone</span> +1 (555) 000-0000 [Placeholder]</p><p><span>Location</span> Your city, your country [Placeholder]</p></div></Reveal><Reveal delay={.1}><div className="form-card">{sent ? <div className="success" data-testid="contact-success-message"><div><Check /></div><h3>Brief received.</h3><p>Thank you for reaching out. We’ll be in touch soon.</p><button className="text-link" onClick={() => setSent(false)} data-testid="submit-another-inquiry">Submit another inquiry <ArrowUpRight size={16} /></button></div> : <form onSubmit={submit} data-testid="contact-form"><p className="form-label">PROJECT BRIEF</p><label>Name *<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required minLength={2} maxLength={120} data-testid="contact-form-name" /></label><label>Work email *<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" required data-testid="contact-form-email" /></label><label>Company<input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" maxLength={160} data-testid="contact-form-company" /></label><label>How can we help? *<textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you're building..." required minLength={10} maxLength={5000} data-testid="contact-form-message" /></label>{formError && <p className="form-error" role="alert" data-testid="contact-form-error">{formError}</p>}<button className="button button-accent form-submit" disabled={sending} type="submit" data-testid="contact-form-submit-button">{sending ? "Sending brief..." : "Send project brief"} <ArrowUpRight size={17} /></button></form>}</div></Reveal></div></section>
    </main>
    <footer className="footer"><div className="footer-top"><div className="footer-logo-plate"><img src={logoUrl} alt="The Vision Hive logo" data-testid="footer-logo" /></div><p>Strategy, design, technology and digital growth — working together.</p><button className="button button-accent" onClick={() => go("contact")} data-testid="footer-contact-button">Start a Project <ArrowUpRight size={17} /></button></div><div className="footer-bottom"><span>© 2026 The Vision Hive. All rights reserved.</span><span>Email / Phone / Location — placeholders</span><span>Instagram / LinkedIn / X — placeholders</span></div></footer>
  </div>;
}