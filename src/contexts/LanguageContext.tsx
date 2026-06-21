import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getLang, setLang } from '../lib/store'

const ar = {
  /* ── Navigation ── */
  nav_home: 'الرئيسية',
  nav_about: 'من نحن',
  nav_services: 'خدماتنا',
  nav_markets: 'الأسواق',
  nav_news: 'الأخبار',
  nav_faq: 'الأسئلة الشائعة',
  nav_contact: 'تواصل معنا',
  login_btn: 'بوابة العملاء',
  logout_btn: 'تسجيل الخروج',
  lang_toggle: '🌐 AR | EN',
  lang_current: 'ar',
  my_portfolio: 'محفظتي الاستثمارية',
  my_profile: 'ملفي الشخصي',
  portfolio_short: 'محفظتي',
  menu: 'القائمة',
  brand_name: 'ثروة كابيتال',
  brand_sub: 'Tharwah Capital',

  /* ── Hero ── */
  hero_badge: 'شركة استثمارية مرخصة • منذ 2010',
  hero_sub: 'بأيدي خبراء',
  hero_line3: 'نحو مستقبل مالي أكثر ثباتاً',
  hero_desc: 'ندير استثماراتك في أسواق الأسهم العربية والعالمية، العملات الرقمية، المعادن النفيسة والنفط، بخبرة احترافية تمتد لأكثر من خمسة عشر عاماً.',
  hero_btn1: 'تواصل مع مستشار',
  hero_btn2: 'اكتشف خدماتنا',
  hero_badge1: 'ترخيص رسمي',
  hero_badge2: 'استشارة مجانية',
  hero_badge3: '+$2B أصول مُدارة',

  /* ── Footer ── */
  footer_privacy: 'سياسة الخصوصية',
  footer_terms: 'الشروط والأحكام',
  footer_disclosures: 'الإفصاحات',
  footer_copyright: 'ثروة كابيتال. جميع الحقوق محفوظة.',
  footer_desc: 'شركة استثمارية مرخصة تجمع الخبرة المحلية مع الوصول العالمي لأسواق المال.',
  footer_quick_links: 'روابط سريعة',
  footer_contact_us: 'تواصل معنا',

  /* ── Privacy ── */
  privacy_title: 'سياسة الخصوصية',
  privacy_close: 'إغلاق',
  privacy_empty: 'سياسة الخصوصية غير متاحة حالياً. يرجى التواصل مع الشركة للمزيد من المعلومات.',

  /* ── Services Section ── */
  services_label: 'خدماتنا',
  services_heading: 'خدمات استثمارية',
  services_heading_gold: 'متكاملة',
  services_desc: 'نقدم باقة شاملة من الحلول الاستثمارية المصممة بعناية لتلبية تطلعاتك المالية في مختلف الأسواق العالمية.',
  services_learn_more: 'اكتشف المزيد',
  contact_advisor: 'تواصل مع مستشار',

  /* ── Why Choose Us ── */
  why_label: 'لماذا نحن',
  why_heading: 'لماذا تختار',
  why_heading_gold: 'ثروة كابيتال',
  why_desc: 'قيمنا التي بنيناها على مدار سنوات من الثقة والاحترافية.',

  /* ── How It Works ── */
  how_label: 'العملية',
  how_heading: 'كيف تعمل',
  how_heading_gold: 'معنا؟',
  how_desc: 'أربع خطوات بسيطة تفصلك عن بداية رحلتك الاستثمارية معنا.',

  /* ── Stats Section ── */
  stats_clients: 'عميل حول العالم',
  stats_assets: 'أصول تحت الإدارة',
  stats_experience: 'خبرة في الأسواق',
  stats_satisfaction: 'نسبة رضا العملاء',
  stats_years_suffix: ' سنة',

  /* ── Testimonials ── */
  testimonials_label: 'آراء العملاء',
  testimonials_heading: 'ماذا يقول',
  testimonials_heading_gold: 'عملاؤنا',
  testimonials_prev: 'السابق',
  testimonials_next: 'التالي',

  /* ── CTA Section ── */
  cta_label: 'ابدأ الآن',
  cta_heading: 'ابدأ رحلتك',
  cta_heading_gold: 'الاستثمارية',
  cta_heading_end: 'اليوم',
  cta_desc: 'تواصل مع فريق خبرائنا المتخصصين، وسنضع لك خطة استثمارية متكاملة تناسب أهدافك وتطلعاتك المالية على المدى البعيد.',
  cta_btn1: 'تواصل مع مستشار الآن',
  cta_btn2: 'استشارة عبر واتساب',
  cta_trust1: 'استشارة مجانية',
  cta_trust2: 'خبرة 15+ سنة',
  cta_trust3: 'خدمة 24/7',
  cta_trust4: 'سرّية تامة',

  /* ── Latest News ── */
  news_label: 'المدونة',
  news_heading: 'آخر',
  news_heading_gold: 'التحليلات',
  news_all_articles: 'كل المقالات',
  news_trending: 'رائج',
  news_read_more: 'اقرأ المزيد',

  /* ── Markets Preview ── */
  markets_label: 'الأسواق',
  markets_heading: 'أسعار',
  markets_heading_gold: 'مباشرة',
  markets_view_all: 'عرض الكل',
  markets_tab_stocks: 'الأسهم',
  markets_tab_crypto: 'رقمية',
  markets_tab_metals: 'معادن',
  markets_tab_energy: 'الطاقة',
  markets_col_asset: 'الأصل',
  markets_col_symbol: 'الرمز',
  markets_col_price: 'السعر',
  markets_col_change: 'التغيير',
  markets_col_volume: 'الحجم',
  markets_col_mktcap: 'القيمة السوقية',
  markets_disclaimer: '⚠️ الأسعار مؤشرية وقد تكون متأخرة 15 دقيقة. لا تُعدّ نصيحة استثمارية.',
  markets_search: 'ابحث عن أصل...',
  markets_updated: 'آخر تحديث',

  /* ── About Page ── */
  about_label: 'من نحن',
  about_heading: 'نصنع مستقبلك',
  about_heading_gold: 'المالي',
  about_heading_end: 'منذ 2010',
  about_desc: 'ثروة كابيتال — شركة استثمارية رائدة تجمع الخبرة المحلية مع الوصول العالمي لأسواق المال.',
  about_stat1: 'أصول مدارة',
  about_stat2: 'عميل موثوق',
  about_stat3: 'نسبة رضا',
  about_stat4: 'سوق عالمي',
  about_values_heading: 'قيمنا',
  about_values_heading_gold: 'الأساسية',
  about_timeline_heading: 'رحلتنا عبر',
  about_timeline_heading_gold: 'السنوات',
  about_team_heading: 'فريق',
  about_team_heading_gold: 'قيادتنا',

  /* ── Services Page ── */
  services_page_label: 'خدماتنا',
  services_page_heading: 'خدمات استثمارية',
  services_page_heading_gold: 'متكاملة',
  services_page_desc: 'من الأسواق الخليجية إلى وول ستريت — نقدم حلولاً استثمارية شاملة مصممة لتحقيق أهدافك المالية.',
  services_returns: 'عائد سنوي',
  services_features_title: 'المميزات',
  services_cta_heading: 'جاهز للبدء؟',
  services_cta_desc: 'تواصل مع مستشارنا الآن واحصل على خطة استثمارية مجانية.',
  services_how_heading: 'كيف نعمل',
  services_how_heading_gold: 'معك؟',

  /* ── Contact Page ── */
  contact_label: 'تواصل معنا',
  contact_heading: 'نحن هنا',
  contact_heading_gold: 'لمساعدتك',
  contact_desc: 'فريقنا من الخبراء جاهز للرد على استفساراتك وتقديم الاستشارة المالية المناسبة لك.',
  contact_info_heading: 'معلومات التواصل',
  contact_form_heading: 'أرسل لنا رسالة',
  contact_field_name: 'الاسم الكامل',
  contact_field_email: 'البريد الإلكتروني',
  contact_field_phone: 'رقم الهاتف',
  contact_field_service: 'الخدمة المطلوبة',
  contact_field_message: 'رسالتك',
  contact_field_service_default: 'اختر الخدمة...',
  contact_field_phone_placeholder: '+966 5x xxx xxxx',
  contact_field_name_placeholder: 'أدخل اسمك الكامل',
  contact_field_message_placeholder: 'اكتب رسالتك هنا...',
  contact_submit: 'إرسال الرسالة',
  contact_sending: 'جارٍ الإرسال...',
  contact_optional: '(اختياري)',
  contact_success_heading: 'تم إرسال رسالتك!',
  contact_success_desc: 'سيتواصل معك فريقنا خلال 24 ساعة على الأكثر. شكراً لاهتمامك بخدماتنا!',
  contact_success_btn: 'إرسال رسالة أخرى',
  contact_err_name: 'الاسم مطلوب',
  contact_err_email: 'بريد إلكتروني غير صالح',
  contact_err_message: 'الرسالة مطلوبة',

  /* ── FAQ Page ── */
  faq_label: 'الأسئلة الشائعة',
  faq_heading: 'الأسئلة',
  faq_heading_gold: 'الشائعة',
  faq_desc: 'كل ما تريد معرفته عن خدماتنا الاستثمارية — بوضوح وشفافية تامة.',
  faq_search_placeholder: 'ابحث في الأسئلة...',
  faq_cat_all: 'الكل',

  /* ── Markets Page ── */
  markets_page_label: 'الأسواق',
  markets_page_heading: 'أسواق مالية',
  markets_page_heading_gold: 'مباشرة',
  markets_page_desc: 'تابع أسعار الأصول في الوقت الفعلي — أسهم خليجية وعالمية، عملات رقمية، معادن ونفط.',
  markets_refresh: 'تحديث',

  /* ── News Page ── */
  news_page_label: 'المدونة',
  news_page_heading: 'آخر',
  news_page_heading_gold: 'التحليلات',
  news_page_desc: 'تحليلات ورؤى مالية من فريق خبرائنا لمساعدتك في اتخاذ قرارات استثمارية ذكية.',
  news_search_placeholder: 'ابحث في المقالات...',
  news_cat_all: 'الكل',
  news_by: 'بقلم',
  news_min_read: 'دقيقة قراءة',
} as const

