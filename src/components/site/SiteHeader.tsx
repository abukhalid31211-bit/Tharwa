import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Menu, X, LogIn, TrendingUp, Globe, Bitcoin, Building2, Gem, Fuel,
  ChevronDown, Star, Phone, BarChart3, LogOut, User
} from "lucide-react";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "من نحن" },
  { to: "/services", label: "خدماتنا", hasMega: true },
  { to: "/markets", label: "الأسواق" },
  { to: "/news", label: "الأخبار" },
  { to: "/faq", label: "الأسئلة الشائعة" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

const megaServices = [
  { icon: TrendingUp, label: "الأسهم الخليجية", href: "/service/gulf-stocks", cat: "أسواق الأسهم" },
  { icon: Globe, label: "الأسهم العالمية", href: "/service/global-stocks", cat: "أسواق الأسهم" },
  { icon: Bitcoin, label: "العملات الرقمية", href: "/service/crypto", cat: "أسواق بديلة" },
  { icon: Building2, label: "صناديق الاستثمار", href: "/service/funds", cat: "أسواق بديلة" },
  { icon: Gem, label: "المعادن والذهب", href: "/service/metals", cat: "أسواق بديلة" },
  { icon: Fuel, label: "النفط والطاقة", href: "/service/energy", cat: "أسواق بديلة" },
];

const trending = ["الأسهم الخليجية", "Bitcoin", "الذهب والفضة", "صناديق ETF"];

interface ClientAuth {
  id: number;
  name: string;
  email: string;
  portfolioCode: string;
  initial: string;
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [client, setClient] = useState<ClientAuth | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastScroll = useRef(0);
  const megaRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('tharwah_client_auth');
    if (stored) {
      try { setClient(JSON.parse(stored)); } catch { setClient(null); }
    }
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const cur = window.scrollY;
      setScrolled(cur > 80);
      setHidden(cur > 300 && cur > lastScroll.current);
      lastScroll.current = cur;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMegaOpen(false); setProfileOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMegaOpen(false); setMobileOpen(false); setProfileOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleLogout = () => {
    localStorage.removeItem('tharwah_client_auth');
    setClient(null);
    setProfileOpen(false);
    navigate({ to: '/' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] border-b backdrop-blur-xl transition-all duration-400 ${
        scrolled ? "border-gold/30 bg-white/95 shadow-card" : "border-border/60 bg-white/80"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-gold shadow-gold">
            <span className="font-black text-white text-lg">ر</span>
          </div>
          <div className="leading-tight">
            <div className="font-black text-foreground text-base">الثروة كابيتال كابيتال</div>
            <div className="text-[10px] tracking-widest text-gold uppercase">Rasekhoon Capital</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {links.map((l) => {
            const active = pathname === l.to;
            if ("hasMega" in l && l.hasMega) {
              return (
                <div
                  key={l.to}
                  className="relative"
                  ref={megaRef}
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      active || pathname.startsWith("/service")
                        ? "text-gold bg-gold/8"
                        : "text-foreground/80 hover:text-gold hover:bg-gold/5"
                    }`}
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                  >
                    {l.label}
                    <ChevronDown
                      className={`size-3.5 text-gold transition-transform ${megaOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {/* Mega Menu */}
                  <div
                    className={`absolute top-full right-1/2 translate-x-1/2 w-[680px] rounded-2xl border border-border bg-white shadow-[0_20px_60px_rgba(124,58,237,0.12)] transition-all duration-300 mt-2 overflow-hidden ${
                      megaOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-0 p-6">
                      <div>
                        <div className="text-[11px] font-black tracking-[2px] text-gold uppercase mb-4 pb-3 border-b border-border">
                          📈 أسواق الأسهم
                        </div>
                        {megaServices.filter((s) => s.cat === "أسواق الأسهم").map((s) => (
                          <Link
                            key={s.href}
                            to={s.href as any}
                            className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm text-foreground/80 hover:text-gold hover:bg-gold/5 transition-all hover:pr-5 group"
                          >
                            <s.icon className="size-4 text-gold/70 group-hover:text-gold" />
                            {s.label}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <div className="text-[11px] font-black tracking-[2px] text-gold uppercase mb-4 pb-3 border-b border-border">
                          💰 أسواق بديلة
                        </div>
                        {megaServices.filter((s) => s.cat === "أسواق بديلة").map((s) => (
                          <Link
                            key={s.href}
                            to={s.href as any}
                            className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg text-sm text-foreground/80 hover:text-gold hover:bg-gold/5 transition-all hover:pr-5 group"
                          >
                            <s.icon className="size-4 text-gold/70 group-hover:text-gold" />
                            {s.label}
                          </Link>
                        ))}
                      </div>
                      <div>
                        <div className="text-[11px] font-black tracking-[2px] text-gold uppercase mb-4 pb-3 border-b border-border">
                          🔥 الأكثر طلباً
                        </div>
                        {trending.map((t) => (
                          <div
                            key={t}
                            className="flex items-center gap-2 py-2 px-3 text-sm text-foreground/70 cursor-pointer hover:text-gold transition-colors"
                          >
                            <Star className="size-3 text-gold" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border bg-navy-mid/50 px-6 py-4 flex items-center justify-between">
                      <span className="text-sm text-text-muted">🎯 ابدأ الآن بمحادثة مجانية مع مستشارنا</span>
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-gold px-4 py-2 text-sm font-bold text-white shadow-gold hover:-translate-y-0.5 transition-transform"
                      >
                        <Phone className="size-3.5" />
                        تواصل مع مستشار
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  active ? "text-gold bg-gold/8" : "text-foreground/80 hover:text-gold hover:bg-gold/5"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-gold rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button className="text-xs font-bold text-text-muted hover:text-gold transition-colors border border-border rounded-lg px-3 py-1.5">
            🌐 AR | EN
          </button>

          {client ? (
            /* ── Logged-in Client Profile ── */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 border transition-all ${
                  profileOpen
                    ? "bg-gold/10 border-gold/40"
                    : "bg-navy-mid border-border hover:border-gold/30 hover:bg-gold/5"
                }`}
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-gold text-white font-black text-sm shadow-gold">
                  {client.initial}
                </div>
                <div className="text-right leading-tight">
                  <div className="text-xs font-bold text-foreground">{client.name.split(' ').slice(0,2).join(' ')}</div>
                  <div className="text-[10px] text-gold font-mono">{client.portfolioCode}</div>
                </div>
                <ChevronDown className={`size-3.5 text-gold transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50">
                  {/* User card */}
                  <div className="px-4 py-4 bg-gradient-to-b from-gold/5 to-transparent border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-white font-black shadow-gold">
                        {client.initial}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">{client.name}</div>
                        <div className="text-[10px] text-text-muted mt-0.5">{client.email}</div>
                      </div>
                    </div>
                    <div className="mt-3 rounded-lg bg-gold/10 border border-gold/20 px-3 py-1.5 text-center">
                      <span className="text-[10px] font-bold text-gold">محفظة: {client.portfolioCode}</span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-gold hover:bg-gold/5 transition-colors"
                    >
                      <BarChart3 className="size-4 text-gold/70" />
                      محفظتي الاستثمارية
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-gold hover:bg-gold/5 transition-colors"
                    >
                      <User className="size-4 text-gold/70" />
                      ملفي الشخصي
                    </Link>
                  </div>

                  <div className="border-t border-border py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-down hover:bg-down/5 transition-colors text-right"
                    >
                      <LogOut className="size-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest: Login button ── */
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-5 py-2.5 text-sm font-bold text-white shadow-gold transition-transform hover:-translate-y-0.5"
            >
              <LogIn className="size-4" />
              بوابة العملاء
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="القائمة"
          className="lg:hidden grid place-items-center size-10 rounded-xl border border-border bg-navy-mid text-foreground"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute inset-x-0 top-[72px] border-b border-gold/30 bg-white/98 backdrop-blur-xl animate-fade-up max-h-[80vh] overflow-y-auto">
          <div className="px-5 py-6 flex flex-col gap-1">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                    active ? "bg-gold/10 text-gold" : "text-foreground/90 hover:bg-navy-mid"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs font-bold text-text-muted border border-border rounded-lg px-3 py-1.5">🌐 AR | EN</span>
              {client ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-gold/10 border border-gold/30 px-4 py-2 text-sm font-bold text-gold"
                  >
                    <BarChart3 className="size-4" /> محفظتي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm text-down"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-5 py-2.5 text-sm font-bold text-white"
                >
                  <LogIn className="size-4" /> بوابة العملاء
                </Link>
              )}
            </div>

            {/* Mobile: show client info if logged in */}
            {client && (
              <div className="mt-3 rounded-xl bg-gold/8 border border-gold/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-gold text-white font-black text-sm">
                    {client.initial}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{client.name}</div>
                    <div className="text-[10px] text-gold font-mono mt-0.5">{client.portfolioCode}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
