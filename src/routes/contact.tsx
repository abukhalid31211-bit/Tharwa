import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { submitContactMessage } from "../lib/api";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

export const Route = createFileRoute("/contact")({ component: Contact });

type FormState = { name: string; email: string; phone: string; service: string; message: string };
const init: FormState = { name: "", email: "", phone: "", service: "", message: "" };

const servicesAr = ["الأسهم الخليجية", "الأسهم العالمية", "العملات الرقمية", "صناديق الاستثمار", "المعادن والذهب", "النفط والطاقة", "استشارة عامة"];
const servicesEn = ["Gulf Equities", "Global Equities", "Cryptocurrencies", "Investment Funds", "Metals & Gold", "Oil & Energy", "General Consultation"];

function Contact() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const services = isAr ? servicesAr : servicesEn;

  const [form, setForm] = useState<FormState>(init);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = t('contact_err_name');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('contact_err_email');
    if (!form.message.trim()) e.message = t('contact_err_message');
    return e;
  };

  const handle = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const [apiError, setApiError] = useState("");
  const { settings } = useSiteSettings();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError("");
    try {
      await submitContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        message: form.message,
        source: 'contact',
      });
      setLoading(false);
      setSubmitted(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "حدث خطأ. يرجى المحاولة مجدداً.");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-gold shadow-gold text-white">
            <CheckCircle className="size-12" />
          </div>
          <h2 className="mt-8 text-3xl font-black text-foreground">{t('contact_success_heading')}</h2>
          <p className="mt-4 text-text-muted leading-relaxed">{t('contact_success_desc')}</p>
          <button onClick={() => { setSubmitted(false); setForm(init); }} className="mt-8 rounded-xl bg-gradient-gold px-6 py-3 font-bold text-white shadow-gold hover:-translate-y-0.5 transition-transform">
            {t('contact_success_btn')}
          </button>
        </div>
      </div>
    );
  }

  const inputCls = (k: keyof FormState) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-foreground bg-white placeholder:text-text-muted focus:outline-none transition-colors ${errors[k] ? "border-down bg-red-50" : "border-border focus:border-gold"}`;

  const contactInfoAr = [
    { icon: MapPin, title: "عنواننا", val: "برج المركز المالي، شارع الشيخ زايد، دبي، الإمارات" },
    { icon: Phone, title: "هاتف", val: "+971 4 123 4567" },
    { icon: Mail, title: "البريد الإلكتروني", val: "info@tharwahcapital.com" },
    { icon: Clock, title: "ساعات العمل", val: "الأحد – الخميس: 9ص – 6م\nالجمعة: 9ص – 12م" },
  ];

  const contactInfoEn = [
    { icon: MapPin, title: "Our Address", val: "Financial Centre Tower, Sheikh Zayed Road, Dubai, UAE" },
    { icon: Phone, title: "Phone", val: "+971 4 123 4567" },
    { icon: Mail, title: "Email", val: "info@tharwahcapital.com" },
    { icon: Clock, title: "Business Hours", val: "Sun – Thu: 9am – 6pm\nFri: 9am – 12pm" },
  ];

  const contactInfo = isAr ? contactInfoAr : contactInfoEn;

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">{t('contact_label')}</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            {t('contact_heading')} <span className="text-gradient-gold">{t('contact_heading_gold')}</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">{t('contact_desc')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-[1fr_1.5fr] gap-12">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-black text-foreground mb-8">{t('contact_info_heading')}</h2>
            <div className="flex flex-col gap-5">
              {contactInfo.map(({ icon: Icon, title, val }) => (
                <div key={title} className="flex items-start gap-4 rounded-2xl border border-border bg-navy-mid p-5 hover:border-gold transition-colors">
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold text-white">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-gold uppercase tracking-wider">{title}</div>
                    <div className="mt-1 text-sm text-foreground whitespace-pre-line">{val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/5 p-6">
              <h3 className="font-black text-foreground mb-2">
                {isAr ? "⚡ استجابة سريعة" : "⚡ Fast Response"}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {isAr
                  ? <>نرد على جميع الاستفسارات خلال <strong className="text-gold">24 ساعة</strong> أيام الأسبوع. للأمور العاجلة، اتصل بنا مباشرة أو راسلنا عبر الواتساب.</>
                  : <>We respond to all inquiries within <strong className="text-gold">24 hours</strong> on working days. For urgent matters, call us directly or message us on WhatsApp.</>
                }
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-card">
            <h2 className="text-2xl font-black text-foreground mb-6">{t('contact_form_heading')}</h2>
            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">{t('contact_field_name')} *</label>
                  <input value={form.name} onChange={handle("name")} placeholder={t('contact_field_name_placeholder')} className={inputCls("name")} />
                  {errors.name && <p className="mt-1 text-xs text-down">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">{t('contact_field_email')} *</label>
                  <input type="email" value={form.email} onChange={handle("email")} placeholder="email@example.com" className={inputCls("email")} />
                  {errors.email && <p className="mt-1 text-xs text-down">{errors.email}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">{t('contact_field_phone')} <span className="text-text-muted font-normal">{t('contact_optional')}</span></label>
                  <input value={form.phone} onChange={handle("phone")} placeholder={t('contact_field_phone_placeholder')} className={inputCls("phone")} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-foreground">{t('contact_field_service')}</label>
                  <select value={form.service} onChange={handle("service")} className={inputCls("service")}>
                    <option value="">{t('contact_field_service_default')}</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-foreground">{t('contact_field_message')} *</label>
                <textarea value={form.message} onChange={handle("message")} rows={5} placeholder={t('contact_field_message_placeholder')} className={inputCls("message") + " resize-none"} />
                {errors.message && <p className="mt-1 text-xs text-down">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-6 py-4 font-black text-white shadow-gold hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {t('contact_sending')}
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    {t('contact_submit')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
