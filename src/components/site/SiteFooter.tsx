import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Linkedin, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Shield, Award, X } from "lucide-react";
import { useLang } from "../../contexts/LanguageContext";
import { getPrivacyPolicy } from "../../lib/store";

function PrivacyModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const text = getPrivacyPolicy();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", handler); };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-gold shadow-gold">
              <Shield className="size-4 text-white" />
            </div>
            <h2 className="text-lg font-black text-foreground">{t("privacy_title")}</h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl border border-border text-text-muted hover:text-foreground hover:border-gold/40 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {text ? (
            <div className="text-sm leading-[2.2] text-text-muted whitespace-pre-wrap">
              {text}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <Shield className="size-10 text-gold/40" />
              <p className="text-sm text-text-muted max-w-xs">{t("privacy_empty")}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-7 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-6 py-2.5 text-sm font-bold text-white shadow-gold hover:-translate-y-0.5 transition-transform"
          >
            {t("privacy_close")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const { t } = useLang();
  const [showPrivacy, setShowPrivacy] = useState(false);

  const companyLinks = [
    { to: "/about", l: t("nav_about") },
    { to: "/services", l: t("nav_services") },
    { to: "/markets", l: t("nav_markets") },
    { to: "/news", l: "الأخبار والتحليلات" },
    { to: "/faq", l: t("nav_faq") },
    { to: "/contact", l: t("nav_contact") },
  ];

  const serviceLinks = [
    { to: "/service/gulf-stocks", l: "الأسهم الخليجية" },
    { to: "/service/global-stocks", l: "الأسهم العالمية" },
    { to: "/service/crypto", l: "العملات الرقمية" },
    { to: "/service/funds", l: "صناديق الاستثمار" },
    { to: "/service/metals", l: "المعادن والذهب" },
    { to: "/service/energy", l: "النفط والطاقة" },
  ];

  return (
    <>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

      <footer className="mt-24 border-t border-gold/20 bg-navy-mid">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                <span className="font-black text-white text-lg">ر</span>
              </div>
              <div className="leading-tight">
                <div className="font-black text-foreground">الثروة كابيتال كابيتال</div>
                <div className="text-[10px] tracking-widest text-gold uppercase">Rasekhoon Capital</div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-text-muted">
              شركة استثمارية رائدة متخصصة في إدارة الثروات وتنويع المحافظ الاستثمارية
              في الأسواق العربية والعالمية بخبرة تمتد لأكثر من 15 عاماً.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Shield, label: "مرخص رسمياً" },
                { Icon: Award, label: "ISO 27001" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 rounded-lg border border-gold/20 bg-white px-2.5 py-1.5 text-[10px] font-bold text-text-muted">
                  <Icon className="size-3 text-gold" />
                  {label}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2">
              {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid size-10 place-items-center rounded-lg border border-border bg-white text-text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-black text-gold uppercase tracking-wider mb-5">الشركة</h4>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-text-muted hover:text-gold transition-colors">
                    {item.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-black text-gold uppercase tracking-wider mb-5">خدماتنا</h4>
            <ul className="space-y-3 text-sm">
              {serviceLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to as any} className="text-text-muted hover:text-gold transition-colors">
                    {item.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-black text-gold uppercase tracking-wider mb-5">تواصل معنا</h4>
            <ul className="space-y-4 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-gold mt-0.5 shrink-0" />
                <span>برج المركز المالي، شارع الشيخ زايد<br />دبي، الإمارات العربية المتحدة</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-gold shrink-0" />
                <a href="tel:+97141234567" className="font-mono hover:text-gold transition-colors">+971 4 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-gold shrink-0" />
                <a href="mailto:info@rasekhoon.com" className="hover:text-gold transition-colors">info@rasekhoon.com</a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs font-bold text-foreground mb-2">اشترك في نشرتنا الأسبوعية</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-text-muted focus:border-gold focus:outline-none"
                />
                <button className="rounded-lg bg-gradient-gold px-3 py-2 text-sm font-bold text-white shadow-gold">
                  ←
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
            <p>© {new Date().getFullYear()} {t("footer_copyright")}</p>
            <div className="flex items-center gap-5">
              <button
                onClick={() => setShowPrivacy(true)}
                className="hover:text-gold transition-colors cursor-pointer bg-transparent border-none text-xs text-text-muted font-inherit"
              >
                {t("footer_privacy")}
              </button>
              <a href="#" className="hover:text-gold transition-colors">{t("footer_terms")}</a>
              <a href="#" className="hover:text-gold transition-colors">{t("footer_disclosures")}</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
