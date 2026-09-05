import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Mail, FileText, Github, Linkedin,
  Gauge, Waves, LineChart, Check, ExternalLink,
} from 'lucide-react';

const PAPER_FLOWFAKE = '/flowfake.pdf';
const PAPER_COMPLEARN = '/compositional-generalization.pdf';
const EMAIL = 'shivaaydhondiyal23@gmail.com';

const services = [
  {
    icon: Gauge,
    title: 'Latency and cost per minute',
    body:
      'Time-to-first-audio, barge-in responsiveness, and the cost of a single voice turn. Usually the wins are warm pools, streamed first chunks, model routing and caching — not a bigger model.',
  },
  {
    icon: Waves,
    title: 'STT/TTS pipeline work',
    body:
      'Provider selection and fallback, accented-speech accuracy, endpointing and turn-taking, streaming transcription, and the glue that keeps a real-time pipeline from falling over under load.',
  },
  {
    icon: LineChart,
    title: 'Eval and benchmark infrastructure',
    body:
      'The harness that tells you a change actually helped: held-out sets, multiple seeds, variance reported, and regression checks that run on every deploy. Most teams find their failure modes in production instead.',
  },
];

const tiers = [
  {
    name: 'Pilot sprint',
    price: '$600',
    unit: 'one week, fixed scope',
    features: [
      'One metric, agreed in writing before I start',
      'A repo and a before/after benchmark you can re-run without me',
      'A 30-minute readout at the end',
      "If the number doesn't move, don't pay the invoice",
    ],
    featured: true,
  },
  {
    name: 'Embedded',
    price: '$2,500',
    unit: 'per month · 10 hrs/week',
    features: [
      'Part-time, embedded with your engineering team',
      'Written Friday update with numbers in it',
      'Cancel any month, no notice period',
    ],
  },
  {
    name: 'Core',
    price: '$3,500',
    unit: 'per month · 14 hrs/week',
    features: ['Everything in Embedded', 'Larger scope, deeper involvement in roadmap'],
  },
  {
    name: 'Lead',
    price: '$5,000',
    unit: 'per month · 20 hrs/week',
    features: ['Everything in Core', 'Maximum availability — one client only at this tier'],
  },
];

const faqs = [
  {
    q: "You're still a student. Why is that not a risk?",
    a: "I'm finishing a B.Tech at DTU, and that is exactly why this rate exists — it won't after I graduate. The last production system I worked on handled over a million calls a month. Start with the $600 week and judge the work rather than the CV; that's what the pilot is for.",
  },
  {
    q: 'How do time zones work?',
    a: "I'm in India and hold roughly four hours of overlap with US Pacific. I work async-first: written updates with numbers, a Loom for anything that needs a face, and a live call whenever it's genuinely faster. Most of my hours land while you sleep, so you wake up to a diff.",
  },
  {
    q: 'What does a pilot week actually look like?',
    a: 'Monday I reproduce your problem and post baseline numbers in your Slack. Tuesday through Thursday I work the fix and send a short written update every day. Friday you get the repo, the benchmark and a 30-minute readout — including the things I found but could not fix in a week.',
  },
  {
    q: 'How many clients do you take?',
    a: 'Two at a time, and the hour caps are firm. They exist to protect the quality of the work and to stop scope drift from turning a retainer into an uncapped job.',
  },
];

