import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "@/assets/logo.png.asset.json";
const logo = logoAsset.url;
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import { Divider, LeafOrnament, SectionTitle } from "@/components/Ornaments";
import { ContactForm } from "@/components/ContactForm";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Doprajte si Relax – masáže v pohodlí domova" },
      {
        name: "description",
        content:
          "Mobilné masážne služby na Slovensku. Klasická, športová, myofasciálna masáž, Kobido, Champi a lávové kamene priamo u vás doma.",
      },
      { property: "og:title", content: "Doprajte si Relax – masáže v pohodlí domova" },
      {
        property: "og:description",
        content: "Prémiové masáže u vás doma. Pozrite si cenník a objednajte sa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  {
    name: "Klasická masáž",
    desc: "Uvoľnenie stuhnutého svalstva a hlboká regenerácia celého tela.",
    options: [
      { d: "30 min", p: "34 €" },
      { d: "60 min", p: "52 €" },
      { d: "90 min", p: "63 €" },
    ],
  },
  {
    name: "Športová masáž",
    desc: "Intenzívna technika pre aktívnych – rýchlejšia regenerácia po záťaži.",
    options: [
      { d: "30 min", p: "34 €" },
      { d: "60 min", p: "52 €" },
      { d: "90 min", p: "63 €" },
    ],
  },
  {
    name: "Bankovanie & moxovanie",
    desc: "Tradičné techniky na prekrvenie tkanív a úľavu od napätia.",
    options: [{ d: "30 min", p: "32 €" }],
  },
  {
    name: "Myofasciálna masáž",
    desc: "Jemná práca s fasciami, ktorá vracia telu pružnosť a voľnosť.",
    options: [{ d: "60 min", p: "46 €" }],
  },
  {
    name: "Lymfoconturing",
    desc: "Luxusné ošetrenie pre podporu lymfy, detoxikáciu a tvarovanie postavy.",
    options: [{ d: "90 min", p: "110 €" }],
  },
  {
    name: "Champi – indická masáž hlavy",
    desc: "Upokojujúci rituál pre hlavu, šiju a myseľ. Ideálne proti stresu.",
    options: [{ d: "25 min", p: "30 €" }],
  },
  {
    name: "Kobido antiaging masáž",
    desc: "Japonský lifting tváre – pleť pôsobí sviežo, pevne a rozžiarene.",
    options: [{ d: "25 min", p: "30 €" }],
  },
  {
    name: "Masáž lávovými kameňmi",
    desc: "Hrejivé kamene, ktoré rozpúšťajú napätie a prehlbujú relax.",
    options: [{ d: "90 min", p: "46 €" }],
  },
];

