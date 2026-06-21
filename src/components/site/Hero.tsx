import { Link } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../../contexts/LanguageContext";

function CountUp({ target, suffix = "", locale }: { target: number; suffix?: string; locale: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setVal(target); clearInterval(timer); }
            else setVal(Math.floor(start));
          }, 16);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref} dir="ltr" style={{ unicodeBidi: "isolate" }}>
      {val.toLocaleString(locale)}{suffix}
    </span>
  );
}

const miniStatsAr = [
  { icon: "🌍", value: 15, suffix: "+", label: "سوق عالمي" },
  { icon: "💼", value: 5000, suffix: "+", label: "مستثمر" },
  { icon: "📈", value: 98, suffix: ".5%", label: "نسبة نجاح" },
];
const miniStatsEn = [
  { icon: "🌍", value: 15, suffix: "+", label: "Global Markets" },
  { icon: "💼", value: 5000, suffix: "+", label: "Investors" },
  { icon: "📈", value: 98, suffix: ".5%", label: "Success Rate" },
];

export function Hero() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const locale = isAr ? "ar-EG" : "en-US";
  const miniStats = isAr ? miniStatsAr : miniStatsEn;

  const [typed, setTyped] = useState("");
  const full = "استثماراتك";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i === full.length) clearInterval(t);
    }, 80);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.55 0.25 300) 1px, transparent 1px), linear-gradient(90deg, oklch(0.55 0.25 300) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Orbs */}
      <div
        className="absolute top-20 -left-20 size-72 rounded-full blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.25 300 / 0.15), transparent 70%)" }}
      />
      <div
        className="absolute bottom-10 right-10 size-96 rounded-full blur-3xl animate-float-slow"
        style={{ animationDelay: "2s", background: "radial-gradient(circle, oklch(0.72 0.18 300 / 0.2), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center w-full py-24">
        {/* Text */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/60 px-4 py-1.5 backdrop-blur">
            <span className="grid size-2 rounded-full bg-up animate-pulse-glow" />
            <span className="text-xs font-bold text-gold tracking-wide">شركة استثمارية مرخصة • منذ 2010</span>
          </div>

          <h1 className="mt-6 font-display font-black leading-[1.1] text-5xl md:text-6xl lg:text-7xl">
            <span className="text-gradient-gold">{typed}<span className="animate-pulse">|</span></span>
            <br />
            <span className="text-foreground">بأيدي خبراء</span>
            <br />
            <span className="text-foreground/70 text-3xl md:text-4xl lg:text-5xl font-bold">
              نحو مستقبل مالي أكثر ثباتاً
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-text-muted">
            ندير استثماراتك في أسواق الأسهم العربية والعالمية، العملات الرقمية،
            المعادن النفيسة والنفط، بخبرة احترافية تمتد لأكثر من خمسة عشر عاماً.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-7 py-4 text-base font-black text-white shadow-gold hover:-translate-y-1 transition-transform"
            >
              تواصل مع مستشار
              <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-white/50 backdrop-blur px-7 py-4 text-base font-bold text-foreground hover:border-gold hover:bg-gold/5 transition-colors"
            >
              <BarChart3 className="size-5 text-gold" />
              اكتشف خدماتنا
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-text-muted">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-gold" /> ترخيص رسمي</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="size-4 text-gold" /> استشارة مجانية</span>
            <span className="inline-flex items-center gap-2"><TrendingUp className="size-4 text-gold" /> +$2B أصول مُدارة</span>
          </div>

          {/* Mini stats */}
          <div className="mt-10 flex flex-wrap gap-6 pt-8 border-t border-gold/20">
            {miniStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="font-mono text-xl font-black text-gold">
                    <CountUp target={s.value} suffix={s.suffix} locale={locale} />
                  </div>
                  <div className="text-[11px] text-text-muted">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual card */}
        <div
          className="relative hidden lg:block animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 rounded-full border border-gold/20" />
            <div className="absolute inset-6 rounded-full border border-gold/15" />
            <div className="absolute inset-14 rounded-full border border-gold/10" />

            <div className="absolute inset-16 rounded-3xl bg-white border border-gold/30 shadow-gold p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-text-muted">قيمة المحفظة</div>
                  <div className="font-mono text-2xl font-black text-foreground mt-1">$1,284,920</div>
                </div>
                <div className="text-xs font-bold font-mono px-2 py-1 rounded-md bg-up/10 text-up">▲ +12.4%</div>
              </div>

              <svg viewBox="0 0 200 100" className="mt-4 w-full">
                <defs>
                  <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.25 300)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="oklch(0.55 0.25 300)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="oklch(0.55 0.25 300)"
                  strokeWidth="2.5"
                  points="0,80 25,70 50,75 75,55 100,60 125,40 150,45 175,25 200,30"
                />
                <polygon
                  fill="url(#hg)"
                  points="0,80 25,70 50,75 75,55 100,60 125,40 150,45 175,25 200,30 200,100 0,100"
                />
              </svg>

              <div className="mt-auto grid grid-cols-3 gap-2 text-center">
                {[{ l: "أسهم", v: "62%" }, { l: "رقمية", v: "21%" }, { l: "ذهب", v: "17%" }].map((a) => (
                  <div key={a.l} className="rounded-lg bg-navy-mid border border-border p-2">
                    <div className="text-[10px] text-text-muted">{a.l}</div>
                    <div className="text-sm font-black text-gold">{a.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chips */}
            <div className="absolute -top-2 right-2 rounded-xl bg-white border border-gold/30 px-3 py-2 shadow-card animate-float-slow">
              <div className="text-[10px] text-text-muted">BTC</div>
              <div className="font-mono font-black text-up text-sm">+2.4%</div>
            </div>
            <div
              className="absolute bottom-4 -left-2 rounded-xl bg-white border border-gold/30 px-3 py-2 shadow-card animate-float-slow"
              style={{ animationDelay: "1s" }}
            >
              <div className="text-[10px] text-text-muted">الذهب</div>
              <div className="font-mono font-black text-up text-sm">+0.9%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted text-xs opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>
        <span className="tracking-[2px] uppercase text-[10px]">اكتشف المزيد</span>
        <div className="relative w-6 h-9 rounded-xl border-2 border-gold/50 flex justify-center">
          <div className="absolute top-1.5 w-1 h-2 rounded-sm bg-gold animate-[scroll-bounce_2s_infinite]" />
        </div>
      </div>
    </section>
  );
}
