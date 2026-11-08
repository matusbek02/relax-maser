import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Divider, LeafOrnament, SectionTitle } from "@/components/Ornaments";
import {
  SERVICES,
  buildDaySlots,
  dayKey,
  formatDateLong,
  formatTime,
  upcomingDays,
  type Busy,
  type ServiceOption,
} from "@/lib/booking";

export const Route = createFileRoute("/rezervacia")({
  head: () => ({
    meta: [
      { title: "Online rezervácia – Doprajte si Relax" },
      {
        name: "description",
        content:
          "Rezervujte si masáž online. Pozrite si live voľné a obsadené termíny a vyberte si čas, ktorý vám vyhovuje.",
      },
      { property: "og:title", content: "Online rezervácia – Doprajte si Relax" },
      {
        property: "og:description",
        content: "Live prehľad voľných termínov a okamžitá rezervácia masáže u vás doma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RezervaciaPage,
});

const fieldCls =
  "w-full rounded-md border border-border bg-deep/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold";

function RezervaciaPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [serviceName, setServiceName] = useState(SERVICES[0]!.name);
  const [optionIdx, setOptionIdx] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [busy, setBusy] = useState<Busy[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ when: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });

  useEffect(() => setNow(new Date()), []);

  const service = SERVICES.find((s) => s.name === serviceName) ?? SERVICES[0]!;
  const option: ServiceOption = service.options[optionIdx] ?? service.options[0]!;

  const days = useMemo(() => (now ? upcomingDays(now) : []), [now]);

  useEffect(() => {
    if (days.length && !selectedDay) setSelectedDay(dayKey(days[0]!));
  }, [days, selectedDay]);

  const loadBusy = useMemo(
    () => async () => {
      if (!now) return;
      const from = new Date(now);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(to.getDate() + 60);
      const { data, error: err } = await supabase.rpc("get_busy_slots", {
        _from: from.toISOString(),
        _to: to.toISOString(),
      });
      if (err) setError("Nepodarilo sa načítať obsadené termíny.");
      else setBusy((data as Busy[]) ?? []);
      setLoading(false);
    },
    [now],
  );

  useEffect(() => {
    void loadBusy();
  }, [loadBusy]);

  // Live aktualizácia obsadenosti (pravidelné obnovenie)
  useEffect(() => {
    const id = setInterval(() => {
      void loadBusy();
    }, 20000);
    return () => clearInterval(id);
  }, [loadBusy]);

  const dayDate = days.find((d) => dayKey(d) === selectedDay) ?? null;
  const slots = useMemo(
    () => (dayDate && now ? buildDaySlots(dayDate, option.minutes, busy, now) : []),
    [dayDate, option.minutes, busy, now],
  );

  useEffect(() => setSelectedSlot(null), [selectedDay, serviceName, optionIdx]);

  const freeCount = slots.filter((s) => s.available).length;

  async function submit(e: React.FormEvent) {
  e.preventDefault();

  if (!selectedSlot || submitting) return;

  setSubmitting(true);
  setError(null);

  try {
    const start = new Date(selectedSlot);
    const end = new Date(start.getTime() + option.minutes * 60000);

    const { data: fresh, error: checkError } = await supabase.rpc(
      "get_busy_slots",
      {
        _from: start.toISOString(),
        _to: end.toISOString(),
      }
    );

    if (checkError) {
      console.error("Chyba kontroly termínu:", checkError);
      setError("Nepodarilo sa overiť dostupnosť termínu.");
      return;
    }

    if ((fresh as Busy[] | null)?.length) {
      setError("Tento termín bol práve obsadený. Vyberte si iný.");
      void loadBusy();
      return;
    }

    const { error: insertError } = await supabase
      .from("bookings")
      .insert({
        service: `${service.name} (${option.label})`,
        duration_min: option.minutes,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        note: form.note.trim() || null,
      });

    if (insertError) {
      console.error("Chyba uloženia rezervácie:", insertError);
      setError("Rezerváciu sa nepodarilo odoslať. Skúste to prosím znova.");
      return;
    }

    setDone({
      when: `${formatDateLong(start)} o ${formatTime(start)}`,
    });

    setSelectedSlot(null);
    setForm({ name: "", phone: "", email: "", note: "" });

    void loadBusy();
  } catch (err) {
    console.error("Chyba pri odosielaní rezervácie:", err);
    setError("Nastala chyba pri odosielaní. Skúste to prosím znova.");
  } finally {
    setSubmitting(false);
  }
}

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-deep/60 py-16">
        <LeafOrnament className="pointer-events-none absolute left-2 top-4 h-28 w-28 text-gold/20" />
        <LeafOrnament className="pointer-events-none absolute right-2 top-4 h-28 w-28 -scale-x-100 text-gold/20" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.3em] text-gold/80 transition-opacity hover:opacity-70"
          >
            ← Späť na hlavnú stránku
          </Link>
          <h1 className="mt-6 text-4xl leading-tight text-gilded sm:text-5xl">Online rezervácia</h1>
          <Divider className="mt-6" />
          <p className="mx-auto mt-6 max-w-xl font-display text-xl italic text-gold-soft">
            Vyberte si masáž, deň a voľný čas. Obsadené termíny sa aktualizujú naživo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        {done ? (
          <div className="card-luxe mx-auto max-w-xl rounded-lg p-10 text-center">
            <h2 className="text-3xl text-gold-soft">Ďakujeme!</h2>
            <span className="mx-auto mt-4 block rule-gold w-32" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Vaša rezervácia na <span className="text-gold">{done.when}</span> bola prijatá.
              Termín je od tejto chvíle blokovaný a ozveme sa vám s potvrdením.
            </p>
            <button
              onClick={() => setDone(null)}
              className="mt-8 rounded-full border border-gold/50 px-8 py-3 text-xs uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold/10"
            >
              Nová rezervácia
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 1 – služba */}
            <div>
              <SectionTitle eyebrow="Krok 1" title="Vyberte si masáž" />
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {SERVICES.map((s) => {
                  const active = s.name === serviceName;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        setServiceName(s.name);
                        setOptionIdx(0);
                      }}
                      className={`rounded-lg border p-5 text-left transition-colors ${
                        active
                          ? "border-gold bg-gold/10"
                          : "border-gold/20 bg-deep/40 hover:border-gold/50"
                      }`}
                    >
                      <span className="block text-lg text-gold-soft">{s.name}</span>
                      <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {s.options.map((o) => `${o.label} · ${o.price}`).join("   |   ")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {service.options.length > 1 ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {service.options.map((o, i) => (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => setOptionIdx(i)}
                      className={`rounded-full border px-6 py-2 text-xs uppercase tracking-[0.25em] transition-colors ${
                        i === optionIdx
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-gold/30 text-muted-foreground hover:border-gold/60"
                      }`}
                    >
                      {o.label} · {o.price}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* 2 – deň */}
            <div>
              <SectionTitle eyebrow="Krok 2" title="Vyberte si deň" />
              <div className="mt-10 flex gap-3 overflow-x-auto pb-3">
                {days.map((d) => {
                  const k = dayKey(d);
                  const active = k === selectedDay;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSelectedDay(k)}
                      className={`min-w-[5.5rem] shrink-0 rounded-lg border px-4 py-3 text-center transition-colors ${
                        active
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-gold/20 bg-deep/40 text-muted-foreground hover:border-gold/50"
                      }`}
                    >
                      <span className="block text-xs uppercase tracking-[0.2em]">
                        {["Ne", "Po", "Ut", "St", "Št", "Pi", "So"][d.getDay()]}
                      </span>
                      <span className="mt-1 block font-display text-2xl">{d.getDate()}</span>
                      <span className="block text-[0.65rem] uppercase tracking-[0.15em]">
                        {["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec"][d.getMonth()]}
                      </span>
                    </button>
                  );
                })}
                {!days.length ? (
                  <p className="text-sm text-muted-foreground">Načítavam kalendár…</p>
                ) : null}
              </div>
            </div>

            {/* 3 – čas */}
            <div>
              <SectionTitle eyebrow="Krok 3" title="Voľné termíny" />
              <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {dayDate ? formatDateLong(dayDate) : ""} · {freeCount} voľných
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
                {loading ? (
                  <p className="col-span-full text-center text-sm text-muted-foreground">
                    Načítavam dostupnosť…
                  </p>
                ) : null}
                {!loading && !slots.length ? (
                  <p className="col-span-full text-center text-sm text-muted-foreground">
                    V tento deň nie sú dostupné termíny.
                  </p>
                ) : null}
                {slots.map((s) => {
                  const iso = s.start.toISOString();
                  const active = iso === selectedSlot;
                  return (
                    <button
                      key={iso}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setSelectedSlot(iso)}
                      className={`rounded-md border px-2 py-3 text-sm tracking-wide transition-colors ${
                        !s.available
                          ? "cursor-not-allowed border-border/60 bg-deep/30 text-muted-foreground/40 line-through"
                          : active
                            ? "border-gold bg-[image:var(--gradient-gold)] text-primary-foreground"
                            : "border-gold/30 text-gold hover:bg-gold/10"
                      }`}
                    >
                      {formatTime(s.start)}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-center gap-6 text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-gold/50" /> voľné
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border border-border bg-deep/60" /> obsadené
                </span>
              </div>
            </div>

            {/* 4 – kontakt */}
            <div>
              <SectionTitle eyebrow="Krok 4" title="Vaše údaje" />
              <form onSubmit={submit} className="card-luxe mx-auto mt-10 max-w-xl rounded-lg p-8">
                <p className="text-sm text-muted-foreground">
                  Vybraná masáž:{" "}
                  <span className="text-gold">
                    {service.name} · {option.label} · {option.price}
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Termín:{" "}
                  <span className="text-gold">
                    {selectedSlot
                      ? `${formatDateLong(new Date(selectedSlot))} o ${formatTime(new Date(selectedSlot))}`
                      : "zatiaľ nevybraný"}
                  </span>
                </p>
                <span className="mt-5 mb-6 block rule-gold" />

                <div className="space-y-4">
                  <div>
                    <label htmlFor="b-name" className="mb-2 block text-xs uppercase tracking-[0.25em] text-gold/80">
                      Meno
                    </label>
                    <input
                      id="b-name"
                      required
                      minLength={2}
                      className={fieldCls}
                      placeholder="Vaše meno"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="b-phone" className="mb-2 block text-xs uppercase tracking-[0.25em] text-gold/80">
                      Telefón
                    </label>
                    <input
                      id="b-phone"
                      required
                      minLength={6}
                      className={fieldCls}
                      placeholder="+421 900 000 000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="b-email" className="mb-2 block text-xs uppercase tracking-[0.25em] text-gold/80">
                      E-mail (nepovinné)
                    </label>
                    <input
                      id="b-email"
                      type="email"
                      className={fieldCls}
                      placeholder="vas@email.sk"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="b-note" className="mb-2 block text-xs uppercase tracking-[0.25em] text-gold/80">
                      Adresa a poznámka
                    </label>
                    <textarea
                      id="b-note"
                      rows={3}
                      className={fieldCls}
                      placeholder="Adresa, poschodie, na čo si dať pozor…"
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                    />
                  </div>
                </div>

                {error ? <p className="mt-5 text-sm text-red-300">{error}</p> : null}

                <button
                  type="submit"
                  disabled={!selectedSlot || submitting}
                  className="mt-7 w-full rounded-full border border-gold/60 bg-[image:var(--gradient-gold)] px-8 py-3 text-sm font-medium uppercase tracking-[0.3em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "Odosielam…" : "Potvrdiť rezerváciu"}
                </button>
                {!selectedSlot ? (
                  <p className="mt-3 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Najprv si vyberte termín
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-gold/20 py-10 text-center">
        <p className="font-display text-xl italic text-gold-soft">Doprajte si Relax</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Rezervácie · +421 952 038 849
        </p>
      </footer>
    </main>
  );
}
