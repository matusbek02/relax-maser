import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });

  const field =
    "w-full rounded-md border border-border bg-deep/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold";

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-[0.25em] text-gold/80">
          Meno
        </label>
        <input
          id="name"
          required
          className={field}
          placeholder="Vaše meno"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="contact" className="mb-2 block text-xs uppercase tracking-[0.25em] text-gold/80">
          Telefón alebo e-mail
        </label>
        <input
          id="contact"
          required
          className={field}
          placeholder="+421 900 000 000"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.25em] text-gold/80">
          Správa
        </label>
        <textarea
          id="message"
          rows={4}
          className={field}
          placeholder="Napíšte, o akú masáž máte záujem a kedy sa vám to hodí."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full border border-gold/60 bg-[image:var(--gradient-gold)] px-8 py-3 text-sm font-medium uppercase tracking-[0.3em] text-primary-foreground transition-opacity hover:opacity-90"
      >
        Poslať objednávku
      </button>
      {sent ? (
        <p className="text-center text-sm text-gold-soft">
          Ďakujeme, ozveme sa vám čo najskôr.
        </p>
      ) : null}
    </form>
  );
}