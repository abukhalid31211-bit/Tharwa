import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, LogIn, Eye, EyeOff, Shield } from "lucide-react";
import { clientLogin } from "../lib/api";
import { saveClientSession } from "../lib/auth";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !pass) { setError("يرجى إدخال البريد الإلكتروني وكلمة المرور"); return; }
    setLoading(true);
    try {
      const { token, user } = await clientLogin(email.trim(), pass);
      saveClientSession(token, user);
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-gold shadow-gold mb-4">
            <span className="font-black text-white text-2xl">ر</span>
          </div>
          <h1 className="text-2xl font-black text-foreground">بوابة العملاء</h1>
          <p className="mt-1 text-text-muted text-sm">{settings.site_name_ar} — منصة الاستثمار الذكية</p>
        </div>

        <div className="rounded-2xl border border-border bg-white shadow-gold p-8">
          <h2 className="text-xl font-black text-foreground mb-6">تسجيل الدخول</h2>

          {error && (
            <div className="mb-5 rounded-xl border border-down/30 bg-down/5 px-4 py-3 text-sm text-down font-semibold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-foreground">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@tharwah.com"
                  className="w-full rounded-xl border border-border bg-white py-3 pr-10 pl-4 text-sm placeholder:text-text-muted focus:border-gold focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-foreground">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <input type={showPass ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-white py-3 pr-10 pl-10 text-sm placeholder:text-text-muted focus:border-gold focus:outline-none" />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gold transition-colors">
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <a href="#" className="text-xs text-gold hover:underline font-semibold">نسيت كلمة المرور؟</a>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-gold py-4 font-black text-white shadow-gold hover:-translate-y-0.5 transition-transform disabled:opacity-60">
              {loading ? (
                <><div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />جارٍ الدخول...</>
              ) : (
                <><LogIn className="size-5" />دخول</>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-xs text-text-muted justify-center">
            <Shield className="size-4 text-gold" />
            <span>اتصال آمن ومشفر بتقنية TLS 1.3</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          لست عميلاً بعد؟{" "}
          <Link to="/contact" className="font-bold text-gold hover:underline">تواصل معنا للبدء</Link>
        </p>
      </div>
    </div>
  );
}
