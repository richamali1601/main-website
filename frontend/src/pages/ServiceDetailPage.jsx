import React, { useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ConciergeChat } from "../components/ConciergeChat";
import { getServiceBySlug, serviceCatalog } from "../data/services";
import "./ServiceDetailPage.css";

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: .65, ease: [.22, 1, .36, 1] } };

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = getServiceBySlug(slug);
  const index = serviceCatalog.findIndex(item => item.slug === slug);
  const nextService = index >= 0 ? serviceCatalog[(index + 1) % serviceCatalog.length] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!service) return;
    document.title = `${service.title} | The Vision Hive`;
    return () => { document.title = "The Vision Hive"; };
  }, [service]);

  if (!service) return <Navigate to="/" replace />;

  const startProject = () => navigate("/", { state: { scrollTo: "contact", contactPrefill: `I'm interested in ${service.title}. ` } });
  const handleChatNavigate = ({ target, prefill = "" }) => {
    if (target === "service") return navigate(`/services/${prefill}`);
    navigate("/", { state: { scrollTo: target, contactPrefill: target === "contact" ? prefill : "" } });
  };

  return <div className="service-page">
    <ConciergeChat onNavigate={handleChatNavigate} />
    <header className="service-page-nav" data-testid="service-page-navigation">
      <Link to="/" className="service-page-logo" data-testid="service-page-logo"><img src="/logo.png" alt="The Vision Hive logo" /></Link>
      <Link to="/" state={{ scrollTo: "services" }} className="service-nav-link" data-testid="service-page-all-services"><ArrowLeft size={15} /> All Services</Link>
      <button onClick={startProject} data-testid="service-page-nav-cta">Start a Project <ArrowUpRight size={15} /></button>
    </header>

    <main>
      <section className="service-detail-hero" data-testid={`service-detail-${service.slug}`}>
        <img src={service.image} alt={service.imageAlt} data-testid="service-hero-image" />
        <div className="service-hero-overlay" />
        <motion.div className="service-hero-copy" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>
          <p className="service-kicker"><span>{service.number}</span> Full-Service Digital Growth</p>
          <h1 data-testid="service-page-heading">{service.title}</h1>
          <p>{service.hero}</p>
          <div className="service-hero-actions">
            <button onClick={startProject} data-testid="service-hero-start-project">Start a Project <ArrowUpRight size={17} /></button>
            <a href="#service-overview" data-testid="service-hero-explore">Explore the service <ArrowRight size={16} /></a>
          </div>
        </motion.div>
        <span className="service-scroll-cue">Scroll to understand the system</span>
      </section>

      <section id="service-overview" className="service-overview">
        <motion.div className="service-overview-label" {...reveal}><p>THE OPPORTUNITY</p><span>{service.number} / 08</span></motion.div>
        <motion.div className="service-overview-copy" {...reveal}><h2>{service.hero}</h2><p>{service.intro}</p></motion.div>
      </section>

      <section className="service-deliverables" data-testid="service-deliverables-section">
        <motion.div className="service-section-heading" {...reveal}><p>WHAT WE DELIVER</p><h2>A complete system,<br /><em>not isolated activity.</em></h2></motion.div>
        <div className="service-deliverables-grid">{service.deliverables.map(([title, text], itemIndex) => <motion.article key={title} {...reveal} transition={{ ...reveal.transition, delay: itemIndex * .06 }} data-testid={`service-deliverable-${itemIndex + 1}`}><span>{String(itemIndex + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></motion.article>)}</div>
      </section>

      <section className="service-process" data-testid="service-process-section">
        <motion.div className="service-section-heading" {...reveal}><p>HOW WE WORK</p><h2>From clarity<br /><em>to momentum.</em></h2></motion.div>
        <div className="service-process-list">{service.process.map(([title, text], itemIndex) => <motion.div key={title} className="service-process-row" {...reveal} data-testid={`service-process-step-${itemIndex + 1}`}><span>{String(itemIndex + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></motion.div>)}</div>
      </section>

      <section className="service-fit">
        <motion.div {...reveal}><p className="service-label">IDEAL FOR</p><h2>Built for teams<br />ready to move.</h2></motion.div>
        <motion.ul {...reveal}>{service.idealFor.map(item => <li key={item}><Check size={17} />{item}</li>)}</motion.ul>
      </section>

      <section className="service-outcomes" data-testid="service-outcomes-section"><p>DESIGNED TO CREATE</p><div>{service.outcomes.map((outcome, outcomeIndex) => <motion.h3 key={outcome} {...reveal} transition={{ ...reveal.transition, delay: outcomeIndex * .08 }} data-testid={`service-outcome-${outcomeIndex + 1}`}>{outcome}</motion.h3>)}</div></section>

      <section className="service-next">
        <div><p>NEXT CAPABILITY</p><span>{nextService.number} / 08</span></div>
        <Link to={`/services/${nextService.slug}`} data-testid="service-next-link"><span>{nextService.title}</span><ArrowUpRight size={36} /></Link>
      </section>

      <section className="service-final-cta">
        <p>HAVE A PROJECT IN MIND?</p>
        <h2>Let's turn the next move<br />into meaningful growth.</h2>
        <button onClick={startProject} data-testid="service-final-start-project">Start a {service.title} Project <ArrowUpRight size={18} /></button>
      </section>
    </main>

    <footer className="service-page-footer"><Link to="/" data-testid="service-footer-home">© 2026 The Vision Hive</Link><a href="mailto:thevisionhive16@gmail.com" data-testid="service-footer-email"><Mail size={13} />thevisionhive16@gmail.com</a><span><MapPin size={13} />Vesu, Surat, 395007</span></footer>
  </div>;
}