import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  ExternalLink,
  Globe2,
  Heart,
  Link2,
  MapPin,
  Menu,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react";

type CountryKey = "belgium" | "france" | "germany" | "netherlands" | "spain";
type AgeGroup = "U11" | "U12" | "U13" | "U14";
type Availability = "open" | "full" | "unknown" | "closed";
type PeriodFilter = "upcoming" | "past" | "all";
type SortOrder = "date-asc" | "date-desc" | "name";

type Tournament = {
  id: number;
  name: string;
  city: string;
  country: CountryKey;
  flag: string;
  countryLabel: string;
  region: string;
  startDate: string;
  endDate: string;
  dateLabel: string;
  ageGroups: AgeGroup[];
  gender: string;
  format: string;
  level: string;
  price: string;
  teamInfo: string;
  availability: Availability;
  organizer: string;
  description: string;
  sourceUrl: string;
  registrationUrl?: string;
  sourceLabel: string;
  tone: "blue" | "orange" | "yellow" | "green";
  featured?: boolean;
  international?: boolean;
  quality?: boolean;
};

type SourceWatchStatus = {
  generatedAt: string;
  total: number;
  reachable: number;
  changed: number;
};

type CustomSourceKind = "public" | "facebook-profile" | "facebook-group";

type CustomSource = {
  id: string;
  label: string;
  url: string;
  kind: CustomSourceKind;
  addedAt: string;
};

const customSourceKindLabels: Record<CustomSourceKind, string> = {
  public: "Lien public",
  "facebook-profile": "Profil Facebook",
  "facebook-group": "Groupe Facebook",
};

const SOURCE_STATUS_URL = "https://raw.githubusercontent.com/Etiennejck/Messagerie-CyberSend/main/public/source-status.json";

const getBrusselsDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("fr-BE", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const formatCheckedDate = (isoDate: string) => new Intl.DateTimeFormat("fr-BE", {
  timeZone: "Europe/Brussels",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date(isoDate));

const tournaments: Tournament[] = [
  {
    id: 1,
    name: "Urban Sessions 3×3",
    city: "Bruxelles",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Bruxelles-Capitale",
    startDate: "2026-09-13",
    endDate: "2026-09-13",
    dateLabel: "13 septembre 2026",
    ageGroups: ["U12", "U14"],
    gender: "Équipes jeunes",
    format: "3×3 · 1 jour",
    level: "Festival urbain",
    price: "Voir l’organisateur",
    teamInfo: "Poules + finales",
    availability: "unknown",
    organizer: "Urban Sessions Brussels",
    description: "Tournoi 3×3 U12 et U14 intégré à l’Urban Sessions. Les phases de poules sont annoncées de 9h à 11h30, avec les finales à partir de 13h.",
    sourceUrl: "https://www.urbansessions.be/program",
    sourceLabel: "Programme Urban Sessions",
    tone: "blue",
    featured: true,
  },
  {
    id: 2,
    name: "RedHawks Cup 2026",
    city: "Potsdam",
    country: "germany",
    flag: "🇩🇪",
    countryLabel: "Allemagne",
    region: "Brandebourg",
    startDate: "2026-08-29",
    endDate: "2026-08-29",
    dateLabel: "29 août 2026",
    ageGroups: ["U11", "U12", "U13", "U14"],
    gender: "Filles et garçons",
    format: "Tournoi · 1 jour",
    level: "Multi-niveaux",
    price: "Voir l’inscription",
    teamInfo: "75+ équipes",
    availability: "open",
    organizer: "RedHawks Potsdam",
    description: "La quatrième RedHawks Cup annonce plus de 75 équipes, environ 900 joueuses et joueurs et près de 200 matchs, de U10 à seniors.",
    sourceUrl: "https://bbv-inside.de/events/redhawks-cup-2026/",
    registrationUrl: "https://tournifyapp.com/live/redhawkscup2026",
    sourceLabel: "Fédération du Brandebourg",
    tone: "yellow",
    featured: true,
  },
  {
    id: 3,
    name: "DBB Mädchen-Minifestival",
    city: "Berlin",
    country: "germany",
    flag: "🇩🇪",
    countryLabel: "Allemagne",
    region: "Berlin",
    startDate: "2026-09-04",
    endDate: "2026-09-06",
    dateLabel: "4–6 septembre 2026",
    ageGroups: ["U11", "U12"],
    gender: "Filles",
    format: "Festival · 3 jours",
    level: "Loisir / développement",
    price: "Forfait avec repas",
    teamInfo: "Groupes de clubs",
    availability: "open",
    organizer: "Deutscher Basketball Bund",
    description: "Festival fédéral pour joueuses U10/U12, organisé à Berlin pendant la Coupe du monde féminine. Les équipes sont recomposées sur place et l’expérience prime sur le classement.",
    sourceUrl: "https://www.basketball-bund.de/minifestivals/",
    registrationUrl: "https://www.basketball-bund.de/minifestivals/",
    sourceLabel: "Fédération allemande DBB",
    tone: "orange",
  },
  {
    id: 4,
    name: "Ruhrbaskets Cup U12",
    city: "Oberhausen",
    country: "germany",
    flag: "🇩🇪",
    countryLabel: "Allemagne",
    region: "Nordrhein-Westfalen",
    startDate: "2026-09-13",
    endDate: "2026-09-13",
    dateLabel: "13 septembre 2026",
    ageGroups: ["U12"],
    gender: "Filles et ouvert/garçons",
    format: "5×5 · 1 jour",
    level: "Kreisliga à Oberliga",
    price: "Voir l’organisateur",
    teamInfo: "Quota atteint",
    availability: "full",
    organizer: "Ruhrbaskets Oberhausen",
    description: "Tournoi U12 d’une journée en catégories féminine et masculine/ouverte. La page d’inscription officielle indique que le quota U12 est atteint.",
    sourceUrl: "https://ruhrbaskets-ob.de/rubacup.html",
    registrationUrl: "https://ruhrbaskets-ob.de/rubacupanmeldung.html",
    sourceLabel: "Ruhrbaskets Oberhausen",
    tone: "green",
  },
  {
    id: 5,
    name: "Boys Can Play 2026",
    city: "Mons",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Hainaut + étapes wallonnes",
    startDate: "2026-05-02",
    endDate: "2026-05-23",
    dateLabel: "2–23 mai 2026",
    ageGroups: ["U12", "U14"],
    gender: "Garçons",
    format: "3×3 · 4 étapes",
    level: "Fédéral ouvert",
    price: "30 € / équipe",
    teamInfo: "12 à 16 équipes / catégorie",
    availability: "closed",
    organizer: "AWBB",
    description: "Circuit 3×3 AWBB à Libramont, Courcelles et Ciney, suivi d’une finale à l’Union Mons-Hainaut. Règles FIBA 3×3 adaptées pour les plus jeunes.",
    sourceUrl: "https://www.awbb.be/news/bcp-2026/",
    sourceLabel: "AWBB",
    tone: "blue",
  },
  {
    id: 6,
    name: "Phantoms 3×3 Tornooi",
    city: "Boom",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Province d’Anvers",
    startDate: "2026-05-10",
    endDate: "2026-05-10",
    dateLabel: "10 mai 2026",
    ageGroups: ["U12", "U14"],
    gender: "Équipes de club",
    format: "3×3 · 1 jour",
    level: "Tous niveaux",
    price: "Voir la source",
    teamInfo: "4 joueurs max.",
    availability: "closed",
    organizer: "Phantoms Boom",
    description: "Tournoi découverte 3×3 avec matchs de 10 minutes en continu. L’édition 2026 accueillait les U12 le matin et les U14 l’après-midi.",
    sourceUrl: "https://phantomsboom.be/phantoms-3x3-tornooi/",
    sourceLabel: "Phantoms Boom",
    tone: "orange",
  },
  {
    id: 7,
    name: "Supers Coupes de L’Avenir",
    city: "Philippeville",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Province de Namur",
    startDate: "2026-05-16",
    endDate: "2026-05-16",
    dateLabel: "16 mai 2026",
    ageGroups: ["U12", "U14"],
    gender: "Filles et garçons",
    format: "5×5 · 1 jour",
    level: "Équipes invitées",
    price: "Sur invitation",
    teamInfo: "2 terrains",
    availability: "closed",
    organizer: "CP Namur et partenaires",
    description: "Rencontres U12 à 11h et U14 à 13h, complétées par des matchs U16/U18/U19 et un concours à trois points.",
    sourceUrl: "https://www.cpnamur.be/news/supers-coupes-de-lavenir/",
    sourceLabel: "Comité Provincial Namur",
    tone: "yellow",
  },
  {
    id: 8,
    name: "HNBT 2026",
    city: "Groningen",
    country: "netherlands",
    flag: "🇳🇱",
    countryLabel: "Pays-Bas",
    region: "Province de Groningue",
    startDate: "2026-04-04",
    endDate: "2026-04-06",
    dateLabel: "4–6 avril 2026",
    ageGroups: ["U14"],
    gender: "Équipes internationales",
    format: "5×5 · 3 jours",
    level: "International élite",
    price: "Sur invitation",
    teamInfo: "Résultats en ligne",
    availability: "closed",
    organizer: "Holland Nordic Basketball Tournament",
    description: "Tournoi international annuel à Groningen. L’édition U14 2026 a réuni notamment des équipes néerlandaises, belges, polonaises et tchèques.",
    sourceUrl: "https://hnbt.nl/",
    sourceLabel: "HNBT officiel",
    tone: "green",
    international: true,
  },
  {
    id: 9,
    name: "Open NJK V12 2026",
    city: "Katwijk / Barendrecht",
    country: "netherlands",
    flag: "🇳🇱",
    countryLabel: "Pays-Bas",
    region: "Hollande-Méridionale",
    startDate: "2026-05-09",
    endDate: "2026-05-16",
    dateLabel: "9 & 16 mai 2026",
    ageGroups: ["U12"],
    gender: "Filles",
    format: "Championnat national",
    level: "National",
    price: "Clubs NBB",
    teamInfo: "12 équipes",
    availability: "closed",
    organizer: "Nederlandse Basketball Bond",
    description: "Championnat national ouvert V12 avec douze équipes, demi-finales à Katwijk puis finale à Barendrecht.",
    sourceUrl: "https://basketball.nl/2026/03/24/wedstrijdprogramma-open-njk-v12-2026-bekend/",
    sourceLabel: "Basketball Nederland",
    tone: "blue",
  },
  {
    id: 10,
    name: "FUNCUP 2026",
    city: "Münster",
    country: "germany",
    flag: "🇩🇪",
    countryLabel: "Allemagne",
    region: "Nordrhein-Westfalen",
    startDate: "2026-05-23",
    endDate: "2026-05-24",
    dateLabel: "23–24 mai 2026",
    ageGroups: ["U12", "U14"],
    gender: "U14 filles/garçons",
    format: "5×5 · 2 jours",
    level: "International ouvert",
    price: "80 € / équipe",
    teamInfo: "57 équipes en 2026",
    availability: "closed",
    organizer: "FUNCUP Münster-Kinderhaus",
    description: "Tournoi de Pentecôte axé sur le plaisir, les échanges entre clubs et la diversité, avec six terrains et des équipes allemandes et néerlandaises.",
    sourceUrl: "https://www.funcup.fun/",
    sourceLabel: "FUNCUP officiel",
    tone: "orange",
    international: true,
  },
  {
    id: 11,
    name: "Wizards Summer Cup",
    city: "Babenhausen",
    country: "germany",
    flag: "🇩🇪",
    countryLabel: "Allemagne",
    region: "Hesse",
    startDate: "2026-06-20",
    endDate: "2026-06-20",
    dateLabel: "20 juin 2026",
    ageGroups: ["U12", "U14"],
    gender: "Équipes de club",
    format: "5×5 · 1 jour",
    level: "Tournoi ouvert",
    price: "65 € / équipe",
    teamInfo: "Poules + phases finales",
    availability: "closed",
    organizer: "TV 1891 Babenhausen",
    description: "Matchs de 2×10 minutes, puis quarts, demi-finales et finales dans les salles de la Joachim-Schumann-Schule.",
    sourceUrl: "https://tvb-web.de/abteilungen/basketball/bb-news/1245-summer-cup",
    sourceLabel: "TV Babenhausen",
    tone: "yellow",
  },
  {
    id: 12,
    name: "Itzebasket 2026",
    city: "Itzehoe",
    country: "germany",
    flag: "🇩🇪",
    countryLabel: "Allemagne",
    region: "Schleswig-Holstein",
    startDate: "2026-06-20",
    endDate: "2026-06-20",
    dateLabel: "20 juin 2026",
    ageGroups: ["U12", "U14"],
    gender: "Équipes jeunes",
    format: "3×3 · 1 jour",
    level: "Fédéral ouvert",
    price: "Voir la source",
    teamInfo: "Plusieurs catégories",
    availability: "closed",
    organizer: "BVSH / Itzebasket",
    description: "Étape 3×3 officielle du Schleswig-Holstein avec catégories U12, U14, U16, U18 et formats adultes.",
    sourceUrl: "https://www.bvsh.de/index.php/3x3/1183-itzebasket-2026",
    sourceLabel: "Fédération BVSH",
    tone: "green",
  },
  {
    id: 13,
    name: "Tournoi Jeunes Caen Nord",
    city: "Caen",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "Nord France",
    region: "Normandie",
    startDate: "2026-05-09",
    endDate: "2026-05-10",
    dateLabel: "9–10 mai 2026",
    ageGroups: ["U11", "U13"],
    gender: "Filles et garçons",
    format: "5×5 · 2 jours",
    level: "Tournoi de clubs",
    price: "40 € / équipe",
    teamInfo: "U9, U11 et U13",
    availability: "closed",
    organizer: "Caen Nord Basket",
    description: "Tournoi jeunes pour équipes féminines et masculines U9, U11 et U13, avec inscription officielle via HelloAsso.",
    sourceUrl: "https://www.helloasso.com/associations/caen-nord-basket/boutiques/2026-inscriptions-au-tournoi-jeunes-du-caen-nord-basket-2",
    sourceLabel: "HelloAsso / Caen Nord Basket",
    tone: "blue",
  },
  {
    id: 14,
    name: "Tournoi U13 de Linselles",
    city: "Linselles",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "Nord France",
    region: "Hauts-de-France",
    startDate: "2026-06-28",
    endDate: "2026-06-28",
    dateLabel: "28 juin 2026",
    ageGroups: ["U13"],
    gender: "Garçons",
    format: "5×5 · 1 jour",
    level: "Départemental / district",
    price: "Voir le club",
    teamInfo: "9h–18h",
    availability: "closed",
    organizer: "Linselles Basket",
    description: "Tournoi U13 masculin organisé à la salle Ramet pour des équipes de niveau départemental et district.",
    sourceUrl: "https://www.linselles.fr/agenda/tournoi-u13-masculins/",
    sourceLabel: "Ville de Linselles",
    tone: "orange",
  },
  {
    id: 15,
    name: "LAC Basket – Tournoi Jeunesse",
    city: "Loison-sous-Lens",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "Nord France",
    region: "Pas-de-Calais",
    startDate: "2026-06-06",
    endDate: "2026-06-07",
    dateLabel: "6–7 juin 2026",
    ageGroups: ["U11"],
    gender: "Équipes jeunes",
    format: "Tournoi · 2 jours",
    level: "Tournoi de club",
    price: "Voir le club",
    teamInfo: "U9 et U11",
    availability: "closed",
    organizer: "LAC Basket",
    description: "Week-end jeunesse U9 et U11 annoncé par la Ville de Loison-sous-Lens dans le calendrier 2026 du club.",
    sourceUrl: "https://ville-loison-sous-lens.fr/agenda/evenement/139",
    sourceLabel: "Ville de Loison-sous-Lens",
    tone: "yellow",
  },
  {
    id: 16,
    name: "Crelan 3×3 Masters",
    city: "Bruxelles / Anvers",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Place de la Monnaie puis Groenplaats",
    startDate: "2026-07-18",
    endDate: "2026-07-25",
    dateLabel: "18 & 25 juillet 2026",
    ageGroups: ["U12", "U14"],
    gender: "U12 mixte · U14 garçons",
    format: "3×3 · étapes + finale",
    level: "Circuit officiel",
    price: "Voir l’inscription",
    teamInfo: "Bruxelles puis finale",
    availability: "open",
    organizer: "Crelan 3×3 Masters / AWBB",
    description: "Dernières étapes du circuit estival officiel : Bruxelles le 18 juillet, puis finale nationale à Anvers le 25 juillet. Catégories U12 mixte et U14 garçons.",
    sourceUrl: "https://www.awbb.be/news/3x3masters/",
    registrationUrl: "https://3x3masters.be/",
    sourceLabel: "AWBB",
    tone: "orange",
    featured: true,
  },
  {
    id: 17,
    name: "Challenge U12 AWBB 2026",
    city: "5 provinces AWBB",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Hainaut, Bxl-BBW, Liège, Namur et Luxembourg",
    startDate: "2026-01-03",
    endDate: "2026-02-15",
    dateLabel: "3 janvier–15 février 2026",
    ageGroups: ["U12"],
    gender: "Filles et garçons",
    format: "Challenge technique",
    level: "Provincial puis finale AWBB",
    price: "Joueuses et joueurs affiliés",
    teamInfo: "5 qualifications provinciales",
    availability: "closed",
    organizer: "AWBB et comités provinciaux",
    description: "Qualifications organisées à Flénu-Frameries, Schaerbeek, Sprimont, Gembloux, Arlon et Musson, avant la finale AWBB. Quatre épreuves individuelles pour les U12.",
    sourceUrl: "https://www.awbb.be/news/challengeu122026/",
    sourceLabel: "AWBB / comités provinciaux",
    tone: "blue",
  },
  {
    id: 18,
    name: "Bruges International Trophy",
    city: "Bruges",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Flandre-Occidentale",
    startDate: "2026-04-11",
    endDate: "2026-04-12",
    dateLabel: "11–12 avril 2026",
    ageGroups: ["U14"],
    gender: "Équipes internationales",
    format: "5×5 · 2 jours",
    level: "International",
    price: "Voir l’organisateur",
    teamInfo: "U14, U16 et U18",
    availability: "closed",
    organizer: "Flanders Basketball Events",
    description: "Tournoi international organisé au KTA Brugge pour les catégories U14, U16 et U18.",
    sourceUrl: "https://www.basketbal.vlaanderen/activiteiten/bruges-international-basketball-trophy",
    sourceLabel: "Basketbal Vlaanderen",
    tone: "yellow",
    international: true,
  },
  {
    id: 19,
    name: "3×3 Tornooi Duffel",
    city: "Duffel",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Province d’Anvers",
    startDate: "2026-05-14",
    endDate: "2026-05-14",
    dateLabel: "14 mai 2026",
    ageGroups: ["U14"],
    gender: "U14 mixte",
    format: "3×3 · plein air",
    level: "Tous niveaux",
    price: "Voir la source",
    teamInfo: "4 matchs minimum",
    availability: "closed",
    organizer: "BBC Duffel",
    description: "Cinquième édition du tournoi 3×3 de Duffel, organisé au Sportcentrum Rooienberg avec au moins quatre matchs par équipe.",
    sourceUrl: "https://www.basketbal.vlaanderen/activiteiten/3x3-tornooi-duffel26",
    sourceLabel: "Basketbal Vlaanderen",
    tone: "green",
  },
  {
    id: 20,
    name: "Tournoi U12–U14 Junior Arlonais",
    city: "Arlon",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Province de Luxembourg",
    startDate: "2026-05-16",
    endDate: "2026-05-17",
    dateLabel: "16–17 mai 2026",
    ageGroups: ["U12", "U14"],
    gender: "Équipes jeunes",
    format: "5×5 · 2 jours",
    level: "Tournoi de club",
    price: "Voir le club",
    teamInfo: "Arbitrage encadré AWBB",
    availability: "closed",
    organizer: "Junior Arlonais",
    description: "Tournoi U12–U14 mentionné dans le procès-verbal officiel du département arbitrage AWBB, avec encadrement des arbitres de club par les formateurs provinciaux.",
    sourceUrl: "https://www.awbb.be/wp-content/uploads/2026/04/awdptarb260412.pdf",
    sourceLabel: "Procès-verbal AWBB",
    tone: "orange",
  },
  {
    id: 21,
    name: "Coupe 3×3 BasketLux",
    city: "Province de Luxembourg",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Luxembourg belge",
    startDate: "2026-05-30",
    endDate: "2026-05-30",
    dateLabel: "30 mai 2026",
    ageGroups: ["U12", "U14"],
    gender: "Filles et garçons",
    format: "3×3 · coupe provinciale",
    level: "Provincial",
    price: "Clubs de la province",
    teamInfo: "U12, U14 et U16",
    availability: "closed",
    organizer: "Comité provincial BasketLux",
    description: "Journée provinciale 3×3 annoncée pour les catégories U12, U14 et U16 féminines et masculines.",
    sourceUrl: "https://www.awbb.be/wp-content/uploads/2025/10/awcplu250918.pdf",
    sourceLabel: "Comité provincial Luxembourg",
    tone: "blue",
  },
  {
    id: 22,
    name: "Beker van Antwerpen",
    city: "Hulshout",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Province d’Anvers",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    dateLabel: "1–3 mai 2026",
    ageGroups: ["U12", "U14"],
    gender: "Filles et mixte",
    format: "Finales de coupe · 3 jours",
    level: "Provincial",
    price: "Équipes qualifiées",
    teamInfo: "Finales U12 et U14",
    availability: "closed",
    organizer: "Basketbal Vlaanderen / Zuiderkempen Diamonds",
    description: "Finales provinciales au Sportpark Joris Verhaegen : U12 filles et mixte, U14 mixte et filles.",
    sourceUrl: "https://www.basketbal.vlaanderen/competitiegerelateerde-events/provinciale-bekerfinales/bekervanantwerpen",
    sourceLabel: "Basketbal Vlaanderen",
    tone: "yellow",
  },
  {
    id: 23,
    name: "Mercurius Tornooi U14",
    city: "Berchem / Hoboken",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Province d’Anvers",
    startDate: "2026-05-23",
    endDate: "2026-05-23",
    dateLabel: "23 mai 2026",
    ageGroups: ["U14"],
    gender: "Équipes de club",
    format: "5×5 · 1 jour",
    level: "Tournoi de club",
    price: "Voir le club",
    teamInfo: "U14 et U16",
    availability: "closed",
    organizer: "Mercurius BBC",
    description: "Tournoi annuel du Mercurius BBC pour équipes U14 et U16, publié dans le calendrier officiel du club.",
    sourceUrl: "https://www.mercuriusbbc.be/activiteiten",
    sourceLabel: "Mercurius BBC",
    tone: "green",
  },
  {
    id: 24,
    name: "Tournoi U11 de Linselles",
    city: "Linselles",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "Nord France",
    region: "Hauts-de-France",
    startDate: "2026-06-27",
    endDate: "2026-06-27",
    dateLabel: "27 juin 2026",
    ageGroups: ["U11"],
    gender: "Garçons",
    format: "5×5 · 1 jour",
    level: "Départemental",
    price: "Voir le club",
    teamInfo: "9h–18h",
    availability: "closed",
    organizer: "Linselles Basket",
    description: "Tournoi U11 masculin organisé à la salle Ramet de 9h à 18h, annoncé par la Ville de Linselles.",
    sourceUrl: "https://www.linselles.fr/agenda/tournoi-u11-masculins/",
    sourceLabel: "Ville de Linselles",
    tone: "blue",
  },
  {
    id: 25,
    name: "Finales U13 Hauts-de-France",
    city: "Oignies",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "Nord France",
    region: "Pas-de-Calais",
    startDate: "2026-05-30",
    endDate: "2026-05-30",
    dateLabel: "30 mai 2026",
    ageGroups: ["U13"],
    gender: "Filles et garçons",
    format: "Finales régionales · 1 jour",
    level: "Régional",
    price: "Équipes qualifiées",
    teamInfo: "U13F et U13M",
    availability: "closed",
    organizer: "Ligue Hauts-de-France de Basketball",
    description: "Finales des Trophées des Champions U13 filles et garçons, regroupées au Complexe Sportif Coubertin-Lemaire d’Oignies.",
    sourceUrl: "https://www.hautsdefrancebasketball.org/commission-sportive/finales-regionales-2026/",
    sourceLabel: "Ligue Hauts-de-France",
    tone: "orange",
  },
  {
    id: 26,
    name: "Mondial Mini-Basket de Bourbourg",
    city: "Bourbourg",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Hauts-de-France",
    startDate: "2026-04-04",
    endDate: "2026-04-06",
    dateLabel: "4–6 avril 2026",
    ageGroups: ["U11"],
    gender: "Garçons · équipes invitées",
    format: "5×5 · 3 jours",
    level: "International élite",
    price: "Sur invitation",
    teamInfo: "24 équipes · 240 jeunes",
    availability: "closed",
    organizer: "Sporting Club Bourbourg Basket",
    description: "Le grand rendez-vous pascal du mini-basket réunit 24 équipes U11 et des clubs européens de premier plan à Bourbourg.",
    sourceUrl: "https://www.bourbourg.fr/vivre-a-bourbourg/vie-associative-sports-et-loisirs/les-grands-evenements/",
    sourceLabel: "Ville de Bourbourg",
    tone: "blue",
    international: true,
  },
  {
    id: 27,
    name: "Tournoi international U11 de Furdenheim",
    city: "Furdenheim",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Grand Est",
    startDate: "2026-02-20",
    endDate: "2026-02-22",
    dateLabel: "20–22 février 2026",
    ageGroups: ["U11"],
    gender: "Équipes européennes",
    format: "5×5 · 3 jours",
    level: "International",
    price: "Voir le club",
    teamInfo: "Tournoi sur invitation",
    availability: "closed",
    organizer: "BASK Furdenheim",
    description: "Le tournoi U11 international du BASK Furdenheim accueille de jeunes équipes européennes pour trois jours de compétition et d’échanges.",
    sourceUrl: "https://fufubasket.org/wp-content/uploads/2025/09/AG_Ordinaire_BAS_Furdenheim_2025-1.pdf",
    sourceLabel: "BASK Furdenheim",
    tone: "orange",
    international: true,
  },
  {
    id: 28,
    name: "Furdenheim International Tournament",
    city: "Furdenheim",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Grand Est",
    startDate: "2026-05-22",
    endDate: "2026-05-25",
    dateLabel: "22–25 mai 2026",
    ageGroups: ["U13"],
    gender: "Filles et garçons",
    format: "5×5 · 4 jours",
    level: "International",
    price: "Voir le club",
    teamInfo: "Clubs européens",
    availability: "closed",
    organizer: "BASK Furdenheim",
    description: "Le FIT U13 rassemble à la Pentecôte des équipes de plusieurs pays européens, avec résultats et programme publiés en ligne.",
    sourceUrl: "https://fufubasket.org/tag/fit/",
    sourceLabel: "BASK Furdenheim",
    tone: "green",
    international: true,
  },
  {
    id: 29,
    name: "ION X-Mas Tournament",
    city: "Courtrai et environs",
    country: "belgium",
    flag: "🇧🇪",
    countryLabel: "Belgique",
    region: "Flandre-Occidentale",
    startDate: "2025-12-27",
    endDate: "2025-12-30",
    dateLabel: "27–30 décembre 2025",
    ageGroups: ["U12", "U14"],
    gender: "Filles et garçons",
    format: "5×5 · 4 jours",
    level: "International élite",
    price: "Voir l’organisateur",
    teamInfo: "184 équipes · 19 pays",
    availability: "closed",
    organizer: "X-Mas Tournament Kortrijk",
    description: "La dernière édition confirmée du grand tournoi de Noël de Courtrai a réuni 184 équipes de 19 pays dans plusieurs salles de la région.",
    sourceUrl: "https://www.basketbal.vlaanderen/nieuws/184-ploegen-uit-19-landen-op-ion-x-mas-tournament-in-kortrijk-en-omstreken",
    sourceLabel: "Basketbal Vlaanderen",
    tone: "yellow",
    international: true,
  },
  {
    id: 30,
    name: "Torneig Nord",
    city: "Figueres / Peralada",
    country: "spain",
    flag: "🇪🇸",
    countryLabel: "Espagne",
    region: "Catalogne",
    startDate: "2026-08-28",
    endDate: "2026-09-13",
    dateLabel: "28–30 août & 11–13 septembre 2026",
    ageGroups: ["U12", "U14"],
    gender: "Filles et garçons",
    format: "2 week-ends · 5×5",
    level: "International",
    price: "Voir l’inscription",
    teamInfo: "U14 puis U12",
    availability: "open",
    organizer: "Torneig Nord",
    description: "Deux week-ends internationaux en Catalogne : U14 fin août, puis U12 mi-septembre, entre Figueres et Peralada.",
    sourceUrl: "https://torneignord.com/es/",
    registrationUrl: "https://torneignord.com/es/",
    sourceLabel: "Torneig Nord officiel",
    tone: "yellow",
    featured: true,
    international: true,
  },
  {
    id: 31,
    name: "La Roda U12 Future Stars",
    city: "La Roda",
    country: "spain",
    flag: "🇪🇸",
    countryLabel: "Espagne",
    region: "Castille-La Manche",
    startDate: "2026-07-01",
    endDate: "2026-07-05",
    dateLabel: "1–5 juillet 2026",
    ageGroups: ["U12"],
    gender: "Garçons",
    format: "5×5 · 5 jours",
    level: "International élite",
    price: "Voir l’organisateur",
    teamInfo: "14 équipes · 6 pays",
    availability: "closed",
    organizer: "Club Polideportivo La Roda",
    description: "La 28e édition a accueilli 14 équipes issues de six pays et trois continents dans l’un des grands tournois U12 espagnols.",
    sourceUrl: "https://clmpress.com/n/2026/06/la-roda-reunira-a-14-equipos-de-seis-paises-en-la-28-edicion-del-torneo-internacional-la-roda-u12-future-stars/",
    sourceLabel: "CLM Press",
    tone: "green",
    international: true,
  },
  {
    id: 32,
    name: "Euro Pacé U13",
    city: "Pacé / Saint-Gilles",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Bretagne",
    startDate: "2026-03-28",
    endDate: "2026-03-29",
    dateLabel: "28–29 mars 2026",
    ageGroups: ["U13"],
    gender: "Filles et garçons",
    format: "5×5 · 2 jours",
    level: "International",
    price: "Voir l’organisateur",
    teamInfo: "Équipes de 10 pays",
    availability: "closed",
    organizer: "Euro Pacé Association",
    description: "Tournoi international U13 féminin et masculin organisé sur deux communes, avec des équipes venues de dix pays.",
    sourceUrl: "https://www.europacebasket.fr/",
    sourceLabel: "Euro Pacé officiel",
    tone: "blue",
    international: true,
  },
  {
    id: 33,
    name: "Globasket 2026",
    city: "Lloret de Mar",
    country: "spain",
    flag: "🇪🇸",
    countryLabel: "Espagne",
    region: "Catalogne",
    startDate: "2026-03-29",
    endDate: "2026-04-10",
    dateLabel: "29 mars–10 avril 2026",
    ageGroups: ["U11", "U12", "U13", "U14"],
    gender: "Filles et garçons",
    format: "2 sessions internationales",
    level: "International ouvert",
    price: "Formules avec séjour",
    teamInfo: "Clubs du monde entier",
    availability: "closed",
    organizer: "Globasket",
    description: "Festival international de basket jeunesse sur la Costa Brava, en deux sessions, ouvert aux clubs, écoles et sélections U11 à U14.",
    sourceUrl: "https://globasket.com/wp-content/uploads/GLOBASKET2026_ENG.pdf",
    sourceLabel: "Globasket officiel",
    tone: "orange",
    international: true,
  },
  {
    id: 34,
    name: "Pirineos Basket Cup",
    city: "La Cerdanya",
    country: "spain",
    flag: "🇪🇸",
    countryLabel: "Espagne",
    region: "Pyrénées catalanes",
    startDate: "2026-06-12",
    endDate: "2026-06-14",
    dateLabel: "12–14 juin 2026",
    ageGroups: ["U12", "U14"],
    gender: "Filles et garçons",
    format: "5×5 · minimum 5 matchs",
    level: "International ouvert",
    price: "Formules tournoi et séjour",
    teamInfo: "Clubs de plusieurs pays",
    availability: "closed",
    organizer: "Pirineos Basket Cup",
    description: "Tournoi de trois jours dans la Cerdagne espagnole pour plusieurs catégories, dont U12 et U14, avec au moins cinq matchs garantis.",
    sourceUrl: "https://pirineosbasketcup.com/",
    sourceLabel: "Pirineos Basket Cup officiel",
    tone: "green",
    international: true,
  },
  {
    id: 35,
    name: "Euro Youth Basketball Cup",
    city: "Barcelone",
    country: "spain",
    flag: "🇪🇸",
    countryLabel: "Espagne",
    region: "Catalogne",
    startDate: "2026-06-19",
    endDate: "2026-06-21",
    dateLabel: "19–21 juin 2026",
    ageGroups: ["U12", "U14"],
    gender: "Filles et garçons",
    format: "5×5 · 3 jours",
    level: "International",
    price: "Formules avec séjour",
    teamInfo: "Équipes du monde entier",
    availability: "closed",
    organizer: "European Sport Events",
    description: "Compétition internationale jeunesse à Barcelone avec catégories féminines et masculines, dont U12 et U14.",
    sourceUrl: "https://www.eurobasketballcup.com/es/",
    sourceLabel: "Euro Youth Basketball Cup",
    tone: "blue",
    international: true,
  },
  {
    id: 36,
    name: "Tournoi international FIBA Castelldefels",
    city: "Castelldefels",
    country: "spain",
    flag: "🇪🇸",
    countryLabel: "Espagne",
    region: "Catalogne",
    startDate: "2026-03-31",
    endDate: "2026-04-04",
    dateLabel: "31 mars–4 avril 2026",
    ageGroups: ["U13", "U14"],
    gender: "Garçons",
    format: "5×5 · 5 jours",
    level: "International FIBA Europe",
    price: "Voir l’organisateur",
    teamInfo: "39 équipes",
    availability: "closed",
    organizer: "CB Castelldefels",
    description: "Tournoi approuvé par FIBA Europe avec 39 équipes U13 et U14 venues d’Espagne, d’Allemagne, d’Angleterre, de Lituanie et de Porto Rico.",
    sourceUrl: "https://www.castelldefels.org/es/actualidad/el-castell/noticias/gran-canaria-y-barca-campeones-torneo-internacional-fiba-cb-castelldefels",
    sourceLabel: "Ville de Castelldefels",
    tone: "yellow",
    international: true,
  },
  {
    id: 37,
    name: "Tournoi U11 de Coquelles",
    city: "Coquelles",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Pas-de-Calais",
    startDate: "2026-05-23",
    endDate: "2026-05-24",
    dateLabel: "23–24 mai 2026",
    ageGroups: ["U11"],
    gender: "Garçons",
    format: "5×5 · 2 jours",
    level: "Interrégional",
    price: "Voir le club",
    teamInfo: "Tournoi sur 2 jours",
    availability: "closed",
    organizer: "SC Coquelles Basket",
    description: "Tournoi U11 sur deux jours à Coquelles, confirmé par le compte rendu d’une équipe participante de Saint-Charles Basket.",
    sourceUrl: "https://www.saintcharlesbasket.fr/articles/210514-tournoi-u11m1-a-coquelles",
    sourceLabel: "Saint-Charles Basket",
    tone: "orange",
    quality: true,
  },
  {
    id: 38,
    name: "Paris World Games Basket 2027",
    city: "Paris",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Île-de-France",
    startDate: "2027-06-26",
    endDate: "2027-06-27",
    dateLabel: "26–27 juin 2027",
    ageGroups: ["U11", "U12", "U13", "U14"],
    gender: "Filles et garçons",
    format: "5×5 · 2 jours",
    level: "International",
    price: "Packs tournoi et séjour",
    teamInfo: "Clubs du monde entier",
    availability: "open",
    organizer: "Paris World Games",
    description: "Tournoi international multisites à Paris, ouvert aux clubs affiliés à une fédération reconnue par la FIBA, avec catégories de U11 à U20.",
    sourceUrl: "https://www.parisworldgames.com/fr/sport-basket-2/",
    registrationUrl: "https://parisworldgames.cups.nu/",
    sourceLabel: "Paris World Games officiel",
    tone: "blue",
    featured: true,
    international: true,
    quality: true,
  },
  {
    id: 39,
    name: "Final Four Île-de-France U13",
    city: "Cergy-Pontoise",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Val-d’Oise",
    startDate: "2026-06-13",
    endDate: "2026-06-14",
    dateLabel: "13–14 juin 2026",
    ageGroups: ["U13"],
    gender: "Filles et garçons",
    format: "Demi-finales + finales",
    level: "Régional élite",
    price: "Équipes qualifiées",
    teamInfo: "8 équipes U13",
    availability: "closed",
    organizer: "Ligue Île-de-France de Basketball",
    description: "L’aboutissement du championnat régional U13 réunit les quatre meilleures équipes féminines et masculines dans deux salles de Cergy-Pontoise.",
    sourceUrl: "https://www.basketidf.com/final-four-dile-de-france-jeunes-2026-rendez-vous-a-cergy-pontoise-les-13-et-14-juin/",
    sourceLabel: "Ligue Île-de-France",
    tone: "yellow",
    quality: true,
  },
  {
    id: 40,
    name: "Challenge Benjamin(e)s Île-de-France",
    city: "Paris 16e",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Île-de-France",
    startDate: "2026-03-14",
    endDate: "2026-03-14",
    dateLabel: "14 mars 2026",
    ageGroups: ["U13"],
    gender: "Filles et garçons",
    format: "Épreuves techniques · 1 jour",
    level: "Sélection régionale",
    price: "Participants qualifiés",
    teamInfo: "Meilleurs U13 franciliens",
    availability: "closed",
    organizer: "Ligue Île-de-France de Basketball",
    description: "Étape régionale du Challenge Benjamin(e)s au Stade Français, réservée aux meilleurs U13 franciliens sur les épreuves techniques fédérales.",
    sourceUrl: "https://www.basketidf.com/challenge-benjamines-une-matinee-dediee-aux-jeunes-talents-a-paris/",
    sourceLabel: "Ligue Île-de-France",
    tone: "green",
    quality: true,
  },
  {
    id: 41,
    name: "Les Princes du Basket U13",
    city: "Bonneuil-sur-Marne",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Val-de-Marne",
    startDate: "2026-04-18",
    endDate: "2026-04-19",
    dateLabel: "18–19 avril 2026",
    ageGroups: ["U13"],
    gender: "Garçons",
    format: "5×5 · 2 jours",
    level: "Régional",
    price: "Entrée gratuite",
    teamInfo: "9h–21h",
    availability: "closed",
    organizer: "Les Princes du Basket · Levallois SC",
    description: "Tournoi U13 masculin de niveau régional organisé à Bonneuil-sur-Marne par Les Princes du Basket, structure liée au Levallois Sporting Club.",
    sourceUrl: "https://www.ville-bonneuil.fr/104-2626/agenda-du-moment/fiche/tournoi-les-princes-du-basket-u13-masculins.htm",
    sourceLabel: "Ville de Bonneuil-sur-Marne",
    tone: "blue",
    quality: true,
  },
  {
    id: 42,
    name: "Les Princes du Basket U11",
    city: "Bonneuil-sur-Marne",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Val-de-Marne",
    startDate: "2026-04-26",
    endDate: "2026-04-26",
    dateLabel: "26 avril 2026",
    ageGroups: ["U11"],
    gender: "Garçons",
    format: "5×5 · 1 jour",
    level: "Départemental",
    price: "Entrée gratuite",
    teamInfo: "9h–21h",
    availability: "closed",
    organizer: "Les Princes du Basket · Levallois SC",
    description: "Journée U11 masculine à Bonneuil-sur-Marne, intégrée au tournoi multigénération Les Princes du Basket.",
    sourceUrl: "https://www.ville-bonneuil.fr/104-2631/agenda-du-moment/fiche/tournoi-les-princes-du-basket-u11-masculins.htm",
    sourceLabel: "Ville de Bonneuil-sur-Marne",
    tone: "orange",
    quality: true,
  },
  {
    id: 43,
    name: "Viking All-Star Jeunes",
    city: "Paris 17e",
    country: "france",
    flag: "🇫🇷",
    countryLabel: "France",
    region: "Île-de-France",
    startDate: "2026-06-06",
    endDate: "2026-06-06",
    dateLabel: "6 juin 2026",
    ageGroups: ["U11", "U12", "U13", "U14"],
    gender: "Équipes jeunes",
    format: "Tournoi + skills + tirs",
    level: "Festival urbain",
    price: "Voir l’organisateur",
    teamInfo: "Créneaux par âge",
    availability: "closed",
    organizer: "Viking Club Paris",
    description: "Format All-Star mêlant tournoi par équipes, Skills Challenge et concours de tir au gymnase Balzac, pour les catégories U10 à U18.",
    sourceUrl: "https://www.helloasso.com/associations/viking-club-paris/evenements/basketball-tournois-basketball-allstar-6-juin-2026",
    sourceLabel: "Viking Club Paris · HelloAsso",
    tone: "yellow",
    quality: true,
  },
];

const sourceNetworks = [
  { name: "AWBB", area: "Wallonie & Bruxelles", kind: "Fédération régionale", flag: "🇧🇪", url: "https://www.awbb.be/" },
  { name: "CP Bruxelles–Brabant wallon", area: "Bruxelles / Brabant wallon", kind: "Comité provincial", flag: "🇧🇪", url: "https://www.basket-brabant.be/" },
  { name: "Basket Hainaut", area: "Hainaut", kind: "Comité provincial", flag: "🇧🇪", url: "https://baskethainaut.be/" },
  { name: "CP Liège", area: "Province de Liège", kind: "Comité provincial", flag: "🇧🇪", url: "https://www.cpliege.be/" },
  { name: "BasketLux", area: "Province de Luxembourg", kind: "Comité provincial", flag: "🇧🇪", url: "https://www.basketlux.be/" },
  { name: "CP Namur", area: "Province de Namur", kind: "Comité provincial", flag: "🇧🇪", url: "https://www.cpnamur.be/" },
  { name: "Basketbal Vlaanderen", area: "Flandre · agenda et clubs", kind: "Fédération régionale", flag: "🇧🇪", url: "https://www.basketbal.vlaanderen/activiteiten" },
  { name: "Ligue Hauts-de-France", area: "Hauts-de-France", kind: "Ligue régionale", flag: "🇫🇷", url: "https://www.hautsdefrancebasketball.org/" },
  { name: "Comité du Nord", area: "Nord (59) · annuaire clubs", kind: "Comité départemental", flag: "🇫🇷", url: "https://competitions.ffbb.com/ligues/hdf/comites/0059" },
  { name: "Comité du Pas-de-Calais", area: "Pas-de-Calais (62) · annuaire clubs", kind: "Comité départemental", flag: "🇫🇷", url: "https://competitions.ffbb.com/ligues/hdf/comites/0062" },
  { name: "Comité de l’Aisne", area: "Aisne (02) · annuaire clubs", kind: "Comité départemental", flag: "🇫🇷", url: "https://competitions.ffbb.com/ligues/hdf/comites/0002" },
  { name: "Comité de l’Oise", area: "Oise (60) · annuaire clubs", kind: "Comité départemental", flag: "🇫🇷", url: "https://competitions.ffbb.com/ligues/hdf/comites/0060" },
  { name: "Comité de la Somme", area: "Somme (80) · annuaire clubs", kind: "Comité départemental", flag: "🇫🇷", url: "https://competitions.ffbb.com/ligues/hdf/comites/0080" },
  { name: "Ligue Île-de-France", area: "Paris et région francilienne", kind: "Ligue régionale", flag: "🇫🇷", url: "https://www.basketidf.com/" },
  { name: "Comité de Paris", area: "Paris (75) · compétitions jeunes", kind: "Comité départemental", flag: "🇫🇷", url: "https://competitions.ffbb.com/ligues/idf/comites/0075" },
];

const countries: { key: CountryKey | "all"; label: string; flag?: string }[] = [
  { key: "all", label: "Tous" },
  { key: "belgium", label: "Belgique", flag: "🇧🇪" },
  { key: "france", label: "France", flag: "🇫🇷" },
  { key: "germany", label: "Allemagne", flag: "🇩🇪" },
  { key: "netherlands", label: "Pays-Bas", flag: "🇳🇱" },
  { key: "spain", label: "Espagne", flag: "🇪🇸" },
];

const ageGroups: AgeGroup[] = ["U11", "U12", "U13", "U14"];

const isPast = (tournament: Tournament, today: string) => tournament.endDate < today;

const getAvailability = (tournament: Tournament, today: string) => {
  if (isPast(tournament, today)) return { label: "Édition terminée", className: "closed" };
  if (tournament.availability === "open") return { label: "Inscriptions ouvertes", className: "" };
  if (tournament.availability === "full") return { label: "Complet", className: "full" };
  return { label: "À confirmer", className: "unknown" };
};

function App() {
  const [country, setCountry] = useState<CountryKey | "all">("all");
  const [activeAges, setActiveAges] = useState<AgeGroup[]>([]);
  const [period, setPeriod] = useState<PeriodFilter>("upcoming");
  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [internationalOnly, setInternationalOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("date-asc");
  const [saved, setSaved] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("hoopscout-favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [selected, setSelected] = useState<Tournament | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sourceWatch, setSourceWatch] = useState<SourceWatchStatus | null>(null);
  const [today, setToday] = useState(getBrusselsDateKey);
  const [customSources, setCustomSources] = useState<CustomSource[]>(() => {
    try {
      const savedSources = JSON.parse(localStorage.getItem("hoopscout-custom-sources") || "[]");
      return Array.isArray(savedSources) ? savedSources : [];
    } catch {
      return [];
    }
  });
  const [showSourceManager, setShowSourceManager] = useState(false);
  const [sourceError, setSourceError] = useState("");

  useEffect(() => {
    localStorage.setItem("hoopscout-favorites", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem("hoopscout-custom-sources", JSON.stringify(customSources));
  }, [customSources]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${SOURCE_STATUS_URL}?v=${Date.now()}`, { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Source status unavailable")))
      .then((status: SourceWatchStatus) => setSourceWatch(status))
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") setSourceWatch(null);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const refreshToday = () => setToday(getBrusselsDateKey());
    const timer = window.setInterval(refreshToday, 60_000);
    window.addEventListener("focus", refreshToday);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshToday);
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("fr");
    const result = tournaments.filter((tournament) => {
      const matchesCountry = country === "all" || tournament.country === country;
      const matchesAge = activeAges.length === 0 || activeAges.some((age) => tournament.ageGroups.includes(age));
      const matchesPeriod = period === "all" || (period === "past" ? isPast(tournament, today) : !isPast(tournament, today));
      const matchesAvailability = !availableOnly || (!isPast(tournament, today) && tournament.availability === "open");
      const matchesInternational = !internationalOnly || tournament.international;
      const matchesSaved = !savedOnly || saved.includes(tournament.id);
      const matchesSearch = !needle || [tournament.name, tournament.city, tournament.region, tournament.organizer, tournament.sourceLabel]
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(needle);
      return matchesCountry && matchesAge && matchesPeriod && matchesAvailability && matchesInternational && matchesSaved && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name, "fr");
      return sortOrder === "date-desc" ? b.startDate.localeCompare(a.startDate) : a.startDate.localeCompare(b.startDate);
    });
  }, [activeAges, availableOnly, country, internationalOnly, period, saved, savedOnly, search, sortOrder, today]);

  const upcomingCount = tournaments.filter((tournament) => !isPast(tournament, today)).length;
  const internationalCount = tournaments.filter((tournament) => tournament.international).length;
  const countryCount = new Set(tournaments.map((tournament) => tournament.country)).size;
  const checkedDateLabel = sourceWatch ? formatCheckedDate(sourceWatch.generatedAt) : null;

  const toggleAge = (age: AgeGroup) => {
    setActiveAges((current) => current.includes(age) ? current.filter((item) => item !== age) : [...current, age]);
  };

  const toggleSaved = (id: number) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const resetFilters = () => {
    setCountry("all");
    setActiveAges([]);
    setPeriod("upcoming");
    setSearch("");
    setAvailableOnly(false);
    setInternationalOnly(false);
    setSavedOnly(false);
  };

  const submitTournament = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const proposal = {
      name: String(form.get("name") || ""),
      city: String(form.get("city") || ""),
      ages: String(form.get("ages") || ""),
      source: String(form.get("source") || ""),
      savedAt: new Date().toISOString(),
    };
    const current = JSON.parse(localStorage.getItem("hoopscout-proposals") || "[]");
    localStorage.setItem("hoopscout-proposals", JSON.stringify([...current, proposal]));
    setSubmitted(true);
  };

  const addCustomSource = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const kind = String(form.get("sourceKind") || "public") as CustomSourceKind;
    const rawUrl = String(form.get("sourceUrl") || "").trim();
    const rawLabel = String(form.get("sourceLabel") || "").trim();

    try {
      const parsedUrl = new URL(rawUrl);
      const hostname = parsedUrl.hostname.toLowerCase();
      const isFacebook = hostname === "facebook.com" || hostname.endsWith(".facebook.com") || hostname === "fb.com" || hostname.endsWith(".fb.com");
      if (!/^https?:$/.test(parsedUrl.protocol)) throw new Error("Le lien doit commencer par https:// ou http://.");
      if (kind !== "public" && !isFacebook) throw new Error("Pour un profil ou un groupe Facebook, utilise un lien facebook.com ou fb.com.");
      if (customSources.some((source) => source.url === parsedUrl.toString())) throw new Error("Ce lien est déjà dans tes sources.");

      const fallbackLabel = kind === "facebook-group" ? "Groupe Facebook" : kind === "facebook-profile" ? "Profil Facebook" : parsedUrl.hostname;
      setCustomSources((current) => [...current, {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        label: rawLabel || fallbackLabel,
        url: parsedUrl.toString(),
        kind,
        addedAt: new Date().toISOString(),
      }]);
      setSourceError("");
      event.currentTarget.reset();
    } catch (error) {
      setSourceError(error instanceof Error ? error.message : "Impossible d’ajouter ce lien.");
    }
  };

  const removeCustomSource = (id: string) => {
    setCustomSources((current) => current.filter((source) => source.id !== id));
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
          <a href="#sources" onClick={() => setMobileMenu(false)}>Sources suivies</a>
          <a href="#comment-ca-marche" onClick={() => setMobileMenu(false)}>Comment ça marche</a>
          <button className="nav-submit" onClick={() => { setShowSubmit(true); setMobileMenu(false); }}>Proposer un tournoi</button>
        </nav>

        <div className="top-actions">
          <button
            className={savedOnly ? "saved-button is-active" : "saved-button"}
            onClick={() => setSavedOnly((value) => !value)}
            aria-label={saved.length === 1 ? "1 tournoi favori" : `${saved.length} tournois favoris`}
          >
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
            <div className="eyebrow"><CircleCheck size={15} /> Données vérifiées · veille quotidienne</div>
            <h1>Trouve le tournoi<br /><em>qui fait vibrer</em><br />ton équipe.</h1>
            <p>Des tournois U11 à U14 réels et sourcés, du circuit provincial aux grands rendez-vous internationaux européens.</p>
            <div className="hero-stats" aria-label="Statistiques">
              <div><strong>{tournaments.length}</strong><span>tournois sourcés</span></div>
              <div><strong>{upcomingCount}</strong><span>à venir</span></div>
              <div><strong>{countryCount}</strong><span>pays</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="child-court-art">
              <img src="/assets/terrain-basket-enfant.webp" alt="" />
              <div className="floating-card card-one"><span>🇧🇪</span><div><b>Bruxelles</b><small>13 sept. · U12/U14</small></div></div>
              <div className="floating-card card-two"><span>🇩🇪</span><div><b>Potsdam</b><small>29 août · U11–U14</small></div></div>
              <span className="motion-dot dot-one" /><span className="motion-dot dot-two" /><span className="motion-cross">+</span>
            </div>
          </div>
        </section>

        <section className="finder" id="tournois">
          <div className="finder-intro">
            <div>
              <span className="section-kicker">Le calendrier vérifié</span>
              <h2>Où joue-t-on ensuite ?</h2>
            </div>
            <p>Chaque fiche renvoie vers l’annonce de l’organisateur, du club ou de la fédération.</p>
          </div>

          <div className="period-tabs" aria-label="Filtrer par période">
            <button className={period === "upcoming" ? "active" : ""} onClick={() => setPeriod("upcoming")}>À venir <span>{upcomingCount}</span></button>
            <button className={period === "past" ? "active" : ""} onClick={() => setPeriod("past")}><Archive size={14} /> Archives <span>{tournaments.length - upcomingCount}</span></button>
            <button className={period === "all" ? "active" : ""} onClick={() => setPeriod("all")}>Tout voir <span>{tournaments.length}</span></button>
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
              <button className={internationalOnly ? "filter-chip international-filter active" : "filter-chip international-filter"} onClick={() => setInternationalOnly((value) => !value)}>
                <Globe2 size={15} /> International
              </button>
              <label className="availability-toggle">
                <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} />
                <span className="toggle-track"><span /></span>
                Inscriptions ouvertes
              </label>
            </div>
          </div>

          <div className="results-head">
            <p><strong>{filtered.length}</strong> tournoi{filtered.length !== 1 ? "s" : ""} sur le radar</p>
            <label className="sort-label">Trier
              <select className="sort-button" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
                <option value="date-asc">Date croissante</option>
                <option value="date-desc">Date décroissante</option>
                <option value="name">Nom A–Z</option>
              </select>
            </label>
          </div>

          {filtered.length > 0 ? (
            <div className="tournament-grid">
              {filtered.map((tournament) => {
                const status = getAvailability(tournament, today);
                return (
                  <article className={`tournament-card tone-${tournament.tone} ${isPast(tournament, today) ? "is-past" : ""}`} key={tournament.id}>
                    <div className="card-banner">
                      <span className="country-label">{tournament.flag} {tournament.countryLabel}</span>
                      {tournament.featured && <span className="featured-label"><Sparkles size={12} /> À la une</span>}
                      {tournament.quality && !tournament.featured && <span className="featured-label quality-label"><ShieldCheck size={12} /> Sélection qualité</span>}
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
                        <span className="verified"><ShieldCheck size={14} /> Sourcé</span>
                      </div>
                      <h3>{tournament.name}</h3>
                      <p className="location"><MapPin size={16} /> {tournament.city} · {tournament.region}</p>
                      <div className="age-list">
                        {tournament.ageGroups.map((age) => <span key={age}>{age}</span>)}
                        <span className="gender-tag">{tournament.gender}</span>
                        {tournament.international && <span className="international-tag"><Globe2 size={11} /> International</span>}
                      </div>
                      <div className="card-meta">
                        <span><Users size={15} /> {tournament.teamInfo}</span>
                        <span><Clock3 size={15} /> {tournament.format}</span>
                      </div>
                      <div className="card-footer">
                        <span className={`spots ${status.className}`}><i /> {status.label}</span>
                        <button onClick={() => setSelected(tournament)}>Voir la fiche <ArrowRight size={16} /></button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-ball" aria-hidden="true" />
              <h3>Aucun match pour ces filtres</h3>
              <p>Change de catégorie, ouvre les archives ou élargis la zone.</p>
              <button className="primary-button" onClick={resetFilters}>Réinitialiser les filtres</button>
            </div>
          )}
        </section>

        <section className="source-coverage" id="sources">
          <div className="coverage-copy">
            <span className="section-kicker"><Building2 size={16} /> Périmètre de collecte</span>
            <h2>Les comités et leurs clubs sont dans le radar.</h2>
            <p>Les agendas fédéraux, procès-verbaux provinciaux et annuaires officiels de clubs ci-dessous font partie des sources consultées. Une fiche n’est publiée que si une annonce exploitable confirme au minimum la date, le lieu et la catégorie.</p>
            <div className="source-watch" aria-live="polite">
              <RefreshCw size={17} />
              <span><strong>Veille quotidienne active</strong><small>{sourceWatch ? `Dernier contrôle : ${new Date(sourceWatch.generatedAt).toLocaleString("fr-BE", { dateStyle: "medium", timeStyle: "short" })}` : "Synchronisation en cours"}</small></span>
              {sourceWatch && <em>{sourceWatch.reachable}/{sourceWatch.total} accessibles · page synchronisée</em>}
            </div>
            <div className="coverage-stats">
              <span><strong>{sourceNetworks.length}</strong> réseaux officiels</span>
              <span><strong>5</strong> provinces AWBB</span>
              <span><strong>5</strong> comités HDF</span>
              <span><strong>{internationalCount}</strong> tournois internationaux</span>
              {customSources.length > 0 && <span><strong>{customSources.length}</strong> sources perso</span>}
            </div>
            <button className="source-add-button primary-button" onClick={() => { setShowSourceManager(true); setSourceError(""); }}>
              <Plus size={17} /> Ajouter une source
            </button>
          </div>
          <div className="source-grid">
            {sourceNetworks.map((source) => (
              <a key={source.name} className="source-card" href={source.url} target="_blank" rel="noreferrer">
                <span className="source-flag">{source.flag}</span>
                <span><strong>{source.name}</strong><small>{source.area}</small></span>
                <em>{source.kind}</em>
                <ExternalLink size={15} />
              </a>
            ))}
            {customSources.map((source) => (
              <div key={source.id} className="source-card custom-source-card">
                <span className="source-flag">{source.kind === "public" ? "🔗" : "ⓕ"}</span>
                <span><strong>{source.label}</strong><small>{source.url}</small></span>
                <em>{customSourceKindLabels[source.kind]} · à contrôler</em>
                <a className="source-open" href={source.url} target="_blank" rel="noreferrer" aria-label={`Ouvrir ${source.label}`}><ExternalLink size={15} /></a>
                <button className="source-remove" onClick={() => removeCustomSource(source.id)} aria-label={`Supprimer ${source.label}`}><X size={14} /></button>
              </div>
            ))}
          </div>
        </section>

        <section className="how-it-works" id="comment-ca-marche">
          <div className="how-copy">
            <span className="section-kicker light">Simple comme un lay-up</span>
            <h2>Du web au terrain.<br />Sans info inventée.</h2>
            <p>HoopScout recoupe les annonces publiques des clubs, comités et fédérations. Les organisateurs restent la source de vérité pour les places, tarifs et règlements.</p>
          </div>
          <div className="steps">
            <article><span>01</span><div><Search /><h3>Explore</h3><p>Filtre par pays, âge, période et disponibilité.</p></div></article>
            <article><span>02</span><div><Heart /><h3>Garde</h3><p>Tes favoris restent enregistrés sur cet appareil.</p></div></article>
            <article><span>03</span><div><ExternalLink /><h3>Vérifie</h3><p>Ouvre la source officielle avant d’inscrire l’équipe.</p></div></article>
          </div>
        </section>

        <section className="trust-note">
          <ShieldCheck size={22} />
          <p><strong>{checkedDateLabel ? `Sources contrôlées le ${checkedDateLabel}.` : "Synchronisation des sources en cours."}</strong> Les disponibilités peuvent changer rapidement : confirme toujours auprès de l’organisateur avant déplacement ou paiement.</p>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-ball"><span /></span><span>HOOP<span>SCOUT</span></span></a>
        <p>Le basket des jeunes, sans frontières.</p>
        <span>{tournaments.length} fiches · {checkedDateLabel ? `mises à jour le ${checkedDateLabel}` : "synchronisation en cours"}</span>
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
              <div className="detail-labels">
                <span className="country-label">{selected.countryLabel}</span>
                <span className={`spots ${getAvailability(selected, today).className}`}><i /> {getAvailability(selected, today).label}</span>
              </div>
              <h2 id="detail-title">{selected.name}</h2>
              <p className="detail-location"><MapPin /> {selected.city} · {selected.region}</p>
              <p className="detail-description">{selected.description}</p>
              <div className="detail-grid">
                <div><CalendarDays /><span>Date</span><strong>{selected.dateLabel}</strong></div>
                <div><Users /><span>Public</span><strong>{selected.gender}</strong></div>
                <div><Trophy /><span>Niveau</span><strong>{selected.level}</strong></div>
                <div><span className="euro-icon">€</span><span>Inscription</span><strong>{selected.price}</strong></div>
              </div>
              <div className="detail-ages">{selected.ageGroups.map((age) => <span key={age}>{age}</span>)}</div>
              <div className="organizer-line"><span>Organisé par</span><strong>{selected.organizer}</strong></div>
              {selected.registrationUrl && !isPast(selected, today) && selected.availability !== "full" ? (
                <a className="primary-button wide" href={selected.registrationUrl} target="_blank" rel="noreferrer">
                  Ouvrir l’inscription <ExternalLink size={18} />
                </a>
              ) : null}
              <a className="source-button" href={selected.sourceUrl} target="_blank" rel="noreferrer">
                <Link2 size={17} /> Voir la source : {selected.sourceLabel} <ExternalLink size={15} />
              </a>
              <small className="demo-caption"><ShieldCheck size={13} /> {checkedDateLabel ? `Source contrôlée le ${checkedDateLabel}` : "Contrôle de la source en cours"}</small>
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
                <h2 id="submit-title">Ajoute un tournoi au radar.</h2>
                <p>Enregistre une proposition sourcée. Elle restera sur cet appareil jusqu’à la prochaine phase de modération connectée.</p>
                <form onSubmit={submitTournament}>
                  <label>Nom du tournoi<input name="name" required placeholder="Ex. Brussels Basket Cup" /></label>
                  <div className="form-row">
                    <label>Ville<input name="city" required placeholder="Bruxelles" /></label>
                    <label>Catégories<input name="ages" required placeholder="U11, U12…" /></label>
                  </div>
                  <label>Lien vers l’annonce officielle<input name="source" required type="url" placeholder="https://club.be/tournoi" /></label>
                  <button className="primary-button wide" type="submit">Enregistrer la proposition <ArrowRight /></button>
                </form>
              </>
            ) : (
              <div className="success-state">
                <span><Check /></span>
                <h2>Proposition enregistrée</h2>
                <p>Le brouillon est conservé sur cet appareil avec sa source. Aucune donnée n’a été envoyée à un tiers.</p>
                <button className="primary-button" onClick={() => { setShowSubmit(false); setSubmitted(false); }}>Retour aux tournois</button>
              </div>
            )}
          </section>
        </div>
      )}

      {showSourceManager && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowSourceManager(false)}>
          <section className="submit-modal source-manager" role="dialog" aria-modal="true" aria-labelledby="source-manager-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSourceManager(false)} aria-label="Fermer"><X /></button>
            <span className="section-kicker"><Link2 size={15} /> Sources personnalisées</span>
            <h2 id="source-manager-title">Ajoute tes liens au radar.</h2>
            <p>Enregistre une page publique, un profil Facebook ou un groupe précis à vérifier. Les liens restent enregistrés sur cet appareil.</p>
            <form onSubmit={addCustomSource}>
              <label>Type de source
                <select name="sourceKind" defaultValue="public">
                  <option value="public">Lien public (club, comité, fédération…)</option>
                  <option value="facebook-profile">Profil Facebook</option>
                  <option value="facebook-group">Groupe Facebook</option>
                </select>
              </label>
              <label>Nom court (facultatif)<input name="sourceLabel" placeholder="Ex. Groupe Stage / Camp Basket" /></label>
              <label>Lien à suivre<input name="sourceUrl" required type="url" placeholder="https://www.facebook.com/groups/…" /></label>
              {sourceError && <p className="form-error" role="alert">{sourceError}</p>}
              <button className="primary-button wide" type="submit"><Plus size={17} /> Ajouter ce lien</button>
            </form>
            <div className="facebook-note"><strong>À savoir pour Facebook</strong><span>Les groupes et profils privés nécessitent une connexion et une autorisation. HoopScout ne contourne pas ces accès : seuls les contenus publics peuvent être contrôlés.</span></div>
            {customSources.length > 0 && <div className="saved-sources"><strong>{customSources.length} source{customSources.length > 1 ? "s" : ""} enregistrée{customSources.length > 1 ? "s" : ""}</strong><span>Tu peux les supprimer depuis la liste « Sources suivies ».</span></div>}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
