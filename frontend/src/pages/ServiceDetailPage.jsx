import React, { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Mail, MapPin } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ConciergeChat } from "../components/ConciergeChat";
import { getServiceBySlug, serviceCatalog } from "../data/services";
import "./ServiceDetailPage.css";
import "./ServiceMotion.css";

const EDITORIAL_EASE = [.76, 0, .24, 1];
const SMOOTH_EASE = [.25, 1, .5, 1];

const MaskedHeading = ({ children, className = "", reduceMotion, delay = 0 }) => <div className={`motion-heading-mask ${className}`}>
  <motion.div
    initial={reduceMotion ? { opacity: 0 } : { y: "108%", rotate: 1.2 }}
    whileInView={reduceMotion ? { opacity: 1 } : { y: "0%", rotate: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: reduceMotion ? .2 : 1.05, delay, ease: EDITORIAL_EASE }}
  >{children}</motion.div>
</div>;

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const service = getServiceBySlug(slug);
  const index = serviceCatalog.findIndex(item => item.slug === slug);
  const nextService = index >= 0 ? serviceCatalog[(index + 1) % serviceCatalog.length] : null;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: .7 });
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY = useTransform(heroProgress, [0, 1], [0, 90]);
  const heroImageScale = useTransform(heroProgress, [0, 1], [1.08, 1.01]);

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
  const itemVariant = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 24, filter: "blur(4px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } };
  const listVariant = { hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : .11 } } };
  const outcomeVariant = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { x: "-102%" }, visible: { x: "0%" } };

  return <div className="service-page">
    <motion.div className="service-scroll-progress" style={{ scaleX: reduceMotion ? 1 : progress }} data-testid="service-scroll-progress" />
    <ConciergeChat onNavigate={handleChatNavigate} />
    <header className="service-page-nav" data-testid="service-page-navigation">
      <Link to="/" className="service-page-logo" data-testid="service-page-logo"><img src="/logo.png" alt="The Vision Hive logo" /></Link>
      <Link to="/" state={{ scrollTo: "services" }} className="service-nav-link" data-testid="service-page-all-services"><ArrowLeft size={15} /> All Services</Link>
      <button onClick={startProject} data-testid="service-page-nav-cta">Start a Project <ArrowUpRight size={15} /></button>
    </header>

    <motion.main key={service.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? .2 : .45 }}>
      <section ref={heroRef} className="service-detail-hero" data-testid={`service-detail-${service.slug}`}>
        <motion.div className="service-hero-media" initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }} animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }} transition={{ duration: reduceMotion ? .2 : 1.35, ease: EDITORIAL_EASE }}>
          <motion.img src={service.image} alt={service.imageAlt} style={reduceMotion ? undefined : { y: heroImageY, scale: heroImageScale }} initial={reduceMotion ? false : { scale: 1.16 }} animate={reduceMotion ? undefined : { scale: 1.08 }} transition={{ duration: 1.5, ease: EDITORIAL_EASE }} data-testid="service-hero-image" />
        </motion.div>
        <motion.div className="service-hero-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? .2 : 1, delay: reduceMotion ? 0 : .35 }} />
        <div className="service-hero-copy">
          <motion.p className="service-kicker" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? .2 : .8, delay: reduceMotion ? 0 : .5, ease: SMOOTH_EASE }}><span>{service.number}</span> Full-Service Digital Growth</motion.p>
          <h1 data-testid="service-page-heading">{service.title.split(" ").map((word, wordIndex) => <span className="service-title-mask" key={`${word}-${wordIndex}`}><motion.span initial={reduceMotion ? { opacity: 0 } : { y: "110%", rotate: 2 }} animate={reduceMotion ? { opacity: 1 } : { y: "0%", rotate: 0 }} transition={{ duration: reduceMotion ? .2 : 1.12, delay: reduceMotion ? 0 : .56 + wordIndex * .09, ease: EDITORIAL_EASE }}>{word}</motion.span></span>)}</h1>
          <motion.p initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? .2 : .85, delay: reduceMotion ? 0 : .82, ease: SMOOTH_EASE }}>{service.hero}</motion.p>
          <motion.div className="service-hero-actions" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? .2 : .65, delay: reduceMotion ? 0 : 1.02, ease: SMOOTH_EASE }}>
            <button onClick={startProject} data-testid="service-hero-start-project">Start a Project <ArrowUpRight size={17} /></button>
            <a href="#service-overview" data-testid="service-hero-explore">Explore the service <ArrowRight size={16} /></a>
          </motion.div>
        </div>
        <motion.span className="service-scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduceMotion ? 0 : 1.2 }}><i />Scroll to understand the system</motion.span>
      </section>

      <section id="service-overview" className="service-overview">
        <motion.div className="service-overview-label" initial={itemVariant.hidden} whileInView={itemVariant.visible} viewport={{ once: true }} transition={{ duration: .7, ease: SMOOTH_EASE }}><p>THE OPPORTUNITY</p><span>{service.number} / 08</span></motion.div>
        <div className="service-overview-copy"><MaskedHeading reduceMotion={reduceMotion}><h2>{service.hero}</h2></MaskedHeading><motion.p initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: reduceMotion ? .2 : .8, delay: reduceMotion ? 0 : .16, ease: SMOOTH_EASE }}>{service.intro}</motion.p></div>
        <motion.span className="service-section-rule" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? .2 : 1.2, ease: EDITORIAL_EASE }} />
      </section>

      <section className="service-deliverables" data-testid="service-deliverables-section">
        <div className="service-section-heading"><motion.p initial={itemVariant.hidden} whileInView={itemVariant.visible} viewport={{ once: true }} transition={{ duration: .6 }}>WHAT WE DELIVER</motion.p><MaskedHeading reduceMotion={reduceMotion}><h2>A complete system,<br /><em>not isolated activity.</em></h2></MaskedHeading></div>
        <motion.div className="service-deliverables-grid" variants={listVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>{service.deliverables.map(([title, text], itemIndex) => <motion.article key={title} variants={itemVariant} transition={{ duration: reduceMotion ? .2 : .72, ease: SMOOTH_EASE }} whileHover={reduceMotion ? undefined : { y: -7 }} data-testid={`service-deliverable-${itemIndex + 1}`}><span>{String(itemIndex + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></motion.article>)}</motion.div>
      </section>

      <section className="service-process" data-testid="service-process-section">
        <div className="service-section-heading"><motion.p initial={itemVariant.hidden} whileInView={itemVariant.visible} viewport={{ once: true }} transition={{ duration: .6 }}>HOW WE WORK</motion.p><MaskedHeading reduceMotion={reduceMotion}><h2>From clarity<br /><em>to momentum.</em></h2></MaskedHeading></div>
        <motion.div className="service-process-list" variants={listVariant} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>{service.process.map(([title, text], itemIndex) => <motion.div key={title} className="service-process-row" variants={itemVariant} transition={{ duration: reduceMotion ? .2 : .75, ease: SMOOTH_EASE }} whileHover={reduceMotion ? undefined : { x: 9 }} data-testid={`service-process-step-${itemIndex + 1}`}><span>{String(itemIndex + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></motion.div>)}</motion.div>
      </section>

      <section className="service-fit">
        <div><motion.p className="service-label" initial={itemVariant.hidden} whileInView={itemVariant.visible} viewport={{ once: true }}>IDEAL FOR</motion.p><MaskedHeading reduceMotion={reduceMotion}><h2>Built for teams<br />ready to move.</h2></MaskedHeading></div>
        <motion.ul variants={listVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>{service.idealFor.map(item => <motion.li key={item} variants={itemVariant} transition={{ duration: reduceMotion ? .2 : .65, ease: SMOOTH_EASE }}><Check size={17} />{item}</motion.li>)}</motion.ul>
      </section>

      <section className="service-outcomes" data-testid="service-outcomes-section"><motion.p initial={itemVariant.hidden} whileInView={itemVariant.visible} viewport={{ once: true }}>DESIGNED TO CREATE</motion.p><div>{service.outcomes.map((outcome, outcomeIndex) => <motion.div className="outcome-mask" key={outcome} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }}><motion.h3 variants={outcomeVariant} transition={{ duration: reduceMotion ? .2 : 1, delay: reduceMotion ? 0 : outcomeIndex * .09, ease: EDITORIAL_EASE }} data-testid={`service-outcome-${outcomeIndex + 1}`}>{outcome}</motion.h3></motion.div>)}</div></section>

      <motion.section className="service-next" initial={reduceMotion ? { opacity: 0 } : { scale: .96, clipPath: "inset(8% 4% 0 4%)" }} whileInView={reduceMotion ? { opacity: 1 } : { scale: 1, clipPath: "inset(0% 0% 0% 0%)" }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: reduceMotion ? .2 : 1.1, ease: EDITORIAL_EASE }}>
        <div><p>NEXT CAPABILITY</p><span>{nextService.number} / 08</span></div>
        <Link to={`/services/${nextService.slug}`} data-testid="service-next-link"><span>{nextService.title}</span><ArrowUpRight size={36} /></Link>
      </motion.section>

      <section className="service-final-cta">
        <motion.p initial={itemVariant.hidden} whileInView={itemVariant.visible} viewport={{ once: true }}>HAVE A PROJECT IN MIND?</motion.p>
        <MaskedHeading reduceMotion={reduceMotion}><h2>Let's turn the next move<br />into meaningful growth.</h2></MaskedHeading>
        <motion.button initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? .2 : .7, delay: reduceMotion ? 0 : .22, ease: SMOOTH_EASE }} onClick={startProject} data-testid="service-final-start-project">Start a {service.title} Project <ArrowUpRight size={18} /></motion.button>
      </section>
    </motion.main>

    <footer className="service-page-footer"><Link to="/" data-testid="service-footer-home">© 2026 The Vision Hive</Link><a href="mailto:thevisionhive16@gmail.com" data-testid="service-footer-email"><Mail size={13} />thevisionhive16@gmail.com</a><span><MapPin size={13} />Vesu, Surat, 395007</span></footer>
  </div>;
}