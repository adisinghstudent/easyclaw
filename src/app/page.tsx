"use client";

import { motion } from "framer-motion";
import { Nav } from "@/components/nav";

import { StarChart } from "@/components/star-chart";
import { ReviewsCarousel } from "@/components/reviews-carousel";
import Link from "next/link";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    title: "One command",
    desc: "Paste a single curl and everything installs — Node, OpenClaw, ClawdBot, MoltBot. Done.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
      />
    ),
  },
  {
    title: "Every platform",
    desc: "macOS, Windows, and Linux. The installer detects your OS and handles the rest automatically.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
      />
    ),
  },
  {
    title: "Your hardware",
    desc: "Everything runs locally. Your data stays on your machine. No cloud dependency, full control.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    ),
  },
  {
    title: "All your apps",
    desc: "WhatsApp, Telegram, Discord, Slack — OpenClaw connects to the messaging apps you already use.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    ),
  },
  {
    title: "AI models",
    desc: "Use Claude, GPT, or fully local models. Pick the brain that fits your needs and budget.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
      />
    ),
  },
  {
    title: "Extensible",
    desc: "Community skills, custom plugins, browser control. Extend what your AI assistant can do.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c-1.108-.128-2.13.724-2.13 1.84v.822a10.957 10.957 0 01-1.003-.349C2.676 7.436 2.355 7.25 2 7.25h0a.64.64 0 00-.643.657 48.491 48.491 0 00.3 4.163c.128 1.108-.724 2.13-1.84 2.13H-.005a10.957 10.957 0 00.349 1.003c.283.215.604.401.959.401h0a.64.64 0 00.643-.657 48.491 48.491 0 01-.3-4.163c-.128-1.108.724-2.13 1.84-2.13h.822M14.25 6.087c0 .354-.186.676-.401.959-.221.29-.349.634-.349 1.003 0 1.036 1.007 1.875 2.25 1.875s2.25-.84 2.25-1.875c0-.369-.128-.713-.349-1.003-.215-.283-.401-.604-.401-.959v0a.64.64 0 01.657-.643 48.491 48.491 0 014.163.3c1.108.128 2.13-.724 2.13-1.84v-.822m0 0a10.957 10.957 0 001.003.349c.283.215.604.401.959.401h0a.64.64 0 00.643-.657 48.491 48.491 0 00-.3-4.163c-.128-1.108.724-2.13 1.84-2.13h.822"
      />
    ),
  },
];

const steps = [
  {
    num: "01",
    title: "Run the command",
    desc: "Open your terminal. Paste the install command. It handles Node.js, dependencies, and configuration.",
  },
  {
    num: "02",
    title: "Connect your apps",
    desc: "Link WhatsApp, Telegram, Discord, or Slack. OpenClaw walks you through each connection.",
  },
  {
    num: "03",
    title: "Start using it",
    desc: "Message your AI from any connected app. It remembers context, controls your browser, and executes tasks.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center max-w-2xl mx-auto"
        >
          <motion.h1
            variants={fade}
            className="text-6xl sm:text-8xl italic leading-none mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            easyclaw
          </motion.h1>

          <motion.p
            variants={fade}
            className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-lg mx-auto mb-10 leading-relaxed"
          >
            The easiest way to get OpenClaw. ClawdBot, MoltBot,
            and OpenClaw — on your hardware, in seconds.
          </motion.p>

          <motion.div variants={fade}>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Download for Mac / Windows / Linux
            </Link>
          </motion.div>

          <motion.div variants={fade} className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/download"
              className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors underline underline-offset-4 decoration-[var(--color-border)]"
            >
              All download options
            </Link>
            <span className="text-[var(--color-border)]">|</span>
            <a
              href="https://openclaw.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors underline underline-offset-4 decoration-[var(--color-border)]"
            >
              openclaw.ai
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Growth chart */}
      <section className="py-24 px-6 bg-[var(--color-bg-alt)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,340px] gap-12 md:gap-16 items-center">
            {/* Left — chart */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-text-tertiary)] mb-3">
                  Open source
                </p>
                <h2
                  className="text-3xl sm:text-4xl italic tracking-tight mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  The world&apos;s fastest growing
                  <br />
                  open source project
                </h2>
                <p className="text-base text-[var(--color-text-secondary)] max-w-md mb-12">
                  0 to 130k+ GitHub stars in 68 days. OpenClaw is the fastest
                  project to ever reach 100k stars.
                </p>
              </motion.div>

              <StarChart />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Fastest to 100k stars
                </span>
                <span className="text-[var(--color-border)]">|</span>
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  #1 trending on GitHub
                </span>
                <span className="text-[var(--color-border)]">|</span>
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  MIT licensed
                </span>
              </motion.div>
            </div>

            {/* Right — quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="border-l-2 border-[var(--color-accent)] pl-6"
            >
              <blockquote>
                <p
                  className="text-xl sm:text-2xl italic leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  &ldquo;Installing ClawdBot, MoltBot, and OpenClaw should be
                  seamless&nbsp;&mdash; not a mess.&rdquo;
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  EasyClaw exists because getting the OpenClaw stack running
                  should take seconds, not hours of debugging Node versions
                  and permissions.
                </p>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-text-tertiary)] mb-3">
              What you get
            </p>
            <h2
              className="text-2xl sm:text-3xl italic tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Everything in one install
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 hover:border-[var(--color-border-hover)] transition-colors"
              >
                <div className="w-8 h-8 mb-3 text-[var(--color-text-secondary)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-base font-semibold mb-1">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-text-tertiary)] mb-3">
              What people are saying
            </p>
            <h2
              className="text-2xl sm:text-3xl italic tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              &ldquo;It just works&rdquo;
            </h2>
          </motion.div>
        </div>

        <ReviewsCarousel />
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 bg-[var(--color-bg-alt)]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-text-tertiary)] mb-3">
              Three steps
            </p>
            <h2
              className="text-2xl sm:text-3xl italic tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              How it works
            </h2>
          </motion.div>

          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-5 items-start"
              >
                <span className="text-xs font-mono font-medium text-[var(--color-text-tertiary)] pt-0.5 shrink-0">
                  {s.num}
                </span>
                <div className="border-b border-[var(--color-border)] pb-6 w-full">
                  <h3 className="text-base font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[var(--color-bg-alt)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2
            className="text-2xl sm:text-3xl italic tracking-tight mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ready?
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            Download EasyClaw and get started.
          </p>
          <Link
            href="/download"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Download EasyClaw
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-tertiary)]">
            easyclaw
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://openclaw.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              OpenClaw
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