const en = {
  /* ── Navigation ── */
  nav_home: 'Home',
  nav_about: 'About Us',
  nav_services: 'Services',
  nav_markets: 'Markets',
  nav_news: 'News',
  nav_faq: 'FAQ',
  nav_contact: 'Contact Us',
  login_btn: 'Client Portal',
  logout_btn: 'Sign Out',
  lang_toggle: '🌐 EN | AR',
  lang_current: 'en',
  my_portfolio: 'My Portfolio',
  my_profile: 'My Profile',
  portfolio_short: 'Portfolio',
  menu: 'Menu',
  brand_name: 'Tharwah Capital',
  brand_sub: 'ثروة كابيتال',

  /* ── Hero ── */
  hero_badge: 'Licensed Investment Firm • Since 2010',
  hero_sub: 'In expert hands',
  hero_line3: 'Towards a more stable financial future',
  hero_desc: 'We manage your investments in Arab and global equity markets, cryptocurrencies, precious metals and oil, with professional expertise spanning over fifteen years.',
  hero_btn1: 'Contact an Advisor',
  hero_btn2: 'Explore Our Services',
  hero_badge1: 'Official License',
  hero_badge2: 'Free Consultation',
  hero_badge3: '+$2B Assets Managed',

  /* ── Footer ── */
  footer_privacy: 'Privacy Policy',
  footer_terms: 'Terms & Conditions',
  footer_disclosures: 'Disclosures',
  footer_copyright: 'Tharwah Capital. All rights reserved.',
  footer_desc: 'A licensed investment firm combining local expertise with global market access.',
  footer_quick_links: 'Quick Links',
  footer_contact_us: 'Contact Us',

  /* ── Privacy ── */
  privacy_title: 'Privacy Policy',
  privacy_close: 'Close',
  privacy_empty: 'Privacy policy is not available at this time. Please contact us for more information.',

  /* ── Services Section ── */
  services_label: 'Our Services',
  services_heading: 'Comprehensive',
  services_heading_gold: 'Investment Services',
  services_desc: 'We offer a comprehensive suite of investment solutions carefully designed to meet your financial aspirations across global markets.',
  services_learn_more: 'Learn More',
  contact_advisor: 'Contact Advisor',

  /* ── Why Choose Us ── */
  why_label: 'Why Us',
  why_heading: 'Why Choose',
  why_heading_gold: 'Tharwah Capital',
  why_desc: 'Our values built over years of trust and professionalism.',

  /* ── How It Works ── */
  how_label: 'The Process',
  how_heading: 'How Do We Work',
  how_heading_gold: 'With You?',
  how_desc: 'Four simple steps to start your investment journey with us.',

  /* ── Stats Section ── */
  stats_clients: 'Clients Worldwide',
  stats_assets: 'Assets Under Management',
  stats_experience: 'Years of Experience',
  stats_satisfaction: 'Client Satisfaction Rate',
  stats_years_suffix: ' yrs',

  /* ── Testimonials ── */
  testimonials_label: 'Client Reviews',
  testimonials_heading: 'What Our',
  testimonials_heading_gold: 'Clients Say',
  testimonials_prev: 'Previous',
  testimonials_next: 'Next',

  /* ── CTA Section ── */
  cta_label: 'Get Started',
  cta_heading: 'Start Your',
  cta_heading_gold: 'Investment',
  cta_heading_end: 'Journey Today',
  cta_desc: 'Connect with our team of specialists, and we will build a comprehensive investment plan tailored to your long-term financial goals.',
  cta_btn1: 'Contact an Advisor Now',
  cta_btn2: 'WhatsApp Consultation',
  cta_trust1: 'Free Consultation',
  cta_trust2: '15+ Years Experience',
  cta_trust3: '24/7 Support',
  cta_trust4: 'Full Confidentiality',

  /* ── Latest News ── */
  news_label: 'Blog',
  news_heading: 'Latest',
  news_heading_gold: 'Analysis',
  news_all_articles: 'All Articles',
  news_trending: 'Trending',
  news_read_more: 'Read More',

  /* ── Markets Preview ── */
  markets_label: 'Markets',
  markets_heading: 'Live',
  markets_heading_gold: 'Prices',
  markets_view_all: 'View All',
  markets_tab_stocks: 'Stocks',
  markets_tab_crypto: 'Crypto',
  markets_tab_metals: 'Metals',
  markets_tab_energy: 'Energy',
  markets_col_asset: 'Asset',
  markets_col_symbol: 'Symbol',
  markets_col_price: 'Price',
  markets_col_change: 'Change',
  markets_col_volume: 'Volume',
  markets_col_mktcap: 'Mkt Cap',
  markets_disclaimer: '⚠️ Prices are indicative and may be delayed by 15 minutes. Not investment advice.',
  markets_search: 'Search assets...',
  markets_updated: 'Last updated',

  /* ── About Page ── */
  about_label: 'About Us',
  about_heading: 'Building Your',
  about_heading_gold: 'Financial',
  about_heading_end: 'Future Since 2010',
  about_desc: 'Tharwah Capital — a leading investment firm combining local expertise with global market access.',
  about_stat1: 'Assets Managed',
  about_stat2: 'Trusted Clients',
  about_stat3: 'Satisfaction Rate',
  about_stat4: 'Global Markets',
  about_values_heading: 'Our Core',
  about_values_heading_gold: 'Values',
  about_timeline_heading: 'Our Journey',
  about_timeline_heading_gold: 'Through the Years',
  about_team_heading: 'Our',
  about_team_heading_gold: 'Leadership Team',

  /* ── Services Page ── */
  services_page_label: 'Our Services',
  services_page_heading: 'Comprehensive',
  services_page_heading_gold: 'Investment Services',
  services_page_desc: 'From Gulf markets to Wall Street — we offer full-spectrum investment solutions designed to achieve your financial goals.',
  services_returns: 'Annual Return',
  services_features_title: 'Features',
  services_cta_heading: 'Ready to Start?',
  services_cta_desc: 'Contact our advisor now and get a free investment plan.',
  services_how_heading: 'How We Work',
  services_how_heading_gold: 'With You',

  /* ── Contact Page ── */
  contact_label: 'Contact Us',
  contact_heading: 'We Are Here',
  contact_heading_gold: 'to Help You',
  contact_desc: 'Our team of experts is ready to answer your questions and provide the right financial advice for you.',
  contact_info_heading: 'Contact Information',
  contact_form_heading: 'Send Us a Message',
  contact_field_name: 'Full Name',
  contact_field_email: 'Email Address',
  contact_field_phone: 'Phone Number',
  contact_field_service: 'Required Service',
  contact_field_message: 'Your Message',
  contact_field_service_default: 'Select service...',
  contact_field_phone_placeholder: '+1 (xxx) xxx-xxxx',
  contact_field_name_placeholder: 'Enter your full name',
  contact_field_message_placeholder: 'Write your message here...',
  contact_submit: 'Send Message',
  contact_sending: 'Sending...',
  contact_optional: '(optional)',
  contact_success_heading: 'Message Sent!',
  contact_success_desc: 'Our team will reach out within 24 hours. Thank you for your interest in our services!',
  contact_success_btn: 'Send Another Message',
  contact_err_name: 'Name is required',
  contact_err_email: 'Invalid email address',
  contact_err_message: 'Message is required',

  /* ── FAQ Page ── */
  faq_label: 'FAQ',
  faq_heading: 'Frequently Asked',
  faq_heading_gold: 'Questions',
  faq_desc: 'Everything you need to know about our investment services — with full transparency.',
  faq_search_placeholder: 'Search questions...',
  faq_cat_all: 'All',

  /* ── Markets Page ── */
  markets_page_label: 'Markets',
  markets_page_heading: 'Live Financial',
  markets_page_heading_gold: 'Markets',
  markets_page_desc: 'Track real-time asset prices — Gulf and global equities, cryptocurrencies, metals and oil.',
  markets_refresh: 'Refresh',

  /* ── News Page ── */
  news_page_label: 'Blog',
  news_page_heading: 'Latest',
  news_page_heading_gold: 'Analysis',
  news_page_desc: 'Financial analysis and insights from our expert team to help you make smart investment decisions.',
  news_search_placeholder: 'Search articles...',
  news_cat_all: 'All',
  news_by: 'By',
  news_min_read: 'min read',
} as const

