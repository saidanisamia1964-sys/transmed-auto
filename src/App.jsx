import { useState, useMemo } from 'react';
import {
  Phone, Mail, MapPin, ChevronRight, ChevronLeft, X, Calendar, Fuel,
  Clock, Search, Menu, Check, Car, Cog, MessageCircle, Facebook,
  Instagram, Lock, Ship, FileCheck, ArrowRight, Star
} from 'lucide-react';

/* ===============================================================
   DATA
=============================================================== */

const COMPANY = {
  name: 'TransMed Auto',
  tagline: "Spécialiste de l'export de véhicules vers l'Algérie",
  since: 1998,
  phone: '+33 1 48 31 24 17',
  phoneRaw: '+33148312417',
  phoneAlg: '+213 555 84 12 09',
  phoneAlgRaw: '+213555841209',
  whatsapp: '+33148312417',
  email: 'contact@transmed-auto.fr',
  address: '24 Avenue Henri Barbusse',
  zip: '93700 Drancy',
  facebook: 'https://facebook.com/transmedauto',
  instagram: 'https://instagram.com/transmedauto',
  hours: [
    { day: 'Lundi — Vendredi', time: '9h00 — 18h30' },
    { day: 'Samedi', time: '10h00 — 17h00' },
    { day: 'Dimanche', time: 'Sur RDV' },
  ]
};

