import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Globe, Bitcoin, Building2, Gem, Fuel, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

export const Route = createFileRoute("/services")({ component: Services });

const servicesAr = [
  { id: "gulf-stocks", icon: TrendingUp, emoji: "📈", title: "الأسهم الخليجية والعربية", desc: "إدارة استثماراتك في أسواق تداول السعودية، أبوظبي، دبي، الكويت ومصر بفريق خبراء محليين متخصصين.", features: ["تحليل يومي للأسهم", "محافظ مخصصة", "تقارير شهرية", "دعم مباشر"], returns: "+18.5%" },
  { id: "global-stocks", icon: Globe, emoji: "🌍", title: "الأسهم العالمية", desc: "وصول مباشر إلى وول ستريت وناسداك ولندن وطوكيو مع تحليلات مدعومة بالذكاء الاصطناعي.", features: ["15+ سوق عالمي", "تحليل AI", "تحوط العملات", "تقارير ربعية"], returns: "+22.3%" },
  { id: "crypto", icon: Bitcoin, emoji: "₿", title: "العملات الرقمية", desc: "محافظ منوّعة من Bitcoin وEthereum والأصول الرقمية الواعدة بأمان مؤسسي.", features: ["حفظ آمن", "تنويع ذكي", "إدارة المخاطر", "تقارير ضريبية"], returns: "+45.8%" },
  { id: "funds", icon: Building2, emoji: "🏛", title: "صناديق الاستثمار", desc: "صناديق متخصصة بمستويات مخاطر متعددة تتلاءم مع أهدافك المالية قصيرة وطويلة المدى.", features: ["صناديق أسهم", "صناديق دخل", "صناديق متوازنة", "ETF عالمية"], returns: "+14.2%" },
  { id: "metals", icon: Gem, emoji: "💎", title: "المعادن والذهب", desc: "تحوّط ذكي عبر الذهب والفضة والبلاتين كملاذ آمن ضد التضخم وتقلبات السوق.", features: ["ذهب فيزيائي", "عقود آجلة", "ETF معادن", "تحوط تضخم"], returns: "+11.7%" },
  { id: "energy", icon: Fuel, emoji: "⛽", title: "النفط والطاقة", desc: "استثمارات في عقود النفط والغاز وأسهم شركات الطاقة المتجددة عالمياً.", features: ["عقود WTI/Brent", "طاقة متجددة", "أسهم طاقة", "تحوط نفطي"], returns: "+16.9%" },
];

const servicesEn = [
  { id: "gulf-stocks", icon: TrendingUp, emoji: "📈", title: "Gulf & Arab Equities", desc: "Manage your investments in Saudi Tadawul, Abu Dhabi, Dubai, Kuwait, and Egypt markets with local expert teams.", features: ["Daily stock analysis", "Custom portfolios", "Monthly reports", "Direct support"], returns: "+18.5%" },
  { id: "global-stocks", icon: Globe, emoji: "🌍", title: "Global Equities", desc: "Direct access to Wall Street, NASDAQ, London and Tokyo with AI-powered analytics.", features: ["15+ global markets", "AI analytics", "Currency hedging", "Quarterly reports"], returns: "+22.3%" },
  { id: "crypto", icon: Bitcoin, emoji: "₿", title: "Cryptocurrencies", desc: "Diversified portfolios of Bitcoin, Ethereum, and promising digital assets with institutional-grade security.", features: ["Secure custody", "Smart diversification", "Risk management", "Tax reports"], returns: "+45.8%" },
  { id: "funds", icon: Building2, emoji: "🏛", title: "Investment Funds", desc: "Specialized funds with multiple risk levels tailored to your short and long-term financial objectives.", features: ["Equity funds", "Income funds", "Balanced funds", "Global ETFs"], returns: "+14.2%" },
  { id: "metals", icon: Gem, emoji: "💎", title: "Metals & Gold", desc: "Smart hedging through gold, silver, and platinum as a safe haven against inflation and market volatility.", features: ["Physical gold", "Futures contracts", "Metal ETFs", "Inflation hedge"], returns: "+11.7%" },
  { id: "energy", icon: Fuel, emoji: "⛽", title: "Oil & Energy", desc: "Investments in oil and gas contracts and global renewable energy company equities.", features: ["WTI/Brent contracts", "Renewable energy", "Energy equities", "Oil hedging"], returns: "+16.9%" },
];

const howAr = [
  { step: "01", title: "استشارة مجانية", desc: "نجتمع معك لفهم أهدافك المالية ومستوى تحملك للمخاطر." },
  { step: "02", title: "تصميم المحفظة", desc: "يُصمم فريقنا خطة استثمارية مخصصة 100% لاحتياجاتك." },
  { step: "03", title: "التنفيذ والإدارة", desc: "ننفذ الاستراتيجية ونديرها بشكل نشط مع تقارير دورية شفافة." },
  { step: "04", title: "المتابعة والتحسين", desc: "نراجع ونُحسّن المحفظة باستمرار مع تغيرات السوق." },
];

const howEn = [
  { step: "01", title: "Free Consultation", desc: "We meet with you to understand your financial goals and risk tolerance." },
  { step: "02", title: "Portfolio Design", desc: "Our team designs a 100% customized investment plan for your needs." },
  { step: "03", title: "Execution & Management", desc: "We execute the strategy and actively manage it with transparent periodic reports." },
  { step: "04", title: "Monitoring & Improvement", desc: "We continuously review and improve the portfolio with market changes." },
];

function Services() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const services = isAr ? servicesAr : servicesEn;
  const howItWorks = isAr ? howAr : howEn;
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">{t('services_page_label')}</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            {t('services_page_heading')} <span className="text-gradient-gold">{t('services_page_heading_gold')}</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">{t('services_page_desc')}</p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article key={s.id} className="group rounded-2xl border border-border bg-navy-mid p-8 hover:border-gold hover:shadow-gold transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between">
                  <div className="grid size-14 place-items-center rounded-2xl bg-gold/10 border border-gold/20 text-gold">
                    <s.icon className="size-7" />
                  </div>
                  <span className="text-xs font-mono font-black text-up bg-up/10 rounded-lg px-2 py-1">
                    {s.returns} {t('services_returns')}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{s.desc}</p>
                <ul className="mt-5 grid grid-cols-2 gap-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-text-muted">
                      <CheckCircle className="size-3.5 text-gold shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to={`/service/${s.id}` as any} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold group-hover:gap-3 transition-all">
                  {t('services_learn_more')} <Arrow className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-navy-mid">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="text-center text-4xl font-black text-foreground mb-16">
            {t('services_how_heading')} <span className="text-gradient-gold">{t('services_how_heading_gold')}</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((h, i) => (
              <div key={h.step} className="relative rounded-2xl border border-border bg-white p-8 text-center">
                {i < howItWorks.length - 1 && <div className="absolute top-10 -left-3 hidden lg:block w-6 h-0.5 bg-gold/30" />}
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-gold shadow-gold text-white font-black text-lg">{h.step}</div>
                <h3 className="mt-5 font-bold text-foreground">{h.title}</h3>
                <p className="mt-3 text-sm text-text-muted leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-gold text-white text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-4xl font-black">{t('services_cta_heading')}</h2>
          <p className="mt-4 opacity-90 text-lg">{t('services_cta_desc')}</p>
          <Link to="/contact" className="mt-8 inline-block rounded-xl bg-white text-gold font-black px-8 py-4 shadow-lg hover:-translate-y-1 transition-transform">
            {t('contact_advisor')}
          </Link>
        </div>
      </section>
    </div>
  );
}
