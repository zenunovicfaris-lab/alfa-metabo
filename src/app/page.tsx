"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Problem {
  id: number;
  title: string;
  description: string;
  image: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PROBLEMS: Problem[] = [
  {
    id: 1,
    title: "Konkurencija te zakopava na Googleu",
    description: "Tvoji konkurenti su na 1. strani, a ti na 3. Klijenti ne dolaze dalje od prve stranice.",
    image: "/screenshots/Stolarija Daibau uzima poslove.jpg",
  },
  {
    id: 2,
    title: "Loše recenzije odbijaju klijente",
    description: "3.8 zvjezdica na Google Maps-u znači da 40% potencijalnih klijenata odmah odlazi.",
    image: "/screenshots/3.8 zvezdica.jpg",
  },
  {
    id: 3,
    title: "Nisi vidljiv u svom gradu",
    description: "Kada neko u Travniku traži PVC stolariju, tvoja firma se ne pojavljuje na mapi.",
    image: "/screenshots/Konkurencija za PVC TRAVNIK.jpg",
  },
  {
    id: 4,
    title: "Nema cijena = nema povjerenja",
    description: "Posjetitelji koji ne vide okvirne cijene odmah odlaze kod konkurencije.",
    image: "/screenshots/Ljudi traže cijene - ne nalaze vas.jpg",
  },
  {
    id: 5,
    title: "Spora stranica tjera posjetitelje",
    description: "PageSpeed ispod 80 znači da Google aktivno skriva tvoju stranicu u rezultatima.",
    image: "/screenshots/PageSpeed.jpg",
  },
];

const SOLUTIONS = [
  { icon: "🥇", title: "1. Google", desc: "Optimizacija ključnih pojmova za vaš grad i regiju." },
  { icon: "⚡", title: "Brzina stranice", desc: "Core Web Vitals i PageSpeed 90+ score garantovano." },
  { icon: "📍", title: "Google Maps", desc: "Lokalni SEO i strategija za prikupljanje recenzija." },
  { icon: "✍️", title: "Blog & Sadržaj", desc: "Autoritetni članci koji donose organski saobraćaj." },
];

const NAV_LINKS = [
  { label: "Problemi", href: "#problemi" },
  { label: "Rješenja", href: "#rjesenja" },
  { label: "ROI", href: "#roi" },
  { label: "Kontakt", href: "#kontakt" },
];

// ─── CountUp ─────────────────────────────────────────────────────────────────