const VEHICLES = [
  { id: 1, brand: 'Peugeot', model: '3008', version: 'GT BlueHDi 130 EAT8', type: 'neuf', year: 2025, mileage: 12, fuel: 'Diesel', transmission: 'Automatique', power: 130, color: 'Gris Platinium', doors: 5, seats: 5, priceEUR: 28900, bodyType: 'SUV', image: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1400&q=80', description: "Peugeot 3008 GT, véhicule neuf direction. Documents douane Algérie inclus.", equipment: ['Toit panoramique', 'GPS connecté 10"', 'Caméra 360°', 'Sièges chauffants', 'Hayon mains libres', 'Jantes 19"', 'LED Matrix'] },
  { id: 2, brand: 'Renault', model: 'Captur', version: 'Techno TCe 140', type: 'neuf', year: 2025, mileage: 18, fuel: 'Essence', transmission: 'Manuelle', power: 140, color: 'Bleu Iron', doors: 5, seats: 5, priceEUR: 19900, bodyType: 'SUV', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1400&q=80', description: "Captur Techno neuf, configuration idéale Algérie : essence, boîte manuelle.", equipment: ['Écran OpenR Link 10,4"', 'Easy Park Assist', 'Caméra de recul', 'Climatisation auto', 'Jantes 18"'] },
  { id: 3, brand: 'Dacia', model: 'Sandero', version: 'Stepway Expression TCe 90', type: 'neuf', year: 2025, mileage: 5, fuel: 'Essence', transmission: 'Manuelle', power: 90, color: 'Beige Dune', doors: 5, seats: 5, priceEUR: 12600, bodyType: 'Citadine', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=80', description: "Best-seller en Algérie. Sandero Stepway robuste, économique.", equipment: ['Media Display 8"', 'Apple CarPlay', 'Régulateur', 'Climatisation', 'Barres de toit'] },
  { id: 4, brand: 'Citroën', model: 'C5 Aircross', version: 'Shine Hybrid 136', type: 'neuf', year: 2025, mileage: 22, fuel: 'Hybride', transmission: 'Automatique', power: 136, color: 'Gris Acier', doors: 5, seats: 5, priceEUR: 26300, bodyType: 'SUV', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1400&q=80', description: "C5 Aircross hybride : confort de référence Citroën.", equipment: ['Suspensions Hydrauliques', 'Toit panoramique', 'GPS 3D', 'Hayon électrique', 'Jantes 19"'] },
  { id: 5, brand: 'Peugeot', model: '208', version: 'Allure PureTech 100', type: 'neuf', year: 2025, mileage: 7, fuel: 'Essence', transmission: 'Manuelle', power: 100, color: 'Rouge Elixir', doors: 5, seats: 5, priceEUR: 16500, bodyType: 'Citadine', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80', description: "208 Allure neuve, citadine premium très demandée en Algérie.", equipment: ['i-Cockpit 3D', 'Écran 10"', 'Mirror Screen', 'Jantes alu 16"', 'Climatisation auto'] },
  { id: 6, brand: 'Renault', model: 'Clio', version: 'E-Tech full hybrid 145', type: 'neuf', year: 2025, mileage: 14, fuel: 'Hybride', transmission: 'Automatique', power: 145, color: 'Bleu Alpine', doors: 5, seats: 5, priceEUR: 18500, bodyType: 'Citadine', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1400&q=80', description: "Clio hybride : économie de carburant exceptionnelle.", equipment: ['EasyLink 9,3"', 'Caméra de recul', 'Régulateur adaptatif', 'Jantes 17"'] },
  { id: 7, brand: 'Dacia', model: 'Logan', version: 'TCe 100 BVM', type: 'neuf', year: 2026, mileage: 8, fuel: 'Essence', transmission: 'Manuelle', power: 100, color: 'Gris Nardo', doors: 4, seats: 5, priceEUR: 11300, bodyType: 'Berline', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80', description: "Logan 2026, berline familiale économique, idéale taxis et flottes.", equipment: ['Climatisation', 'Régulateur', 'Direction assistée', 'Vitres électriques'] },
  { id: 8, brand: 'Renault', model: 'Megane', version: 'Estate Intens dCi 115', type: 'occasion', year: 2022, mileage: 38500, fuel: 'Diesel', transmission: 'Manuelle', power: 115, color: 'Blanc Nacré', doors: 5, seats: 5, priceEUR: 15900, bodyType: 'Break', image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1400&q=80', description: "Megane Estate, conforme règle des 3 ans pour l'import Algérie.", equipment: ['GPS R-Link 2', 'Caméra de recul', 'Toit ouvrant', 'Jantes 17"'] },
  { id: 9, brand: 'Volkswagen', model: 'Golf 8', version: 'Life 1.5 TSI 130', type: 'occasion', year: 2023, mileage: 25100, fuel: 'Essence', transmission: 'Manuelle', power: 130, color: 'Gris Dolphin', doors: 5, seats: 5, priceEUR: 21700, bodyType: 'Berline', image: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=1400&q=80', description: "Golf 8 Life, faible kilométrage, garantie constructeur en cours.", equipment: ['Discover Pro 10"', 'Digital Cockpit', 'Apple CarPlay', 'Park Assist', 'Jantes 17"'] },
  { id: 10, brand: 'Citroën', model: 'C3', version: 'Shine PureTech 110', type: 'occasion', year: 2023, mileage: 22300, fuel: 'Essence', transmission: 'Manuelle', power: 110, color: 'Blanc Banquise', doors: 5, seats: 5, priceEUR: 11700, bodyType: 'Citadine', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80', description: "C3 Shine récente, citadine confortable, très bon état général.", equipment: ['Écran tactile 7"', 'Mirror Screen', 'Climatisation auto', 'Caméra de recul', 'Jantes 16"'] },
  { id: 11, brand: 'Dacia', model: 'Duster', version: 'Prestige TCe 150 4x4', type: 'occasion', year: 2023, mileage: 28400, fuel: 'Essence', transmission: 'Manuelle', power: 150, color: 'Noir Nacré', doors: 5, seats: 5, priceEUR: 16400, bodyType: 'SUV', image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=1400&q=80', description: "Duster 4x4, idéal terrains algériens, robuste et économique.", equipment: ['Multimedia Nav 8"', 'Caméras 360°', 'Sièges chauffants', '4x4'] },
  { id: 12, brand: 'Audi', model: 'A3', version: 'Sportback S Line 35 TFSI 150', type: 'occasion', year: 2023, mileage: 31100, fuel: 'Essence', transmission: 'Automatique', power: 150, color: 'Gris Daytona', doors: 5, seats: 5, priceEUR: 27700, bodyType: 'Berline', image: 'https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=1400&q=80', description: "A3 S Line, finition exclusive, prestation premium allemande.", equipment: ['Virtual Cockpit Plus', 'MMI Navigation', 'Pack S Line', 'Phares Matrix LED', 'Jantes 18"'] },
];

const TESTIMONIALS = [
  { id: 1, name: 'Karim B.', city: 'Alger', rating: 5, text: "Service impeccable de A à Z. J'ai reçu mon Peugeot 3008 à Alger en 19 jours seulement. Toutes les démarches douanières gérées par leurs soins. Je recommande vivement." },
  { id: 2, name: 'Sofiane M.', city: 'Oran', rating: 5, text: "Très bon contact dès le premier appel. Prix transparent, pas de mauvaises surprises à l'arrivée. La voiture était comme promis." },
  { id: 3, name: 'Yacine A.', city: 'Constantine', rating: 5, text: "Deuxième véhicule que j'achète chez eux. Toujours aussi sérieux et professionnels. Ils parlent français et arabe, c'est un vrai plus." },
];

const FUELS = ['Essence', 'Diesel', 'Hybride'];
const TRANSMISSIONS = ['Manuelle', 'Automatique'];

const fmtEUR = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' €';
const fmtKm = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' km';

/* ===============================================================
   GLOBAL STYLES — Simple, lisible
=============================================================== */

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    body { margin: 0; padding: 0; }
    .text-red { color: #DC2626; }
    .bg-red { background-color: #DC2626; }
    .bg-red-hover:hover { background-color: #B91C1C; }
    .border-red { border-color: #DC2626; }
    .text-dark { color: #1F2937; }
    .bg-dark { background-color: #1F2937; }
    .text-grey { color: #6B7280; }
    .bg-grey-light { background-color: #F3F4F6; }
    .border-grey { border-color: #E5E7EB; }
    @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
    .anim-pulse-ring { animation: pulse-ring 1.8s ease-out infinite; }
    a, button { transition: all 0.15s ease; }
    .img-fallback { background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%); }
    .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

const SafeImg = ({ src, alt, className }) => (
  <div className={`relative img-fallback overflow-hidden ${className || ''}`}>
    <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover"
      onError={(e) => { e.target.style.display = 'none'; }} />
  </div>
);

/* ===============================================================
   HEADER
=============================================================== */

const Header = ({ page, navigate }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { id: 'home', label: 'Accueil' },
    { id: 'catalog-neuf', label: 'Véhicules Neufs' },
    { id: 'catalog-occasion', label: 'Occasions' },
    { id: 'testimonials', label: 'Témoignages' },
    { id: 'about', label: 'Qui sommes-nous' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <div className="bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <a href={`tel:${COMPANY.phoneRaw}`} className="flex items-center gap-2 hover:text-red"><Phone size={14}/>{COMPANY.phone}</a>
            <span className="hidden md:inline text-grey">|</span>
            <a href={`mailto:${COMPANY.email}`} className="hidden md:flex items-center gap-2 hover:text-red"><Mail size={14}/>{COMPANY.email}</a>
          </div>
          <div className="flex items-center gap-3">
            <a href={COMPANY.facebook} className="hover:text-red"><Facebook size={14}/></a>
            <a href={COMPANY.instagram} className="hover:text-red"><Instagram size={14}/></a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white border-b shadow-sm" style={{borderColor: '#E5E7EB'}}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-4 gap-4">
            <button onClick={() => navigate('home')} className="flex items-center gap-2 shrink-0">
              <div className="bg-red text-white px-3 py-2 font-black text-xl tracking-tight">TM</div>
              <div className="text-left">
                <div className="font-bold text-dark text-lg leading-tight">{COMPANY.name}</div>
                <div className="text-xs text-grey hidden sm:block">Export Algérie</div>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {links.map(l => (
                <button key={l.id} onClick={() => navigate(l.id)}
                  className={`px-3 py-2 text-sm font-medium rounded ${page === l.id ? 'text-red' : 'text-dark hover:text-red'}`}>
                  {l.label}
                </button>
              ))}
            </nav>

            <a href={`tel:${COMPANY.phoneRaw}`} className="hidden md:flex items-center gap-2 bg-red text-white px-4 py-2.5 rounded font-semibold text-sm bg-red-hover">
              <Phone size={16}/>Appeler
            </a>

            <button onClick={() => setOpen(!open)} className="lg:hidden text-dark">
              {open ? <X size={26}/> : <Menu size={26}/>}
            </button>
          </div>

          {open && (
            <div className="lg:hidden py-4 border-t" style={{borderColor: '#E5E7EB'}}>
              <div className="flex flex-col gap-1">
                {links.map(l => (
                  <button key={l.id} onClick={() => { navigate(l.id); setOpen(false); }}
                    className={`text-left px-4 py-3 rounded ${page === l.id ? 'bg-red text-white' : 'text-dark hover:bg-grey-light'}`}>
                    {l.label}
                  </button>
                ))}
                <a href={`tel:${COMPANY.phoneRaw}`} className="mt-2 flex items-center justify-center gap-2 bg-red text-white px-4 py-3 rounded font-semibold">
                  <Phone size={16}/>{COMPANY.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

/* ===============================================================
   FOOTER
=============================================================== */

const Footer = ({ navigate, openAdmin }) => (
  <footer className="bg-dark text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-red text-white px-3 py-2 font-black text-xl">TM</div>
            <div className="font-bold text-lg">{COMPANY.name}</div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {COMPANY.tagline}. Plus de 25 ans d'expérience.
          </p>
          <div className="flex gap-3 mt-4">
            <a href={COMPANY.facebook} className="w-9 h-9 bg-gray-700 hover:bg-red flex items-center justify-center rounded"><Facebook size={16}/></a>
            <a href={COMPANY.instagram} className="w-9 h-9 bg-gray-700 hover:bg-red flex items-center justify-center rounded"><Instagram size={16}/></a>
            <a href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g,'')}`} className="w-9 h-9 bg-gray-700 hover:bg-red flex items-center justify-center rounded"><MessageCircle size={16}/></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><button onClick={() => navigate('home')} className="hover:text-red">Accueil</button></li>
            <li><button onClick={() => navigate('catalog-neuf')} className="hover:text-red">Véhicules Neufs</button></li>
            <li><button onClick={() => navigate('catalog-occasion')} className="hover:text-red">Occasions</button></li>
            <li><button onClick={() => navigate('testimonials')} className="hover:text-red">Témoignages</button></li>
            <li><button onClick={() => navigate('about')} className="hover:text-red">Qui sommes-nous</button></li>
            <li><button onClick={() => navigate('contact')} className="hover:text-red">Contact</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2"><Phone size={14} className="mt-0.5 shrink-0 text-red"/><a href={`tel:${COMPANY.phoneRaw}`} className="hover:text-red">{COMPANY.phone}</a></li>
            <li className="flex items-start gap-2"><Phone size={14} className="mt-0.5 shrink-0 text-red"/><a href={`tel:${COMPANY.phoneAlgRaw}`} className="hover:text-red">{COMPANY.phoneAlg} (Algérie)</a></li>
            <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5 shrink-0 text-red"/><a href={`mailto:${COMPANY.email}`} className="hover:text-red break-all">{COMPANY.email}</a></li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-red"/>{COMPANY.address}<br/>{COMPANY.zip}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Horaires</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {COMPANY.hours.map(h => (
              <li key={h.day} className="flex justify-between gap-2 pb-1 border-b border-gray-700">
                <span>{h.day}</span><span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between gap-3 text-xs text-gray-500">
        <div>© {new Date().getFullYear()} {COMPANY.name} — Tous droits réservés</div>
        <div className="flex gap-4 items-center">
          <span>Mentions légales</span>
          <span>RGPD</span>
          <button onClick={openAdmin} className="hover:text-red flex items-center gap-1"><Lock size={11}/>Admin</button>
        </div>
      </div>
    </div>
  </footer>
);

/* ===============================================================
   VEHICLE CARD
=============================================================== */

const VehicleCard = ({ v, onClick }) => (
  <button onClick={onClick} className="group text-left bg-white border rounded overflow-hidden hover:shadow-lg" style={{borderColor: '#E5E7EB'}}>
    <div className="relative aspect-[4/3] overflow-hidden">
      <SafeImg src={v.image} alt={`${v.brand} ${v.model}`} className="w-full h-full" />
      <div className={`absolute top-2 left-2 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded ${v.type === 'neuf' ? 'bg-red text-white' : 'bg-dark text-white'}`}>
        {v.type}
      </div>
    </div>
    <div className="p-4">
      <div className="text-xs text-grey font-semibold uppercase tracking-wider mb-1">{v.brand}</div>
      <h3 className="font-bold text-dark text-lg leading-tight mb-1 group-hover:text-red">{v.model}</h3>
      <div className="text-xs text-grey mb-3 line-clamp-1">{v.version}</div>

      <div className="text-2xl font-black text-red mb-3">{fmtEUR(v.priceEUR)}</div>

      <div className="grid grid-cols-3 gap-2 text-xs text-grey pt-3 border-t" style={{borderColor: '#E5E7EB'}}>
        <div className="flex items-center gap-1"><Calendar size={11}/>{v.year}</div>
        <div className="flex items-center gap-1"><Cog size={11}/>{v.transmission === 'Manuelle' ? 'BVM' : 'BVA'}</div>
        <div className="flex items-center gap-1"><Fuel size={11}/>{v.fuel}</div>
      </div>
    </div>
  </button>
);

/* ===============================================================
   PAGE — HOME
=============================================================== */

const HomePage = ({ navigate, openVehicle }) => {
  const [searchType, setSearchType] = useState('all');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const brands = [...new Set(VEHICLES.map(v => v.brand))].sort();
  const recent = VEHICLES.slice(0, 8);

  const submitSearch = () => {
    let target = 'catalog-neuf';
    if (searchType === 'occasion') target = 'catalog-occasion';
    navigate(target);
  };

  return (
    <main>
      <section className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0">
          <SafeImg src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80" alt="" className="w-full h-full opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-dark/40"/>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-red text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-6">
              <Star size={12} fill="white"/>+25 ans d'expertise
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              {COMPANY.name}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium mb-6 text-gray-200">
              Spécialiste de l'<span className="text-red font-bold">export de véhicules</span> vers l'Algérie
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Véhicules neufs et d'occasion. Démarches douanières, transit maritime et livraison Alger / Oran / Annaba gérés intégralement.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('catalog-neuf')} className="bg-red text-white px-6 py-3 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center gap-2">
                Véhicules Neufs <ArrowRight size={16}/>
              </button>
              <button onClick={() => navigate('catalog-occasion')} className="bg-white text-dark px-6 py-3 rounded font-bold uppercase text-sm tracking-wider hover:bg-gray-200 flex items-center gap-2">
                Voir les Occasions <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 -mb-8 pb-8">
          <div className="bg-white rounded shadow-2xl p-5 lg:p-6">
            <div className="flex items-center gap-2 text-dark mb-4">
              <Search size={18} className="text-red"/>
              <span className="font-bold uppercase tracking-wider text-sm">Rechercher un véhicule</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1.5 block">Type</label>
                <select value={searchType} onChange={e => setSearchType(e.target.value)} className="w-full border rounded px-3 py-2.5 text-dark focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}>
                  <option value="all">Tous</option>
                  <option value="neuf">Neuf</option>
                  <option value="occasion">Occasion</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1.5 block">Marque</label>
                <select value={searchBrand} onChange={e => setSearchBrand(e.target.value)} className="w-full border rounded px-3 py-2.5 text-dark focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}>
                  <option value="">Toutes</option>
                  {brands.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1.5 block">Prix max (€)</label>
                <input type="number" placeholder="20 000" value={searchPrice} onChange={e => setSearchPrice(e.target.value)} className="w-full border rounded px-3 py-2.5 text-dark focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
              </div>
              <div className="flex items-end">
                <button onClick={submitSearch} className="w-full bg-red text-white py-2.5 rounded font-bold uppercase tracking-wider bg-red-hover flex items-center justify-center gap-2">
                  <Search size={16}/>Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <div className="text-red font-bold uppercase tracking-wider text-sm mb-2">Nos derniers arrivages</div>
              <h2 className="text-3xl md:text-4xl font-black text-dark">Véhicules disponibles</h2>
            </div>
            <button onClick={() => navigate('catalog-neuf')} className="text-red font-bold uppercase tracking-wider text-sm flex items-center gap-1 hover:gap-2">
              Voir tout le catalogue <ArrowRight size={14}/>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recent.map(v => <VehicleCard key={v.id} v={v} onClick={() => openVehicle(v)} />)}
          </div>
        </div>
      </section>

      <section className="bg-grey-light py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <div className="text-red font-bold uppercase tracking-wider text-sm mb-2">Comment ça marche</div>
            <h2 className="text-3xl md:text-4xl font-black text-dark">Notre service en 4 étapes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: '01', icon: Car, t: 'Choisissez', d: 'Sélectionnez votre véhicule dans notre catalogue ou demandez un modèle spécifique.' },
              { n: '02', icon: FileCheck, t: 'Documents', d: 'Nous préparons tous les papiers : carte grise, certificat de cession, quitus fiscal.' },
              { n: '03', icon: Ship, t: 'Transit', d: 'Embarquement à Marseille, transit maritime sécurisé jusqu\'à l\'Algérie.' },
              { n: '04', icon: Check, t: 'Livraison', d: 'Dédouanement et remise des clés à Alger, Oran ou Annaba.' },
            ].map(s => (
              <div key={s.n} className="bg-white p-6 rounded shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red text-white w-12 h-12 rounded flex items-center justify-center">
                    <s.icon size={20}/>
                  </div>
                  <div className="text-3xl font-black text-grey">{s.n}</div>
                </div>
                <h3 className="font-bold text-dark text-lg mb-2">{s.t}</h3>
                <p className="text-grey text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">Une question ? Un projet d'export ?</h2>
            <p className="text-gray-300">Notre équipe vous répond du lundi au samedi. Français et arabe.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={`tel:${COMPANY.phoneRaw}`} className="bg-red text-white px-6 py-3 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center gap-2 whitespace-nowrap">
              <Phone size={16}/>{COMPANY.phone}
            </a>
            <a href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g,'')}`} className="bg-[#25D366] text-white px-6 py-3 rounded font-bold uppercase text-sm tracking-wider hover:bg-[#1ebe57] flex items-center gap-2 whitespace-nowrap">
              <MessageCircle size={16}/>WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

/* ===============================================================
   PAGE — CATALOG
=============================================================== */

const CatalogPage = ({ filterType, openVehicle, navigate }) => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [transFilter, setTransFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('default');

  const brands = [...new Set(VEHICLES.map(v => v.brand))].sort();

  const filtered = useMemo(() => {
    let out = VEHICLES.filter(v => {
      if (filterType !== 'all' && v.type !== filterType) return false;
      if (search && !`${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (brandFilter && v.brand !== brandFilter) return false;
      if (fuelFilter && v.fuel !== fuelFilter) return false;
      if (transFilter && v.transmission !== transFilter) return false;
      if (maxPrice && v.priceEUR > parseInt(maxPrice)) return false;
      return true;
    });
    if (sort === 'price-asc') out = [...out].sort((a, b) => a.priceEUR - b.priceEUR);
    else if (sort === 'price-desc') out = [...out].sort((a, b) => b.priceEUR - a.priceEUR);
    else if (sort === 'year-desc') out = [...out].sort((a, b) => b.year - a.year);
    return out;
  }, [filterType, search, brandFilter, fuelFilter, transFilter, maxPrice, sort]);

  const reset = () => {
    setSearch(''); setBrandFilter(''); setFuelFilter(''); setTransFilter(''); setMaxPrice(''); setSort('default');
  };

  const title = filterType === 'neuf' ? 'Véhicules Neufs' : filterType === 'occasion' ? "Véhicules d'Occasion" : 'Tous les Véhicules';

  return (
    <main className="bg-grey-light min-h-screen">
      <section className="bg-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <button onClick={() => navigate('home')} className="text-gray-400 hover:text-red text-sm mb-3 flex items-center gap-1">
            <ChevronLeft size={14}/>Accueil
          </button>
          <h1 className="text-3xl md:text-4xl font-black">{title}</h1>
          <p className="text-gray-300 mt-2">{filtered.length} véhicule{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''} pour l'export Algérie</p>
        </div>
      </section>

      <section className="bg-white border-b shadow-sm" style={{borderColor: '#E5E7EB'}}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="col-span-2 md:col-span-3 lg:col-span-2 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey"/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
                className="w-full border rounded pl-9 pr-3 py-2 text-sm focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
            </div>
            <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="border rounded px-3 py-2 text-sm focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}>
              <option value="">Marque</option>
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>
            <select value={fuelFilter} onChange={e => setFuelFilter(e.target.value)} className="border rounded px-3 py-2 text-sm focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}>
              <option value="">Carburant</option>
              {FUELS.map(f => <option key={f}>{f}</option>)}
            </select>
            <select value={transFilter} onChange={e => setTransFilter(e.target.value)} className="border rounded px-3 py-2 text-sm focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}>
              <option value="">Boîte</option>
              {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
            </select>
            <input type="number" placeholder="Prix max €" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              className="border rounded px-3 py-2 text-sm focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
          </div>

          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t" style={{borderColor: '#E5E7EB'}}>
            <button onClick={reset} className="text-sm text-grey hover:text-red flex items-center gap-1">
              <X size={14}/>Réinitialiser
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded px-3 py-1.5 text-sm focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}>
              <option value="default">Tri par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="year-desc">Année récente</option>
            </select>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="bg-white rounded p-12 text-center">
            <Search size={48} className="mx-auto text-grey mb-4"/>
            <h3 className="font-bold text-dark text-xl mb-2">Aucun véhicule ne correspond</h3>
            <p className="text-grey mb-6">Essayez d'élargir vos critères de recherche.</p>
            <button onClick={reset} className="bg-red text-white px-6 py-2.5 rounded font-bold text-sm bg-red-hover">Réinitialiser les filtres</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(v => <VehicleCard key={v.id} v={v} onClick={() => openVehicle(v)} />)}
          </div>
        )}
      </section>
    </main>
  );
};

/* ===============================================================
   PAGE — VEHICLE DETAIL
=============================================================== */

const VehicleDetailPage = ({ vehicle, navigate, openVehicle }) => {
  if (!vehicle) {
    return (
      <main className="bg-grey-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-grey mb-4">Aucun véhicule sélectionné.</p>
          <button onClick={() => navigate('catalog-neuf')} className="bg-red text-white px-6 py-2.5 rounded font-bold text-sm bg-red-hover">Voir le catalogue</button>
        </div>
      </main>
    );
  }

  const similar = VEHICLES.filter(v => v.id !== vehicle.id && (v.bodyType === vehicle.bodyType || v.brand === vehicle.brand)).slice(0, 4);

  return (
    <main className="bg-grey-light min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <nav className="text-sm text-grey mb-4 flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate('home')} className="hover:text-red">Accueil</button>
          <ChevronRight size={12}/>
          <button onClick={() => navigate(vehicle.type === 'neuf' ? 'catalog-neuf' : 'catalog-occasion')} className="hover:text-red">{vehicle.type === 'neuf' ? 'Neufs' : 'Occasions'}</button>
          <ChevronRight size={12}/>
          <span className="text-dark font-medium">{vehicle.brand} {vehicle.model}</span>
        </nav>

        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7">
              <div className="relative">
                <SafeImg src={vehicle.image} alt="" className="aspect-[4/3] lg:aspect-auto lg:h-full" />
                <div className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${vehicle.type === 'neuf' ? 'bg-red text-white' : 'bg-dark text-white'}`}>
                  {vehicle.type}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 lg:p-8">
              <div className="text-xs text-grey font-semibold uppercase tracking-wider mb-1">{vehicle.brand} · {vehicle.year}</div>
              <h1 className="text-2xl lg:text-3xl font-black text-dark mb-1">{vehicle.model}</h1>
              <div className="text-grey mb-4">{vehicle.version}</div>

              <div className="bg-grey-light p-4 rounded mb-6">
                <div className="text-xs text-grey font-semibold uppercase mb-1">Prix export Algérie</div>
                <div className="text-4xl font-black text-red">{fmtEUR(vehicle.priceEUR)}</div>
                <div className="text-xs text-grey mt-1">Frais de douane et transport inclus</div>
              </div>

              <div className="space-y-2 mb-6">
                <a href={`tel:${COMPANY.phoneRaw}`} className="w-full bg-red text-white py-3.5 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center justify-center gap-2">
                  <Phone size={16}/>Appeler — {COMPANY.phone}
                </a>
                <a href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g,'')}?text=Bonjour, je suis intéressé par le ${vehicle.brand} ${vehicle.model} ${vehicle.version}`} className="w-full bg-[#25D366] text-white py-3.5 rounded font-bold uppercase text-sm tracking-wider hover:bg-[#1ebe57] flex items-center justify-center gap-2">
                  <MessageCircle size={16}/>WhatsApp
                </a>
                <button onClick={() => navigate('contact', vehicle)} className="w-full border-2 border-dark text-dark py-3 rounded font-bold uppercase text-sm tracking-wider hover:bg-dark hover:text-white flex items-center justify-center gap-2">
                  <Mail size={16}/>Demande par formulaire
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-grey pt-4 border-t" style={{borderColor: '#E5E7EB'}}>
                <div className="flex items-center gap-1.5"><FileCheck size={14} className="text-red"/>Documents douane</div>
                <div className="flex items-center gap-1.5"><Ship size={14} className="text-red"/>Transit Marseille</div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-red"/>Livraison incluse</div>
                <div className="flex items-center gap-1.5"><Star size={14} className="text-red"/>Service complet</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm mt-6 p-6 lg:p-8">
          <h2 className="text-xl font-black text-dark mb-6">Caractéristiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: 'Année', v: vehicle.year },
              { l: 'Kilométrage', v: fmtKm(vehicle.mileage) },
              { l: 'Carburant', v: vehicle.fuel },
              { l: 'Boîte', v: vehicle.transmission },
              { l: 'Puissance', v: `${vehicle.power} ch` },
              { l: 'Carrosserie', v: vehicle.bodyType },
              { l: 'Couleur', v: vehicle.color },
              { l: 'Places', v: vehicle.seats },
            ].map((s, i) => (
              <div key={i} className="border-l-4 border-red pl-3 py-1">
                <div className="text-xs text-grey font-semibold uppercase tracking-wider">{s.l}</div>
                <div className="font-bold text-dark mt-0.5">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded shadow-sm mt-6 p-6 lg:p-8">
          <h2 className="text-xl font-black text-dark mb-4">Description</h2>
          <p className="text-grey leading-relaxed mb-6">{vehicle.description}</p>

          <h3 className="font-bold text-dark mb-3">Équipements</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {vehicle.equipment.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-grey text-sm">
                <Check size={16} className="text-red mt-0.5 shrink-0"/>{e}
              </li>
            ))}
          </ul>
        </div>

        {similar.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-black text-dark mb-4">Véhicules similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map(v => <VehicleCard key={v.id} v={v} onClick={() => openVehicle(v)} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

/* ===============================================================
   PAGE — TESTIMONIALS
=============================================================== */

const TestimonialsPage = ({ navigate }) => (
  <main className="bg-grey-light min-h-screen">
    <section className="bg-dark text-white py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <button onClick={() => navigate('home')} className="text-gray-400 hover:text-red text-sm mb-3 flex items-center gap-1">
          <ChevronLeft size={14}/>Accueil
        </button>
        <h1 className="text-3xl md:text-4xl font-black">Témoignages clients</h1>
        <p className="text-gray-300 mt-2">Plus de 4 800 véhicules livrés en Algérie.</p>
      </div>
    </section>

    <section className="max-w-5xl mx-auto px-4 lg:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TESTIMONIALS.map(t => (
          <div key={t.id} className="bg-white rounded shadow-sm p-6">
            <div className="flex gap-1 mb-3">
              {Array.from({length: t.rating}).map((_, i) => <Star key={i} size={18} className="text-red" fill="#DC2626"/>)}
            </div>
            <p className="text-grey leading-relaxed mb-4">"{t.text}"</p>
            <div className="pt-4 border-t" style={{borderColor: '#E5E7EB'}}>
              <div className="font-bold text-dark">{t.name}</div>
              <div className="text-sm text-grey">{t.city}, Algérie</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-dark text-white rounded p-8 mt-12 text-center">
        <h2 className="text-2xl font-black mb-2">Rejoignez nos clients satisfaits</h2>
        <p className="text-gray-300 mb-6">Plus de 4 800 véhicules exportés en 27 ans</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={`tel:${COMPANY.phoneRaw}`} className="bg-red text-white px-6 py-3 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center gap-2">
            <Phone size={16}/>Appeler
          </a>
          <button onClick={() => navigate('contact')} className="bg-white text-dark px-6 py-3 rounded font-bold uppercase text-sm tracking-wider hover:bg-gray-200">
            Nous contacter
          </button>
        </div>
      </div>
    </section>
  </main>
);

/* ===============================================================
   PAGE — ABOUT
=============================================================== */

const AboutPage = ({ navigate }) => (
  <main className="bg-grey-light min-h-screen">
    <section className="bg-dark text-white py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <button onClick={() => navigate('home')} className="text-gray-400 hover:text-red text-sm mb-3 flex items-center gap-1">
          <ChevronLeft size={14}/>Accueil
        </button>
        <h1 className="text-3xl md:text-4xl font-black">Qui sommes-nous</h1>
      </div>
    </section>

    <section className="max-w-5xl mx-auto px-4 lg:px-6 py-12">
      <div className="bg-white rounded shadow-sm p-8 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="text-5xl font-black text-red mb-1">27</div>
            <div className="text-sm text-grey font-semibold uppercase tracking-wider">Années d'expérience</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-red mb-1">4 800+</div>
            <div className="text-sm text-grey font-semibold uppercase tracking-wider">Véhicules livrés</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-red mb-1">4.8/5</div>
            <div className="text-sm text-grey font-semibold uppercase tracking-wider">Satisfaction client</div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-dark mb-4">{COMPANY.name}, votre spécialiste depuis {COMPANY.since}</h2>
        <p className="text-grey leading-relaxed mb-4">
          Nous avons commencé en {COMPANY.since} avec une seule conviction : la diaspora algérienne en France méritait un service d'export simple, transparent et fiable. 27 ans plus tard, {COMPANY.name} reste une entreprise familiale indépendante, basée à Drancy.
        </p>
        <p className="text-grey leading-relaxed mb-4">
          Nous gérons l'intégralité de la chaîne : sélection du véhicule, préparation des documents douaniers, dédouanement français, transit maritime depuis Marseille et livraison dans les principales villes d'Algérie (Alger, Oran, Annaba, Constantine, Béjaïa).
        </p>
        <p className="text-grey leading-relaxed mb-8">
          Notre force : une équipe bilingue franco-arabe à Drancy, des partenaires logistiques de confiance à Marseille et un bureau de représentation à Alger. Vous parlez à des humains, jamais à un standard automatique.
        </p>

        <h3 className="text-xl font-bold text-dark mb-4">Nos engagements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: 'Transparence des prix', d: "Le prix annoncé est le prix facturé. Pas de frais cachés à l'arrivée." },
            { t: 'Conformité réglementaire', d: "Tous nos véhicules respectent la réglementation algérienne." },
            { t: 'Suivi temps réel', d: "Numéro de connaissement, traçage du conteneur, point d'avancement." },
            { t: 'Bureau Algérie', d: "Une équipe à Alger pour vous accueillir au port." },
          ].map(v => (
            <div key={v.t} className="border-l-4 border-red pl-4 py-2">
              <div className="font-bold text-dark mb-1">{v.t}</div>
              <div className="text-sm text-grey">{v.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red text-white rounded p-8 mt-6 text-center">
        <h2 className="text-2xl font-black mb-2">Visitez notre showroom</h2>
        <p className="mb-6 text-white/90">{COMPANY.address}, {COMPANY.zip}</p>
        <button onClick={() => navigate('contact')} className="bg-white text-red px-6 py-3 rounded font-bold uppercase text-sm tracking-wider hover:bg-gray-100">
          Nous contacter
        </button>
      </div>
    </section>
  </main>
);

/* ===============================================================
   PAGE — CONTACT
=============================================================== */

const ContactPage = ({ vehicle, navigate }) => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    subject: vehicle ? `Demande info — ${vehicle.brand} ${vehicle.model}` : '',
    message: vehicle ? `Bonjour, je souhaite des informations pour l'export du ${vehicle.brand} ${vehicle.model} ${vehicle.version} vers l'Algérie.` : ''
  });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <main className="bg-grey-light min-h-screen">
      <section className="bg-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <button onClick={() => navigate('home')} className="text-gray-400 hover:text-red text-sm mb-3 flex items-center gap-1">
            <ChevronLeft size={14}/>Accueil
          </button>
          <h1 className="text-3xl md:text-4xl font-black">Contactez-nous</h1>
          <p className="text-gray-300 mt-2">Téléphone, WhatsApp ou e-mail — réponse rapide</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <a href={`tel:${COMPANY.phoneRaw}`} className="bg-white rounded shadow-sm p-6 flex items-center gap-4 hover:shadow-md group">
              <div className="w-14 h-14 bg-red rounded flex items-center justify-center text-white shrink-0">
                <Phone size={24}/>
              </div>
              <div>
                <div className="text-xs text-grey font-semibold uppercase tracking-wider">Bureau France</div>
                <div className="text-2xl font-black text-dark group-hover:text-red">{COMPANY.phone}</div>
              </div>
            </a>

            <a href={`tel:${COMPANY.phoneAlgRaw}`} className="bg-white rounded shadow-sm p-6 flex items-center gap-4 hover:shadow-md group">
              <div className="w-14 h-14 bg-red rounded flex items-center justify-center text-white shrink-0">
                <Phone size={24}/>
              </div>
              <div>
                <div className="text-xs text-grey font-semibold uppercase tracking-wider">Bureau Algérie</div>
                <div className="text-2xl font-black text-dark group-hover:text-red">{COMPANY.phoneAlg}</div>
              </div>
            </a>

            <a href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g,'')}`} className="bg-[#25D366] text-white rounded shadow-sm p-6 flex items-center gap-4 hover:opacity-95">
              <div className="w-14 h-14 bg-white/20 rounded flex items-center justify-center shrink-0">
                <MessageCircle size={24}/>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-90">WhatsApp</div>
                <div className="text-xl font-black">Réponse immédiate</div>
              </div>
            </a>

            <a href={`mailto:${COMPANY.email}`} className="bg-white rounded shadow-sm p-6 flex items-center gap-4 hover:shadow-md group">
              <div className="w-14 h-14 bg-red rounded flex items-center justify-center text-white shrink-0">
                <Mail size={24}/>
              </div>
              <div className="min-w-0">
                <div className="text-xs text-grey font-semibold uppercase tracking-wider">E-mail</div>
                <div className="text-lg font-bold text-dark group-hover:text-red break-all">{COMPANY.email}</div>
              </div>
            </a>

            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-6 flex items-center gap-4 border-b" style={{borderColor: '#E5E7EB'}}>
                <div className="w-14 h-14 bg-red rounded flex items-center justify-center text-white shrink-0">
                  <MapPin size={24}/>
                </div>
                <div>
                  <div className="text-xs text-grey font-semibold uppercase tracking-wider">Showroom</div>
                  <div className="font-bold text-dark">{COMPANY.address}</div>
                  <div className="text-sm text-grey">{COMPANY.zip}</div>
                </div>
              </div>
              <iframe title="Carte" width="100%" height="300" style={{border: 0}} loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(COMPANY.address + ' ' + COMPANY.zip)}&z=14&output=embed`}></iframe>
            </div>

            <div className="bg-white rounded shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3 text-dark">
                <Clock size={18} className="text-red"/>
                <span className="font-bold uppercase text-sm tracking-wider">Horaires d'ouverture</span>
              </div>
              <ul className="space-y-2">
                {COMPANY.hours.map(h => (
                  <li key={h.day} className="flex justify-between text-sm py-1.5 border-b" style={{borderColor: '#E5E7EB'}}>
                    <span className="text-grey">{h.day}</span><span className="text-dark font-medium">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded shadow-sm p-6 lg:p-8">
            <h2 className="text-2xl font-black text-dark mb-2">Envoyez-nous un message</h2>
            <p className="text-grey mb-6 text-sm">Réponse sous 24h ouvrées</p>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">Nom complet *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border rounded px-3 py-2.5 focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
                </div>
                <div>
                  <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">Téléphone *</label>
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full border rounded px-3 py-2.5 focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">E-mail *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border rounded px-3 py-2.5 focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
                </div>
                <div>
                  <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">Ville d'arrivée</label>
                  <select value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full border rounded px-3 py-2.5 focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}>
                    <option value="">Choisir...</option>
                    <option>Alger</option><option>Oran</option><option>Annaba</option><option>Constantine</option><option>Béjaïa</option><option>Autre</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">Sujet</label>
                <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  className="w-full border rounded px-3 py-2.5 focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
              </div>
              <div>
                <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">Message *</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full border rounded px-3 py-2.5 focus:border-red outline-none resize-none" style={{borderColor: '#E5E7EB'}}/>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-red text-white py-3.5 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center justify-center gap-2">
                  <Mail size={16}/>Envoyer le message
                </button>
              </div>

              {sent && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm flex items-center gap-2">
                  <Check size={16}/>Message envoyé. Nous revenons vers vous sous 24h.
                </div>
              )}

              <p className="text-xs text-grey">
                ⓘ Pour une réponse plus rapide, appelez-nous directement ou contactez-nous via WhatsApp.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

/* ===============================================================
   ADMIN
=============================================================== */

const AdminLogin = ({ onLogin, onCancel }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (u === 'admin' && p === 'admin123') onLogin({ username: 'admin' });
    else setErr('Identifiants incorrects.');
  };

  return (
    <div className="min-h-screen bg-grey-light flex items-center justify-center p-4">
      <GlobalStyles />
      <div className="w-full max-w-md">
        <button onClick={onCancel} className="text-grey hover:text-red text-sm mb-6 flex items-center gap-1">
          <ChevronLeft size={14}/>Retour au site
        </button>
        <div className="bg-white rounded shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red text-white w-10 h-10 rounded flex items-center justify-center">
              <Lock size={18}/>
            </div>
            <div>
              <div className="font-black text-dark text-xl">Admin {COMPANY.name}</div>
              <div className="text-xs text-grey uppercase tracking-wider">BackOffice</div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">Identifiant</label>
              <input value={u} onChange={e => setU(e.target.value)}
                className="w-full border rounded px-3 py-2.5 focus:border-red outline-none" style={{borderColor: '#E5E7EB'}} placeholder="admin"/>
            </div>
            <div>
              <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">Mot de passe</label>
              <input type="password" value={p} onChange={e => setP(e.target.value)}
                className="w-full border rounded px-3 py-2.5 focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
            </div>
            {err && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded">{err}</div>}
            <button type="submit" className="w-full bg-red text-white py-3 rounded font-bold uppercase text-sm tracking-wider bg-red-hover">Se connecter</button>
          </form>

          <div className="mt-6 pt-4 border-t text-xs text-grey" style={{borderColor: '#E5E7EB'}}>
            <div className="text-red font-semibold mb-1">Démo :</div>
            <div>admin / admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPlaceholder = ({ onLogout }) => (
  <div className="min-h-screen bg-grey-light p-8">
    <GlobalStyles />
    <div className="max-w-3xl mx-auto bg-white rounded shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-dark">Espace Admin</h1>
        <button onClick={onLogout} className="text-grey hover:text-red text-sm">Déconnexion</button>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mb-6">
        <div className="font-bold mb-1">⚠️ BackOffice à connecter</div>
        <div className="text-sm">Le BackOffice sera fonctionnel une fois Supabase branché. Pour le moment, le site est en mode "vitrine" avec données de démo.</div>
      </div>
      <div className="space-y-3 text-grey text-sm">
        <p>✅ Design simple et clair (style autoexportmarseille)</p>
        <p>✅ Site déployé en ligne</p>
        <p>⏳ Étape suivante : reconnecter Supabase pour le vrai BackOffice fonctionnel</p>
      </div>
    </div>
  </div>
);

const WhatsAppFAB = () => (
  <a href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
    className="fixed bottom-5 right-5 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] rounded-full flex items-center justify-center shadow-2xl">
    <span className="absolute inset-0 rounded-full bg-[#25D366] anim-pulse-ring"></span>
    <MessageCircle size={26} className="text-white relative z-10" strokeWidth={2}/>
  </a>
);

/* ===============================================================
   MAIN APP
=============================================================== */

export default function App() {
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = (p, payload) => {
    if (payload) setSelected(payload);
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const openVehicle = (v) => navigate('detail', v);

  if (showLogin && !adminUser) {
    return <AdminLogin onLogin={u => { setAdminUser(u); setShowLogin(false); }} onCancel={() => setShowLogin(false)} />;
  }
  if (adminUser) {
    return <AdminPlaceholder onLogout={() => setAdminUser(null)} />;
  }

  let pageEl;
  if (page === 'home') pageEl = <HomePage navigate={navigate} openVehicle={openVehicle} />;
  else if (page === 'catalog-neuf') pageEl = <CatalogPage filterType="neuf" openVehicle={openVehicle} navigate={navigate} />;
  else if (page === 'catalog-occasion') pageEl = <CatalogPage filterType="occasion" openVehicle={openVehicle} navigate={navigate} />;
  else if (page === 'detail') pageEl = <VehicleDetailPage vehicle={selected} navigate={navigate} openVehicle={openVehicle} />;
  else if (page === 'testimonials') pageEl = <TestimonialsPage navigate={navigate} />;
  else if (page === 'about') pageEl = <AboutPage navigate={navigate} />;
  else if (page === 'contact') pageEl = <ContactPage vehicle={selected} navigate={navigate} />;

  return (
    <div className="bg-white min-h-screen">
      <GlobalStyles />
      <Header page={page} navigate={navigate} />
      {pageEl}
      <Footer navigate={navigate} openAdmin={() => setShowLogin(true)} />
      <WhatsAppFAB />
    </div>
  );
}
