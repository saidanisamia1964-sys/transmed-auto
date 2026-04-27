import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Phone, Mail, MapPin, ChevronRight, ChevronLeft, X, Calendar, Gauge, Fuel,
  Settings, Award, Shield, Clock, ArrowRight, ArrowUpRight, Search, Menu,
  Check, Car, Cog, Palette, DoorOpen, Users, Sparkles, Wrench, HandCoins,
  ChevronDown, SlidersHorizontal, ArrowUpDown, MessageCircle, Facebook,
  Instagram, Send, Eye, Plus, Edit2, Trash2, LogOut, LayoutDashboard,
  Image as ImageIcon, FileText, Tag, UserCog, Save, Lock, Ship, FileCheck,
  Globe, TrendingUp
} from 'lucide-react';

/* ===============================================================
   DATA — INITIAL STATE (simule la base de données)
=============================================================== */

const INITIAL_DATA = {
  siteInfo: {
    name: 'TransMed Auto',
    tagline: 'Export France → Algérie',
    since: 1998,
    phone: '+33 1 48 31 24 17',
    phoneRaw: '+33148312417',
    phoneAlg: '+213 555 84 12 09',
    phoneAlgRaw: '+213555841209',
    whatsapp: '+33148312417',
    email: 'contact@transmed-auto.fr',
    address: '24 Avenue Henri Barbusse',
    zip: '93700 Drancy',
    country: 'France',
    facebook: 'https://facebook.com/transmedauto',
    instagram: 'https://instagram.com/transmedauto',
    visitors: 28457,
    hours: [
      { day: 'Lundi — Vendredi', time: '9h00 — 18h30' },
      { day: 'Samedi', time: '10h00 — 17h00' },
      { day: 'Dimanche', time: 'Sur RDV' },
    ]
  },

  sliders: [
    {
      id: 1, active: true,
      eyebrow: 'Export véhicules — France vers Algérie',
      title: "Votre voiture,\nde Marseille\nà Alger.",
      subtitle: 'Plus de 25 ans d\'expérience. Démarches douanières, expédition et livraison gérées de A à Z.',
      cta1: { label: 'Voir le catalogue', target: 'catalog' },
      cta2: { label: 'Nous appeler', target: 'phone' },
      image: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1600&q=80',
    },
    {
      id: 2, active: true,
      eyebrow: 'Coup de cœur de la semaine',
      title: "Peugeot 3008 GT\n2025 — Neuf.",
      subtitle: 'Direction, première main, prêt pour l\'export. Documents douane Algérie inclus.',
      cta1: { label: 'Voir le véhicule', target: 'vehicle-1' },
      cta2: { label: 'Demander un devis', target: 'contact' },
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1600&q=80',
    },
    {
      id: 3, active: true,
      eyebrow: 'Service complet',
      title: "Douane, fret,\nlivraison.",
      subtitle: 'Nous gérons toute la chaîne logistique : transit Marseille, dédouanement Alger / Oran / Annaba.',
      cta1: { label: 'Découvrir le service', target: 'about' },
      cta2: { label: 'WhatsApp', target: 'whatsapp' },
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&q=80',
    },
  ],

  vehicles: [
    { id: 1, brand: 'Peugeot', model: '3008', version: 'GT BlueHDi 130 EAT8', type: 'neuf', year: 2025, mileage: 12, fuel: 'Diesel', transmission: 'Automatique', power: 130, color: 'Gris Platinium', doors: 5, seats: 5, price: 4350000, priceEUR: 28900, bodyType: 'SUV', consumption: 5.2, emissions: 138, image: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1400&q=80', description: "Peugeot 3008 GT, véhicule neuf de direction, prêt pour l'export Algérie. Documents douane (carte grise barrée, certificat de cession, quitus fiscal) fournis. Livraison port d'Alger ou Oran sous 21 jours.", equipment: ['Toit panoramique', 'GPS connecté 10"', 'Caméra 360°', 'Sièges chauffants', 'Hayon mains libres', 'Jantes 19"', 'LED Matrix'], featured: true },
    { id: 2, brand: 'Renault', model: 'Captur', version: 'Techno TCe 140', type: 'neuf', year: 2025, mileage: 18, fuel: 'Essence', transmission: 'Manuelle', power: 140, color: 'Bleu Iron', doors: 5, seats: 5, price: 2980000, priceEUR: 19900, bodyType: 'SUV', consumption: 6.1, emissions: 138, image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1400&q=80', description: "Captur Techno neuf, configuration idéale Algérie : essence, boîte manuelle, équipement complet.", equipment: ['Écran OpenR Link 10,4"', 'Easy Park Assist', 'Caméra de recul', 'Climatisation auto', 'Jantes 18"'], featured: true },
    { id: 3, brand: 'Dacia', model: 'Sandero', version: 'Stepway Expression TCe 90', type: 'neuf', year: 2025, mileage: 5, fuel: 'Essence', transmission: 'Manuelle', power: 90, color: 'Beige Dune', doors: 5, seats: 5, price: 1890000, priceEUR: 12600, bodyType: 'Citadine', consumption: 5.4, emissions: 122, image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80', description: "Best-seller en Algérie. Sandero Stepway robuste, économique, pièces détachées disponibles partout.", equipment: ['Media Display 8"', 'Apple CarPlay', 'Régulateur', 'Climatisation', 'Barres de toit'], featured: true },
    { id: 4, brand: 'Citroën', model: 'C5 Aircross', version: 'Shine Hybrid 136', type: 'neuf', year: 2025, mileage: 22, fuel: 'Hybride', transmission: 'Automatique', power: 136, color: 'Gris Acier', doors: 5, seats: 5, price: 3950000, priceEUR: 26300, bodyType: 'SUV', consumption: 4.8, emissions: 109, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1400&q=80', description: "C5 Aircross hybride : confort de référence Citroën, motorisation hybride économique.", equipment: ['Suspensions Hydrauliques', 'Toit panoramique', 'Sièges Advanced Comfort', 'GPS 3D', 'Hayon électrique', 'Jantes 19"'], featured: false },
    { id: 5, brand: 'Peugeot', model: '208', version: 'Allure PureTech 100', type: 'neuf', year: 2025, mileage: 7, fuel: 'Essence', transmission: 'Manuelle', power: 100, color: 'Rouge Elixir', doors: 5, seats: 5, price: 2480000, priceEUR: 16500, bodyType: 'Citadine', consumption: 5.4, emissions: 122, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80', description: "208 Allure neuve, citadine premium très demandée en Algérie.", equipment: ['i-Cockpit 3D', 'Écran 10"', 'Mirror Screen', 'Jantes alu 16"', 'Climatisation auto'], featured: true },
    { id: 6, brand: 'Renault', model: 'Clio', version: 'E-Tech full hybrid 145', type: 'neuf', year: 2025, mileage: 14, fuel: 'Hybride', transmission: 'Automatique', power: 145, color: 'Bleu Alpine', doors: 5, seats: 5, price: 2780000, priceEUR: 18500, bodyType: 'Citadine', consumption: 4.1, emissions: 95, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400&q=80', description: "Clio hybride : économie de carburant exceptionnelle, idéale pour les longues distances en Algérie.", equipment: ['EasyLink 9,3"', 'Caméra de recul', 'Régulateur adaptatif', 'Jantes 17"'], featured: false },
    { id: 7, brand: 'Peugeot', model: '3008', version: 'Allure BlueHDi 130 EAT8', type: 'occasion', year: 2021, mileage: 45200, fuel: 'Diesel', transmission: 'Automatique', power: 130, color: 'Gris Artense', doors: 5, seats: 5, price: 2980000, priceEUR: 19900, bodyType: 'SUV', consumption: 5.0, emissions: 132, image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1400&q=80', description: "3008 Allure occasion 1ère main, suivi complet, distribution faite. Conforme normes import Algérie (moins de 3 ans).", equipment: ['GPS 3D', 'Caméra de recul', 'Jantes 18"', 'Régulateur adaptatif', 'Hayon électrique'], featured: false },
    { id: 8, brand: 'Renault', model: 'Megane', version: 'Estate Intens dCi 115', type: 'occasion', year: 2022, mileage: 38500, fuel: 'Diesel', transmission: 'Manuelle', power: 115, color: 'Blanc Nacré', doors: 5, seats: 5, price: 2380000, priceEUR: 15900, bodyType: 'Break', consumption: 4.6, emissions: 121, image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&q=80', description: "Megane Estate, break familial spacieux, conforme à la règle des 3 ans pour l'import Algérie.", equipment: ['GPS R-Link 2', 'Caméra de recul', 'Toit ouvrant', 'Jantes 17"'], featured: false },
    { id: 9, brand: 'Volkswagen', model: 'Golf 8', version: 'Life 1.5 TSI 130', type: 'occasion', year: 2023, mileage: 25100, fuel: 'Essence', transmission: 'Manuelle', power: 130, color: 'Gris Dolphin', doors: 5, seats: 5, price: 3250000, priceEUR: 21700, bodyType: 'Berline', consumption: 5.6, emissions: 127, image: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=1400&q=80', description: "Golf 8 Life, faible kilométrage, garantie constructeur en cours.", equipment: ['Discover Pro 10"', 'Digital Cockpit', 'Apple CarPlay', 'Park Assist', 'Jantes 17"'], featured: true },
    { id: 10, brand: 'Citroën', model: 'C3', version: 'Shine PureTech 110', type: 'occasion', year: 2023, mileage: 22300, fuel: 'Essence', transmission: 'Manuelle', power: 110, color: 'Blanc Banquise', doors: 5, seats: 5, price: 1750000, priceEUR: 11700, bodyType: 'Citadine', consumption: 5.5, emissions: 124, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80', description: "C3 Shine récente, citadine confortable, très bon état général.", equipment: ['Écran tactile 7"', 'Mirror Screen', 'Climatisation auto', 'Caméra de recul', 'Jantes 16"'], featured: false },
    { id: 11, brand: 'Dacia', model: 'Duster', version: 'Prestige TCe 150 4x4', type: 'occasion', year: 2023, mileage: 28400, fuel: 'Essence', transmission: 'Manuelle', power: 150, color: 'Noir Nacré', doors: 5, seats: 5, price: 2450000, priceEUR: 16400, bodyType: 'SUV', consumption: 6.4, emissions: 145, image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=1400&q=80', description: "Duster 4x4, idéal terrains algériens, robuste et économique à l'entretien.", equipment: ['Multimedia Nav 8"', 'Caméras 360°', 'Sièges chauffants', '4x4'], featured: true },
    { id: 12, brand: 'Audi', model: 'A3', version: 'Sportback S Line 35 TFSI 150', type: 'occasion', year: 2023, mileage: 31100, fuel: 'Essence', transmission: 'Automatique', power: 150, color: 'Gris Daytona', doors: 5, seats: 5, price: 4150000, priceEUR: 27700, bodyType: 'Berline', consumption: 5.8, emissions: 132, image: 'https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=1400&q=80', description: "A3 S Line, finition exclusive, prestation premium allemande.", equipment: ['Virtual Cockpit Plus', 'MMI Navigation', 'Pack S Line', 'Phares Matrix LED', 'Jantes 18"'], featured: false },
  ],

  articles: [
    { id: 1, category: 'Conseils Export', title: 'Importer une voiture en Algérie : la procédure complète 2025', excerpt: 'Quitus fiscal, certificat de conformité, dédouanement : tout ce qu\'il faut savoir pour importer son véhicule en toute légalité.', content: 'L\'import de véhicules en Algérie est encadré par plusieurs textes réglementaires...', image: 'https://images.unsplash.com/photo-1532009324734-20a7a5813719?w=1200&q=80', date: '15/04/2026', author: 'Karim Benkhedda', readTime: '8 min' },
    { id: 2, category: 'Nouveautés', title: 'Arrivage exceptionnel : 12 véhicules Peugeot et Renault 2025', excerpt: 'Notre stock vient d\'être complété avec 12 véhicules récents, parfaits pour l\'export. Découvrez la sélection.', content: 'Ce mois-ci, nous avons réceptionné un arrivage exceptionnel...', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80', date: '02/04/2026', author: 'Mehdi Larbi', readTime: '4 min' },
    { id: 3, category: 'Événements', title: 'Salon Auto Alger 2026 : nous y serons du 12 au 18 mai', excerpt: 'TransMed Auto sera présent au Palais des Expositions des Pins Maritimes. Stand B14, allée centrale.', content: 'Comme chaque année, nous participons au Salon Automobile d\'Alger...', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80', date: '20/03/2026', author: 'Karim Benkhedda', readTime: '3 min' },
    { id: 4, category: 'Conseils Export', title: 'Quels véhicules sont éligibles à l\'import en Algérie en 2026 ?', excerpt: 'Règle des 3 ans, critères techniques, normes Euro : panorama des véhicules importables actuellement.', content: 'La réglementation algérienne sur l\'importation de véhicules a évolué...', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80', date: '08/03/2026', author: 'Sofiane Belkacem', readTime: '6 min' },
    { id: 5, category: 'Actualités', title: 'Délais d\'expédition Marseille-Alger : ce qui change ce trimestre', excerpt: 'Réorganisation logistique CMA-CGM : nous expliquons les nouveaux délais et impacts pour nos clients.', content: 'Suite à la nouvelle organisation des lignes maritimes...', image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=1200&q=80', date: '28/02/2026', author: 'Mehdi Larbi', readTime: '5 min' },
  ],

  gallery: [
    { id: 1, src: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=900&q=80', caption: 'Peugeot 3008 GT — Showroom Drancy' },
    { id: 2, src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&q=80', caption: 'Arrivage Renault Captur' },
    { id: 3, src: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=900&q=80', caption: 'Port de Marseille — Embarquement' },
    { id: 4, src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80', caption: 'Renault Clio E-Tech' },
    { id: 5, src: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=900&q=80', caption: 'Duster 4x4 — Préparation export' },
    { id: 6, src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80', caption: 'Stock véhicules' },
    { id: 7, src: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=900&q=80', caption: 'Peugeot 3008 Allure' },
    { id: 8, src: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&q=80', caption: 'Renault Megane Estate' },
    { id: 9, src: 'https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=900&q=80', caption: 'Audi A3 S Line' },
    { id: 10, src: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=900&q=80', caption: 'Volkswagen Golf 8' },
    { id: 11, src: 'https://images.unsplash.com/photo-1532009324734-20a7a5813719?w=900&q=80', caption: 'Atelier de préparation' },
    { id: 12, src: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80', caption: 'Peugeot 208 Allure' },
  ],

  adminAccounts: [
    { id: 1, username: 'admin', email: 'admin@transmed-auto.fr', role: 'Super Admin', lastLogin: '27/04/2026 08:14' },
    { id: 2, username: 'karim', email: 'karim@transmed-auto.fr', role: 'Éditeur', lastLogin: '26/04/2026 17:42' },
  ],
};

const BODY_TYPES = ['Citadine', 'Berline', 'SUV', 'Break'];
const FUELS = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
const TRANSMISSIONS = ['Manuelle', 'Automatique'];
const ARTICLE_CATEGORIES = ['Actualités', 'Nouveautés', 'Conseils Export', 'Événements'];

/* ===============================================================
   UTILS
=============================================================== */

const fmtDA = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' DA';
const fmtEUR = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' €';
const fmtKm = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' km';

/* ===============================================================
   GLOBAL STYLES
=============================================================== */

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
    .font-display { font-family: 'Fraunces', 'Times New Roman', serif; font-feature-settings: "ss01", "ss02"; }
    .font-display-italic { font-family: 'Fraunces', serif; font-style: italic; font-feature-settings: "ss01"; }
    .font-body { font-family: 'Geist', system-ui, sans-serif; }
    .font-mono { font-family: 'Geist Mono', monospace; font-feature-settings: "tnum"; }
    body { font-family: 'Geist', system-ui, sans-serif; background-color: #15130F; }
    .bg-ink { background-color: #15130F; }
    .bg-ink-soft { background-color: #1F1B16; }
    .bg-ink-soft2 { background-color: #2A2419; }
    .bg-cream { background-color: #F0E8D5; }
    .bg-cream-soft { background-color: #E8DFC8; }
    .text-cream { color: #F0E8D5; }
    .text-cream-dim { color: #B8AC93; }
    .text-ink { color: #15130F; }
    .text-rust { color: #C8553D; }
    .bg-rust { background-color: #C8553D; }
    .bg-rust-dim { background-color: rgba(200,85,61,0.12); }
    .border-cream { border-color: #F0E8D5; }
    .border-cream-dim { border-color: #3A342B; }
    .border-rust { border-color: #C8553D; }
    .grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.94 0 0 0 0 0.91 0 0 0 0 0.83 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
    @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:translateY(0); } }
    .anim-fade-up { animation: fadeUp 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
    @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .anim-ticker { animation: ticker 40s linear infinite; }
    @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
    .anim-pulse-ring { animation: pulse-ring 1.8s ease-out infinite; }
    .hover-lift { transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1); }
    .hover-lift:hover { transform: translateY(-4px); }
    .img-fallback { background: linear-gradient(135deg, #2A2419 0%, #15130F 100%); }
    .vert-text { writing-mode: vertical-rl; transform: rotate(180deg); }
    a, button { transition: color 0.2s, background-color 0.2s, border-color 0.2s, transform 0.2s; }
    .scrollbar-thin::-webkit-scrollbar { width: 8px; height: 8px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: #1F1B16; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #3A342B; border-radius: 4px; }
  `}</style>
);

/* ===============================================================
   COMMON COMPONENTS
=============================================================== */

const SafeImg = ({ src, alt, className }) => (
  <div className={`relative img-fallback overflow-hidden ${className || ''}`}>
    <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover"
      onError={(e) => { e.target.style.display = 'none'; }} />
  </div>
);

const VehicleCard = ({ v, onClick }) => (
  <button onClick={onClick} className="group text-left bg-ink-soft hover-lift border border-cream-dim/40 hover:border-rust overflow-hidden flex flex-col">
    <div className="relative aspect-[4/3] overflow-hidden">
      <SafeImg src={v.image} alt={`${v.brand} ${v.model}`} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      <div className="absolute top-4 left-4 px-3 py-1 bg-cream text-ink font-mono text-xs uppercase tracking-wider">{v.type}</div>
      <div className="absolute top-4 right-4 px-3 py-1 bg-ink/80 text-cream font-mono text-xs">{v.year}</div>
      {v.featured && <div className="absolute bottom-4 left-4 px-3 py-1 bg-rust text-cream font-mono text-xs uppercase tracking-wider">★ Sélection</div>}
    </div>
    <div className="p-6 flex flex-col flex-1">
      <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-2">{v.brand}</div>
      <h3 className="font-display text-2xl text-cream leading-tight">{v.model}</h3>
      <div className="font-display-italic text-cream-dim text-sm mt-1 mb-5">{v.version}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs text-cream-dim mb-6">
        <div className="flex items-center gap-1.5"><Gauge size={12}/>{fmtKm(v.mileage)}</div>
        <div className="flex items-center gap-1.5"><Fuel size={12}/>{v.fuel}</div>
        <div className="flex items-center gap-1.5"><Cog size={12}/>{v.transmission}</div>
        <div className="flex items-center gap-1.5"><Car size={12}/>{v.bodyType}</div>
      </div>
      <div className="mt-auto flex items-end justify-between border-t border-cream-dim/30 pt-4">
        <div>
          <div className="font-mono text-xs text-cream-dim uppercase">Prix export</div>
          <div className="font-display text-2xl text-cream leading-none">{fmtDA(v.price)}</div>
          <div className="font-mono text-xs text-cream-dim mt-1">≈ {fmtEUR(v.priceEUR)}</div>
        </div>
        <div className="flex items-center gap-1 text-rust group-hover:translate-x-1 transition-transform">
          <span className="font-mono text-xs uppercase tracking-wider">Voir</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </div>
  </button>
);

/* ===============================================================
   PUBLIC HEADER & FOOTER
=============================================================== */

const Header = ({ page, navigate, siteInfo, openAdmin, visitors }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { id: 'home', label: 'Accueil' },
    { id: 'catalog', label: 'Catalogue' },
    { id: 'catalog-neuf', label: 'Neufs' },
    { id: 'catalog-occasion', label: 'Occasions' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'blog', label: 'Blog' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' },
  ];
  const isActive = (id) => page === id;

  return (
    <>
      {/* TOP STRIP */}
      <div className="bg-ink-soft border-b border-cream-dim/40 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-2 flex items-center justify-between font-mono text-xs text-cream-dim">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><MapPin size={12}/>{siteInfo.address}, {siteInfo.zip}</span>
            <span className="flex items-center gap-1.5"><Clock size={12}/>Lun-Ven 9h-18h30</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Eye size={12}/>{new Intl.NumberFormat('fr-FR').format(visitors)} visiteurs</span>
            <a href={siteInfo.facebook} className="hover:text-rust"><Facebook size={12}/></a>
            <a href={siteInfo.instagram} className="hover:text-rust"><Instagram size={12}/></a>
            <button onClick={openAdmin} className="hover:text-rust flex items-center gap-1"><Lock size={12}/>Admin</button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur border-b border-cream-dim">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between gap-8">
          <button onClick={() => navigate('home')} className="flex items-baseline gap-2 text-cream hover:text-rust">
            <span className="font-display text-2xl tracking-tight">{siteInfo.name}</span>
            <span className="font-display-italic text-cream-dim text-sm hidden sm:inline">— {siteInfo.tagline}</span>
          </button>
          <nav className="hidden xl:flex items-center gap-1 font-body text-sm">
            {links.map(l => (
              <button key={l.id} onClick={() => navigate(l.id)}
                className={`px-3 py-2 rounded-full ${isActive(l.id) ? 'bg-cream text-ink' : 'text-cream hover:text-rust'}`}>
                {l.label}
              </button>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${siteInfo.phoneRaw}`} className="flex items-center gap-2 px-4 py-2 border border-cream rounded-full text-cream hover:bg-cream hover:text-ink font-mono text-sm">
              <Phone size={14} />{siteInfo.phone}
            </a>
          </div>
          <button onClick={() => setOpen(!open)} className="xl:hidden text-cream">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {open && (
          <div className="xl:hidden border-t border-cream-dim bg-ink">
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map(l => (
                <button key={l.id} onClick={() => { navigate(l.id); setOpen(false); }}
                  className={`text-left px-4 py-3 rounded-md ${isActive(l.id) ? 'bg-cream text-ink' : 'text-cream'}`}>
                  {l.label}
                </button>
              ))}
              <a href={`tel:${siteInfo.phoneRaw}`} className="mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-rust text-cream rounded-md font-mono">
                <Phone size={16} /> {siteInfo.phone}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

const Footer = ({ navigate, siteInfo }) => (
  <footer className="bg-ink text-cream border-t border-cream-dim mt-32">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <h3 className="font-display text-4xl leading-none">
            {siteInfo.name}<br/>
            <span className="font-display-italic text-cream-dim text-3xl">depuis {siteInfo.since}.</span>
          </h3>
          <p className="mt-6 text-cream-dim max-w-md leading-relaxed">
            Spécialiste de l'export de véhicules neufs et d'occasion depuis la France vers l'Algérie. Démarches douanières, transit maritime et livraison gérés intégralement.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={siteInfo.facebook} className="w-10 h-10 border border-cream-dim flex items-center justify-center hover:bg-rust hover:border-rust"><Facebook size={16}/></a>
            <a href={siteInfo.instagram} className="w-10 h-10 border border-cream-dim flex items-center justify-center hover:bg-rust hover:border-rust"><Instagram size={16}/></a>
            <a href={`https://wa.me/${siteInfo.whatsapp.replace(/\D/g,'')}`} className="w-10 h-10 border border-cream-dim flex items-center justify-center hover:bg-rust hover:border-rust"><MessageCircle size={16}/></a>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-5">Navigation</div>
          <ul className="space-y-3 font-body text-sm">
            <li><button onClick={() => navigate('home')} className="hover:text-rust">Accueil</button></li>
            <li><button onClick={() => navigate('catalog')} className="hover:text-rust">Catalogue</button></li>
            <li><button onClick={() => navigate('catalog-neuf')} className="hover:text-rust">Neufs</button></li>
            <li><button onClick={() => navigate('catalog-occasion')} className="hover:text-rust">Occasions</button></li>
            <li><button onClick={() => navigate('gallery')} className="hover:text-rust">Galerie</button></li>
            <li><button onClick={() => navigate('blog')} className="hover:text-rust">Blog</button></li>
            <li><button onClick={() => navigate('about')} className="hover:text-rust">À propos</button></li>
            <li><button onClick={() => navigate('contact')} className="hover:text-rust">Contact</button></li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-5">Contact France</div>
          <ul className="space-y-3 font-body text-sm">
            <li className="flex gap-2"><Phone size={14} className="mt-1 shrink-0"/>{siteInfo.phone}</li>
            <li className="flex gap-2"><Mail size={14} className="mt-1 shrink-0"/>{siteInfo.email}</li>
            <li className="flex gap-2"><MapPin size={14} className="mt-1 shrink-0"/>{siteInfo.address}<br/>{siteInfo.zip}</li>
          </ul>
          <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3 mt-6">Bureau Algérie</div>
          <ul className="space-y-2 font-body text-sm">
            <li className="flex gap-2"><Phone size={14} className="mt-1 shrink-0"/>{siteInfo.phoneAlg}</li>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-5">Horaires</div>
          <ul className="space-y-2 font-body text-sm">
            {siteInfo.hours.map(h => (
              <li key={h.day} className="flex justify-between gap-4 border-b border-cream-dim/30 pb-2">
                <span>{h.day}</span><span className="font-mono text-cream-dim">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-cream-dim flex flex-col md:flex-row justify-between gap-4 text-xs font-mono text-cream-dim">
        <div>© {new Date().getFullYear()} {siteInfo.name} — Tous droits réservés</div>
        <div className="flex gap-6"><span>Mentions légales</span><span>RGPD</span><span>SIREN 384 217 564</span></div>
      </div>
    </div>
  </footer>
);

/* ===============================================================
   SLIDER (HERO CAROUSEL)
=============================================================== */

const HeroSlider = ({ slides, navigate, siteInfo, vehicles }) => {
  const active = slides.filter(s => s.active);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % active.length), 6000);
    return () => clearInterval(t);
  }, [paused, active.length]);

  const handleCta = (target) => {
    if (target === 'phone') window.location.href = `tel:${siteInfo.phoneRaw}`;
    else if (target === 'whatsapp') window.open(`https://wa.me/${siteInfo.whatsapp.replace(/\D/g,'')}`, '_blank');
    else if (target.startsWith('vehicle-')) {
      const v = vehicles.find(x => x.id === parseInt(target.split('-')[1]));
      if (v) navigate('detail', v);
    }
    else navigate(target);
  };

  if (!active.length) return null;
  const slide = active[idx];

  return (
    <section className="relative bg-ink overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="absolute left-0 top-0 bottom-0 w-12 hidden lg:flex items-center justify-center border-r border-cream-dim z-10">
        <div className="vert-text font-mono text-[10px] uppercase tracking-[0.4em] text-cream-dim">
          {siteInfo.name} — Drancy → Alger — depuis {siteInfo.since}
        </div>
      </div>

      <div className="relative h-[85vh] min-h-[600px] max-h-[800px]">
        {active.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <SafeImg src={s.image} alt="" className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
            <div className="absolute inset-0 grain opacity-30" />
          </div>
        ))}

        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-24 flex items-center">
          <div className="max-w-3xl anim-fade-up" key={slide.id}>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-8 flex items-center gap-3">
              <span className="w-12 h-px bg-rust"></span>{slide.eyebrow}
            </div>
            <h1 className="font-display text-cream text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.92] tracking-tight whitespace-pre-line">{slide.title}</h1>
            <p className="mt-8 max-w-xl text-cream-dim text-lg leading-relaxed">{slide.subtitle}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button onClick={() => handleCta(slide.cta1.target)} className="group flex items-center gap-3 bg-cream text-ink px-7 py-4 font-mono text-sm uppercase tracking-widest hover:bg-rust hover:text-cream">
                {slide.cta1.label}<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => handleCta(slide.cta2.target)} className="flex items-center gap-3 border border-cream text-cream px-7 py-4 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink">
                {slide.cta2.label}
              </button>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="absolute bottom-8 right-6 lg:right-12 flex items-center gap-4 z-10">
          <div className="font-mono text-xs text-cream-dim">
            <span className="text-cream">{String(idx + 1).padStart(2, '0')}</span> / {String(active.length).padStart(2, '0')}
          </div>
          <button onClick={() => setIdx((idx - 1 + active.length) % active.length)} className="w-10 h-10 border border-cream text-cream flex items-center justify-center hover:bg-cream hover:text-ink"><ChevronLeft size={16}/></button>
          <button onClick={() => setIdx((idx + 1) % active.length)} className="w-10 h-10 border border-cream text-cream flex items-center justify-center hover:bg-cream hover:text-ink"><ChevronRight size={16}/></button>
        </div>
        <div className="absolute bottom-8 left-6 lg:left-24 flex gap-2 z-10">
          {active.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`h-1 transition-all ${i === idx ? 'w-12 bg-rust' : 'w-6 bg-cream-dim/40 hover:bg-cream-dim'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===============================================================
   QUICK SEARCH (homepage)
=============================================================== */

const QuickSearch = ({ vehicles, navigate, setSearchPreset }) => {
  const [type, setType] = useState('all');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const brands = [...new Set(vehicles.map(v => v.brand))].sort();

  const submit = () => {
    setSearchPreset({ type, brands: brand ? [brand] : [], maxPrice: maxPrice ? parseInt(maxPrice) : null });
    navigate('catalog');
  };

  return (
    <section className="bg-cream text-ink py-12 -mt-16 relative z-30 mx-6 lg:mx-12 max-w-[1400px] xl:mx-auto shadow-2xl">
      <div className="px-8 lg:px-12">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-6">— Recherche rapide</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink/60 block mb-2">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-transparent border-b-2 border-ink/40 focus:border-rust py-2 outline-none font-display text-xl cursor-pointer">
              <option value="all">Tous</option>
              <option value="neuf">Neuf</option>
              <option value="occasion">Occasion</option>
            </select>
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink/60 block mb-2">Marque</label>
            <select value={brand} onChange={e => setBrand(e.target.value)} className="w-full bg-transparent border-b-2 border-ink/40 focus:border-rust py-2 outline-none font-display text-xl cursor-pointer">
              <option value="">Toutes les marques</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink/60 block mb-2">Budget max (DA)</label>
            <input type="number" placeholder="ex. 3 000 000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-transparent border-b-2 border-ink/40 focus:border-rust py-2 outline-none font-display text-xl placeholder:text-ink/30"/>
          </div>
          <button onClick={submit} className="bg-ink text-cream py-4 px-6 font-mono text-sm uppercase tracking-widest hover:bg-rust flex items-center justify-center gap-3">
            <Search size={16}/>Rechercher
          </button>
        </div>
      </div>
    </section>
  );
};

/* ===============================================================
   PAGE — HOME
=============================================================== */

const HomePage = ({ data, navigate, openVehicle, setSearchPreset }) => {
  const featured = data.vehicles.filter(v => v.featured).slice(0, 4);
  const recentArticles = data.articles.slice(0, 3);

  return (
    <main>
      <HeroSlider slides={data.sliders} navigate={navigate} siteInfo={data.siteInfo} vehicles={data.vehicles} />
      <QuickSearch vehicles={data.vehicles} navigate={navigate} setSearchPreset={setSearchPreset} />

      {/* TICKER */}
      <section className="bg-cream text-ink py-5 overflow-hidden border-y border-ink/20 mt-16">
        <div className="flex anim-ticker whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 pr-12 font-display-italic text-2xl">
              <span>Démarches douanières incluses</span><span className="text-rust">✦</span>
              <span>Livraison Alger / Oran / Annaba</span><span className="text-rust">✦</span>
              <span>Quitus fiscal fourni</span><span className="text-rust">✦</span>
              <span>Transit maritime sécurisé</span><span className="text-rust">✦</span>
              <span>+25 ans d'expérience</span><span className="text-rust">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="bg-ink py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-cream-dim/40">
            {[
              { v: '27', s: 'années', l: 'd\'expertise export' },
              { v: '4 800+', s: 'véhicules', l: 'livrés en Algérie' },
              { v: '21', s: 'jours', l: 'délai moyen Marseille → Alger' },
              { v: '4.8', s: '/5 ★', l: '512 avis clients' },
            ].map((s, i) => (
              <div key={i} className="bg-ink p-10">
                <div className="font-display text-cream text-6xl lg:text-7xl">{s.v}<span className="text-rust font-display-italic text-3xl"> {s.s}</span></div>
                <div className="mt-3 font-mono text-xs uppercase tracking-widest text-cream-dim">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="bg-ink pb-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-4">— Sélection</div>
              <h2 className="font-display text-cream text-5xl lg:text-7xl leading-none">
                Coups de cœur<br/><span className="font-display-italic text-cream-dim">prêts à l'export.</span>
              </h2>
            </div>
            <button onClick={() => navigate('catalog')} className="flex items-center gap-2 text-cream hover:text-rust font-mono text-sm uppercase tracking-widest">
              Tout le catalogue <ArrowRight size={14}/>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(v => <VehicleCard key={v.id} v={v} onClick={() => openVehicle(v)} />)}
          </div>
        </div>
      </section>

      {/* PROCESS EXPORT */}
      <section className="bg-cream text-ink py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-6">— Notre service</div>
              <h2 className="font-display text-6xl leading-none">
                4 étapes,<br/><span className="font-display-italic">zéro souci.</span>
              </h2>
              <p className="mt-6 text-ink/70 max-w-md leading-relaxed">
                Vous choisissez le véhicule, nous gérons tout le reste : papiers, transport, dédouanement, livraison.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
              {[
                { n: '01', icon: Car, t: 'Sélection véhicule', d: 'Vous choisissez parmi notre catalogue ou nous demandez un véhicule spécifique. Devis fourni sous 24h.' },
                { n: '02', icon: FileCheck, t: 'Documents douane', d: 'Carte grise barrée, certificat de cession, quitus fiscal, certificat de conformité — nous préparons tout.' },
                { n: '03', icon: Ship, t: 'Transit maritime', d: 'Embarquement à Marseille, transit RoRo sécurisé, suivi temps réel jusqu\'au port d\'arrivée.' },
                { n: '04', icon: HandCoins, t: 'Livraison & remise', d: 'Dédouanement à Alger, Oran ou Annaba. Remise des clés sur place ou livraison à votre adresse.' },
              ].map((s, i) => (
                <div key={i} className="border-t-2 border-ink pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-rust text-sm">{s.n}</span>
                    <s.icon size={24} strokeWidth={1.5}/>
                  </div>
                  <h4 className="font-display text-2xl mb-2">{s.t}</h4>
                  <p className="text-ink/70 leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-ink py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-cream-dim/40">
            <button onClick={() => navigate('catalog-neuf')} className="bg-ink-soft group p-12 lg:p-16 text-left hover-lift">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-6">— 01</div>
              <h3 className="font-display text-cream text-5xl lg:text-6xl leading-none">Véhicules<br/><span className="font-display-italic text-cream-dim">neufs.</span></h3>
              <p className="mt-6 max-w-md text-cream-dim">Modèles 2024-2025, kilométrage zéro ou direction, garantie constructeur.</p>
              <div className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-cream group-hover:text-rust">
                {data.vehicles.filter(v => v.type === 'neuf').length} véhicules <ArrowRight size={14}/>
              </div>
            </button>
            <button onClick={() => navigate('catalog-occasion')} className="bg-ink-soft group p-12 lg:p-16 text-left hover-lift">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-6">— 02</div>
              <h3 className="font-display text-cream text-5xl lg:text-6xl leading-none">Véhicules<br/><span className="font-display-italic text-cream-dim">d'occasion.</span></h3>
              <p className="mt-6 max-w-md text-cream-dim">Conformes import Algérie (moins de 3 ans), contrôle 120 points.</p>
              <div className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-cream group-hover:text-rust">
                {data.vehicles.filter(v => v.type === 'occasion').length} véhicules <ArrowRight size={14}/>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* BLOG TEASER */}
      <section className="bg-ink py-24 border-t border-cream-dim">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-4">— Actualités & conseils</div>
              <h2 className="font-display text-cream text-5xl lg:text-7xl leading-none">Blog<br/><span className="font-display-italic text-cream-dim">& événements.</span></h2>
            </div>
            <button onClick={() => navigate('blog')} className="flex items-center gap-2 text-cream hover:text-rust font-mono text-sm uppercase tracking-widest">
              Tous les articles <ArrowRight size={14}/>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map(a => (
              <button key={a.id} onClick={() => navigate('article', a)} className="text-left group hover-lift bg-ink-soft border border-cream-dim/40 hover:border-rust overflow-hidden">
                <SafeImg src={a.image} alt={a.title} className="aspect-[16/10]" />
                <div className="p-6">
                  <div className="font-mono text-xs uppercase tracking-widest text-rust mb-3">{a.category}</div>
                  <h3 className="font-display text-2xl text-cream leading-tight mb-3">{a.title}</h3>
                  <p className="text-cream-dim text-sm leading-relaxed mb-4">{a.excerpt}</p>
                  <div className="flex items-center justify-between font-mono text-xs text-cream-dim border-t border-cream-dim/30 pt-3">
                    <span>{a.date}</span><span>{a.readTime}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-cream text-ink">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-6">— Parlons projet</div>
            <h2 className="font-display text-6xl lg:text-7xl leading-none">Une question ?<br/><span className="font-display-italic">Décrochez.</span></h2>
            <p className="mt-6 text-ink/70 max-w-md leading-relaxed">Téléphone ou WhatsApp, nous parlons français et arabe. Réponse immédiate du lundi au samedi.</p>
          </div>
          <div className="lg:text-right">
            <a href={`tel:${data.siteInfo.phoneRaw}`} className="font-display text-5xl lg:text-7xl block text-ink hover:text-rust">{data.siteInfo.phone}</a>
            <a href={`https://wa.me/${data.siteInfo.whatsapp.replace(/\D/g,'')}`} className="mt-6 inline-flex items-center gap-2 border-b-2 border-ink hover:border-rust hover:text-rust pb-1 font-mono text-sm uppercase tracking-widest">
              <MessageCircle size={14}/>WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

/* ===============================================================
   PAGE — CATALOG (avec recherche avancée)
=============================================================== */

const CatalogPage = ({ data, filterType, openVehicle, navigate, searchPreset, clearPreset }) => {
  const initial = {
    type: filterType || 'all', search: '', brands: [], bodyTypes: [],
    fuels: [], transmissions: [], minPrice: 0, maxPrice: 5000000,
    minYear: 2018, maxKm: 100000,
  };
  const [filters, setFilters] = useState(initial);
  const [sort, setSort] = useState('default');
  const [openMobileFilters, setOpenMobileFilters] = useState(false);

  useEffect(() => {
    setFilters(f => ({ ...f, type: filterType || 'all' }));
  }, [filterType]);

  useEffect(() => {
    if (searchPreset) {
      setFilters(f => ({
        ...f,
        type: searchPreset.type || 'all',
        brands: searchPreset.brands || [],
        maxPrice: searchPreset.maxPrice || 5000000,
      }));
      clearPreset();
    }
  }, [searchPreset, clearPreset]);

  const brands = [...new Set(data.vehicles.map(v => v.brand))].sort();
  const toggle = (key, val) => setFilters(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val] }));

  const filtered = useMemo(() => {
    let out = data.vehicles.filter(v => {
      if (filters.type !== 'all' && v.type !== filters.type) return false;
      if (filters.search && !`${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.brands.length && !filters.brands.includes(v.brand)) return false;
      if (filters.bodyTypes.length && !filters.bodyTypes.includes(v.bodyType)) return false;
      if (filters.fuels.length && !filters.fuels.includes(v.fuel)) return false;
      if (filters.transmissions.length && !filters.transmissions.includes(v.transmission)) return false;
      if (v.price < filters.minPrice || v.price > filters.maxPrice) return false;
      if (v.year < filters.minYear) return false;
      if (v.mileage > filters.maxKm) return false;
      return true;
    });
    if (sort === 'price-asc') out = [...out].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') out = [...out].sort((a, b) => b.price - a.price);
    else if (sort === 'year-desc') out = [...out].sort((a, b) => b.year - a.year);
    else if (sort === 'km-asc') out = [...out].sort((a, b) => a.mileage - b.mileage);
    return out;
  }, [filters, sort, data.vehicles]);

  const reset = () => setFilters(initial);
  const activeCount = filters.brands.length + filters.bodyTypes.length + filters.fuels.length + filters.transmissions.length + (filters.type !== 'all' ? 1 : 0) + (filters.search ? 1 : 0);

  const Panel = () => (
    <div className="space-y-8 font-body">
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Recherche</h4>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim" />
          <input value={filters.search} onChange={e => setFilters(f => ({...f, search: e.target.value}))} placeholder="Marque, modèle..."
            className="w-full bg-ink-soft border border-cream-dim text-cream pl-9 pr-3 py-2 text-sm focus:border-rust outline-none"/>
        </div>
      </div>
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Type</h4>
        <div className="flex gap-2">
          {[{v:'all',l:'Tous'},{v:'neuf',l:'Neuf'},{v:'occasion',l:'Occasion'}].map(o => (
            <button key={o.v} onClick={() => setFilters(f => ({...f, type: o.v}))}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border ${filters.type === o.v ? 'bg-cream text-ink border-cream' : 'border-cream-dim text-cream hover:border-rust'}`}>
              {o.l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Marque</h4>
        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <button key={b} onClick={() => toggle('brands', b)}
              className={`px-3 py-1.5 text-xs border ${filters.brands.includes(b) ? 'bg-cream text-ink border-cream' : 'border-cream-dim text-cream hover:border-rust'}`}>{b}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Carrosserie</h4>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map(b => (
            <button key={b} onClick={() => toggle('bodyTypes', b)}
              className={`px-3 py-1.5 text-xs border ${filters.bodyTypes.includes(b) ? 'bg-cream text-ink border-cream' : 'border-cream-dim text-cream hover:border-rust'}`}>{b}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Carburant</h4>
        <div className="flex flex-wrap gap-2">
          {FUELS.map(b => (
            <button key={b} onClick={() => toggle('fuels', b)}
              className={`px-3 py-1.5 text-xs border ${filters.fuels.includes(b) ? 'bg-cream text-ink border-cream' : 'border-cream-dim text-cream hover:border-rust'}`}>{b}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Boîte</h4>
        <div className="flex flex-wrap gap-2">
          {TRANSMISSIONS.map(b => (
            <button key={b} onClick={() => toggle('transmissions', b)}
              className={`px-3 py-1.5 text-xs border ${filters.transmissions.includes(b) ? 'bg-cream text-ink border-cream' : 'border-cream-dim text-cream hover:border-rust'}`}>{b}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Budget max — <span className="text-rust">{fmtDA(filters.maxPrice)}</span></h4>
        <input type="range" min="1000000" max="5000000" step="100000" value={filters.maxPrice} onChange={e => setFilters(f => ({...f, maxPrice: parseInt(e.target.value)}))} className="w-full accent-rust"/>
      </div>
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Année min. — <span className="text-rust">{filters.minYear}</span></h4>
        <input type="range" min="2018" max="2025" step="1" value={filters.minYear} onChange={e => setFilters(f => ({...f, minYear: parseInt(e.target.value)}))} className="w-full accent-rust"/>
      </div>
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Kilométrage max. — <span className="text-rust">{fmtKm(filters.maxKm)}</span></h4>
        <input type="range" min="0" max="100000" step="1000" value={filters.maxKm} onChange={e => setFilters(f => ({...f, maxKm: parseInt(e.target.value)}))} className="w-full accent-rust"/>
      </div>
      <button onClick={reset} className="w-full px-4 py-3 border border-cream-dim text-cream-dim hover:border-rust hover:text-rust font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2">
        <X size={14}/>Réinitialiser
      </button>
    </div>
  );

  const titleMap = {
    'all': { eyebrow: '— Catalogue', title: 'Tous les', italic: 'véhicules.' },
    'neuf': { eyebrow: '— Neufs', title: 'Véhicules', italic: 'neufs.' },
    'occasion': { eyebrow: '— Occasions', title: 'Véhicules', italic: "d'occasion." }
  };
  const t = titleMap[filters.type];

  return (
    <main className="bg-ink min-h-screen">
      <section className="border-b border-cream-dim">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <button onClick={() => navigate('home')} className="font-mono text-xs uppercase tracking-widest text-cream-dim hover:text-rust mb-6 flex items-center gap-2">
            <ChevronLeft size={14}/>Accueil
          </button>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-6">{t.eyebrow}</div>
          <h1 className="font-display text-cream text-6xl lg:text-8xl leading-none">{t.title} <span className="font-display-italic text-cream-dim">{t.italic}</span></h1>
          <p className="mt-6 text-cream-dim font-mono text-sm">
            {filtered.length} véhicule{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}{activeCount > 0 && ` · ${activeCount} filtre${activeCount > 1 ? 's' : ''} actif${activeCount > 1 ? 's' : ''}`}
          </p>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-cream-dim">
                <h3 className="font-display text-2xl text-cream">Filtres</h3>
                {activeCount > 0 && <span className="bg-rust text-cream font-mono text-xs px-2 py-0.5">{activeCount}</span>}
              </div>
              <Panel />
            </div>
          </aside>

          <div className="lg:hidden flex items-center justify-between mb-2">
            <button onClick={() => setOpenMobileFilters(true)} className="flex items-center gap-2 px-4 py-2 border border-cream text-cream font-mono text-xs uppercase tracking-widest">
              <SlidersHorizontal size={14}/>Filtres {activeCount > 0 && `(${activeCount})`}
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} className="bg-ink border border-cream text-cream font-mono text-xs px-3 py-2">
              <option value="default">Tri</option>
              <option value="price-asc">Prix ↑</option>
              <option value="price-desc">Prix ↓</option>
              <option value="year-desc">Année récente</option>
              <option value="km-asc">Km ↑</option>
            </select>
          </div>

          {openMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-ink overflow-y-auto">
              <div className="sticky top-0 bg-ink border-b border-cream-dim px-6 py-4 flex justify-between items-center">
                <h3 className="font-display text-2xl text-cream">Filtres</h3>
                <button onClick={() => setOpenMobileFilters(false)} className="text-cream"><X size={24}/></button>
              </div>
              <div className="p-6">
                <Panel />
                <button onClick={() => setOpenMobileFilters(false)} className="w-full mt-8 bg-rust text-cream py-4 font-mono text-sm uppercase tracking-widest">
                  Voir {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}

          <div className="lg:col-span-9">
            <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-cream-dim">
              <div className="font-mono text-sm text-cream-dim">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</div>
              <div className="flex items-center gap-3">
                <ArrowUpDown size={14} className="text-cream-dim"/>
                <select value={sort} onChange={e => setSort(e.target.value)} className="bg-ink border-b border-cream text-cream font-mono text-xs uppercase tracking-widest pb-1 cursor-pointer">
                  <option value="default">Pertinence</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="year-desc">Année récente</option>
                  <option value="km-asc">Km croissant</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 border border-cream-dim/30">
                <Search size={48} className="mx-auto text-cream-dim mb-6" strokeWidth={1}/>
                <h3 className="font-display text-3xl text-cream mb-3">Aucun véhicule ne correspond</h3>
                <p className="text-cream-dim mb-8">Élargissez vos critères ou réinitialisez.</p>
                <button onClick={reset} className="px-6 py-3 bg-cream text-ink font-mono text-xs uppercase tracking-widest hover:bg-rust hover:text-cream">Réinitialiser</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(v => <VehicleCard key={v.id} v={v} onClick={() => openVehicle(v)} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

/* ===============================================================
   PAGE — VEHICLE DETAIL
=============================================================== */

const VehicleDetailPage = ({ vehicle, data, navigate, openVehicle }) => {
  if (!vehicle) {
    return (
      <main className="bg-ink min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-cream-dim mb-6">Aucun véhicule sélectionné.</p>
          <button onClick={() => navigate('catalog')} className="px-6 py-3 bg-cream text-ink font-mono text-xs uppercase tracking-widest">Voir le catalogue</button>
        </div>
      </main>
    );
  }
  const similar = data.vehicles.filter(v => v.id !== vehicle.id && (v.bodyType === vehicle.bodyType || v.brand === vehicle.brand)).slice(0, 3);
  const specs = [
    { icon: Calendar, l: 'Année', v: vehicle.year }, { icon: Gauge, l: 'Kilométrage', v: fmtKm(vehicle.mileage) },
    { icon: Fuel, l: 'Carburant', v: vehicle.fuel }, { icon: Cog, l: 'Boîte', v: vehicle.transmission },
    { icon: Sparkles, l: 'Puissance', v: `${vehicle.power} ch` }, { icon: Car, l: 'Carrosserie', v: vehicle.bodyType },
    { icon: Palette, l: 'Couleur', v: vehicle.color }, { icon: DoorOpen, l: 'Portes', v: vehicle.doors },
    { icon: Users, l: 'Places', v: vehicle.seats }, { icon: Fuel, l: 'Conso. mixte', v: `${vehicle.consumption} L/100` },
    { icon: Sparkles, l: 'CO₂', v: `${vehicle.emissions} g/km` },
  ];

  return (
    <main className="bg-ink min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 pb-20">
        <nav className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-8 flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate('home')} className="hover:text-rust">Accueil</button>
          <ChevronRight size={12}/>
          <button onClick={() => navigate(vehicle.type === 'neuf' ? 'catalog-neuf' : 'catalog-occasion')} className="hover:text-rust">{vehicle.type === 'neuf' ? 'Neufs' : 'Occasions'}</button>
          <ChevronRight size={12}/><span className="text-cream">{vehicle.brand} {vehicle.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <SafeImg src={vehicle.image} alt="" className="aspect-[4/3] mb-3" />
            <div className="grid grid-cols-3 gap-3">
              {[vehicle.image, vehicle.image, vehicle.image].map((src, i) => (
                <SafeImg key={i} src={src} alt="" className={`aspect-[4/3] cursor-pointer ${i === 0 ? 'ring-2 ring-rust' : ''}`} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-cream text-ink font-mono text-xs uppercase tracking-wider">{vehicle.type}</span>
                <span className="px-3 py-1 border border-cream-dim text-cream font-mono text-xs">{vehicle.year}</span>
                {vehicle.featured && <span className="px-3 py-1 bg-rust text-cream font-mono text-xs uppercase tracking-wider">★ Sélection</span>}
              </div>
              <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-2">{vehicle.brand}</div>
              <h1 className="font-display text-cream text-5xl lg:text-6xl leading-none">{vehicle.model}</h1>
              <div className="font-display-italic text-cream-dim text-2xl mt-2">{vehicle.version}</div>

              <div className="my-8 py-6 border-y border-cream-dim">
                <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-1">Prix export Algérie</div>
                <div className="font-display text-cream text-5xl">{fmtDA(vehicle.price)}</div>
                <div className="font-mono text-sm text-cream-dim mt-1">≈ {fmtEUR(vehicle.priceEUR)} (cours indicatif)</div>
                <div className="font-mono text-xs text-cream-dim mt-3">Frais de douane et transport inclus · Livraison Alger / Oran / Annaba</div>
              </div>

              <div className="space-y-3">
                <a href={`tel:${data.siteInfo.phoneRaw}`} className="flex items-center justify-center gap-3 bg-rust text-cream w-full py-5 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink">
                  <Phone size={18}/>Appeler — {data.siteInfo.phone}
                </a>
                <a href={`https://wa.me/${data.siteInfo.whatsapp.replace(/\D/g,'')}?text=Bonjour, je suis intéressé par le ${vehicle.brand} ${vehicle.model} ${vehicle.version}`} className="flex items-center justify-center gap-3 bg-[#25D366] text-cream w-full py-5 font-mono text-sm uppercase tracking-widest hover:opacity-90">
                  <MessageCircle size={18}/>WhatsApp — Demande directe
                </a>
                <button onClick={() => navigate('contact', vehicle)} className="flex items-center justify-center gap-3 border border-cream text-cream w-full py-5 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink">
                  <Mail size={18}/>Demande par formulaire
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-cream-dim font-mono text-xs">
                <div className="flex items-center gap-2"><FileCheck size={14} className="text-rust"/>Documents douane</div>
                <div className="flex items-center gap-2"><Ship size={14} className="text-rust"/>Transit Marseille-Alger</div>
                <div className="flex items-center gap-2"><Shield size={14} className="text-rust"/>Garantie incluse</div>
                <div className="flex items-center gap-2"><HandCoins size={14} className="text-rust"/>Paiement échelonné</div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-4">— Caractéristiques</div>
          <h2 className="font-display text-cream text-5xl mb-12">Fiche technique</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-cream-dim/40">
            {specs.map((s, i) => (
              <div key={i} className="bg-ink p-6">
                <s.icon className="text-rust mb-3" size={18} strokeWidth={1.5}/>
                <div className="font-mono text-xs uppercase tracking-widest text-cream-dim">{s.l}</div>
                <div className="font-display text-2xl text-cream mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-4">— Description</div>
            <h2 className="font-display text-cream text-5xl leading-none">L'avis<br/><span className="font-display-italic">de l'expert.</span></h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-cream text-xl leading-relaxed font-display-italic">{vehicle.description}</p>
            <div className="mt-12">
              <h3 className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-6">Équipements & options</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vehicle.equipment.map((e, i) => (
                  <li key={i} className="flex items-start gap-3 text-cream border-b border-cream-dim/30 pb-3">
                    <Check size={16} className="text-rust mt-1 shrink-0"/><span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {similar.length > 0 && (
          <section className="mt-24">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-4">— À voir aussi</div>
                <h2 className="font-display text-cream text-5xl leading-none">Véhicules <span className="font-display-italic">similaires.</span></h2>
              </div>
              <button onClick={() => navigate('catalog')} className="flex items-center gap-2 text-cream hover:text-rust font-mono text-sm uppercase tracking-widest">Tout le catalogue <ArrowRight size={14}/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similar.map(v => <VehicleCard key={v.id} v={v} onClick={() => openVehicle(v)} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

/* ===============================================================
   PAGE — BLOG LIST + ARTICLE DETAIL
=============================================================== */

const BlogPage = ({ data, navigate }) => {
  const [cat, setCat] = useState('all');
  const filtered = cat === 'all' ? data.articles : data.articles.filter(a => a.category === cat);

  return (
    <main className="bg-ink min-h-screen">
      <section className="border-b border-cream-dim">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <button onClick={() => navigate('home')} className="font-mono text-xs uppercase tracking-widest text-cream-dim hover:text-rust mb-6 flex items-center gap-2"><ChevronLeft size={14}/>Accueil</button>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-6">— Blog</div>
          <h1 className="font-display text-cream text-6xl lg:text-8xl leading-none">Actualités<br/><span className="font-display-italic text-cream-dim">& conseils.</span></h1>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-cream-dim">
          <button onClick={() => setCat('all')} className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border ${cat === 'all' ? 'bg-cream text-ink border-cream' : 'border-cream-dim text-cream hover:border-rust'}`}>Tous</button>
          {ARTICLE_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border ${cat === c ? 'bg-cream text-ink border-cream' : 'border-cream-dim text-cream hover:border-rust'}`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(a => (
            <button key={a.id} onClick={() => navigate('article', a)} className="text-left group hover-lift bg-ink-soft border border-cream-dim/40 hover:border-rust overflow-hidden">
              <SafeImg src={a.image} alt={a.title} className="aspect-[16/10]" />
              <div className="p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-rust mb-3">{a.category}</div>
                <h3 className="font-display text-2xl text-cream leading-tight mb-3">{a.title}</h3>
                <p className="text-cream-dim text-sm leading-relaxed mb-4">{a.excerpt}</p>
                <div className="flex items-center justify-between font-mono text-xs text-cream-dim border-t border-cream-dim/30 pt-3">
                  <span>{a.date} · {a.author}</span><span>{a.readTime}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

const ArticlePage = ({ article, data, navigate }) => {
  if (!article) return null;
  const others = data.articles.filter(a => a.id !== article.id).slice(0, 2);
  return (
    <main className="bg-ink min-h-screen">
      <article className="max-w-3xl mx-auto px-6 lg:px-12 pt-12 pb-20">
        <button onClick={() => navigate('blog')} className="font-mono text-xs uppercase tracking-widest text-cream-dim hover:text-rust mb-8 flex items-center gap-2"><ChevronLeft size={14}/>Retour au blog</button>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-6">— {article.category}</div>
        <h1 className="font-display text-cream text-4xl md:text-6xl leading-tight mb-6">{article.title}</h1>
        <div className="flex items-center gap-4 font-mono text-xs text-cream-dim mb-12 pb-8 border-b border-cream-dim">
          <span>{article.date}</span><span>·</span><span>{article.author}</span><span>·</span><span>{article.readTime} de lecture</span>
        </div>
        <SafeImg src={article.image} alt={article.title} className="aspect-[16/9] mb-12" />
        <div className="text-cream text-lg leading-relaxed space-y-6 font-body">
          <p className="font-display-italic text-2xl text-cream-dim">{article.excerpt}</p>
          <p>{article.content}</p>
          <p className="text-cream-dim">L'équipe TransMed Auto vous accompagne à chaque étape : sélection du véhicule, préparation des documents, transit maritime, dédouanement et livraison. Plus de 4 800 véhicules exportés en 27 ans d'expertise.</p>
          <p className="text-cream-dim">Pour toute question concernant l'export de votre véhicule, n'hésitez pas à nous contacter par téléphone, WhatsApp ou via notre formulaire de contact. Notre équipe parle français et arabe.</p>
        </div>
      </article>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
        <h3 className="font-display text-cream text-4xl mb-8">À lire aussi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {others.map(a => (
            <button key={a.id} onClick={() => navigate('article', a)} className="text-left group hover-lift bg-ink-soft border border-cream-dim/40 hover:border-rust overflow-hidden">
              <SafeImg src={a.image} alt="" className="aspect-[16/10]" />
              <div className="p-6">
                <div className="font-mono text-xs uppercase tracking-widest text-rust mb-3">{a.category}</div>
                <h3 className="font-display text-2xl text-cream leading-tight">{a.title}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

/* ===============================================================
   PAGE — GALLERY
=============================================================== */

const GalleryPage = ({ data, navigate }) => {
  const [lightbox, setLightbox] = useState(null);
  return (
    <main className="bg-ink min-h-screen">
      <section className="border-b border-cream-dim">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <button onClick={() => navigate('home')} className="font-mono text-xs uppercase tracking-widest text-cream-dim hover:text-rust mb-6 flex items-center gap-2"><ChevronLeft size={14}/>Accueil</button>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-6">— Galerie</div>
          <h1 className="font-display text-cream text-6xl lg:text-8xl leading-none">Notre<br/><span className="font-display-italic text-cream-dim">univers.</span></h1>
        </div>
      </section>
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.gallery.map(g => (
            <button key={g.id} onClick={() => setLightbox(g)} className="group relative aspect-square overflow-hidden bg-ink-soft hover-lift">
              <SafeImg src={g.src} alt={g.caption} className="w-full h-full" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-all flex items-end p-4">
                <span className="text-cream font-mono text-xs opacity-0 group-hover:opacity-100">{g.caption}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 bg-ink/95 z-50 flex items-center justify-center p-6 cursor-pointer">
          <button className="absolute top-6 right-6 text-cream"><X size={28}/></button>
          <div className="max-w-5xl w-full">
            <SafeImg src={lightbox.src} alt="" className="aspect-[16/10] max-h-[80vh]" />
            <div className="text-center text-cream font-display-italic text-xl mt-4">{lightbox.caption}</div>
          </div>
        </div>
      )}
    </main>
  );
};

/* ===============================================================
   PAGE — ABOUT
=============================================================== */

const AboutPage = ({ data, navigate }) => (
  <main className="bg-ink min-h-screen">
    <section className="border-b border-cream-dim">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-8">— À propos</div>
        <h1 className="font-display text-cream text-6xl lg:text-9xl leading-[0.9]">
          27 ans à faire<br/>traverser<br/><span className="font-display-italic text-cream-dim">la Méditerranée.</span>
        </h1>
      </div>
    </section>

    <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="font-display text-rust text-9xl leading-none">{data.siteInfo.since}</div>
          <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mt-4">Année de fondation</div>
        </div>
        <div className="lg:col-span-8 space-y-6 text-cream text-lg leading-relaxed">
          <p><span className="font-display-italic text-3xl text-rust">«</span> Nous avons commencé en 1998 avec une seule conviction : la diaspora algérienne en France méritait un service d'export simple, transparent et fiable.<span className="font-display-italic text-3xl text-rust">»</span></p>
          <p className="text-cream-dim">27 ans plus tard, TransMed Auto reste une entreprise familiale indépendante. Nous gérons l'intégralité de la chaîne : sélection du véhicule, préparation des documents, dédouanement français, transit maritime et livraison en Algérie.</p>
          <p className="text-cream-dim">Notre force : une équipe bilingue franco-arabe à Drancy, des partenaires logistiques de confiance à Marseille (CMA-CGM, Marfret) et un bureau de représentation à Alger. Vous parlez à des gens, jamais à un standard.</p>
          <div className="pt-6 font-display-italic text-2xl">— Karim Benkhedda, gérant</div>
        </div>
      </div>
    </section>

    <section className="bg-cream text-ink">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-8">— Nos engagements</div>
        <h2 className="font-display text-6xl lg:text-7xl leading-none mb-16">Quatre principes,<br/><span className="font-display-italic">aucune exception.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {[
            { n: '01', t: 'Transparence des prix', d: "Le prix annoncé est le prix facturé : véhicule, documents, transport et dédouanement inclus. Pas de frais cachés à l'arrivée." },
            { n: '02', t: 'Conformité réglementaire', d: "Tous nos véhicules respectent la réglementation algérienne sur l'importation (règle des 3 ans, normes techniques)." },
            { n: '03', t: 'Suivi temps réel', d: "Numéro de connaissement, traçage du conteneur, point d'avancement à chaque étape clé." },
            { n: '04', t: 'Bureau Algérie', d: "Une équipe à Alger pour vous accueillir au port et gérer les formalités de réception locale." },
          ].map(v => (
            <div key={v.n} className="border-t-2 border-ink pt-8">
              <div className="font-mono text-xs text-rust mb-3">{v.n}</div>
              <h3 className="font-display text-3xl mb-4">{v.t}</h3>
              <p className="text-ink/70 leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-ink py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-cream-dim/40">
          {[
            { v: '14', l: 'collaborateurs France' },
            { v: '4', l: 'agents bureau Algérie' },
            { v: '1 200 m²', l: 'parc Drancy' },
            { v: '4.8/5', l: 'satisfaction client' },
          ].map((s, i) => (
            <div key={i} className="bg-ink p-10">
              <div className="font-display text-cream text-6xl">{s.v}</div>
              <div className="mt-3 font-mono text-xs uppercase tracking-widest text-cream-dim">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-cream text-ink py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <h2 className="font-display text-5xl lg:text-7xl leading-none mb-8">Visitez notre<br/><span className="font-display-italic">parc à Drancy.</span></h2>
        <p className="text-ink/70 max-w-xl mx-auto mb-10">Le showroom est ouvert sans rendez-vous. Le café est toujours chaud.</p>
        <button onClick={() => navigate('contact')} className="inline-flex items-center gap-3 bg-ink text-cream px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-rust">Nous rendre visite <ArrowRight size={16}/></button>
      </div>
    </section>
  </main>
);

/* ===============================================================
   PAGE — CONTACT (avec Google Maps embed)
=============================================================== */

const ContactPage = ({ data, vehicle, navigate }) => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    subject: vehicle ? `Demande info — ${vehicle.brand} ${vehicle.model}` : '',
    message: vehicle ? `Bonjour, je souhaite recevoir un devis pour l'export du ${vehicle.brand} ${vehicle.model} ${vehicle.version} (réf #${vehicle.id}) vers l'Algérie.` : ''
  });
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 5000); };

  return (
    <main className="bg-ink min-h-screen">
      <section className="border-b border-cream-dim">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-8">— Contact</div>
          <h1 className="font-display text-cream text-6xl lg:text-9xl leading-[0.9]">Prenons<br/><span className="font-display-italic text-cream-dim">contact.</span></h1>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-12">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">📞 Bureau France</div>
              <a href={`tel:${data.siteInfo.phoneRaw}`} className="font-display text-4xl lg:text-5xl text-cream hover:text-rust block leading-none">{data.siteInfo.phone}</a>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">📞 Bureau Algérie</div>
              <a href={`tel:${data.siteInfo.phoneAlgRaw}`} className="font-display text-4xl lg:text-5xl text-cream hover:text-rust block leading-none">{data.siteInfo.phoneAlg}</a>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">WhatsApp</div>
              <a href={`https://wa.me/${data.siteInfo.whatsapp.replace(/\D/g,'')}`} className="inline-flex items-center gap-3 font-display text-2xl text-cream hover:text-rust">
                <MessageCircle size={24}/>Réponse immédiate
              </a>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">E-mail</div>
              <a href={`mailto:${data.siteInfo.email}`} className="font-display text-2xl text-cream hover:text-rust">{data.siteInfo.email}</a>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-3">Showroom</div>
              <div className="font-display text-2xl text-cream leading-tight">{data.siteInfo.address}<br/>{data.siteInfo.zip}</div>
              <div className="font-mono text-xs text-cream-dim mt-3">Parking client gratuit · Métro Drancy</div>
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-cream-dim mb-4">Horaires</div>
              <ul className="space-y-2">
                {data.siteInfo.hours.map(h => (
                  <li key={h.day} className="flex justify-between gap-4 border-b border-cream-dim/30 pb-2 text-cream">
                    <span>{h.day}</span><span className="font-mono text-cream-dim">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* GOOGLE MAPS EMBED */}
            <div className="aspect-[4/3] bg-ink-soft border border-cream-dim/40 overflow-hidden">
              <iframe title="Carte" width="100%" height="100%" style={{border: 0}} loading="lazy"
                src="https://maps.google.com/maps?q=Drancy+93700&z=14&output=embed"></iframe>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-cream text-ink p-8 lg:p-12">
              <h2 className="font-display text-4xl mb-2">Demande<br/><span className="font-display-italic">d'information.</span></h2>
              <p className="font-mono text-xs uppercase tracking-widest text-ink/60 mb-10">Réponse sous 24h ouvrées</p>

              <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-ink/60 block mb-2">Nom complet *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-transparent border-b border-ink/40 focus:border-rust py-2 outline-none"/>
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-ink/60 block mb-2">Téléphone *</label>
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-transparent border-b border-ink/40 focus:border-rust py-2 outline-none"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-ink/60 block mb-2">E-mail *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-transparent border-b border-ink/40 focus:border-rust py-2 outline-none"/>
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-ink/60 block mb-2">Ville d'arrivée</label>
                    <select value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full bg-transparent border-b border-ink/40 focus:border-rust py-2 outline-none cursor-pointer">
                      <option value="">— Choisir —</option>
                      <option>Alger</option><option>Oran</option><option>Annaba</option><option>Constantine</option><option>Béjaïa</option><option>Skikda</option><option>Autre</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-ink/60 block mb-2">Sujet</label>
                  <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full bg-transparent border-b border-ink/40 focus:border-rust py-2 outline-none"/>
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-ink/60 block mb-2">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-transparent border-b border-ink/40 focus:border-rust py-2 outline-none resize-none"/>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="font-mono text-xs text-ink/60 max-w-xs">En soumettant, vous acceptez le traitement de vos données.</p>
                  <button type="submit" className="inline-flex items-center gap-3 bg-ink text-cream px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-rust">Envoyer <ArrowRight size={16}/></button>
                </div>
                {sent && <div className="bg-rust text-cream px-4 py-3 font-mono text-sm flex items-center gap-3"><Check size={16}/>Message envoyé. Nous revenons vers vous sous 24h.</div>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

/* ===============================================================
   WHATSAPP FLOATING BUTTON
=============================================================== */

const WhatsAppFAB = ({ siteInfo }) => (
  <a href={`https://wa.me/${siteInfo.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
    className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] rounded-full flex items-center justify-center shadow-2xl group">
    <span className="absolute inset-0 rounded-full bg-[#25D366] anim-pulse-ring"></span>
    <MessageCircle size={26} className="text-white relative z-10" strokeWidth={2}/>
    <span className="absolute right-full mr-3 bg-ink text-cream px-3 py-1.5 font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
      WhatsApp
    </span>
  </a>
);

/* ===============================================================
   ===   ADMIN PANEL (BackOffice)   ===
=============================================================== */

const AdminLogin = ({ onLogin, onCancel }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (u === 'admin' && p === 'admin123') onLogin({ username: 'admin', role: 'Super Admin' });
    else setErr('Identifiants incorrects.');
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <GlobalStyles />
      <div className="w-full max-w-md">
        <button onClick={onCancel} className="font-mono text-xs uppercase tracking-widest text-cream-dim hover:text-rust mb-8 flex items-center gap-2">
          <ChevronLeft size={14}/>Retour au site
        </button>
        <div className="bg-ink-soft border border-cream-dim p-10">
          <div className="flex items-center gap-3 mb-2">
            <Lock size={24} className="text-rust"/>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust">— BackOffice</div>
          </div>
          <h1 className="font-display text-cream text-4xl mb-2">Espace<br/><span className="font-display-italic">administrateur.</span></h1>
          <p className="font-mono text-xs text-cream-dim mb-8">TransMed Auto · Panneau de gestion</p>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-cream-dim block mb-2">Identifiant</label>
              <input value={u} onChange={e => setU(e.target.value)} className="w-full bg-transparent border-b border-cream-dim focus:border-rust py-2 outline-none text-cream" placeholder="admin"/>
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-cream-dim block mb-2">Mot de passe</label>
              <input type="password" value={p} onChange={e => setP(e.target.value)} className="w-full bg-transparent border-b border-cream-dim focus:border-rust py-2 outline-none text-cream" placeholder="admin123"/>
            </div>
            {err && <div className="bg-rust/20 border border-rust text-cream px-4 py-3 font-mono text-xs">{err}</div>}
            <button type="submit" className="w-full bg-rust text-cream py-4 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink">Se connecter</button>
          </form>

          <div className="mt-8 pt-6 border-t border-cream-dim font-mono text-xs text-cream-dim">
            <div className="text-rust mb-1">Démo — identifiants de test :</div>
            <div>admin / admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = ({ children, current, navAdmin, onLogout, user, data }) => {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'vehicles', icon: Car, label: 'Véhicules' },
    { id: 'brands', icon: Tag, label: 'Marques & Catégories' },
    { id: 'sliders', icon: ImageIcon, label: 'Sliders' },
    { id: 'articles', icon: FileText, label: 'Articles & Blog' },
    { id: 'gallery', icon: ImageIcon, label: 'Galerie photos' },
    { id: 'site-info', icon: Settings, label: 'Infos du site' },
    { id: 'accounts', icon: UserCog, label: 'Comptes admin' },
  ];

  return (
    <div className="min-h-screen bg-ink flex">
      <GlobalStyles />
      {/* SIDEBAR */}
      <aside className="w-72 bg-ink-soft border-r border-cream-dim flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-cream-dim">
          <div className="font-display text-cream text-2xl">{data.siteInfo.name}</div>
          <div className="font-mono text-xs text-rust uppercase tracking-widest mt-1">BackOffice</div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
          {items.map(it => (
            <button key={it.id} onClick={() => navAdmin(it.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-left ${current === it.id ? 'bg-rust text-cream' : 'text-cream-dim hover:bg-ink-soft2 hover:text-cream'}`}>
              <it.icon size={16}/>{it.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-cream-dim space-y-2">
          <div className="px-4 py-3 bg-ink-soft2">
            <div className="font-mono text-xs text-cream-dim uppercase">Connecté</div>
            <div className="font-display text-cream">{user.username}</div>
            <div className="font-mono text-xs text-rust">{user.role}</div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-cream-dim hover:text-rust">
            <LogOut size={16}/>Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
};

/* ---------- ADMIN — DASHBOARD ---------- */
const AdminDashboard = ({ data }) => {
  const stats = [
    { label: 'Véhicules en ligne', val: data.vehicles.length, sub: `${data.vehicles.filter(v=>v.type==='neuf').length} neufs · ${data.vehicles.filter(v=>v.type==='occasion').length} occasions`, icon: Car },
    { label: 'Articles publiés', val: data.articles.length, sub: `${ARTICLE_CATEGORIES.length} catégories`, icon: FileText },
    { label: 'Visiteurs', val: data.siteInfo.visitors.toLocaleString('fr-FR'), sub: '+412 cette semaine', icon: Eye },
    { label: 'Photos galerie', val: data.gallery.length, sub: 'mises à jour récentes', icon: ImageIcon },
  ];
  return (
    <div className="p-10">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-3">— Vue d'ensemble</div>
      <h1 className="font-display text-cream text-5xl mb-10">Tableau<br/><span className="font-display-italic">de bord.</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <div key={i} className="bg-ink-soft border border-cream-dim p-6">
            <s.icon className="text-rust mb-4" size={20}/>
            <div className="font-mono text-xs uppercase tracking-widest text-cream-dim">{s.label}</div>
            <div className="font-display text-cream text-4xl mt-2">{s.val}</div>
            <div className="font-mono text-xs text-cream-dim mt-2">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-ink-soft border border-cream-dim p-6">
          <h3 className="font-display text-cream text-2xl mb-4">Derniers véhicules</h3>
          <ul className="space-y-3">
            {data.vehicles.slice(0, 5).map(v => (
              <li key={v.id} className="flex items-center gap-4 pb-3 border-b border-cream-dim/30">
                <SafeImg src={v.image} alt="" className="w-16 h-12 shrink-0"/>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-cream truncate">{v.brand} {v.model}</div>
                  <div className="font-mono text-xs text-cream-dim">{v.year} · {fmtKm(v.mileage)}</div>
                </div>
                <div className="font-mono text-xs text-rust">{fmtDA(v.price)}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-ink-soft border border-cream-dim p-6">
          <h3 className="font-display text-cream text-2xl mb-4">Derniers articles</h3>
          <ul className="space-y-3">
            {data.articles.slice(0, 5).map(a => (
              <li key={a.id} className="pb-3 border-b border-cream-dim/30">
                <div className="font-mono text-xs text-rust uppercase tracking-wider">{a.category}</div>
                <div className="font-display text-cream truncate">{a.title}</div>
                <div className="font-mono text-xs text-cream-dim">{a.date} · {a.author}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/* ---------- ADMIN — TABLE COMPONENT (réutilisable) ---------- */
const AdminPageHeader = ({ title, italic, onAdd, addLabel = "Ajouter" }) => (
  <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
    <div>
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-rust mb-3">— Gestion</div>
      <h1 className="font-display text-cream text-5xl leading-none">{title} <span className="font-display-italic text-cream-dim">{italic}</span></h1>
    </div>
    {onAdd && <button onClick={onAdd} className="bg-rust text-cream px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink flex items-center gap-2"><Plus size={16}/>{addLabel}</button>}
  </div>
);

const Modal = ({ children, onClose, title }) => (
  <div onClick={onClose} className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-6 overflow-y-auto cursor-pointer">
    <div onClick={e => e.stopPropagation()} className="bg-ink-soft border border-cream-dim w-full max-w-3xl my-12 cursor-default scrollbar-thin">
      <div className="flex items-center justify-between p-6 border-b border-cream-dim sticky top-0 bg-ink-soft">
        <h3 className="font-display text-cream text-2xl">{title}</h3>
        <button onClick={onClose} className="text-cream-dim hover:text-cream"><X size={20}/></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const Field = ({ label, children, full }) => (
  <div className={full ? 'col-span-2' : ''}>
    <label className="font-mono text-xs uppercase tracking-widest text-cream-dim block mb-2">{label}</label>
    {children}
  </div>
);
const inp = "w-full bg-ink border border-cream-dim text-cream px-3 py-2 focus:border-rust outline-none font-body";

/* ---------- ADMIN — VEHICLES CRUD ---------- */
const AdminVehicles = ({ data, setData }) => {
  const [edit, setEdit] = useState(null);
  const [filter, setFilter] = useState('');

  const empty = { brand: '', model: '', version: '', type: 'neuf', year: 2025, mileage: 0, fuel: 'Essence', transmission: 'Manuelle', power: 100, color: '', doors: 5, seats: 5, price: 0, priceEUR: 0, bodyType: 'Citadine', consumption: 0, emissions: 0, image: '', description: '', equipment: [], featured: false };

  const save = (form) => {
    if (form.id) {
      setData(d => ({ ...d, vehicles: d.vehicles.map(v => v.id === form.id ? form : v) }));
    } else {
      const id = Math.max(0, ...data.vehicles.map(v => v.id)) + 1;
      setData(d => ({ ...d, vehicles: [...d.vehicles, { ...form, id }] }));
    }
    setEdit(null);
  };
  const remove = (id) => {
    if (confirm('Supprimer ce véhicule ?')) setData(d => ({ ...d, vehicles: d.vehicles.filter(v => v.id !== id) }));
  };

  const filtered = data.vehicles.filter(v => `${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-10">
      <AdminPageHeader title="Véhicules" italic="catalogue." onAdd={() => setEdit({ ...empty })} addLabel="Ajouter un véhicule"/>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim"/>
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Rechercher..."
            className="w-full bg-ink-soft border border-cream-dim text-cream pl-9 pr-3 py-2 focus:border-rust outline-none"/>
        </div>
        <div className="font-mono text-xs text-cream-dim">{filtered.length} / {data.vehicles.length}</div>
      </div>

      <div className="bg-ink-soft border border-cream-dim overflow-x-auto scrollbar-thin">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-cream-dim font-mono text-xs uppercase tracking-widest text-cream-dim">
              <th className="p-4">Photo</th><th className="p-4">Véhicule</th><th className="p-4">Type</th>
              <th className="p-4">Année</th><th className="p-4">Km</th><th className="p-4">Prix</th>
              <th className="p-4">Sélection</th><th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body text-sm text-cream">
            {filtered.map(v => (
              <tr key={v.id} className="border-b border-cream-dim/30 hover:bg-ink-soft2">
                <td className="p-4"><SafeImg src={v.image} alt="" className="w-16 h-12"/></td>
                <td className="p-4">
                  <div className="font-display text-base">{v.brand} {v.model}</div>
                  <div className="font-mono text-xs text-cream-dim">{v.version}</div>
                </td>
                <td className="p-4"><span className={`font-mono text-xs uppercase tracking-wider px-2 py-1 ${v.type === 'neuf' ? 'bg-cream text-ink' : 'bg-rust text-cream'}`}>{v.type}</span></td>
                <td className="p-4 font-mono text-xs">{v.year}</td>
                <td className="p-4 font-mono text-xs">{fmtKm(v.mileage)}</td>
                <td className="p-4 font-mono text-xs">{fmtDA(v.price)}</td>
                <td className="p-4">{v.featured ? <span className="text-rust">★</span> : <span className="text-cream-dim">—</span>}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEdit({...v})} className="p-2 text-cream-dim hover:text-rust"><Edit2 size={14}/></button>
                    <button onClick={() => remove(v.id)} className="p-2 text-cream-dim hover:text-rust"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && <VehicleForm v={edit} onSave={save} onClose={() => setEdit(null)} brands={[...new Set(data.vehicles.map(x => x.brand))]} />}
    </div>
  );
};

const VehicleForm = ({ v, onSave, onClose, brands }) => {
  const [f, setF] = useState(v);
  const upd = (k, val) => setF(p => ({ ...p, [k]: val }));

  return (
    <Modal title={v.id ? `Modifier — ${v.brand} ${v.model}` : 'Nouveau véhicule'} onClose={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(f); }} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Marque *"><input list="brands" required value={f.brand} onChange={e => upd('brand', e.target.value)} className={inp}/><datalist id="brands">{brands.map(b => <option key={b} value={b}/>)}</datalist></Field>
          <Field label="Modèle *"><input required value={f.model} onChange={e => upd('model', e.target.value)} className={inp}/></Field>
          <Field label="Version" full><input value={f.version} onChange={e => upd('version', e.target.value)} className={inp}/></Field>
          <Field label="Type"><select value={f.type} onChange={e => upd('type', e.target.value)} className={inp}><option value="neuf">Neuf</option><option value="occasion">Occasion</option></select></Field>
          <Field label="Carrosserie"><select value={f.bodyType} onChange={e => upd('bodyType', e.target.value)} className={inp}>{BODY_TYPES.map(b => <option key={b}>{b}</option>)}</select></Field>
          <Field label="Année"><input type="number" value={f.year} onChange={e => upd('year', parseInt(e.target.value))} className={inp}/></Field>
          <Field label="Kilométrage"><input type="number" value={f.mileage} onChange={e => upd('mileage', parseInt(e.target.value))} className={inp}/></Field>
          <Field label="Carburant"><select value={f.fuel} onChange={e => upd('fuel', e.target.value)} className={inp}>{FUELS.map(b => <option key={b}>{b}</option>)}</select></Field>
          <Field label="Boîte"><select value={f.transmission} onChange={e => upd('transmission', e.target.value)} className={inp}>{TRANSMISSIONS.map(b => <option key={b}>{b}</option>)}</select></Field>
          <Field label="Puissance (ch)"><input type="number" value={f.power} onChange={e => upd('power', parseInt(e.target.value))} className={inp}/></Field>
          <Field label="Couleur"><input value={f.color} onChange={e => upd('color', e.target.value)} className={inp}/></Field>
          <Field label="Portes"><input type="number" value={f.doors} onChange={e => upd('doors', parseInt(e.target.value))} className={inp}/></Field>
          <Field label="Places"><input type="number" value={f.seats} onChange={e => upd('seats', parseInt(e.target.value))} className={inp}/></Field>
          <Field label="Prix DA"><input type="number" value={f.price} onChange={e => upd('price', parseInt(e.target.value))} className={inp}/></Field>
          <Field label="Prix EUR"><input type="number" value={f.priceEUR} onChange={e => upd('priceEUR', parseInt(e.target.value))} className={inp}/></Field>
          <Field label="Conso L/100"><input type="number" step="0.1" value={f.consumption} onChange={e => upd('consumption', parseFloat(e.target.value))} className={inp}/></Field>
          <Field label="CO₂ g/km"><input type="number" value={f.emissions} onChange={e => upd('emissions', parseInt(e.target.value))} className={inp}/></Field>
          <Field label="URL Image" full><input value={f.image} onChange={e => upd('image', e.target.value)} className={inp}/></Field>
          <Field label="Description" full><textarea rows={3} value={f.description} onChange={e => upd('description', e.target.value)} className={`${inp} resize-none`}/></Field>
          <Field label="Équipements (un par ligne)" full><textarea rows={4} value={f.equipment.join('\n')} onChange={e => upd('equipment', e.target.value.split('\n').filter(x => x))} className={`${inp} resize-none`}/></Field>
          <Field label="Sélection / Coup de cœur" full>
            <label className="flex items-center gap-3 text-cream cursor-pointer"><input type="checkbox" checked={f.featured} onChange={e => upd('featured', e.target.checked)} className="w-5 h-5 accent-rust"/>Afficher en sélection sur la page d'accueil</label>
          </Field>
        </div>
        <div className="flex gap-3 pt-4 border-t border-cream-dim">
          <button type="submit" className="bg-rust text-cream px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink flex items-center gap-2"><Save size={14}/>Enregistrer</button>
          <button type="button" onClick={onClose} className="border border-cream-dim text-cream-dim px-6 py-3 font-mono text-sm uppercase tracking-widest hover:border-rust hover:text-rust">Annuler</button>
        </div>
      </form>
    </Modal>
  );
};

/* ---------- ADMIN — BRANDS / CATEGORIES ---------- */
const AdminBrands = ({ data, setData }) => {
  const brands = [...new Set(data.vehicles.map(v => v.brand))].sort();
  const counts = brands.reduce((acc, b) => ({ ...acc, [b]: data.vehicles.filter(v => v.brand === b).length }), {});

  return (
    <div className="p-10">
      <AdminPageHeader title="Marques &" italic="catégories."/>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-ink-soft border border-cream-dim p-6">
          <h3 className="font-display text-cream text-2xl mb-6">Marques ({brands.length})</h3>
          <div className="space-y-3">
            {brands.map(b => (
              <div key={b} className="flex items-center justify-between p-3 bg-ink border border-cream-dim/40">
                <div>
                  <div className="font-display text-cream text-lg">{b}</div>
                  <div className="font-mono text-xs text-cream-dim">{counts[b]} véhicule{counts[b] > 1 ? 's' : ''}</div>
                </div>
                <div className="font-mono text-xs text-cream-dim">Auto-détectée</div>
              </div>
            ))}
          </div>
          <div className="mt-4 font-mono text-xs text-cream-dim">Les marques sont gérées automatiquement à partir des véhicules ajoutés.</div>
        </div>

        <div className="bg-ink-soft border border-cream-dim p-6">
          <h3 className="font-display text-cream text-2xl mb-6">Catégories articles</h3>
          <div className="space-y-3">
            {ARTICLE_CATEGORIES.map(c => (
              <div key={c} className="flex items-center justify-between p-3 bg-ink border border-cream-dim/40">
                <div>
                  <div className="font-display text-cream text-lg">{c}</div>
                  <div className="font-mono text-xs text-cream-dim">{data.articles.filter(a => a.category === c).length} article(s)</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink-soft border border-cream-dim p-6">
          <h3 className="font-display text-cream text-2xl mb-6">Carrosseries</h3>
          <div className="grid grid-cols-2 gap-3">
            {BODY_TYPES.map(t => (
              <div key={t} className="p-3 bg-ink border border-cream-dim/40">
                <div className="font-display text-cream">{t}</div>
                <div className="font-mono text-xs text-cream-dim">{data.vehicles.filter(v => v.bodyType === t).length} véhicule(s)</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ink-soft border border-cream-dim p-6">
          <h3 className="font-display text-cream text-2xl mb-6">Carburants</h3>
          <div className="grid grid-cols-2 gap-3">
            {FUELS.map(t => (
              <div key={t} className="p-3 bg-ink border border-cream-dim/40">
                <div className="font-display text-cream">{t}</div>
                <div className="font-mono text-xs text-cream-dim">{data.vehicles.filter(v => v.fuel === t).length} véhicule(s)</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- ADMIN — SLIDERS CRUD ---------- */
const AdminSliders = ({ data, setData }) => {
  const [edit, setEdit] = useState(null);
  const empty = { active: true, eyebrow: '', title: '', subtitle: '', cta1: { label: '', target: 'catalog' }, cta2: { label: '', target: 'contact' }, image: '' };

  const save = (form) => {
    if (form.id) setData(d => ({ ...d, sliders: d.sliders.map(s => s.id === form.id ? form : s) }));
    else { const id = Math.max(0, ...data.sliders.map(s => s.id)) + 1; setData(d => ({ ...d, sliders: [...d.sliders, { ...form, id }] })); }
    setEdit(null);
  };
  const remove = (id) => { if (confirm('Supprimer ?')) setData(d => ({ ...d, sliders: d.sliders.filter(s => s.id !== id) })); };
  const toggleActive = (id) => setData(d => ({ ...d, sliders: d.sliders.map(s => s.id === id ? { ...s, active: !s.active } : s) }));

  return (
    <div className="p-10">
      <AdminPageHeader title="Sliders" italic="d'accueil." onAdd={() => setEdit({ ...empty })} addLabel="Nouveau slider"/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.sliders.map(s => (
          <div key={s.id} className="bg-ink-soft border border-cream-dim overflow-hidden">
            <div className="relative aspect-[16/9]">
              <SafeImg src={s.image} alt="" className="w-full h-full"/>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent"/>
              <div className="absolute bottom-3 left-4 right-4 text-cream">
                <div className="font-mono text-xs uppercase tracking-widest text-rust">{s.eyebrow}</div>
                <div className="font-display text-2xl mt-1 line-clamp-2">{s.title.replace(/\n/g, ' ')}</div>
              </div>
              <div className={`absolute top-3 right-3 px-2 py-1 font-mono text-xs uppercase tracking-wider ${s.active ? 'bg-rust text-cream' : 'bg-ink text-cream-dim'}`}>{s.active ? 'Actif' : 'Inactif'}</div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-cream-dim/40">
              <button onClick={() => toggleActive(s.id)} className="font-mono text-xs text-cream-dim hover:text-rust">{s.active ? 'Désactiver' : 'Activer'}</button>
              <div className="flex gap-2">
                <button onClick={() => setEdit({...s})} className="p-2 text-cream-dim hover:text-rust"><Edit2 size={14}/></button>
                <button onClick={() => remove(s.id)} className="p-2 text-cream-dim hover:text-rust"><Trash2 size={14}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {edit && (
        <Modal title={edit.id ? 'Modifier slider' : 'Nouveau slider'} onClose={() => setEdit(null)}>
          <form onSubmit={e => { e.preventDefault(); save(edit); }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Eyebrow"><input value={edit.eyebrow} onChange={e => setEdit({...edit, eyebrow: e.target.value})} className={inp}/></Field>
              <Field label="Image URL"><input value={edit.image} onChange={e => setEdit({...edit, image: e.target.value})} className={inp}/></Field>
              <Field label="Titre (sauts de ligne avec \\n)" full><textarea rows={3} value={edit.title} onChange={e => setEdit({...edit, title: e.target.value})} className={`${inp} resize-none`}/></Field>
              <Field label="Sous-titre" full><textarea rows={2} value={edit.subtitle} onChange={e => setEdit({...edit, subtitle: e.target.value})} className={`${inp} resize-none`}/></Field>
              <Field label="CTA 1 — Label"><input value={edit.cta1.label} onChange={e => setEdit({...edit, cta1: {...edit.cta1, label: e.target.value}})} className={inp}/></Field>
              <Field label="CTA 1 — Cible"><select value={edit.cta1.target} onChange={e => setEdit({...edit, cta1: {...edit.cta1, target: e.target.value}})} className={inp}><option value="catalog">Catalogue</option><option value="catalog-neuf">Neufs</option><option value="catalog-occasion">Occasions</option><option value="contact">Contact</option><option value="phone">Téléphone</option><option value="whatsapp">WhatsApp</option><option value="about">À propos</option></select></Field>
              <Field label="CTA 2 — Label"><input value={edit.cta2.label} onChange={e => setEdit({...edit, cta2: {...edit.cta2, label: e.target.value}})} className={inp}/></Field>
              <Field label="CTA 2 — Cible"><select value={edit.cta2.target} onChange={e => setEdit({...edit, cta2: {...edit.cta2, target: e.target.value}})} className={inp}><option value="catalog">Catalogue</option><option value="contact">Contact</option><option value="phone">Téléphone</option><option value="whatsapp">WhatsApp</option><option value="about">À propos</option></select></Field>
              <Field label="Statut" full>
                <label className="flex items-center gap-3 text-cream cursor-pointer"><input type="checkbox" checked={edit.active} onChange={e => setEdit({...edit, active: e.target.checked})} className="w-5 h-5 accent-rust"/>Slider actif</label>
              </Field>
            </div>
            <div className="flex gap-3 pt-4 border-t border-cream-dim">
              <button type="submit" className="bg-rust text-cream px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink flex items-center gap-2"><Save size={14}/>Enregistrer</button>
              <button type="button" onClick={() => setEdit(null)} className="border border-cream-dim text-cream-dim px-6 py-3 font-mono text-sm uppercase tracking-widest hover:border-rust hover:text-rust">Annuler</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

/* ---------- ADMIN — ARTICLES CRUD ---------- */
const AdminArticles = ({ data, setData }) => {
  const [edit, setEdit] = useState(null);
  const empty = { category: 'Actualités', title: '', excerpt: '', content: '', image: '', date: new Date().toLocaleDateString('fr-FR'), author: 'admin', readTime: '5 min' };

  const save = (form) => {
    if (form.id) setData(d => ({ ...d, articles: d.articles.map(a => a.id === form.id ? form : a) }));
    else { const id = Math.max(0, ...data.articles.map(a => a.id)) + 1; setData(d => ({ ...d, articles: [{ ...form, id }, ...d.articles] })); }
    setEdit(null);
  };
  const remove = (id) => { if (confirm('Supprimer ?')) setData(d => ({ ...d, articles: d.articles.filter(a => a.id !== id) })); };

  return (
    <div className="p-10">
      <AdminPageHeader title="Articles &" italic="blog." onAdd={() => setEdit({...empty})} addLabel="Nouvel article"/>
      <div className="bg-ink-soft border border-cream-dim overflow-x-auto scrollbar-thin">
        <table className="w-full text-left">
          <thead><tr className="border-b border-cream-dim font-mono text-xs uppercase tracking-widest text-cream-dim">
            <th className="p-4">Image</th><th className="p-4">Titre</th><th className="p-4">Catégorie</th><th className="p-4">Auteur</th><th className="p-4">Date</th><th className="p-4 text-right">Actions</th>
          </tr></thead>
          <tbody className="font-body text-sm text-cream">
            {data.articles.map(a => (
              <tr key={a.id} className="border-b border-cream-dim/30 hover:bg-ink-soft2">
                <td className="p-4"><SafeImg src={a.image} alt="" className="w-16 h-12"/></td>
                <td className="p-4 font-display max-w-md truncate">{a.title}</td>
                <td className="p-4"><span className="font-mono text-xs uppercase tracking-wider px-2 py-1 bg-rust-dim text-rust">{a.category}</span></td>
                <td className="p-4 font-mono text-xs">{a.author}</td>
                <td className="p-4 font-mono text-xs">{a.date}</td>
                <td className="p-4"><div className="flex justify-end gap-2">
                  <button onClick={() => setEdit({...a})} className="p-2 text-cream-dim hover:text-rust"><Edit2 size={14}/></button>
                  <button onClick={() => remove(a.id)} className="p-2 text-cream-dim hover:text-rust"><Trash2 size={14}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <Modal title={edit.id ? 'Modifier article' : 'Nouvel article'} onClose={() => setEdit(null)}>
          <form onSubmit={e => { e.preventDefault(); save(edit); }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Catégorie"><select value={edit.category} onChange={e => setEdit({...edit, category: e.target.value})} className={inp}>{ARTICLE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Auteur"><input value={edit.author} onChange={e => setEdit({...edit, author: e.target.value})} className={inp}/></Field>
              <Field label="Date"><input value={edit.date} onChange={e => setEdit({...edit, date: e.target.value})} className={inp}/></Field>
              <Field label="Temps de lecture"><input value={edit.readTime} onChange={e => setEdit({...edit, readTime: e.target.value})} className={inp}/></Field>
              <Field label="Titre *" full><input required value={edit.title} onChange={e => setEdit({...edit, title: e.target.value})} className={inp}/></Field>
              <Field label="Image URL" full><input value={edit.image} onChange={e => setEdit({...edit, image: e.target.value})} className={inp}/></Field>
              <Field label="Extrait" full><textarea rows={2} value={edit.excerpt} onChange={e => setEdit({...edit, excerpt: e.target.value})} className={`${inp} resize-none`}/></Field>
              <Field label="Contenu" full><textarea rows={8} value={edit.content} onChange={e => setEdit({...edit, content: e.target.value})} className={`${inp} resize-none`}/></Field>
            </div>
            <div className="flex gap-3 pt-4 border-t border-cream-dim">
              <button type="submit" className="bg-rust text-cream px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink flex items-center gap-2"><Save size={14}/>Enregistrer</button>
              <button type="button" onClick={() => setEdit(null)} className="border border-cream-dim text-cream-dim px-6 py-3 font-mono text-sm uppercase tracking-widest hover:border-rust hover:text-rust">Annuler</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

/* ---------- ADMIN — GALLERY CRUD ---------- */
const AdminGallery = ({ data, setData }) => {
  const [edit, setEdit] = useState(null);
  const save = (form) => {
    if (form.id) setData(d => ({ ...d, gallery: d.gallery.map(g => g.id === form.id ? form : g) }));
    else { const id = Math.max(0, ...data.gallery.map(g => g.id)) + 1; setData(d => ({ ...d, gallery: [...d.gallery, { ...form, id }] })); }
    setEdit(null);
  };
  const remove = (id) => { if (confirm('Supprimer ?')) setData(d => ({ ...d, gallery: d.gallery.filter(g => g.id !== id) })); };

  return (
    <div className="p-10">
      <AdminPageHeader title="Galerie" italic="photos." onAdd={() => setEdit({ src: '', caption: '' })} addLabel="Ajouter une photo"/>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.gallery.map(g => (
          <div key={g.id} className="bg-ink-soft border border-cream-dim overflow-hidden group">
            <SafeImg src={g.src} alt="" className="aspect-square w-full"/>
            <div className="p-3">
              <div className="text-cream text-sm truncate">{g.caption}</div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setEdit({...g})} className="p-1.5 text-cream-dim hover:text-rust"><Edit2 size={12}/></button>
                <button onClick={() => remove(g.id)} className="p-1.5 text-cream-dim hover:text-rust"><Trash2 size={12}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {edit && (
        <Modal title={edit.id ? 'Modifier photo' : 'Nouvelle photo'} onClose={() => setEdit(null)}>
          <form onSubmit={e => { e.preventDefault(); save(edit); }} className="space-y-6">
            <Field label="URL de l'image *"><input required value={edit.src} onChange={e => setEdit({...edit, src: e.target.value})} className={inp}/></Field>
            <Field label="Légende"><input value={edit.caption} onChange={e => setEdit({...edit, caption: e.target.value})} className={inp}/></Field>
            {edit.src && <SafeImg src={edit.src} alt="" className="aspect-video"/>}
            <div className="flex gap-3 pt-4 border-t border-cream-dim">
              <button type="submit" className="bg-rust text-cream px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink flex items-center gap-2"><Save size={14}/>Enregistrer</button>
              <button type="button" onClick={() => setEdit(null)} className="border border-cream-dim text-cream-dim px-6 py-3 font-mono text-sm uppercase tracking-widest hover:border-rust hover:text-rust">Annuler</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

/* ---------- ADMIN — SITE INFO ---------- */
const AdminSiteInfo = ({ data, setData }) => {
  const [f, setF] = useState(data.siteInfo);
  const [saved, setSaved] = useState(false);
  const save = (e) => { e.preventDefault(); setData(d => ({ ...d, siteInfo: f })); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="p-10">
      <AdminPageHeader title="Infos" italic="du site."/>
      <form onSubmit={save} className="bg-ink-soft border border-cream-dim p-8 max-w-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nom du site"><input value={f.name} onChange={e => setF({...f, name: e.target.value})} className={inp}/></Field>
          <Field label="Tagline"><input value={f.tagline} onChange={e => setF({...f, tagline: e.target.value})} className={inp}/></Field>
          <Field label="Année fondation"><input type="number" value={f.since} onChange={e => setF({...f, since: parseInt(e.target.value)})} className={inp}/></Field>
          <Field label="E-mail"><input value={f.email} onChange={e => setF({...f, email: e.target.value})} className={inp}/></Field>
          <Field label="Téléphone France"><input value={f.phone} onChange={e => setF({...f, phone: e.target.value, phoneRaw: e.target.value.replace(/\s/g,'')})} className={inp}/></Field>
          <Field label="Téléphone Algérie"><input value={f.phoneAlg} onChange={e => setF({...f, phoneAlg: e.target.value, phoneAlgRaw: e.target.value.replace(/\s/g,'')})} className={inp}/></Field>
          <Field label="WhatsApp"><input value={f.whatsapp} onChange={e => setF({...f, whatsapp: e.target.value})} className={inp}/></Field>
          <Field label="Pays"><input value={f.country} onChange={e => setF({...f, country: e.target.value})} className={inp}/></Field>
          <Field label="Adresse"><input value={f.address} onChange={e => setF({...f, address: e.target.value})} className={inp}/></Field>
          <Field label="Code postal & ville"><input value={f.zip} onChange={e => setF({...f, zip: e.target.value})} className={inp}/></Field>
          <Field label="Facebook" full><input value={f.facebook} onChange={e => setF({...f, facebook: e.target.value})} className={inp}/></Field>
          <Field label="Instagram" full><input value={f.instagram} onChange={e => setF({...f, instagram: e.target.value})} className={inp}/></Field>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-cream-dim">
          <button type="submit" className="bg-rust text-cream px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink flex items-center gap-2"><Save size={14}/>Enregistrer</button>
          {saved && <span className="font-mono text-xs text-rust flex items-center gap-2"><Check size={14}/>Modifications enregistrées</span>}
        </div>
      </form>
    </div>
  );
};

/* ---------- ADMIN — ACCOUNTS ---------- */
const AdminAccounts = ({ data, setData }) => {
  const [edit, setEdit] = useState(null);
  const save = (form) => {
    if (form.id) setData(d => ({ ...d, adminAccounts: d.adminAccounts.map(a => a.id === form.id ? form : a) }));
    else { const id = Math.max(0, ...data.adminAccounts.map(a => a.id)) + 1; setData(d => ({ ...d, adminAccounts: [...d.adminAccounts, { ...form, id, lastLogin: 'Jamais' }] })); }
    setEdit(null);
  };
  const remove = (id) => { if (confirm('Supprimer ce compte ?')) setData(d => ({ ...d, adminAccounts: d.adminAccounts.filter(a => a.id !== id) })); };

  return (
    <div className="p-10">
      <AdminPageHeader title="Comptes" italic="administrateurs." onAdd={() => setEdit({ username: '', email: '', role: 'Éditeur' })} addLabel="Nouveau compte"/>
      <div className="bg-ink-soft border border-cream-dim overflow-x-auto scrollbar-thin">
        <table className="w-full text-left">
          <thead><tr className="border-b border-cream-dim font-mono text-xs uppercase tracking-widest text-cream-dim">
            <th className="p-4">Identifiant</th><th className="p-4">E-mail</th><th className="p-4">Rôle</th><th className="p-4">Dernière connexion</th><th className="p-4 text-right">Actions</th>
          </tr></thead>
          <tbody className="font-body text-sm text-cream">
            {data.adminAccounts.map(a => (
              <tr key={a.id} className="border-b border-cream-dim/30 hover:bg-ink-soft2">
                <td className="p-4 font-display">{a.username}</td>
                <td className="p-4 font-mono text-xs">{a.email}</td>
                <td className="p-4"><span className={`font-mono text-xs uppercase tracking-wider px-2 py-1 ${a.role === 'Super Admin' ? 'bg-rust text-cream' : 'bg-cream text-ink'}`}>{a.role}</span></td>
                <td className="p-4 font-mono text-xs">{a.lastLogin}</td>
                <td className="p-4"><div className="flex justify-end gap-2">
                  <button onClick={() => setEdit({...a})} className="p-2 text-cream-dim hover:text-rust"><Edit2 size={14}/></button>
                  <button onClick={() => remove(a.id)} className="p-2 text-cream-dim hover:text-rust"><Trash2 size={14}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <Modal title={edit.id ? 'Modifier compte' : 'Nouveau compte'} onClose={() => setEdit(null)}>
          <form onSubmit={e => { e.preventDefault(); save(edit); }} className="space-y-6">
            <Field label="Identifiant *"><input required value={edit.username} onChange={e => setEdit({...edit, username: e.target.value})} className={inp}/></Field>
            <Field label="E-mail *"><input required type="email" value={edit.email} onChange={e => setEdit({...edit, email: e.target.value})} className={inp}/></Field>
            <Field label="Rôle"><select value={edit.role} onChange={e => setEdit({...edit, role: e.target.value})} className={inp}><option>Super Admin</option><option>Éditeur</option><option>Modérateur</option></select></Field>
            <div className="flex gap-3 pt-4 border-t border-cream-dim">
              <button type="submit" className="bg-rust text-cream px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-cream hover:text-ink flex items-center gap-2"><Save size={14}/>Enregistrer</button>
              <button type="button" onClick={() => setEdit(null)} className="border border-cream-dim text-cream-dim px-6 py-3 font-mono text-sm uppercase tracking-widest hover:border-rust hover:text-rust">Annuler</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

/* ===============================================================
   MAIN APP
=============================================================== */

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const [searchPreset, setSearchPreset] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [adminPage, setAdminPage] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  // Visitor counter (simulated increment)
  useEffect(() => {
    const t = setInterval(() => {
      setData(d => ({ ...d, siteInfo: { ...d.siteInfo, visitors: d.siteInfo.visitors + 1 } }));
    }, 12000);
    return () => clearInterval(t);
  }, []);

  const navigate = (p, payload) => {
    if (p === 'detail' && payload) setSelected(payload);
    else if (p === 'article' && payload) setSelected(payload);
    else if (p === 'contact' && payload) setSelected(payload);
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const openVehicle = (v) => navigate('detail', v);

  // ADMIN MODE
  if (showLogin && !adminUser) {
    return <AdminLogin onLogin={u => { setAdminUser(u); setShowLogin(false); }} onCancel={() => setShowLogin(false)} />;
  }
  if (adminUser) {
    let admEl;
    if (adminPage === 'dashboard') admEl = <AdminDashboard data={data} />;
    else if (adminPage === 'vehicles') admEl = <AdminVehicles data={data} setData={setData} />;
    else if (adminPage === 'brands') admEl = <AdminBrands data={data} setData={setData} />;
    else if (adminPage === 'sliders') admEl = <AdminSliders data={data} setData={setData} />;
    else if (adminPage === 'articles') admEl = <AdminArticles data={data} setData={setData} />;
    else if (adminPage === 'gallery') admEl = <AdminGallery data={data} setData={setData} />;
    else if (adminPage === 'site-info') admEl = <AdminSiteInfo data={data} setData={setData} />;
    else if (adminPage === 'accounts') admEl = <AdminAccounts data={data} setData={setData} />;
    return (
      <AdminLayout current={adminPage} navAdmin={setAdminPage} onLogout={() => setAdminUser(null)} user={adminUser} data={data}>
        {admEl}
      </AdminLayout>
    );
  }

  // PUBLIC MODE
  let pageEl;
  if (page === 'home') pageEl = <HomePage data={data} navigate={navigate} openVehicle={openVehicle} setSearchPreset={setSearchPreset} />;
  else if (page === 'catalog') pageEl = <CatalogPage data={data} filterType="all" openVehicle={openVehicle} navigate={navigate} searchPreset={searchPreset} clearPreset={() => setSearchPreset(null)} />;
  else if (page === 'catalog-neuf') pageEl = <CatalogPage data={data} filterType="neuf" openVehicle={openVehicle} navigate={navigate} searchPreset={searchPreset} clearPreset={() => setSearchPreset(null)} />;
  else if (page === 'catalog-occasion') pageEl = <CatalogPage data={data} filterType="occasion" openVehicle={openVehicle} navigate={navigate} searchPreset={searchPreset} clearPreset={() => setSearchPreset(null)} />;
  else if (page === 'detail') pageEl = <VehicleDetailPage vehicle={selected} data={data} navigate={navigate} openVehicle={openVehicle} />;
  else if (page === 'blog') pageEl = <BlogPage data={data} navigate={navigate} />;
  else if (page === 'article') pageEl = <ArticlePage article={selected} data={data} navigate={navigate} />;
  else if (page === 'gallery') pageEl = <GalleryPage data={data} navigate={navigate} />;
  else if (page === 'about') pageEl = <AboutPage data={data} navigate={navigate} />;
  else if (page === 'contact') pageEl = <ContactPage data={data} vehicle={selected} navigate={navigate} />;

  return (
    <div className="bg-ink min-h-screen text-cream font-body antialiased">
      <GlobalStyles />
      <Header page={page} navigate={navigate} siteInfo={data.siteInfo} openAdmin={() => setShowLogin(true)} visitors={data.siteInfo.visitors} />
      {pageEl}
      <Footer navigate={navigate} siteInfo={data.siteInfo} />
      <WhatsAppFAB siteInfo={data.siteInfo} />
    </div>
  );
}
