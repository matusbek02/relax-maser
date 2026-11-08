import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatDateLong, formatTime } from "@/lib/booking";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Prehľad rezervácií – Doprajte si Relax" },
      { name: "description", content: "Interný prehľad a správa rezervácií masáží." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Prehľad rezervácií – Doprajte si Relax" },
      { property: "og:description", content: "Interný prehľad rezervácií." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Booking = {
  id: string;
  service: string;
  duration_min: number;
  starts_at: string;
  ends_at: string;
  customer_name: string;
  phone: string;
  email: string | null;
  note: string | null;
  status: "pending" | "confirmed" | "cancelled";
};

const STATUS_LABEL: Record<Booking["status"], string> = {
  pending: "Čaká na potvrdenie",
  confirmed: "Potvrdená",
  cancelled: "Zrušená",
};

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "all">("upcoming");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("starts_at", { ascending: true });
    setRows((data as Booking[]) ?? []);
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        void navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sessionData.session.user.id);
      if (!active) return;
      const admin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) await load();
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, [navigate, load]);

  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("admin-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        void load();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isAdmin, load]);

  async function setStatus(id: string, status: Booking["status"]) {
    await supabase.from("bookings").update({ status }).eq("id", id);
    await load();
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Načítavam…
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="card-luxe max-w-md rounded-lg p-10">
          <h1 className="text-2xl text-gold-soft">Prístup zamietnutý</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Tento účet nemá práva správcu. Požiadajte o pridelenie prístupu.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              void navigate({ to: "/auth" });
            }}
            className="mt-6 rounded-full border border-gold/50 px-8 py-3 text-xs uppercase tracking-[0.3em] text-gold hover:bg-gold/10"
          >
            Odhlásiť sa
          </button>
        </div>
      </main>
    );
  }

  const nowMs = Date.now();
  const visible = rows.filter((r) => (filter === "all" ? true : new Date(r.ends_at).getTime() >= nowMs));

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl text-gilded">Rezervácie</h1>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs uppercase tracking-[0.25em] text-gold/70 hover:opacity-70">
              Stránka
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                void navigate({ to: "/auth" });
              }}
              className="rounded-full border border-gold/40 px-5 py-2 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold/10"
            >
              Odhlásiť
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {(["upcoming", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.25em] transition-colors ${
                filter === f ? "border-gold bg-gold/15 text-gold" : "border-gold/25 text-muted-foreground"
              }`}
            >
              {f === "upcoming" ? "Nadchádzajúce" : "Všetky"}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {!visible.length ? (
            <p className="text-sm text-muted-foreground">Žiadne rezervácie.</p>
          ) : null}
          {visible.map((b) => {
            const start = new Date(b.starts_at);
            return (
              <article key={b.id} className="card-luxe rounded-lg p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-xl text-gold-soft">
                    {formatDateLong(start)} · {formatTime(start)}–{formatTime(new Date(b.ends_at))}
                  </h2>
                  <span
                    className={`text-xs uppercase tracking-[0.25em] ${
                      b.status === "confirmed"
                        ? "text-gold"
                        : b.status === "cancelled"
                          ? "text-muted-foreground line-through"
                          : "text-gold-soft"
                    }`}
                  >
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>
                <span className="mt-3 block rule-gold" />
                <p className="mt-4 text-sm text-muted-foreground">{b.service}</p>
                <p className="mt-2 text-sm">
                  <span className="text-gold">{b.customer_name}</span> ·{" "}
                  <a href={`tel:${b.phone}`} className="text-gold-soft hover:opacity-80">
                    {b.phone}
                  </a>
                  {b.email ? <span className="text-muted-foreground"> · {b.email}</span> : null}
                </p>
                {b.note ? <p className="mt-2 text-sm text-muted-foreground">{b.note}</p> : null}
                <div className="mt-5 flex flex-wrap gap-3">
                  {b.status !== "confirmed" ? (
                    <button
                      onClick={() => void setStatus(b.id, "confirmed")}
                      className="rounded-full border border-gold/50 px-6 py-2 text-xs uppercase tracking-[0.25em] text-gold hover:bg-gold/10"
                    >
                      Potvrdiť
                    </button>
                  ) : null}
                  {b.status !== "cancelled" ? (
                    <button
                      onClick={() => void setStatus(b.id, "cancelled")}
                      className="rounded-full border border-border px-6 py-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:border-gold/40"
                    >
                      Zrušiť
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