function CountUp({ end }: { end: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = end / (2000 / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{count.toLocaleString("de-DE")}</span>;
}

// ─── ProblemCard ──────────────────────────────────────────────────────────────

function ProblemCard({
  problem,
  index,
  onClick,
}: {
  problem: Problem;
  index: number;
  onClick: () => void;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onClick={onClick}
      className="bg-[#0d1f12] border border-white/10 rounded-2xl overflow-hidden cursor-pointer group hover:border-red-500/40 hover:shadow-[0_0_24px_rgba(239,68,68,0.2)] transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-black">
        <Image
          src={problem.image}
          alt={problem.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f12] via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-white mb-2 leading-snug">{problem.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{problem.description}</p>
        <p className="mt-3 text-xs text-gray-600">Klikni za uvećanje →</p>
      </div>
    </motion.div>
  );
}

// ─── SolutionCard ─────────────────────────────────────────────────────────────

function SolutionCard({
  solution,
  index,
}: {
  solution: (typeof SOLUTIONS)[0];
  index: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:shadow-[0_0_24px_rgba(34,197,94,0.4)] hover:border-green-500/30 transition-all duration-300"
    >
      <div className="text-4xl mb-4">{solution.icon}</div>
      <h3 className="font-bold text-lg mb-2 text-white">{solution.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{solution.desc}</p>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AlfaMetaboSEO() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [touchStart, setTouchStart] = useState(0);

  const { scrollY, scrollYProgress } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);

  const { ref: finalCtaRef, inView: finalCtaInView } = useInView({ threshold: 0.3 });

  // ESC key to close modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProblem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#030a06] text-[#f0fdf4] overflow-x-hidden">

      {/* ── Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-green-500 origin-left z-[100]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ── NavBar ── */}
      <nav className="fixed top-1 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between bg-black/50 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
          <div className="font-bold text-green-400 text-lg font-display">Alfa Metabo SEO</div>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-400 hover:text-green-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/38762000000?text=Zanima%20me%20SEO%20za%20Alfa%20Metabo"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded-xl text-sm transition-all"
            >
              💬 WhatsApp
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-400 hover:text-white text-xl transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-2 max-w-6xl mx-auto"
            >
              <div className="bg-[#0d1f12] border border-white/10 rounded-2xl p-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-300 hover:text-green-400 py-2 px-3 rounded-xl hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="https://wa.me/38762000000?text=Zanima%20me%20SEO%20za%20Alfa%20Metabo"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-500 text-black font-bold py-3 px-4 rounded-xl text-center mt-2"
                >
                  💬 WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20"
      >
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 bg-gradient-to-br from-[#030a06] via-[#0d2818] to-[#0f2d2d]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.07)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full px-4 py-2 text-sm font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              ⚡ Rezultati za 90 dana ili povrat novca
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
          >
            💰 Alfa Metabo →{" "}
            <span className="text-green-400">1. mjesto na Googleu</span>
            {" "}= 15 novih montaža/mj
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Vaši konkurenti već rade SEO. Svaki dan kašnjenja = izgubljeni klijenti.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://wa.me/38762000000?text=Zanima%20me%20SEO%20za%20Alfa%20Metabo"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-2xl text-lg transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            >
              💬 Zatraži besplatnu analizu
            </a>
            <a
              href="#rjesenja"
              className="flex items-center justify-center gap-2 border border-green-500/40 text-green-400 hover:bg-green-500/10 font-semibold py-4 px-8 rounded-2xl text-lg transition-all"
            >
              Vidi kako funkcioniše →
            </a>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-gray-500 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* ── Problems ── */}
      <section id="problemi" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-red-500/10 text-red-400 border border-red-500/30 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              ⚠️ Trenutna situacija
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Zašto Alfa Metabo gubi kupce{" "}
              <span className="text-red-400">svaki dan</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Ovo su stvarni problemi koje smo identificirali na vašem online prisustvu.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROBLEMS.map((problem, i) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                index={i}
                onClick={() => setSelectedProblem(problem)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem Modal ── */}
      <AnimatePresence>
        {selectedProblem && (
          <Dialog
            static
            open={!!selectedProblem}
            onClose={() => setSelectedProblem(null)}
            className="relative z-[200]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90"
              aria-hidden="true"
              onClick={() => setSelectedProblem(null)}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 20 }}
                  transition={{ type: "spring", bounce: 0.2 }}
                  className="bg-[#0d1f12] border border-white/10 rounded-2xl overflow-hidden"
                  onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientY)}
                  onTouchEnd={(e) => {
                    if (e.changedTouches[0].clientY - touchStart > 80) {
                      setSelectedProblem(null);
                    }
                  }}
                >
                  <div className="relative w-full h-64 md:h-96 bg-black">
                    <Image
                      src={selectedProblem.image}
                      alt={selectedProblem.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-contain"
                    />
                  </div>
                  <div className="p-6">
                    <Dialog.Title className="text-xl font-bold mb-2 text-white">
                      {selectedProblem.title}
                    </Dialog.Title>
                    <p className="text-gray-400 mb-6">{selectedProblem.description}</p>
                    <button
                      onClick={() => setSelectedProblem(null)}
                      className="w-full bg-white/10 hover:bg-white/20 rounded-xl py-3 font-semibold transition-all text-white"
                    >
                      Zatvori ✕
                    </button>
                  </div>
                </motion.div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ── Solutions ── */}
      <section id="rjesenja" className="py-24 px-6 bg-[#0d1f12]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-green-500/10 text-green-400 border border-green-500/30 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              ✅ Naš plan akcije
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Kompletna SEO strategija{" "}
              <span className="text-green-400">za Alfa Metabo</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Lokalni SEO koji donosi kupce + content strategija koja gradi autoritet.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOLUTIONS.map((sol, i) => (
              <SolutionCard key={i} solution={sol} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI ── */}
      <section id="roi" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              💰 ROI Kalkulacija
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold">
              Koliko vrijedi{" "}
              <span className="text-yellow-400">1. mjesto</span>
              {" "}na Googleu?
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Nove montaže/mj", end: 15 },
              { label: "Prihod/mj (KM)", end: 2500 },
              { label: "Prihod/god (KM)", end: 30000 },
              { label: "Net profit/god (KM)", end: 26400 },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#0d1f12] border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-1">
                  <CountUp end={stat.end} />
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#0d1f12] border border-green-500/20 rounded-2xl p-8">
            {(
              [
                ["5 montaža × 500 KM", "= 2.500 KM/mj", false],
                ["12 mj × 2.500 KM", "= 30.000 KM/god", false],
                ["SEO investicija", "= 3.600 KM/god", false],
                ["NET PROFIT", "+26.400 KM", true],
              ] as const
            ).map(([left, right, highlight], i) => (
              <div
                key={i}
                className={`flex justify-between items-center py-4 border-b border-white/5 last:border-0 font-mono ${
                  highlight ? "text-green-400 font-bold text-lg pt-6" : "text-gray-300"
                }`}
              >
                <span>{left}</span>
                <span className={highlight ? "text-green-400 text-xl" : "text-white"}>
                  {right}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guarantee ── */}
      <section className="py-24 px-6 bg-[#0d1f12]">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="border border-green-500/40 rounded-3xl p-10 md:p-16"
            style={{ boxShadow: "0 0 80px rgba(34,197,94,0.07)" }}
          >
            <div className="text-7xl mb-6">🏆</div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              1. mjesto na Googleu
              <br />
              <span className="text-green-400">ili BESPLATNO!</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
              Ako ne dostignemo 1. stranicu za dogovorene ključne pojmove u 90 dana,
              nastavljamo raditi besplatno dok ne dostignemo.
            </p>
            <a
              href="https://wa.me/38762000000?text=Zanima%20me%20SEO%20za%20Alfa%20Metabo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-10 rounded-2xl text-lg transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            >
              💬 Pokreni SEO kampanju
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section id="kontakt" ref={finalCtaRef} className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Spreman za{" "}
            <span className="text-green-400">1. mjesto</span>
            {" "}na Googleu?
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            30 minuta besplatnog razgovora. Konkretni plan za tvoj biznis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/38762000000?text=Zanima%20me%20SEO%20za%20Alfa%20Metabo"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-2xl text-lg transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            >
              💬 WhatsApp
            </a>
            <a
              href="#calendly"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-teal-500/40 text-teal-400 hover:bg-teal-500/10 font-semibold py-4 px-8 rounded-2xl text-lg transition-all"
            >
              📅 Zakaži poziv
            </a>
            <a
              href="tel:+38762000000"
              className="text-gray-500 hover:text-white transition-colors text-sm underline underline-offset-4"
            >
              Zovi sad: +387 62 000 000
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <div className="font-semibold text-gray-400 mb-1">
          SEOPro BiH · Stručnjaci za lokalni SEO
        </div>
        <div className="text-gray-600 text-sm">
          Priprema za Alfa Metabo d.o.o. · Travnik, Federacija BiH ·{" "}
          {new Date().getFullYear()}
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ── */}
      <AnimatePresence>
        {!finalCtaInView && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", bounce: 0 }}
            className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#030a06]/95 backdrop-blur border-t border-white/10 z-50"
          >
            <a
              href="https://wa.me/38762000000?text=Zanima%20me%20SEO%20za%20Alfa%20Metabo"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-4 rounded-2xl text-lg w-full"
            >
              💬 Besplatna SEO analiza
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
