import { useState } from "react";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import { useLang } from "../../contexts/LanguageContext";

const itemsAr = [
  { name: "محمد أحمد الراشد", role: "رجل أعمال — الرياض", text: "تجربتي مع ثروة كابيتال غيّرت نظرتي للاستثمار تماماً. الفريق محترف وشفافيتهم في التعامل والتقارير لا تُضاهى." },
  { name: "د. سارة المنصوري", role: "طبيبة استشارية — دبي", text: "كنت أبحث عن جهة موثوقة لإدارة محفظتي. المستشار المخصص يفهم أهدافي ويتواصل معي باستمرار. النتائج فاقت توقعاتي." },
  { name: "خالد بن سلمان", role: "مهندس بترول — الكويت", text: "احترافية في العمل وذكاء في اختيار الفرص الاستثمارية. أنصح بهم لكل من يبحث عن شراكة استثمارية حقيقية." },
  { name: "نورة الزهراني", role: "مديرة مالية — جدة", text: "خدمة عملاء راقية وفهم عميق للأسواق الخليجية والعالمية. شعرت بالأمان منذ اليوم الأول." },
];

const itemsEn = [
  { name: "Mohammed Al-Rashid", role: "Businessman — Riyadh", text: "My experience with Tharwah Capital completely changed my perspective on investing. The team is professional and their transparency in dealings and reporting is unmatched." },
  { name: "Dr. Sara Al-Mansouri", role: "Consultant Physician — Dubai", text: "I was looking for a trusted partner to manage my portfolio. My dedicated advisor understands my goals and keeps in constant contact. Results exceeded my expectations." },
  { name: "Khalid bin Salman", role: "Petroleum Engineer — Kuwait", text: "Professional work and smart selection of investment opportunities. I recommend them to anyone looking for a genuine investment partnership." },
  { name: "Noura Al-Zahrani", role: "Finance Manager — Jeddah", text: "Premium customer service and a deep understanding of Gulf and global markets. I felt secure from day one." },
];

export function Testimonials() {
  const { t, lang } = useLang();
  const items = lang === 'ar' ? itemsAr : itemsEn;
  const [i, setI] = useState(0);
  const prev = () => setI((p) => (p - 1 + items.length) % items.length);
  const next = () => setI((p) => (p + 1) % items.length);
  const item = items[i];

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-black tracking-[0.3em] text-gold uppercase">{t('testimonials_label')}</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-text-light">
            {t('testimonials_heading')} <span className="text-gradient-gold">{t('testimonials_heading_gold')}</span>
          </h2>
        </div>

        <div className="relative rounded-3xl border border-gold/30 bg-gradient-to-br from-navy-mid to-navy-dark p-10 md:p-14 shadow-card">
          <div className="absolute -top-5 right-10 text-7xl text-gold/30 font-serif select-none">"</div>
          <div className="flex items-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, n) => (
              <Star key={n} className="size-5 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-xl md:text-2xl leading-relaxed text-text-light font-medium">{item.text}</p>
          <div className="mt-8 flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-full bg-gradient-gold text-navy-dark font-black text-lg">
              {item.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-text-light">{item.name}</div>
              <div className="text-sm text-text-muted">{item.role}</div>
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-navy-dark border border-border rounded-full px-3 py-2 shadow-card">
            <button onClick={prev} aria-label={t('testimonials_prev')} className="grid size-9 place-items-center rounded-full hover:bg-navy-mid text-text-light">
              <ChevronRight className="size-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {items.map((_, n) => (
                <button
                  key={n}
                  onClick={() => setI(n)}
                  className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-gold" : "w-1.5 bg-border"}`}
                />
              ))}
            </div>
            <button onClick={next} aria-label={t('testimonials_next')} className="grid size-9 place-items-center rounded-full hover:bg-navy-mid text-text-light">
              <ChevronLeft className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
