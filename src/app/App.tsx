import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";

type CountryKey = "belgium" | "france" | "germany" | "netherlands";
type AgeGroup = "U11" | "U12" | "U13" | "U14";

type Tournament = {
  id: number;
  name: string;
  city: string;
  country: CountryKey;
  flag: string;
  countryLabel: string;
  region: string;
  date: string;
  dateLabel: string;
  ageGroups: AgeGroup[];
  format: string;
  level: string;
  price: string;
  teams: number;
  spots: number;
  distance: string;
  organizer: string;
  description: string;
  tone: "blue" | "orange" | "yellow" | "green";
  featured?: boolean;
};

const tournaments: Tournament[] = [
  {
    id: 1,
    name: "Brussels Basket Cup",
    city: "Bruxelles",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Bruxelles-Capitale",
    date: "2026-08-22",
    dateLabel: "22–23 août",
    ageGroups: ["U11", "U12", "U13"],
    format: "5×5 · 2 jours",
    level: "Régional +",
    price: "95 € / équipe",
    teams: 24,
    spots: 3,
    distance: "12 km",
    organizer: "Brussels Youth Basketball",
    description: "Un week-end basket au cœur de Bruxelles, avec matchs de classement, concours de shoots et village clubs.",
    tone: "blue",
    featured: true,
  },
  {
    id: 2,
    name: "Lille Métropole Youth Cup",
    city: "Villeneuve-d’Ascq",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "Nord France",
    region: "Hauts-de-France",
    date: "2026-09-05",
    dateLabel: "5–6 sept.",
    ageGroups: ["U12", "U13", "U14"],
    format: "5×5 · 2 jours",
    level: "Interrégional",
    price: "110 € / équipe",
    teams: 32,
    spots: 5,
    distance: "118 km",
    organizer: "Métropole Basket Jeunes",
    description: "Une formule dense et conviviale près de Lille, pensée pour multiplier les matchs et les rencontres entre clubs.",
    tone: "orange",
    featured: true,
  },
  {
    id: 3,
    name: "Rhein-Ruhr Rising Stars",
    city: "Düsseldorf",
    country: "germany",
    flag: "🇩🇪",
    countryLabel: "Allemagne",
    region: "Nordrhein-Westfalen",
    date: "2026-09-12",
    dateLabel: "12–13 sept.",
    ageGroups: ["U11", "U13", "U14"],
    format: "5×5 · 2 jours",
    level: "Élite régionale",
    price: "125 € / équipe",
    teams: 28,
    spots: 2,
    distance: "206 km",
    organizer: "Rhein Hoops Academy",
    description: "Un tournoi rythmé avec équipes allemandes et internationales, cérémonie d’ouverture et finales commentées.",
    tone: "yellow",
  },
  {
    id: 4,
    name: "Tulip Hoops Festival",
    city: "Utrecht",
    country: "netherlands",
    flag: "🇳🇱",
    countryLabel: "Pays-Bas",
    region: "Province d’Utrecht",
    date: "2026-09-19",
    dateLabel: "19 sept.",
    ageGroups: ["U11", "U12"],
    format: "4×4 · 1 jour",
    level: "Tous niveaux",
    price: "75 € / équipe",
    teams: 20,
    spots: 7,
    distance: "174 km",
    organizer: "Utrecht Mini Hoops",
    description: "Une journée ludique dédiée aux plus jeunes, avec matchs courts, ateliers techniques et défis collectifs.",
    tone: "green",
  },
  {
    id: 5,
    name: "Liège Mini-Basket Open",
    city: "Liège",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Province de Liège",
    date: "2026-09-26",
    dateLabel: "26 sept.",
    ageGroups: ["U11", "U12"],
    format: "4×4 · 1 jour",
    level: "Découverte +",
    price: "65 € / équipe",
    teams: 16,
    spots: 0,
    distance: "98 km",
    organizer: "Liège Basket Formation",
    description: "Un open accessible et chaleureux qui favorise le jeu, l’autonomie et le plaisir sur le terrain.",
    tone: "orange",
  },
  {
    id: 6,
    name: "Dunkerque Coast Challenge",
    city: "Dunkerque",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "Nord France",
    region: "Hauts-de-France",
    date: "2026-10-03",
    dateLabel: "3–4 oct.",
    ageGroups: ["U13", "U14"],
    format: "5×5 · 2 jours",
    level: "Régional",
    price: "105 € / équipe",
    teams: 24,
    spots: 4,
    distance: "158 km",
    organizer: "Basket Côte d’Opale",
    description: "Deux jours de compétition sur la côte avec un tableau principal et une consolante pour garantir du temps de jeu.",
    tone: "blue",
  },
  {
    id: 7,
    name: "Cologne Summer Jam",
    city: "Cologne",
    country: "germany",
    flag: "🇩🇪",
    countryLabel: "Allemagne",
    region: "Nordrhein-Westfalen",
    date: "2026-10-10",
    dateLabel: "10 oct.",
    ageGroups: ["U12", "U13"],
    format: "3×3 · 1 jour",
    level: "Tous niveaux",
    price: "55 € / équipe",
    teams: 36,
    spots: 9,
    distance: "214 km",
    organizer: "Köln Jugendbasketball",
    description: "Une ambiance urbaine, des matchs rapides et un format 3×3 idéal pour lancer la saison avec énergie.",
    tone: "yellow",
  },
  {
    id: 8,
    name: "Rotterdam Next Gen Cup",
    city: "Rotterdam",
    country: "netherlands",
    flag: "🇳🇱",
    countryLabel: "Pays-Bas",
    region: "Hollande-Méridionale",
    date: "2026-10-17",
    dateLabel: "17–18 oct.",
    ageGroups: ["U12", "U14"],
    format: "5×5 · 2 jours",
    level: "National",
    price: "135 € / équipe",
    teams: 30,
    spots: 1,
    distance: "152 km",
    organizer: "Rotterdam Future Hoops",
    description: "Un rendez-vous exigeant pour équipes ambitieuses, avec statistiques de match et finale dans la grande salle.",
    tone: "green",
  },
];