type TranslationKey = keyof typeof ar
type Translations = typeof ar

interface LangCtx {
  lang: 'ar' | 'en'
  t: (key: TranslationKey) => string
  toggleLang: () => void
}

const translations: Record<'ar' | 'en', Translations> = { ar, en }

/** Read ?lang= from the URL, fall back to localStorage */
function getInitialLang(): 'ar' | 'en' {
  if (typeof window !== 'undefined') {
    const param = new URLSearchParams(window.location.search).get('lang')
    if (param === 'ar' || param === 'en') {
      setLang(param) // keep localStorage in sync
      return param
    }
  }
  return getLang()
}

/** Write ?lang= into the current URL without a page reload */
function patchUrlLang(lang: 'ar' | 'en') {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set('lang', lang)
  window.history.replaceState({}, '', url.toString())
}

const LangContext = createContext<LangCtx>({
  lang: 'ar',
  t: (k) => ar[k],
  toggleLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<'ar' | 'en'>(getInitialLang)

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  const toggleLang = () => {
    const next: 'ar' | 'en' = lang === 'ar' ? 'en' : 'ar'
    setLangState(next)
    setLang(next)          // persist to localStorage
    patchUrlLang(next)     // reflect in URL immediately
  }

  const t = (key: TranslationKey): string => translations[lang][key] ?? translations.ar[key]

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)

/** Drop this component anywhere inside LanguageProvider.
 *  It re-stamps ?lang=xx whenever TanStack Router changes the pathname,
 *  so the language is always visible in the URL after navigation. */
export function LangUrlSync({ pathname }: { pathname: string }) {
  const { lang } = useLang()
  useEffect(() => {
    patchUrlLang(lang)
  }, [pathname, lang])
  return null
}
