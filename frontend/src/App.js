/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "./WorkCards.css";
import "./components/Stats.css";
import "./components/ContactLinks.css";
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
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61590595676030", Icon: Users },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/richa-mali-228675282?utm_source=share_via&utm_content=profile&utm_medium=member_ios", Icon: Briefcase },
];

const processSteps = [
  ["01", "DISCOVER", "Understand the business, audience, competitors and objectives."],
  ["02", "STRATEGIZE", "Build a clear roadmap based on data, positioning and business goals."],
  ["03", "CREATE", "Design and develop the digital experience, campaigns and content."],
  ["04", "OPTIMIZE", "Measure performance, test continuously and improve what matters."],
];

const work = [
  ["AMRUT", "Fashion / 2026", "A future case study will live here. Replace this with your project story, services and verified outcome.", "VIEW CASE STUDY", "/work/amrut.jpg", "Amrut fashion brand logo"],
  ["COFFY-RICO", "Coffee / 2026", "A future case study will live here. Replace this with your project story, services and verified outcome.", "VIEW CASE STUDY", "/work/logo.svg", "Coffy-Rico brand logo"],
  ["NIDHI SKINCARE", "Skincare / 2026", "A future case study will live here. Replace this with your project story, services and verified outcome.", "VIEW CASE STUDY", "/work/nidhi-logo.avif", "Nidhi Skincare brand logo"],
];

const insights = [
  ["01", "From Visibility to Sales: How a Strong Digital Marketing Strategy Converts Audiences into Customers", "A practical guide to moving audiences from awareness and engagement through trust to conversion.", "Digital Marketing", "https://medium.com/@richamali1601/from-visibility-to-sales-how-a-strong-digital-marketing-strategy-converts-audiences-into-customers-ca153d68bab8?sharedUserId=richamali1601"],
  ["02", "How Digital Marketing Can Help Startups Build a Strong Brand from Day One", "How startups can use branding, social media, content, SEO and paid marketing to build lasting visibility and trust.", "Brand Strategy", "https://medium.com/@richamali1601/how-digital-marketing-can-help-startups-build-a-strong-brand-from-day-one-d0784eff03f4?sharedUserId=richamali1601"],
  ["03", "From Activity to Momentum", "How ambitious teams can move beyond busywork and build a marketing rhythm that compounds.", "Growth"],
];

