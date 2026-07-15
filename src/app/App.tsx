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
  Heart,
  Link2,
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
};

const TODAY = "2026-07-15";
const VERIFIED_AT = "15 juillet 2026";

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
];

const countries: { key: CountryKey | "all"; label: string; flag?: string }[] = [
  { key: "all", label: "Tous" },
  { key: "belgium", label: "Belgique", flag: "🇧🇪" },
  { key: "france", label: "Nord France", flag: "🇫🇷" },
  { key: "germany", label: "Allemagne", flag: "🇩🇪" },
  { key: "netherlands", label: "Pays-Bas", flag: "🇳🇱" },
];

const ageGroups: AgeGroup[] = ["U11", "U12", "U13", "U14"];

const isPast = (tournament: Tournament) => tournament.endDate < TODAY;

const getAvailability = (tournament: Tournament) => {
  if (isPast(tournament)) return { label: "Édition terminée", className: "closed" };
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

  useEffect(() => {
    localStorage.setItem("hoopscout-favorites", JSON.stringify(saved));
  }, [saved]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("fr");
    const result = tournaments.filter((tournament) => {
      const matchesCountry = country === "all" || tournament.country === country;
      const matchesAge = activeAges.length === 0 || activeAges.some((age) => tournament.ageGroups.includes(age));
      const matchesPeriod = period === "all" || (period === "past" ? isPast(tournament) : !isPast(tournament));
      const matchesAvailability = !availableOnly || (!isPast(tournament) && tournament.availability === "open");
      const matchesSaved = !savedOnly || saved.includes(tournament.id);
      const matchesSearch = !needle || [tournament.name, tournament.city, tournament.region, tournament.organizer, tournament.sourceLabel]
        .join(" ")
        .toLocaleLowerCase("fr")
        .includes(needle);
      return matchesCountry && matchesAge && matchesPeriod && matchesAvailability && matchesSaved && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name, "fr");
      return sortOrder === "date-desc" ? b.startDate.localeCompare(a.startDate) : a.startDate.localeCompare(b.startDate);
    });
  }, [activeAges, availableOnly, country, period, saved, savedOnly, search, sortOrder]);

  const upcomingCount = tournaments.filter((tournament) => !isPast(tournament)).length;

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
            <div className="eyebrow"><CircleCheck size={15} /> Données vérifiées</div>
            <h1>Trouve le tournoi<br /><em>qui fait vibrer</em><br />ton équipe.</h1>
            <p>Des tournois U11 à U14 réels et sourcés, collectés auprès des clubs, comités provinciaux et ligues régionales.</p>
            <div className="hero-stats" aria-label="Statistiques">
              <div><strong>{tournaments.length}</strong><span>tournois sourcés</span></div>
              <div><strong>{upcomingCount}</strong><span>à venir</span></div>
              <div><strong>4</strong><span>pays</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="court-board">
              <div className="court-lines"><span className="court-circle" /><span className="court-key" /></div>
              <div className="floating-card card-one"><span>🇧🇪</span><div><b>Bruxelles</b><small>13 sept. · U12/U14</small></div></div>
              <div className="floating-card card-two"><span>🇩🇪</span><div><b>Potsdam</b><small>29 août · U11–U14</small></div></div>
              <div className="big-ball"><span className="ball-line line-a" /><span className="ball-line line-b" /><span className="ball-line line-c" /></div>
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
                const status = getAvailability(tournament);
                return (
                  <article className={`tournament-card tone-${tournament.tone} ${isPast(tournament) ? "is-past" : ""}`} key={tournament.id}>
                    <div className="card-banner">
                      <span className="country-label">{tournament.flag} {tournament.countryLabel}</span>
                      {tournament.featured && <span className="featured-label"><Sparkles size={12} /> À la une</span>}
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
            <div className="coverage-stats">
              <span><strong>{sourceNetworks.length}</strong> réseaux officiels</span>
              <span><strong>5</strong> provinces AWBB</span>
              <span><strong>5</strong> comités HDF</span>
            </div>
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
          <p><strong>Sources contrôlées le {VERIFIED_AT}.</strong> Les disponibilités peuvent changer rapidement : confirme toujours auprès de l’organisateur avant déplacement ou paiement.</p>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-ball"><span /></span><span>HOOP<span>SCOUT</span></span></a>
        <p>Le basket des jeunes, sans frontières.</p>
        <span>{tournaments.length} fiches · mises à jour le {VERIFIED_AT}</span>
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
                <span className={`spots ${getAvailability(selected).className}`}><i /> {getAvailability(selected).label}</span>
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
              {selected.registrationUrl && !isPast(selected) && selected.availability !== "full" ? (
                <a className="primary-button wide" href={selected.registrationUrl} target="_blank" rel="noreferrer">
                  Ouvrir l’inscription <ExternalLink size={18} />
                </a>
              ) : null}
              <a className="source-button" href={selected.sourceUrl} target="_blank" rel="noreferrer">
                <Link2 size={17} /> Voir la source : {selected.sourceLabel} <ExternalLink size={15} />
              </a>
              <small className="demo-caption"><ShieldCheck size={13} /> Source vérifiée le {VERIFIED_AT}</small>
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
    </div>
  );
}

export default App;
