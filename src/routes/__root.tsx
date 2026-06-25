import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouterState } from "@tanstack/react-router";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { WhatsappButton } from "../components/site/WhatsappButton";
import { BackToTop } from "../components/site/BackToTop";
import { CookieBanner } from "../components/site/CookieBanner";
import { ToastProvider } from "../components/site/Toast";
import { LanguageProvider, LangUrlSync } from "../contexts/LanguageContext";
import { SiteSettingsProvider } from "../contexts/SiteSettingsContext";
import { Link } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-[clamp(6rem,18vw,12rem)] font-black leading-none text-gradient-gold animate-[glitch_3s_infinite]">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-3 text-text-muted leading-relaxed">
          الصفحة التي تبحث عنها لم تعد متاحة أو تم نقلها.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-6 py-3 font-bold text-white shadow-gold hover:-translate-y-0.5 transition-transform"
          >
            العودة للرئيسية
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-gold/40 px-6 py-3 font-bold text-gold hover:bg-gold/10 transition-colors"
          >
            تواصل معنا
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {[
            { to: "/services", l: "خدماتنا" },
            { to: "/markets", l: "الأسواق" },
            { to: "/about", l: "من نحن" },
            { to: "/faq", l: "الأسئلة الشائعة" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-text-muted hover:border-gold hover:text-gold transition-colors"
            >
              {item.l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminOrDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/Akadmin");

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
      <LanguageProvider>
        {/* Keeps ?lang=xx in the URL on every client-side navigation */}
        <LangUrlSync pathname={pathname} />
        <ToastProvider>
          <a href="#main-content" className="skip-link">
            الانتقال إلى المحتوى الرئيسي
          </a>
          <div className="min-h-screen bg-background text-foreground">
            {!isAdminOrDashboard && <SiteHeader />}
            <main id="main-content" className={!isAdminOrDashboard ? "pt-[72px]" : ""}>
              <Outlet />
            </main>
            {!isAdminOrDashboard && <SiteFooter />}
            {!isAdminOrDashboard && <WhatsappButton />}
            <BackToTop />
            <CookieBanner />
          </div>
        </ToastProvider>
      </LanguageProvider>
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}