function Reveal({ children, className = "", delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .7, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function Counter({ value, suffix = "", label, decimals = 0 }) {
  const ref = useRef(null); const visible = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => { if (!visible) return; let frame = 0; const step = () => { frame += 1; const next = value * Math.min(frame / 30, 1); setCount(next); if (frame < 30) requestAnimationFrame(step); }; requestAnimationFrame(step); }, [visible, value]);
  return <div ref={ref} className="stat" data-testid={`stat-${label.toLowerCase().replaceAll(" ", "-")}`}><strong>{count.toFixed(decimals)}{suffix}</strong><span>{label}</span></div>;
}

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); const [sent, setSent] = useState(false); const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [formError, setFormError] = useState("");
  const go = (id) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => {
    if (!location.state?.scrollTo) return;
    const { scrollTo, contactPrefill = "" } = location.state;
    if (contactPrefill) setForm(current => ({ ...current, message: contactPrefill }));
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
      const message = "Please complete the required fields.";
      setFormError(message);
      toast.error(message);
      return;
    }

    setSending(true);
    setForm({ name: "", email: "", company: "", message: "" });
    setSent(true);
    setSending(false);
    toast.success("Your project brief has been saved for this demo.");
  };
  const handleChatNavigate = ({ target, prefill = "" }) => {
    if (target === "service") {
      navigate(`/services/${prefill}`);
      return;
    }
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

      <div className="marquee" data-testid="service-marquee"><div className="marquee-track">{[...Array(2)].flatMap((_, i) => serviceCatalog.map(service => <span key={`${i}-${service.number}`}>{service.title} <b>✦</b></span>))}</div></div>

      <section id="about" className="section-pad intro"><Reveal><p className="eyebrow">WHAT WE DO <span>—</span></p></Reveal><div className="intro-layout"><Reveal delay={.05}><h2>WE BUILD DIGITAL SYSTEMS THAT TURN <em>ATTENTION</em> INTO GROWTH.</h2></Reveal><Reveal delay={.12}><div><p>We don't just create websites or run campaigns. We combine strategy, creative, technology and performance to build digital systems designed around measurable business outcomes.</p><button className="text-link" onClick={() => go("services")} data-testid="intro-services-link">Explore our capabilities <ArrowUpRight size={16} /></button></div></Reveal></div></section>

      <section className="stats-band" data-testid="results-section"><div className="stats-grid"><Counter value={10} suffix="+" label="Projects delivered" /><Counter value={95} suffix="+" label="Performance score" /><Counter value={4.9} suffix="/5" decimals={1} label="Client satisfaction" /><Counter value={5} suffix="+" label="Industries served" /></div></section>

      <section id="services" className="section-pad services-section"><Reveal><p className="eyebrow">OUR CAPABILITIES <span>—</span></p><div className="section-heading"><h2>FULL-SERVICE<br /><em>DIGITAL GROWTH.</em></h2><p>Explore each capability in depth, then choose the right path for your next stage of growth.</p></div></Reveal><div className="services-list">{serviceCatalog.map((service, i) => <Reveal key={service.slug} delay={i * .04}><Link className="service-row" to={`/services/${service.slug}`} data-testid={`service-card-${service.number}`}><span className="service-no">{service.number}</span><span className="service-title">{service.title}</span><span className="service-desc" id={`service-description-${service.number}`}>{service.short}</span><span className="service-arrow"><ArrowUpRight size={22} /></span></Link></Reveal>)}</div></section>

      <section className="process-section"><div className="section-pad"><Reveal><p className="eyebrow">OUR PROCESS <span>—</span></p><div className="section-heading"><h2>HOW WE CREATE<br /><em>GROWTH.</em></h2><p>A strategy-first process designed to turn ideas into measurable results.</p></div></Reveal><div className="process-grid">{processSteps.map((p, i) => <Reveal key={p[0]} delay={i * .08}><div className="process-card" data-testid={`process-step-${p[0]}`}><span>{p[0]}</span><h3>{p[1]}</h3><p>{p[2]}</p></div></Reveal>)}</div></div></section>

  <section id="work" className="section-pad work-section"><Reveal><p className="eyebrow">SELECTED WORK <span>—</span></p><div className="section-heading"><h2>PROOF, NOT<br /><em>PROMISES.</em></h2><p>Real stories will replace these placeholders as the Vision Hive portfolio takes shape.</p></div></Reveal><div className="work-grid">{work.map((w, i) => <Reveal key={w[0]} delay={i * .1}><article className="work-card" data-testid={`work-card-${i + 1}`}><div className={`work-visual visual-${i + 1}`}>{w[4] ? <img src={w[4]} alt={w[5]} /> : <span>PLACEHOLDER</span>}<i>{String(i + 1).padStart(2, "0")}</i></div><div className="work-info"><p className="eyebrow">{w[1]}</p><h3>{w[0]}</h3><p>{w[2]}</p><button onClick={() => go("contact")} data-testid={`work-case-study-${i + 1}`}>{w[3]} <ArrowUpRight size={16} /></button></div></article></Reveal>)}</div></section>

      <section className="principles-section"><div className="section-pad"><Reveal><p className="eyebrow">WHY THE VISION HIVE <span>—</span></p><h2>BUILT FOR <em>AMBITIOUS</em> BRANDS.</h2></Reveal><div className="principles-grid">{[["01", "Strategy First", "Every decision starts with the business objective."], ["02", "Designed to Convert", "Design should not only look beautiful — it should drive action."], ["03", "Technology That Performs", "Fast, accessible and scalable digital experiences."], ["04", "Always Improving", "Launch is not the finish line. We continuously test and optimize."]].map((p, i) => <Reveal key={p[0]} delay={i * .08}><div className="principle" data-testid={`principle-${p[0]}`}><span>{p[0]}</span><h3>{p[1]}</h3><p>{p[2]}</p></div></Reveal>)}</div></div></section>

      <section id="insights" className="insights-section section-pad"><Reveal><p className="eyebrow">INSIGHTS <span>—</span></p><div className="section-heading"><h2>THOUGHTS FOR<br /><em>FORWARD MOTION.</em></h2><p>Original perspectives on strategy, experience and the systems behind meaningful growth.</p></div></Reveal><div className="insights-grid">{insights.map((article, i) => <Reveal key={article[0]} delay={i * .08}><article className="insight-card" data-testid={`insight-card-${i + 1}`}><div className="insight-art"><span>{article[3]}</span><b>{article[0]}</b></div><div className="insight-content"><p className="eyebrow">5 MIN READ</p><h3>{article[1]}</h3><p>{article[2]}</p>{article[4] ? <a href={article[4]} target="_blank" rel="noreferrer" data-testid={`insight-read-button-${i + 1}`}>Read article <ArrowUpRight size={16} /></a> : <button onClick={() => toast.info("Article preview — full editorial coming soon.")} data-testid={`insight-read-button-${i + 1}`}>Read article <ArrowUpRight size={16} /></button>}</div></article></Reveal>)}</div></section>

      <section className="testimonial section-pad"><Reveal><p className="eyebrow">A NOTE FROM THE FUTURE <span>—</span></p><blockquote>“The most valuable digital experiences don't shout for attention. They earn it, then turn it into momentum.”</blockquote><p className="testimonial-credit">Vision Hive editorial placeholder<br /><span>Replace with a verified client testimonial</span></p></Reveal></section>

      <section id="contact" className="contact-section section-pad"><div className="contact-layout"><Reveal><p className="eyebrow">START THE CONVERSATION <span>—</span></p><h2>LET'S BUILD<br />SOMETHING<br /><em>THAT MATTERS.</em></h2><p className="contact-copy">Tell us where you want to go. We'll help you find the smartest digital path to get there.</p><div className="contact-details"><p data-testid="contact-email-detail"><span>Email</span><a href="mailto:thevisionhive16@gmail.com" data-testid="contact-email-link">thevisionhive16@gmail.com</a></p><p data-testid="contact-location-detail"><span>Location</span>Vesu, Surat, 395007</p><div className="contact-socials" aria-label="Social media links">{socialLinks.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`Visit The Vision Hive on ${label}`} data-testid={`contact-social-${label.toLowerCase()}`}><Icon size={16} />{label}</a>)}</div></div></Reveal><Reveal delay={.1}><div className="form-card">{sent ? <div className="success" data-testid="contact-success-message"><div><Check /></div><h3>Brief received.</h3><p>Thank you for reaching out. We’ll be in touch soon.</p><button className="text-link" onClick={() => setSent(false)} data-testid="submit-another-inquiry">Submit another inquiry <ArrowUpRight size={16} /></button></div> : <form onSubmit={submit} data-testid="contact-form"><p className="form-label">PROJECT BRIEF</p><label>Name *<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required minLength={2} maxLength={120} data-testid="contact-form-name" /></label><label>Work email *<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" required data-testid="contact-form-email" /></label><label>Company<input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" maxLength={160} data-testid="contact-form-company" /></label><label>How can we help? *<textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you're building..." required minLength={10} maxLength={5000} data-testid="contact-form-message" /></label>{formError && <p className="form-error" role="alert" data-testid="contact-form-error">{formError}</p>}<button className="button button-accent form-submit" disabled={sending} type="submit" data-testid="contact-form-submit-button">{sending ? "Sending brief..." : "Send project brief"} <ArrowUpRight size={17} /></button></form>}</div></Reveal></div></section>
    </main>
    <footer className="footer"><div className="footer-top"><div className="footer-logo-plate"><img src={logoUrl} alt="The Vision Hive logo" data-testid="footer-logo" /></div><p>Strategy, design, technology and digital growth — working together.</p><button className="button button-accent" onClick={() => go("contact")} data-testid="footer-contact-button">Start a Project <ArrowUpRight size={17} /></button></div><div className="footer-bottom"><span data-testid="footer-copyright">© 2026 The Vision Hive. All rights reserved.</span><div className="footer-contact-meta"><a href="mailto:thevisionhive16@gmail.com" data-testid="footer-email-link"><Mail size={13} />thevisionhive16@gmail.com</a><span data-testid="footer-location"><MapPin size={13} />Vesu, Surat, 395007</span></div><div className="footer-socials" aria-label="Footer social media links">{socialLinks.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`Visit The Vision Hive on ${label}`} data-testid={`footer-social-${label.toLowerCase()}`}><Icon size={14} /><span>{label}</span></a>)}</div></div></footer>
  </div>;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/services/:slug" element={<ServiceDetailPage />} />
    <Route path="*" element={<HomePage />} />
  </Routes>;
}