const Consulting = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'AI Consulting — Shivaay Dhondiyal | Voice AI latency, cost and evals';
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? '';
    meta?.setAttribute(
      'content',
      'Part-time AI/ML consulting for seed-stage voice AI teams. Latency and cost per minute, STT/TTS pipelines, and eval infrastructure. Fixed-scope one-week pilots from $600; retainers from $2,500/mo.'
    );
    return () => {
      document.title = prevTitle;
      meta?.setAttribute('content', prevDesc);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* top bar */}
      <header className="border-b border-border">
        <div className="container mx-auto max-w-5xl px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Portfolio</span>
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="ml-auto inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition-colors"
          >
            <Mail size={15} />
            <span>Get in touch</span>
          </a>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-6 pb-24">
        {/* hero */}
        <section className="py-14 md:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-blue mb-5">
            Part-time AI consulting · 2 slots
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.1] max-w-3xl">
            I make voice AI systems faster, cheaper, and measurably more reliable.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Most of my work is with seed-stage teams whose voice agent already works — but is too slow,
            costs too much per minute, or fails in ways nobody can reproduce.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${EMAIL}?subject=Pilot%20sprint%20enquiry`}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Mail size={17} />
              Start with a $600 pilot
            </a>
            <a
              href={PAPER_FLOWFAKE}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-medium hover:border-primary hover:text-primary transition-colors"
            >
              <FileText size={17} />
              Read the ICML 2026 paper
            </a>
          </div>

          {/* credibility strip */}
          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {[
              ['1M+', 'calls/month analysed in production'],
              ['35% → 60%+', 'voice automation rate delivered'],
              ['2', 'papers accepted at ICML 2026'],
              ['−40%', 'backend integration errors'],
            ].map(([value, label]) => (
              <div key={label} className="bg-card px-5 py-5">
                <dt className="font-mono text-xl md:text-2xl font-semibold text-primary-light">{value}</dt>
                <dd className="mt-1 text-xs text-muted-foreground leading-snug">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* services */}
        <section className="py-12 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">What I get hired for</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {services.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-6">
                <Icon size={22} className="text-accent-blue" />
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* proof */}
        <section className="py-12 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Where the credibility comes from</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent-pink">Production</p>
              <h3 className="mt-3 font-display text-lg font-semibold">
                Voice agents at healthcare scale
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Built STT/TTS voice-agent workflows for Fortune-30 hospital deployments and the analytics
                layer over more than a million calls a month. Automation went from roughly 35% to 60%+,
                backend integration errors dropped 40%, and escalations came down to 28%.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent-pink">Research</p>
              <h3 className="mt-3 font-display text-lg font-semibold">Two ICML 2026 workshop papers</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground">FlowFake</span> — first author, ICML 2026 Workshop on
                Machine Learning for Audio. A continuous-time audio architecture evaluated across four
                datasets and multiple random seeds with variance reported. The transferable part is the
                method: you find out where a model degrades before your users do.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a href={PAPER_FLOWFAKE} className="inline-flex items-center gap-1.5 text-primary-light hover:text-primary transition-colors">
                  <FileText size={14} /> FlowFake (PDF)
                </a>
                <a href={PAPER_COMPLEARN} className="inline-flex items-center gap-1.5 text-primary-light hover:text-primary transition-colors">
                  <FileText size={14} /> Compositional generalization (PDF)
                </a>
                <a href="https://github.com/shivaay790" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary-light hover:text-primary transition-colors">
                  <ExternalLink size={14} /> Code
                </a>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Things you can click and use right now:{' '}
            <a href="https://crowd-counting.shivaaydhondiyal.online/" target="_blank" rel="noreferrer" className="text-primary-light hover:text-primary underline underline-offset-4">
              crowd density estimation
            </a>
            {', '}
            <a href="https://hand-gesture.shivaaydhondiyal.online/" target="_blank" rel="noreferrer" className="text-primary-light hover:text-primary underline underline-offset-4">
              real-time gesture control
            </a>
            {', and the code for both on '}
            <a href="https://github.com/shivaay790" target="_blank" rel="noreferrer" className="text-primary-light hover:text-primary underline underline-offset-4">
              GitHub
            </a>
            .
          </p>
        </section>

        {/* how it works */}
        <section className="py-12 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">How an engagement starts</h2>
          <ol className="mt-8 space-y-5">
            {[
              ['A 25-minute call', 'Mostly me asking about your pipeline. You leave with at least one thing you can act on whether or not we work together.'],
              ['A one-page scope, same day', 'One metric, one week, a fixed price. If I do not think I can move the number, I will say so instead of selling you a week.'],
              ['The pilot', 'Baseline posted within 24 hours, a short written update every day, and a repo plus a re-runnable benchmark at the end.'],
              ['Then decide', 'If it worked, the natural next step is a monthly retainer against the things the pilot surfaced but could not finish. If it did not, you owe nothing and you keep the work.'],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-5">
                <span className="font-mono text-sm text-accent-blue pt-0.5 shrink-0 w-8">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-2xl">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* pricing */}
        <section className="py-12 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Rates</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Priced by scope, with the hours capped. The cap is there to protect the quality of the work —
            it is not a target to fill.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`rounded-lg border p-6 ${
                  t.featured ? 'border-primary bg-card' : 'border-border bg-card'
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold">{t.name}</h3>
                  <span className="font-mono text-2xl font-semibold text-primary-light">{t.price}</span>
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{t.unit}</p>
                <ul className="mt-4 space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-muted-foreground">
                      <Check size={15} className="text-accent-blue shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* faq */}
        <section className="py-12 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Fair questions</h2>
          <div className="mt-8 space-y-7">
            {faqs.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-semibold">{q}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-2xl">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* cta */}
        <section className="mt-6 rounded-lg border border-primary bg-card p-8 md:p-10">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">
            Tell me what is slow, and I will tell you where it goes.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Send me a link to your agent or a description of the pipeline. I will come back with what I
            would measure first — no call required, and no charge for that.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`mailto:${EMAIL}?subject=Voice%20AI%20consulting`}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Mail size={17} />
              {EMAIL}
            </a>
            <a href="https://www.linkedin.com/in/shivaay-dhondiyal/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href="https://github.com/shivaay790" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Github size={16} /> GitHub
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto max-w-5xl px-6 text-sm text-muted-foreground">
          Shivaay Dhondiyal · B.Tech CSE, Delhi Technological University · New Delhi, India
        </div>
      </footer>
    </div>
  );
};

export default Consulting;