const countries: { key: CountryKey | "all"; label: string; flag?: string }[] = [
  { key: "all", label: "Tous" },
  { key: "belgium", label: "Belgique", flag: "🇧🇪" },
  { key: "france", label: "Nord France", flag: "🇫🇷" },
  { key: "germany", label: "Allemagne", flag: "🇩🇪" },
  { key: "netherlands", label: "Pays-Bas", flag: "🇳🇱" },
];

const ageGroups: AgeGroup[] = ["U11", "U12", "U13", "U14"];

function App() {
  const [country, setCountry] = useState<CountryKey | "all">("all");
  const [activeAges, setActiveAges] = useState<AgeGroup[]>([]);
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [saved, setSaved] = useState<number[]>([2]);
  const [selected, setSelected] = useState<Tournament | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("fr");
    return tournaments.filter((tournament) => {
      const matchesCountry = country === "all" || tournament.country === country;
      const matchesAge = activeAges.length === 0 || activeAges.some((age) => tournament.ageGroups.includes(age));
      const matchesAvailability = !availableOnly || tournament.spots > 0;
      const matchesSearch = !needle || [tournament.name, tournament.city, tournament.region, tournament.organizer]
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(needle);
      return matchesCountry && matchesAge && matchesAvailability && matchesSearch;
    });
  }, [activeAges, availableOnly, country, search]);

  const toggleAge = (age: AgeGroup) => {
    setActiveAges((current) => current.includes(age) ? current.filter((item) => item !== age) : [...current, age]);
  };

  const toggleSaved = (id: number) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const resetFilters = () => {
    setCountry("all");
    setActiveAges([]);
    setSearch("");
    setAvailableOnly(false);
  };

  const submitTournament = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="HoopScout, accueil">
          <span className="brand-ball" aria-hidden="true"><span /></span>
          <span>HOOP<span>SCOUT</span></span>
        </a>

        <nav className={mobileMenu ? "main-nav is-open" : "main-nav"} aria-label="Navigation principale">
          <a className="active" href="#tournois" onClick={() => setMobileMenu(false)}>Tournois</a>
          <a href="#comment-ca-marche" onClick={() => setMobileMenu(false)}>Comment ça marche</a>
          <button className="nav-submit" onClick={() => { setShowSubmit(true); setMobileMenu(false); }}>Proposer un tournoi</button>
        </nav>

        <div className="top-actions">
          <button className="saved-button" aria-label={`${saved.length} tournois favoris`}>
            <Heart size={19} fill={saved.length ? "currentColor" : "none"} />
            <span>{saved.length}</span>
          </button>
          <button className="primary-button desktop-submit" onClick={() => setShowSubmit(true)}>
            Proposer un tournoi <ArrowRight size={17} />
          </button>
          <button className="menu-button" onClick={() => setMobileMenu((open) => !open)} aria-label="Ouvrir le menu">
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> Le terrain commence ici</div>
            <h1>Trouve le tournoi<br /><em>qui fait vibrer</em><br />ton équipe.</h1>
            <p>Les meilleurs tournois U11 à U14, réunis entre Belgique, nord de la France, Allemagne et Pays-Bas.</p>
            <div className="hero-stats" aria-label="Statistiques">
              <div><strong>4</strong><span>régions</span></div>
              <div><strong>U11–U14</strong><span>catégories</span></div>
              <div><strong>1</strong><span>terrain de jeu</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="court-board">
              <div className="court-lines"><span className="court-circle" /><span className="court-key" /></div>
              <div className="floating-card card-one"><span>🇧🇪</span><div><b>Bruxelles</b><small>3 places</small></div></div>
              <div className="floating-card card-two"><span>🇳🇱</span><div><b>Utrecht</b><small>U11 · U12</small></div></div>
              <div className="big-ball"><span className="ball-line line-a" /><span className="ball-line line-b" /><span className="ball-line line-c" /></div>
              <span className="motion-dot dot-one" /><span className="motion-dot dot-two" /><span className="motion-cross">+</span>
            </div>
          </div>
        </section>

        <section className="finder" id="tournois">
          <div className="finder-intro">
            <div>
              <span className="section-kicker">Le tableau des matchs</span>
              <h2>Où joue-t-on ensuite ?</h2>
            </div>
            <p>Choisis ta zone, ta catégorie, et trouve le prochain défi de ton équipe.</p>
          </div>

          <div className="search-panel">
            <label className="search-field">
              <Search size={20} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ville, tournoi ou organisateur…" />
              {search && <button onClick={() => setSearch("")} aria-label="Effacer la recherche"><X size={17} /></button>}
            </label>

            <div className="filter-row">
              <div className="filter-group filter-countries" aria-label="Filtrer par pays">
                {countries.map((item) => (
                  <button key={item.key} className={country === item.key ? "filter-chip active" : "filter-chip"} onClick={() => setCountry(item.key)}>
                    {item.flag && <span>{item.flag}</span>}{item.label}
                  </button>
                ))}
              </div>
              <span className="filter-divider" />
              <div className="filter-group" aria-label="Filtrer par âge">
                {ageGroups.map((age) => (
                  <button key={age} className={activeAges.includes(age) ? "age-chip active" : "age-chip"} onClick={() => toggleAge(age)}>{age}</button>
                ))}
              </div>
              <label className="availability-toggle">
                <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} />
                <span className="toggle-track"><span /></span>
                Places disponibles
              </label>
            </div>
          </div>

          <div className="results-head">
            <p><strong>{filtered.length}</strong> tournoi{filtered.length !== 1 ? "s" : ""} sur le radar</p>
            <button className="sort-button">Plus proches <ChevronDown size={16} /></button>
          </div>

          {filtered.length > 0 ? (
            <div className="tournament-grid">
              {filtered.map((tournament) => (
                <article className={`tournament-card tone-${tournament.tone}`} key={tournament.id}>
                  <div className="card-banner">
                    <span className="country-label">{tournament.flag} {tournament.countryLabel}</span>
                    {tournament.featured && <span className="featured-label"><Sparkles size={12} /> Coup de cœur</span>}
                    <button
                      className={saved.includes(tournament.id) ? "heart-button saved" : "heart-button"}
                      onClick={() => toggleSaved(tournament.id)}
                      aria-label={saved.includes(tournament.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart size={18} fill={saved.includes(tournament.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="mini-court"><span /><i /></div>
                  </div>

                  <div className="card-content">
                    <div className="date-block">
                      <CalendarDays size={16} />
                      <span>{tournament.dateLabel}</span>
                      <span className="distance"><MapPin size={14} /> {tournament.distance}</span>
                    </div>
                    <h3>{tournament.name}</h3>
                    <p className="location"><MapPin size={16} /> {tournament.city} · {tournament.region}</p>
                    <div className="age-list">
                      {tournament.ageGroups.map((age) => <span key={age}>{age}</span>)}
                    </div>
                    <div className="card-meta">
                      <span><Users size={15} /> {tournament.teams} équipes</span>
                      <span><Clock3 size={15} /> {tournament.format}</span>
                    </div>
                    <div className="card-footer">
                      <span className={tournament.spots > 0 ? "spots" : "spots full"}>
                        <i /> {tournament.spots > 0 ? `${tournament.spots} place${tournament.spots > 1 ? "s" : ""}` : "Complet"}
                      </span>
                      <button onClick={() => setSelected(tournament)}>Voir le tournoi <ArrowRight size={16} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-ball" aria-hidden="true" />
              <h3>Aucun match pour ces filtres</h3>
              <p>Change de catégorie ou élargis la zone de recherche.</p>
              <button className="primary-button" onClick={resetFilters}>Réinitialiser les filtres</button>
            </div>
          )}
        </section>

        <section className="how-it-works" id="comment-ca-marche">
          <div className="how-copy">
            <span className="section-kicker light">Simple comme un lay-up</span>
            <h2>Le bon tournoi.<br />Sans perdre la balle.</h2>
            <p>HoopScout rapproche les clubs, les coachs et les organisateurs autour d’un calendrier clair et joyeux.</p>
          </div>
          <div className="steps">
            <article><span>01</span><div><Search /><h3>Explore</h3><p>Filtre par région, âge et disponibilité.</p></div></article>
            <article><span>02</span><div><Heart /><h3>Garde</h3><p>Ajoute les meilleurs tournois à tes favoris.</p></div></article>
            <article><span>03</span><div><Trophy /><h3>Joue</h3><p>Contacte l’organisateur et prépare l’équipe.</p></div></article>
          </div>
        </section>

        <section className="trust-note">
          <ShieldCheck size={22} />
          <p><strong>Prototype de démonstration.</strong> Les dates et disponibilités affichées sont fictives et doivent être confirmées auprès des organisateurs.</p>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-ball"><span /></span><span>HOOP<span>SCOUT</span></span></a>
        <p>Le basket des jeunes, sans frontières.</p>
        <span>Belgique · France · Allemagne · Pays-Bas</span>
      </footer>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Fermer"><X /></button>
            <div className={`detail-top tone-${selected.tone}`}>
              <span>{selected.flag}</span>
              <div className="detail-ball" aria-hidden="true" />
            </div>
            <div className="detail-body">
              <span className="country-label">{selected.countryLabel}</span>
              <h2 id="detail-title">{selected.name}</h2>
              <p className="detail-location"><MapPin /> {selected.city} · {selected.region}</p>
              <p className="detail-description">{selected.description}</p>
              <div className="detail-grid">
                <div><CalendarDays /><span>Date</span><strong>{selected.dateLabel} 2026</strong></div>
                <div><Users /><span>Format</span><strong>{selected.format}</strong></div>
                <div><Trophy /><span>Niveau</span><strong>{selected.level}</strong></div>
                <div><span className="euro-icon">€</span><span>Inscription</span><strong>{selected.price}</strong></div>
              </div>
              <div className="detail-ages">{selected.ageGroups.map((age) => <span key={age}>{age}</span>)}</div>
              <div className="organizer-line"><span>Organisé par</span><strong>{selected.organizer}</strong></div>
              <button className="primary-button wide" disabled={selected.spots === 0}>
                {selected.spots > 0 ? "Contacter l’organisateur" : "Tournoi complet"} <ArrowRight />
              </button>
              <small className="demo-caption">Action de démonstration — aucun message ne sera envoyé.</small>
            </div>
          </section>
        </div>
      )}

      {showSubmit && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => { setShowSubmit(false); setSubmitted(false); }}>
          <section className="submit-modal" role="dialog" aria-modal="true" aria-labelledby="submit-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowSubmit(false); setSubmitted(false); }} aria-label="Fermer"><X /></button>
            {!submitted ? (
              <>
                <span className="section-kicker">Pour les organisateurs</span>
                <h2 id="submit-title">Ajoute ton tournoi au radar.</h2>
                <p>Quelques infos suffisent. L’équipe HoopScout vérifiera la fiche avant publication.</p>
                <form onSubmit={submitTournament}>
                  <label>Nom du tournoi<input required placeholder="Ex. Brussels Basket Cup" /></label>
                  <div className="form-row">
                    <label>Ville<input required placeholder="Bruxelles" /></label>
                    <label>Catégories<input required placeholder="U11, U12…" /></label>
                  </div>
                  <label>E-mail de contact<input required type="email" placeholder="coach@club.be" /></label>
                  <button className="primary-button wide" type="submit">Envoyer la proposition <ArrowRight /></button>
                </form>
              </>
            ) : (
              <div className="success-state">
                <span><Check /></span>
                <h2>Bien reçu, coach !</h2>
                <p>La proposition a été ajoutée à la démo. Aucun e-mail n’a réellement été envoyé.</p>
                <button className="primary-button" onClick={() => { setShowSubmit(false); setSubmitted(false); }}>Retour aux tournois</button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