const benefits = [
  {
    title: "Bez cestovania",
    text: "Prídeme za vami. Po masáži zostávate v teple domova a relax pokračuje.",
  },
  {
    title: "Súkromie a pohodlie",
    text: "Ošetrenie prebieha v známom prostredí, kde sa cítite úplne uvoľnene.",
  },
  {
    title: "Kompletné vybavenie",
    text: "Prinášame masážny stôl, čisté obliečky, oleje aj jemnú relaxačnú hudbu.",
  },
  {
    title: "Individuálny prístup",
    text: "Každú masáž prispôsobíme vášmu telu, jeho potrebám a citlivosti.",
  },
  {
    title: "Flexibilné termíny",
    text: "Aj po pracovnom čase či cez víkend – vyberte si čas, ktorý vám vyhovuje.",
  },
  {
    title: "Profesionalita",
    text: "Certifikované techniky, diskrétnosť a starostlivosť s úprimným záujmom.",
  },
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Sviečky, uteráky a masážny olej v luxusnej spa atmosfére"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-deep)] opacity-75" />
        <LeafOrnament className="pointer-events-none absolute left-2 top-2 h-28 w-28 text-gold/40 sm:h-44 sm:w-44" />
        <LeafOrnament className="pointer-events-none absolute right-2 top-2 h-28 w-28 -scale-x-100 text-gold/40 sm:h-44 sm:w-44" />
        <LeafOrnament className="pointer-events-none absolute bottom-2 left-2 h-28 w-28 -scale-y-100 text-gold/30 sm:h-44 sm:w-44" />
        <LeafOrnament className="pointer-events-none absolute bottom-2 right-2 h-28 w-28 -scale-100 text-gold/30 sm:h-44 sm:w-44" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
          <img
            src={logo}
            alt="Doprajte si Relax – logo"
            width={1024}
            height={1024}
            className="w-[28rem] sm:w-[44rem] -mb-1 sm:-mb-2"
          />
          <p className="mt-0 max-w-xl font-display text-2xl italic leading-relaxed text-gold-soft text-shadow-luxe sm:text-3xl">
            Doprajte si relax – masážne služby v pohodlí domova.
          </p>
          <Divider className="mt-8" />
          <p className="mt-8 max-w-xl font-display text-xl italic leading-relaxed text-gold-soft text-shadow-luxe sm:text-2xl">
            Prémiová starostlivosť o telo aj myseľ. Prichádzame k vám s vlastným
            vybavením, jemnou hudbou a plnou pozornosťou venovanou len vám.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/rezervacia"
              className="rounded-full border border-gold/60 bg-[image:var(--gradient-gold)] px-10 py-3 text-sm uppercase tracking-[0.3em] text-primary-foreground shadow-[var(--shadow-luxe)] transition-opacity hover:opacity-90"
            >
              Objednať sa online
            </Link>
            <a
              href="#cennik"
              className="rounded-full border border-gold/50 px-10 py-3 text-sm uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold/10"
            >
              Cenník
            </a>
          </div>
        </div>
      </section>

      {/* O NÁS */}
      <section id="o-nas" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-3 rounded-md border border-gold/25" />
            <img
              src={aboutImg}
              alt="Uteráky, sviečka a miska s olejom pripravené na masáž"
              width={1200}
              height={1408}
              loading="lazy"
              className="relative h-[420px] w-full rounded-md object-cover sm:h-[520px]"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold/80">O nás</p>
            <h2 className="mt-4 text-4xl leading-tight text-gilded sm:text-5xl">
              Váš domov sa premení na tiché wellness
            </h2>
            <span className="mt-6 block rule-gold w-32" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Veríme, že skutočný oddych začína tam, kde sa cítite bezpečne. Preto
              prinášame masáž priamo k vám – so všetkým, čo k nej patrí. Masážny
              stôl, hrejivé oleje, sviece a pokojná hudba vytvoria atmosféru
              exkluzívneho salónu vo vašej obývačke či spálni.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Každé ošetrenie začína krátkym rozhovorom, aby sme pochopili, čo vaše
              telo práve potrebuje. Následne zvolíme techniku a intenzitu presne pre
              vás – jemné uvoľnenie, hlbšiu prácu so svalmi alebo starostlivosť
              o tvár a pleť.
            </p>
            <p className="mt-6 font-display text-2xl italic text-gold-soft">
              „Chvíľa pre seba nie je luxus. Je to potreba.“
            </p>
          </div>
        </div>
      </section>

      {/* CENNÍK */}
      <section id="cennik" className="relative overflow-hidden bg-deep/60 py-24">
        <LeafOrnament className="pointer-events-none absolute -left-8 top-10 h-40 w-40 text-gold/15" />
        <LeafOrnament className="pointer-events-none absolute -right-8 bottom-10 h-40 w-40 -scale-100 text-gold/15" />
        <div className="relative mx-auto max-w-5xl px-6">
          <SectionTitle eyebrow="Cenník" title="Naše masáže" />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <article key={s.name} className="card-luxe rounded-lg p-7">
                <h3 className="text-2xl text-gold-soft">{s.name}</h3>
                <span className="mt-3 block rule-gold" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
                <ul className="mt-5 space-y-2">
                  {s.options.map((o) => (
                    <li
                      key={o.d}
                      className="flex items-baseline gap-3 text-sm tracking-wide"
                    >
                      <span className="text-muted-foreground">{o.d}</span>
                      <span className="h-px flex-1 border-b border-dotted border-gold/30" />
                      <span className="font-display text-xl text-gold">{o.p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Ceny sú konečné · Doprava po dohode
          </p>
        </div>
      </section>

      {/* BENEFITY */}
      <section id="preco" className="mx-auto max-w-6xl px-6 py-24">
        <SectionTitle eyebrow="Prečo my" title="Masáž u vás doma" />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <div key={b.title} className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 font-display text-lg text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-2xl text-gold-soft">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" className="relative overflow-hidden bg-deep/60 py-24">
        <LeafOrnament className="pointer-events-none absolute left-2 top-6 h-32 w-32 text-gold/20" />
        <LeafOrnament className="pointer-events-none absolute right-2 top-6 h-32 w-32 -scale-x-100 text-gold/20" />
        <div className="relative mx-auto max-w-5xl px-6">
          <SectionTitle eyebrow="Kontakt" title="Objednajte sa" />
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            <div className="card-luxe rounded-lg p-8">
              <h3 className="text-2xl text-gold-soft">Rezervácia termínu</h3>
              <span className="mt-3 block rule-gold" />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Zavolajte nám alebo napíšte správu. Radi vám poradíme s výberom
                masáže a dohodneme termín, ktorý vám bude vyhovovať.
              </p>
              <dl className="mt-7 space-y-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.3em] text-gold/80">
                    Telefón
                  </dt>
                  <dd className="mt-1">
                  <a
                    href="tel:+421952038849"
                    className="font-display text-2xl text-gold transition-opacity hover:opacity-80"
                  >
                    +421 952 038 849
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-gold/80">
                  E-mail
                </dt>
                <dd className="mt-1 text-muted-foreground">
                  doprajtesirelax@gmail.com
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-gold/80">
                  Na Objednanie
                </dt>
              </div>
              </dl>
              <a
                href="tel:+421952038849"
                className="mt-8 inline-block rounded-full border border-gold/50 px-8 py-3 text-xs uppercase tracking-[0.3em] text-gold transition-colors hover:bg-gold/10"
              >
                Zavolať teraz
              </a>
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/80">
                  Sociálne siete
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <a
                    href="https://www.instagram.com/doprajtesirelax/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold/10"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.44-.645 1.44-1.44s-.645-1.44-1.44-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/people/Doprajte-si-relax/61593066457421/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold/10"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="card-luxe rounded-lg p-8">
              <h3 className="text-2xl text-gold-soft">Rezervujte si termín online</h3>
              <span className="mt-3 mb-5 block rule-gold" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                V online rezervácii uvidíte naživo voľné a obsadené termíny a vyberiete si
                čas, ktorý vám vyhovuje.
              </p>
              <Link
                to="/rezervacia"
                className="mt-6 inline-block rounded-full border border-gold/60 bg-[image:var(--gradient-gold)] px-8 py-3 text-xs uppercase tracking-[0.3em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Zobraziť voľné termíny
              </Link>
              <h3 className="mt-10 text-2xl text-gold-soft">Napíšte nám</h3>
              <span className="mt-3 mb-6 block rule-gold" />
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gold/20 py-10 text-center">
        <p className="font-display text-xl italic text-gold-soft">Doprajte si Relax</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Masážne služby v pohodlí domova
        </p>
      </footer>
    </main>
  );
}
