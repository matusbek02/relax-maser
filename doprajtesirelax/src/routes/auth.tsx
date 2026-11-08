import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Divider } from "@/components/Ornaments";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Prihlásenie správcu – Doprajte si Relax" },
      { name: "description", content: "Prihlásenie do správy rezervácií Doprajte si Relax." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Prihlásenie správcu – Doprajte si Relax" },
      { property: "og:description", content: "Interná správa rezervácií." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const fieldCls =
  "w-full rounded-md border border-border bg-deep/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) setMsg("Prihlásenie zlyhalo. Skontrolujte e-mail a heslo.");
      else void navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      setMsg(
        error
          ? "Registrácia zlyhala. Skúste to prosím znova."
          : "Účet vytvorený. Ak je potrebné, potvrďte e-mail a potom sa prihláste.",
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="card-luxe w-full max-w-md rounded-lg p-9">
        <h1 className="text-center text-3xl text-gilded">Správa rezervácií</h1>
        <Divider className="mt-5" />
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="a-email" className="mb-2 block text-xs uppercase tracking-[0.25em] text-gold/80">
              E-mail
            </label>
            <input
              id="a-email"
              type="email"
              required
              className={fieldCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="a-pass" className="mb-2 block text-xs uppercase tracking-[0.25em] text-gold/80">
              Heslo
            </label>
            <input
              id="a-pass"
              type="password"
              required
              minLength={6}
              className={fieldCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {msg ? <p className="text-sm text-gold-soft">{msg}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full border border-gold/60 bg-[image:var(--gradient-gold)] px-8 py-3 text-sm uppercase tracking-[0.3em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Moment…" : mode === "login" ? "Prihlásiť sa" : "Vytvoriť účet"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full text-center text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-gold"
        >
          {mode === "login" ? "Vytvoriť nový účet" : "Už mám účet – prihlásiť sa"}
        </button>
        <Link
          to="/"
          className="mt-4 block text-center text-xs uppercase tracking-[0.25em] text-gold/70 hover:opacity-70"
        >
          Späť na stránku
        </Link>
      </div>
    </main>
  );
}
