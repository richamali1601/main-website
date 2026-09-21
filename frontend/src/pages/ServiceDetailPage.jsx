import React, { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Mail, MapPin } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ConciergeChat } from "../components/ConciergeChat";
import { getServiceBySlug, serviceCatalog } from "../data/services";

const EDITORIAL_EASE = [0.76, 0, 0.24, 1];
const SMOOTH_EASE    = [0.25, 1, 0.5,  1];

const MaskedHeading = ({ children, className = "", reduceMotion, delay = 0 }) => (
  <div className={`motion-heading-mask ${className}`}>
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { y: "108%", rotate: 1.2 }}
      whileInView={reduceMotion ? { opacity: 1 } : { y: "0%", rotate: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: reduceMotion ? 0.2 : 1.05, delay, ease: EDITORIAL_EASE }}
    >
      {children}
    </motion.div>
  </div>
);

export default function ServiceDetailPage() {
  const { slug }    = useParams();
  const navigate    = useNavigate();
  const heroRef     = useRef(null);
  const reduceMotion = useReducedMotion();
  const service     = getServiceBySlug(slug);
  const index       = serviceCatalog.findIndex(item => item.slug === slug);
  const nextService = index >= 0 ? serviceCatalog[(index + 1) % serviceCatalog.length] : null;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.7 });
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImageY     = useTransform(heroProgress, [0, 1], [0, 90]);
  const heroImageScale = useTransform(heroProgress, [0, 1], [1.08, 1.01]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!service) return;
    document.title = `${service.title} | The Vision Hive`;
    return () => { document.title = "The Vision Hive"; };
  }, [service]);

  if (!service) return <Navigate to="/" replace />;

  const startProject    = () => navigate("/", { state: { scrollTo: "contact", contactPrefill: `I'm interested in ${service.title}. ` } });
  const handleChatNavigate = ({ target, prefill = "" }) => {
    if (target === "service") return navigate(`/services/${prefill}`);
    navigate("/", { state: { scrollTo: target, contactPrefill: target === "contact" ? prefill : "" } });
  };

  const itemVariant  = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 24, filter: "blur(4px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } };
  const listVariant  = { hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.11 } } };
  const outcomeVariant = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { x: "-102%" }, visible: { x: "0%" } };

  /* ── Shared CTA button class ─────────────────────────────────── */
  const ctaBtn = "border border-teal bg-teal text-ink min-h-[44px] px-[17px] inline-flex items-center justify-center gap-3 font-manrope font-bold text-[11px] uppercase cursor-pointer transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(18,219,229,0.18)]";

  return (
    <div className="min-h-screen bg-[#080c0f] text-paper overflow-hidden">
      {/* ── Scroll progress bar ─────────────────────────────────── */}
      <motion.div
        className="service-scroll-progress"
        style={{ scaleX: reduceMotion ? 1 : progress }}
        data-testid="service-scroll-progress"
      />

      <ConciergeChat onNavigate={handleChatNavigate} />

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <header
        className="fixed z-[70] top-0 left-0 right-0 h-[78px] px-[5vw] flex items-center gap-[30px] border-b border-paper/[0.13] bg-[rgba(8,12,15,0.82)] backdrop-blur-[18px]"
        data-testid="service-page-navigation"
      >
        <Link
          to="/"
          className="w-[160px] h-[52px] flex items-center justify-center"
          style={{ textDecoration: "none" }}
          data-testid="service-page-logo"
        >
          <img src="/main%20logo.PNG" alt="The Vision Hive logo" className="w-full h-full object-contain" style={{ mixBlendMode: "screen" }} />
        </Link>
        <Link
          to="/"
          state={{ scrollTo: "services" }}
          className="ml-auto text-muted no-underline inline-flex items-center gap-[9px] font-manrope font-bold text-[11px] uppercase transition-colors duration-200 hover:text-teal md:text-[11px] text-[0px]"
          data-testid="service-page-all-services"
        >
          <ArrowLeft size={15} className="w-5 h-5" /> <span className="hidden md:inline">All Services</span>
        </Link>
        <button
          onClick={startProject}
          className={ctaBtn}
          data-testid="service-page-nav-cta"
        >
          Start a Project <ArrowUpRight size={15} />
        </button>
      </header>

      {/* ── Main ────────────────────────────────────────────────── */}
      <motion.main
        key={service.slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.45 }}
      >
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="h-[92svh] min-h-[680px] relative flex items-end px-[8vw] pb-[9vh]"
          data-testid={`service-detail-${service.slug}`}
        >
          {/* Parallax image */}
          <motion.div
            className="service-hero-media"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: reduceMotion ? 0.2 : 1.35, ease: EDITORIAL_EASE }}
          >
            <motion.img
              src={service.image}
              alt={service.imageAlt}
              style={reduceMotion ? undefined : { y: heroImageY, scale: heroImageScale }}
              initial={reduceMotion ? false : { scale: 1.16 }}
              animate={reduceMotion ? undefined : { scale: 1.08 }}
              transition={{ duration: 1.5, ease: EDITORIAL_EASE }}
              data-testid="service-hero-image"
            />
          </motion.div>

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-[rgba(3,8,10,0.48)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0.2 : 1, delay: reduceMotion ? 0 : 0.35 }}
          />

          {/* Grid overlay */}
          <div
            className="absolute opacity-[0.18] pointer-events-none"
            style={{
              inset: "78px 0 0",
              backgroundImage: "linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px)",
              backgroundSize: "100px 100px",
            }}
          />

          {/* Copy */}
          <div className="relative z-[2] max-w-[1120px]">
            <motion.p
              className="font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-[#d8e2e3] mb-6"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -26 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.8, delay: reduceMotion ? 0 : 0.5, ease: SMOOTH_EASE }}
            >
              <span className="text-teal mr-4">{service.number}</span> Full-Service Digital Growth
            </motion.p>

            <h1 className="text-[clamp(3.8rem,8.8vw,9rem)] leading-[0.82] max-w-[1150px] mb-[30px] text-white" data-testid="service-page-heading">
              {service.title.split(" ").map((word, wordIndex) => (
                <span className="service-title-mask" key={`${word}-${wordIndex}`}>
                  <motion.span
                    initial={reduceMotion ? { opacity: 0 } : { y: "110%", rotate: 2 }}
                    animate={reduceMotion ? { opacity: 1 } : { y: "0%", rotate: 0 }}
                    transition={{ duration: reduceMotion ? 0.2 : 1.12, delay: reduceMotion ? 0 : 0.56 + wordIndex * 0.09, ease: EDITORIAL_EASE }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="text-[clamp(1.2rem,2.1vw,2rem)] leading-[1.25] max-w-[700px] mb-[34px] text-[#edf2f1]"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 34 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.85, delay: reduceMotion ? 0 : 0.82, ease: SMOOTH_EASE }}
            >
              {service.hero}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-[10px] md:flex-row flex-col"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.65, delay: reduceMotion ? 0 : 1.02, ease: SMOOTH_EASE }}
            >
              <button onClick={startProject} className={`${ctaBtn} md:w-auto w-full justify-center`} data-testid="service-hero-start-project">
                Start a Project <ArrowUpRight size={17} />
              </button>
              <a
                href="#service-overview"
                className="min-h-[44px] border border-paper/36 text-paper px-[17px] no-underline inline-flex items-center gap-3 font-manrope font-bold text-[11px] uppercase transition-all duration-200 hover:border-teal hover:text-teal md:w-auto w-full justify-center"
                data-testid="service-hero-explore"
              >
                Explore the service <ArrowRight size={16} />
              </a>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.span
            className="service-scroll-cue absolute z-[2] right-[8vw] bottom-[9vh] font-mono text-[9px] uppercase tracking-[0.15em] text-[#c5cecf] flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 1.2 }}
          >
            <i className="service-scroll-cue-line" />
            Scroll to understand the system
          </motion.span>
        </section>

        {/* ── Overview ────────────────────────────────────────────── */}
        <section id="service-overview" className="service-overview bg-paper text-ink px-[9vw] py-[140px] grid grid-cols-1 md:grid-cols-[0.65fr_1.8fr] gap-[10vw] relative">
          <motion.div
            className="flex justify-between gap-5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#487073]"
            initial={itemVariant.hidden}
            whileInView={itemVariant.visible}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: SMOOTH_EASE }}
          >
            <p>THE OPPORTUNITY</p>
            <span>{service.number} / 08</span>
          </motion.div>
          <div>
            <MaskedHeading reduceMotion={reduceMotion}>
              <h2 className="text-[clamp(2.6rem,5.2vw,5.8rem)] leading-[0.94] mb-[45px] max-w-[1050px]">{service.hero}</h2>
            </MaskedHeading>
            <motion.p
              className="text-[17px] leading-[1.8] text-[#4f5c5f] max-w-[790px]"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: reduceMotion ? 0.2 : 0.8, delay: reduceMotion ? 0 : 0.16, ease: SMOOTH_EASE }}
            >
              {service.intro}
            </motion.p>
          </div>
          <motion.span
            className="service-section-rule"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0.2 : 1.2, ease: EDITORIAL_EASE }}
          />
        </section>

        {/* ── Deliverables ────────────────────────────────────────── */}
        <section className="bg-[#dfe5e2] text-ink px-[9vw] py-[140px]" data-testid="service-deliverables-section">
          <div className="grid grid-cols-1 md:grid-cols-[0.65fr_1.8fr] gap-[10vw] mb-[80px]">
            <motion.p
              className="font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-[#008b91]"
              initial={itemVariant.hidden}
              whileInView={itemVariant.visible}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              WHAT WE DELIVER
            </motion.p>
            <MaskedHeading reduceMotion={reduceMotion}>
              <h2 className="text-[clamp(2.7rem,5.4vw,5.8rem)] leading-[0.94] m-0 [&_em]:not-italic [&_em]:text-[#008b91]">
                A complete system,<br /><em>not isolated activity.</em>
              </h2>
            </MaskedHeading>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-ink/25"
            variants={listVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {service.deliverables.map(([title, text], itemIndex) => (
              <motion.article
                key={title}
                className="deliverable-card min-h-[265px] p-8 border-r border-b border-ink/25"
                variants={itemVariant}
                transition={{ duration: reduceMotion ? 0.2 : 0.72, ease: SMOOTH_EASE }}
                whileHover={reduceMotion ? undefined : { y: -7 }}
                data-testid={`service-deliverable-${itemIndex + 1}`}
              >
                <span className="font-mono text-[11px] text-[#008b91]">{String(itemIndex + 1).padStart(2, "0")}</span>
                <h3 className="text-[25px] mt-[65px] mb-4">{title}</h3>
                <p className="text-[14px] leading-[1.7] text-[#536063] max-w-[450px]">{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* ── Process ─────────────────────────────────────────────── */}
        <section className="bg-[#10161a] px-[9vw] py-[140px]" data-testid="service-process-section">
          <div className="grid grid-cols-1 md:grid-cols-[0.65fr_1.8fr] gap-[10vw] mb-[80px]">
            <motion.p
              className="font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-teal"
              initial={itemVariant.hidden}
              whileInView={itemVariant.visible}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              HOW WE WORK
            </motion.p>
            <MaskedHeading reduceMotion={reduceMotion}>
              <h2 className="text-[clamp(2.7rem,5.4vw,5.8rem)] leading-[0.94] m-0 [&_em]:not-italic [&_em]:text-teal">
                From clarity<br /><em>to momentum.</em>
              </h2>
            </MaskedHeading>
          </div>
          <motion.div
            className="border-t border-line"
            variants={listVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {service.process.map(([title, text], itemIndex) => (
              <motion.div
                key={title}
                className="process-row grid grid-cols-[35px_1fr] md:grid-cols-[80px_0.7fr_1.2fr] gap-3 md:gap-[30px] items-start px-2 py-8 border-b border-line"
                variants={itemVariant}
                transition={{ duration: reduceMotion ? 0.2 : 0.75, ease: SMOOTH_EASE }}
                whileHover={reduceMotion ? undefined : { x: 9 }}
                data-testid={`service-process-step-${itemIndex + 1}`}
              >
                <span className="font-mono text-[11px] text-teal">{String(itemIndex + 1).padStart(2, "0")}</span>
                <h3 className="text-[24px] m-0">{title}</h3>
                <p className="text-[14px] leading-[1.7] text-muted max-w-[580px] m-0 col-span-full md:col-auto text-[13px]">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Ideal For ───────────────────────────────────────────── */}
        <section className="bg-paper text-ink px-[9vw] py-[130px] grid grid-cols-1 md:grid-cols-2 gap-[10vw]">
          <div>
            <motion.p
              className="font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-[#008b91]"
              initial={itemVariant.hidden}
              whileInView={itemVariant.visible}
              viewport={{ once: true }}
            >
              IDEAL FOR
            </motion.p>
            <MaskedHeading reduceMotion={reduceMotion}>
              <h2 className="text-[clamp(2.5rem,4.7vw,5rem)] leading-[0.95] mt-[22px] m-0">
                Built for teams<br />ready to move.
              </h2>
            </MaskedHeading>
          </div>
          <motion.ul
            className="list-none p-0 mt-[35px] border-t border-ink/22"
            variants={listVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {service.idealFor.map(item => (
              <motion.li
                key={item}
                className="py-[22px] border-b border-ink/22 flex gap-[13px] items-center text-[15px]"
                variants={itemVariant}
                transition={{ duration: reduceMotion ? 0.2 : 0.65, ease: SMOOTH_EASE }}
              >
                <Check size={17} className="text-[#008b91] shrink-0" />{item}
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* ── Outcomes ────────────────────────────────────────────── */}
        <section className="bg-teal text-ink px-[9vw] py-[105px]" data-testid="service-outcomes-section">
          <motion.p
            className="font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-ink mb-[45px]"
            initial={itemVariant.hidden}
            whileInView={itemVariant.visible}
            viewport={{ once: true }}
          >
            DESIGNED TO CREATE
          </motion.p>
          <div>
            {service.outcomes.map((outcome, outcomeIndex) => (
              <motion.div className="outcome-mask" key={outcome} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                <motion.h3
                  className="text-[clamp(2.4rem,5.2vw,6rem)] leading-[0.95] m-0 py-[22px] border-t border-ink/28 last:border-b last:border-ink/28"
                  variants={outcomeVariant}
                  transition={{ duration: reduceMotion ? 0.2 : 1, delay: reduceMotion ? 0 : outcomeIndex * 0.09, ease: EDITORIAL_EASE }}
                  data-testid={`service-outcome-${outcomeIndex + 1}`}
                >
                  {outcome}
                </motion.h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Next service ────────────────────────────────────────── */}
        <motion.section
          className="bg-[#0a0e11] px-[9vw] pt-[90px] pb-[120px]"
          initial={reduceMotion ? { opacity: 0 } : { scale: 0.96, clipPath: "inset(8% 4% 0 4%)" }}
          whileInView={reduceMotion ? { opacity: 1 } : { scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduceMotion ? 0.2 : 1.1, ease: EDITORIAL_EASE }}
        >
          <div className="flex justify-between text-muted">
            <p className="font-mono font-medium text-[10px] uppercase tracking-[0.18em]">NEXT CAPABILITY</p>
            <span className="font-mono text-[10px]">{nextService.number} / 08</span>
          </div>
          <Link
            to={`/services/${nextService.slug}`}
            className="service-next-link mt-[40px] pt-[28px] border-t border-line text-paper no-underline flex items-start justify-between gap-[30px] transition-colors duration-200 hover:text-teal"
            data-testid="service-next-link"
          >
            <span className="text-[clamp(3rem,7vw,8rem)] leading-[0.88]">{nextService.title}</span>
            <ArrowUpRight size={36} />
          </Link>
        </motion.section>

        {/* ── Final CTA ───────────────────────────────────────────── */}
        <section className="bg-[#121b1f] px-[9vw] py-[130px] text-left">
          <motion.p
            className="font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-teal"
            initial={itemVariant.hidden}
            whileInView={itemVariant.visible}
            viewport={{ once: true }}
          >
            HAVE A PROJECT IN MIND?
          </motion.p>
          <MaskedHeading reduceMotion={reduceMotion}>
            <h2 className="text-[clamp(2.8rem,6vw,6.5rem)] leading-[0.94] max-w-[1100px] mt-7 mb-[50px]">
              Let's turn the next move<br />into meaningful growth.
            </h2>
          </MaskedHeading>
          <motion.button
            className={`${ctaBtn} md:w-auto w-full justify-center`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0 : 0.22, ease: SMOOTH_EASE }}
            onClick={startProject}
            data-testid="service-final-start-project"
          >
            Start a {service.title} Project <ArrowUpRight size={18} />
          </motion.button>
        </section>
      </motion.main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="px-[6vw] py-7 bg-[#050708] border-t border-line flex flex-col md:flex-row items-start md:items-center justify-between gap-[25px] font-mono text-[9px] uppercase text-[#758084]">
        <Link to="/" className="text-[#758084] no-underline hover:text-teal" data-testid="service-footer-home">© 2026 The Vision Hive</Link>
        <a href="mailto:thevisionhive16@gmail.com" className="text-[#758084] no-underline inline-flex items-center gap-[7px] hover:text-teal" data-testid="service-footer-email">
          <Mail size={13} />thevisionhive16@gmail.com
        </a>
        <span className="inline-flex items-center gap-[7px]"><MapPin size={13} />Vesu, Surat, 395007</span>
      </footer>
    </div>
  );
}