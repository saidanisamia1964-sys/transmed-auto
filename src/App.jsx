import { useState, useEffect, useMemo } from 'react';
import {
  Phone, Mail, MapPin, ChevronRight, ChevronLeft, X, Calendar, Fuel,
  Clock, Search, Menu, Check, Car, Cog, MessageCircle, Facebook,
  Instagram, Lock, Ship, FileCheck, ArrowRight, Star, Loader2,
  LayoutDashboard, Image as ImageIcon, FileText, UserCog, Save,
  Plus, Edit2, Trash2, LogOut, Settings as SettingsIcon
} from 'lucide-react';
import { supabase } from './supabase.js';

/* ===============================================================
   CONSTANTES
=============================================================== */

const FUELS = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
const TRANSMISSIONS = ['Manuelle', 'Automatique'];
const BODY_TYPES = ['Citadine', 'Berline', 'SUV', 'Break'];
const ARTICLE_CATEGORIES = ['Actualités', 'Nouveautés', 'Conseils Export', 'Événements'];

const fmtEUR = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' €';
const fmtKm = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' km';

/* ===============================================================
   GLOBAL STYLES
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
    @keyframes spin { to { transform: rotate(360deg); } }
    .anim-spin { animation: spin 1s linear infinite; }
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

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-grey-light flex items-center justify-center z-50">
    <GlobalStyles />
    <div className="text-center">
      <Loader2 className="anim-spin text-red mx-auto mb-4" size={32} />
      <div className="font-bold text-dark">Chargement...</div>
    </div>
  </div>
);

const ErrorScreen = ({ error, onRetry }) => (
  <div className="fixed inset-0 bg-grey-light flex items-center justify-center z-50 p-6">
    <GlobalStyles />
    <div className="max-w-md text-center bg-white rounded shadow-lg p-8">
      <div className="text-red text-5xl mb-4">⚠️</div>
      <h2 className="font-black text-dark text-xl mb-3">Erreur de connexion</h2>
      <p className="text-grey text-sm mb-6">Impossible de charger les données depuis Supabase.</p>
      <pre className="bg-grey-light text-grey text-xs p-3 rounded mb-6 text-left overflow-auto">{error}</pre>
      <button onClick={onRetry} className="bg-red text-white px-6 py-2.5 rounded font-bold text-sm bg-red-hover">
        Réessayer
      </button>
    </div>
  </div>
);

/* ===============================================================
   HEADER & FOOTER
=============================================================== */

const Header = ({ page, navigate, siteInfo }) => {
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
            <a href={`tel:${siteInfo.phone_raw}`} className="flex items-center gap-2 hover:text-red"><Phone size={14}/>{siteInfo.phone}</a>
            <span className="hidden md:inline text-grey">|</span>
            <a href={`mailto:${siteInfo.email}`} className="hidden md:flex items-center gap-2 hover:text-red"><Mail size={14}/>{siteInfo.email}</a>
          </div>
          <div className="flex items-center gap-3">
            {siteInfo.facebook && <a href={siteInfo.facebook} className="hover:text-red"><Facebook size={14}/></a>}
            {siteInfo.instagram && <a href={siteInfo.instagram} className="hover:text-red"><Instagram size={14}/></a>}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white border-b shadow-sm" style={{borderColor: '#E5E7EB'}}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-4 gap-4">
            <button onClick={() => navigate('home')} className="flex items-center gap-2 shrink-0">
              <div className="bg-red text-white px-3 py-2 font-black text-xl tracking-tight">TM</div>
              <div className="text-left">
                <div className="font-bold text-dark text-lg leading-tight">{siteInfo.name}</div>
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

            <a href={`tel:${siteInfo.phone_raw}`} className="hidden md:flex items-center gap-2 bg-red text-white px-4 py-2.5 rounded font-semibold text-sm bg-red-hover">
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
                <a href={`tel:${siteInfo.phone_raw}`} className="mt-2 flex items-center justify-center gap-2 bg-red text-white px-4 py-3 rounded font-semibold">
                  <Phone size={16}/>{siteInfo.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

const Footer = ({ navigate, openAdmin, siteInfo }) => (
  <footer className="bg-dark text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-red text-white px-3 py-2 font-black text-xl">TM</div>
            <div className="font-bold text-lg">{siteInfo.name}</div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {siteInfo.tagline}.
          </p>
          <div className="flex gap-3 mt-4">
            {siteInfo.facebook && <a href={siteInfo.facebook} className="w-9 h-9 bg-gray-700 hover:bg-red flex items-center justify-center rounded"><Facebook size={16}/></a>}
            {siteInfo.instagram && <a href={siteInfo.instagram} className="w-9 h-9 bg-gray-700 hover:bg-red flex items-center justify-center rounded"><Instagram size={16}/></a>}
            {siteInfo.whatsapp && <a href={`https://wa.me/${siteInfo.whatsapp.replace(/\D/g,'')}`} className="w-9 h-9 bg-gray-700 hover:bg-red flex items-center justify-center rounded"><MessageCircle size={16}/></a>}
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
            <li className="flex items-start gap-2"><Phone size={14} className="mt-0.5 shrink-0 text-red"/><a href={`tel:${siteInfo.phone_raw}`} className="hover:text-red">{siteInfo.phone}</a></li>
            {siteInfo.phone_alg && <li className="flex items-start gap-2"><Phone size={14} className="mt-0.5 shrink-0 text-red"/><a href={`tel:${siteInfo.phone_alg_raw}`} className="hover:text-red">{siteInfo.phone_alg}</a></li>}
            <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5 shrink-0 text-red"/><a href={`mailto:${siteInfo.email}`} className="hover:text-red break-all">{siteInfo.email}</a></li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-red"/>{siteInfo.address}<br/>{siteInfo.zip}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Horaires</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {(siteInfo.hours || []).map(h => (
              <li key={h.day} className="flex justify-between gap-2 pb-1 border-b border-gray-700">
                <span>{h.day}</span><span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between gap-3 text-xs text-gray-500">
        <div>© {new Date().getFullYear()} {siteInfo.name} — Tous droits réservés</div>
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
      <div className="text-2xl font-black text-red mb-3">{fmtEUR(v.price_eur)}</div>
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

const HomePage = ({ data, navigate, openVehicle }) => {
  const [searchType, setSearchType] = useState('all');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const brands = [...new Set(data.vehicles.map(v => v.brand))].sort();
  const recent = data.vehicles.slice(0, 8);
  const siteInfo = data.siteInfo;

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
              <Star size={12} fill="white"/>+5 ans d'expertise
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
              {siteInfo.name}
            </h1>
            <h2 className="text-xl md:text-2xl font-medium mb-6 text-gray-200">
              Spécialiste de l'<span className="text-red font-bold">export de véhicules</span> vers l'Algérie
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Véhicules neufs et d'occasion. Démarches douanières, transit maritime et livraison à Alger gérés intégralement.
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

      {recent.length > 0 && (
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
      )}

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
              { n: '04', icon: Check, t: 'Livraison', d: 'Dédouanement et remise des clés à Alger.' },
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
            <a href={`tel:${siteInfo.phone_raw}`} className="bg-red text-white px-6 py-3 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center gap-2 whitespace-nowrap">
              <Phone size={16}/>{siteInfo.phone}
            </a>
            {siteInfo.whatsapp && (
              <a href={`https://wa.me/${siteInfo.whatsapp.replace(/\D/g,'')}`} className="bg-[#25D366] text-white px-6 py-3 rounded font-bold uppercase text-sm tracking-wider hover:bg-[#1ebe57] flex items-center gap-2 whitespace-nowrap">
                <MessageCircle size={16}/>WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

/* ===============================================================
   PAGE — CATALOG
=============================================================== */

const CatalogPage = ({ data, filterType, openVehicle, navigate }) => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [fuelFilter, setFuelFilter] = useState('');
  const [transFilter, setTransFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('default');

  const brands = [...new Set(data.vehicles.map(v => v.brand))].sort();

  const filtered = useMemo(() => {
    let out = data.vehicles.filter(v => {
      if (filterType !== 'all' && v.type !== filterType) return false;
      if (search && !`${v.brand} ${v.model} ${v.version}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (brandFilter && v.brand !== brandFilter) return false;
      if (fuelFilter && v.fuel !== fuelFilter) return false;
      if (transFilter && v.transmission !== transFilter) return false;
      if (maxPrice && v.price_eur > parseInt(maxPrice)) return false;
      return true;
    });
    if (sort === 'price-asc') out = [...out].sort((a, b) => a.price_eur - b.price_eur);
    else if (sort === 'price-desc') out = [...out].sort((a, b) => b.price_eur - a.price_eur);
    else if (sort === 'year-desc') out = [...out].sort((a, b) => b.year - a.year);
    return out;
  }, [data.vehicles, filterType, search, brandFilter, fuelFilter, transFilter, maxPrice, sort]);

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
          <p className="text-gray-300 mt-2">{filtered.length} véhicule{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
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
            <button onClick={reset} className="bg-red text-white px-6 py-2.5 rounded font-bold text-sm bg-red-hover">Réinitialiser</button>
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

const VehicleDetailPage = ({ vehicle, data, navigate, openVehicle }) => {
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

  const similar = data.vehicles.filter(v => v.id !== vehicle.id && (v.body_type === vehicle.body_type || v.brand === vehicle.brand)).slice(0, 4);
  const equipment = Array.isArray(vehicle.equipment) ? vehicle.equipment : [];
  const siteInfo = data.siteInfo;

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
                <div className="text-4xl font-black text-red">{fmtEUR(vehicle.price_eur)}</div>
                <div className="text-xs text-grey mt-1">Frais de douane et transport inclus</div>
              </div>

              <div className="space-y-2 mb-6">
                <a href={`tel:${siteInfo.phone_raw}`} className="w-full bg-red text-white py-3.5 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center justify-center gap-2">
                  <Phone size={16}/>Appeler — {siteInfo.phone}
                </a>
                {siteInfo.whatsapp && (
                  <a href={`https://wa.me/${siteInfo.whatsapp.replace(/\D/g,'')}?text=Bonjour, je suis intéressé par le ${vehicle.brand} ${vehicle.model} ${vehicle.version}`} className="w-full bg-[#25D366] text-white py-3.5 rounded font-bold uppercase text-sm tracking-wider hover:bg-[#1ebe57] flex items-center justify-center gap-2">
                    <MessageCircle size={16}/>WhatsApp
                  </a>
                )}
                <button onClick={() => navigate('contact', vehicle)} className="w-full border-2 border-dark text-dark py-3 rounded font-bold uppercase text-sm tracking-wider hover:bg-dark hover:text-white flex items-center justify-center gap-2">
                  <Mail size={16}/>Demande par formulaire
                </button>
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
              { l: 'Carrosserie', v: vehicle.body_type },
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

          {equipment.length > 0 && (
            <>
              <h3 className="font-bold text-dark mb-3">Équipements</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {equipment.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-grey text-sm">
                    <Check size={16} className="text-red mt-0.5 shrink-0"/>{e}
                  </li>
                ))}
              </ul>
            </>
          )}
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
   PAGE — TESTIMONIALS / ABOUT / CONTACT
=============================================================== */

const TestimonialsPage = ({ data, navigate }) => (
  <main className="bg-grey-light min-h-screen">
    <section className="bg-dark text-white py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <button onClick={() => navigate('home')} className="text-gray-400 hover:text-red text-sm mb-3 flex items-center gap-1">
          <ChevronLeft size={14}/>Accueil
        </button>
        <h1 className="text-3xl md:text-4xl font-black">Témoignages clients</h1>
      </div>
    </section>

    <section className="max-w-5xl mx-auto px-4 lg:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Karim B.', city: 'Alger', text: "Service impeccable de A à Z. J'ai reçu mon véhicule à Alger en 19 jours. Toutes les démarches gérées. Je recommande." },
          { name: 'Sofiane M.', city: 'Oran', text: "Très bon contact dès le premier appel. Prix transparent, pas de mauvaises surprises. La voiture était comme promis." },
          { name: 'Yacine A.', city: 'Constantine', text: "Deuxième véhicule chez eux. Toujours sérieux et professionnels. Ils parlent français et arabe." },
          { name: 'Mohamed T.', city: 'Annaba', text: "Excellent suivi du dossier. L'équipe à Drancy m'a accompagné à chaque étape. Très satisfait." },
        ].map((t, i) => (
          <div key={i} className="bg-white rounded shadow-sm p-6">
            <div className="flex gap-1 mb-3">
              {Array.from({length: 5}).map((_, i) => <Star key={i} size={18} className="text-red" fill="#DC2626"/>)}
            </div>
            <p className="text-grey leading-relaxed mb-4">"{t.text}"</p>
            <div className="pt-4 border-t" style={{borderColor: '#E5E7EB'}}>
              <div className="font-bold text-dark">{t.name}</div>
              <div className="text-sm text-grey">{t.city}, Algérie</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

const AboutPage = ({ data, navigate }) => {
  const siteInfo = data.siteInfo;
  return (
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
              <div className="text-5xl font-black text-red mb-1">{new Date().getFullYear() - siteInfo.since}</div>
              <div className="text-sm text-grey font-semibold uppercase tracking-wider">Années d'expérience</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-red mb-1">100+</div>
              <div className="text-sm text-grey font-semibold uppercase tracking-wider">Véhicules livrés</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-red mb-1">4.8/5</div>
              <div className="text-sm text-grey font-semibold uppercase tracking-wider">Satisfaction client</div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-dark mb-4">{siteInfo.name}, votre spécialiste depuis {siteInfo.since}</h2>
          <p className="text-grey leading-relaxed mb-4 whitespace-pre-wrap">{siteInfo.about_story}</p>
          <p className="text-grey font-bold italic mt-6">{siteInfo.about_quote}</p>
        </div>

        <div className="bg-red text-white rounded p-8 mt-6 text-center">
          <h2 className="text-2xl font-black mb-2">Visitez notre showroom</h2>
          <p className="mb-6 text-white/90">{siteInfo.address}, {siteInfo.zip}</p>
          <button onClick={() => navigate('contact')} className="bg-white text-red px-6 py-3 rounded font-bold uppercase text-sm tracking-wider hover:bg-gray-100">
            Nous contacter
          </button>
        </div>
      </section>
    </main>
  );
};

const ContactPage = ({ data, vehicle, navigate }) => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    subject: vehicle ? `Demande info — ${vehicle.brand} ${vehicle.model}` : '',
    message: vehicle ? `Bonjour, je souhaite des informations pour l'export du ${vehicle.brand} ${vehicle.model} ${vehicle.version} vers l'Algérie.` : ''
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const siteInfo = data.siteInfo;

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from('contacts').insert([form]);
    setSending(false);
    if (error) {
      alert('Erreur : ' + error.message);
    } else {
      setSent(true);
      setForm({ name: '', email: '', phone: '', city: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 6000);
    }
  };

  return (
    <main className="bg-grey-light min-h-screen">
      <section className="bg-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <button onClick={() => navigate('home')} className="text-gray-400 hover:text-red text-sm mb-3 flex items-center gap-1">
            <ChevronLeft size={14}/>Accueil
          </button>
          <h1 className="text-3xl md:text-4xl font-black">Contactez-nous</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <a href={`tel:${siteInfo.phone_raw}`} className="bg-white rounded shadow-sm p-6 flex items-center gap-4 hover:shadow-md group">
              <div className="w-14 h-14 bg-red rounded flex items-center justify-center text-white shrink-0"><Phone size={24}/></div>
              <div>
                <div className="text-xs text-grey font-semibold uppercase tracking-wider">Bureau France</div>
                <div className="text-2xl font-black text-dark group-hover:text-red">{siteInfo.phone}</div>
              </div>
            </a>

            {siteInfo.phone_alg && (
              <a href={`tel:${siteInfo.phone_alg_raw}`} className="bg-white rounded shadow-sm p-6 flex items-center gap-4 hover:shadow-md group">
                <div className="w-14 h-14 bg-red rounded flex items-center justify-center text-white shrink-0"><Phone size={24}/></div>
                <div>
                  <div className="text-xs text-grey font-semibold uppercase tracking-wider">Bureau Algérie</div>
                  <div className="text-2xl font-black text-dark group-hover:text-red">{siteInfo.phone_alg}</div>
                </div>
              </a>
            )}

            {siteInfo.whatsapp && (
              <a href={`https://wa.me/${siteInfo.whatsapp.replace(/\D/g,'')}`} className="bg-[#25D366] text-white rounded shadow-sm p-6 flex items-center gap-4 hover:opacity-95">
                <div className="w-14 h-14 bg-white/20 rounded flex items-center justify-center shrink-0"><MessageCircle size={24}/></div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-90">WhatsApp</div>
                  <div className="text-xl font-black">Réponse immédiate</div>
                </div>
              </a>
            )}

            <a href={`mailto:${siteInfo.email}`} className="bg-white rounded shadow-sm p-6 flex items-center gap-4 hover:shadow-md group">
              <div className="w-14 h-14 bg-red rounded flex items-center justify-center text-white shrink-0"><Mail size={24}/></div>
              <div className="min-w-0">
                <div className="text-xs text-grey font-semibold uppercase tracking-wider">E-mail</div>
                <div className="text-lg font-bold text-dark group-hover:text-red break-all">{siteInfo.email}</div>
              </div>
            </a>

            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-6 flex items-center gap-4 border-b" style={{borderColor: '#E5E7EB'}}>
                <div className="w-14 h-14 bg-red rounded flex items-center justify-center text-white shrink-0"><MapPin size={24}/></div>
                <div>
                  <div className="text-xs text-grey font-semibold uppercase tracking-wider">Showroom</div>
                  <div className="font-bold text-dark">{siteInfo.address}</div>
                  <div className="text-sm text-grey">{siteInfo.zip}</div>
                </div>
              </div>
              <iframe title="Carte" width="100%" height="300" style={{border: 0}} loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(siteInfo.address + ' ' + siteInfo.zip)}&z=14&output=embed`}></iframe>
            </div>
          </div>

          <div className="bg-white rounded shadow-sm p-6 lg:p-8">
            <h2 className="text-2xl font-black text-dark mb-2">Envoyez-nous un message</h2>
            <p className="text-grey mb-6 text-sm">Réponse sous 24h ouvrées</p>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">Nom *</label>
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
              <button type="submit" disabled={sending} className="w-full bg-red text-white py-3.5 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center justify-center gap-2 disabled:opacity-50">
                {sending ? <><Loader2 size={16} className="anim-spin"/>Envoi...</> : <><Mail size={16}/>Envoyer le message</>}
              </button>
              {sent && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm flex items-center gap-2">
                  <Check size={16}/>Message envoyé. Nous revenons vers vous sous 24h.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

const WhatsAppFAB = ({ siteInfo }) => {
  if (!siteInfo.whatsapp) return null;
  return (
    <a href={`https://wa.me/${siteInfo.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] rounded-full flex items-center justify-center shadow-2xl">
      <span className="absolute inset-0 rounded-full bg-[#25D366] anim-pulse-ring"></span>
      <MessageCircle size={26} className="text-white relative z-10" strokeWidth={2}/>
    </a>
  );
};

/* ===============================================================
   ADMIN LOGIN
=============================================================== */

const AdminLogin = ({ onLogin, onCancel }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('*')
      .eq('username', u)
      .eq('password_hash', p)
      .single();
    setLoading(false);
    if (error || !data) {
      setErr('Identifiants incorrects.');
    } else {
      await supabase.from('admin_accounts').update({ last_login: new Date().toLocaleString('fr-FR') }).eq('id', data.id);
      onLogin({ username: data.username, role: data.role, id: data.id });
    }
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
            <div className="bg-red text-white w-10 h-10 rounded flex items-center justify-center"><Lock size={18}/></div>
            <div>
              <div className="font-black text-dark text-xl">Admin</div>
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
            <button type="submit" disabled={loading} className="w-full bg-red text-white py-3 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 size={14} className="anim-spin"/>Connexion...</> : 'Se connecter'}
            </button>
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

/* ===============================================================
   ADMIN — LAYOUT
=============================================================== */

const AdminLayout = ({ children, current, navAdmin, onLogout, user, data }) => {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'vehicles', icon: Car, label: 'Véhicules' },
    { id: 'articles', icon: FileText, label: 'Articles' },
    { id: 'gallery', icon: ImageIcon, label: 'Galerie' },
    { id: 'contacts', icon: Mail, label: 'Demandes contact' },
    { id: 'site-info', icon: SettingsIcon, label: 'Infos du site' },
    { id: 'accounts', icon: UserCog, label: 'Comptes admin' },
  ];
  return (
    <div className="min-h-screen bg-grey-light flex">
      <GlobalStyles />
      <aside className="w-64 bg-dark text-white flex flex-col h-screen sticky top-0">
        <div className="p-5 border-b border-gray-700">
          <div className="font-black text-lg">{data.siteInfo.name}</div>
          <div className="text-xs text-red uppercase tracking-wider mt-1">BackOffice</div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map(it => (
            <button key={it.id} onClick={() => navAdmin(it.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left rounded ${current === it.id ? 'bg-red text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
              <it.icon size={16}/>{it.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700 space-y-2">
          <div className="px-3 py-2 bg-gray-800 rounded">
            <div className="text-xs text-gray-400">Connecté</div>
            <div className="font-bold text-white text-sm">{user.username}</div>
            <div className="text-xs text-red">{user.role}</div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red">
            <LogOut size={14}/>Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
};

const Modal = ({ children, onClose, title }) => (
  <div onClick={onClose} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto cursor-pointer">
    <div onClick={e => e.stopPropagation()} className="bg-white rounded shadow-2xl w-full max-w-3xl my-8 cursor-default">
      <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white" style={{borderColor: '#E5E7EB'}}>
        <h3 className="font-black text-dark text-lg">{title}</h3>
        <button onClick={onClose} className="text-grey hover:text-dark"><X size={20}/></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const Field = ({ label, children, full }) => (
  <div className={full ? 'md:col-span-2' : ''}>
    <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">{label}</label>
    {children}
  </div>
);

const inp = "w-full border rounded px-3 py-2 text-sm focus:border-red outline-none";
const inpStyle = {borderColor: '#E5E7EB'};

const Toast = ({ msg, type = 'success' }) => (
  <div className={`fixed bottom-5 left-5 z-[100] px-4 py-3 rounded text-sm font-medium flex items-center gap-2 shadow-lg ${type === 'success' ? 'bg-green-600 text-white' : 'bg-red text-white'}`}>
    {type === 'success' ? <Check size={16}/> : <X size={16}/>}{msg}
  </div>
);

/* ===============================================================
   ADMIN — DASHBOARD
=============================================================== */

const AdminDashboard = ({ data }) => {
  const stats = [
    { label: 'Véhicules', val: data.vehicles.length, sub: `${data.vehicles.filter(v=>v.type==='neuf').length} neufs · ${data.vehicles.filter(v=>v.type==='occasion').length} occasions`, icon: Car },
    { label: 'Articles', val: data.articles.length, sub: 'publiés', icon: FileText },
    { label: 'Photos galerie', val: data.gallery.length, sub: '', icon: ImageIcon },
    { label: 'Demandes contact', val: data.contacts.length, sub: 'à traiter', icon: Mail },
  ];
  return (
    <div className="p-8">
      <h1 className="font-black text-dark text-3xl mb-2">Tableau de bord</h1>
      <p className="text-grey mb-8">Bienvenue dans votre espace de gestion</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded shadow-sm p-5">
            <s.icon className="text-red mb-3" size={20}/>
            <div className="text-xs text-grey font-semibold uppercase tracking-wider">{s.label}</div>
            <div className="font-black text-dark text-3xl mt-1">{s.val}</div>
            {s.sub && <div className="text-xs text-grey mt-1">{s.sub}</div>}
          </div>
        ))}
      </div>
      <div className="bg-white rounded shadow-sm p-6">
        <h3 className="font-black text-dark text-lg mb-4">Derniers véhicules ajoutés</h3>
        <ul className="divide-y" style={{borderColor: '#E5E7EB'}}>
          {data.vehicles.slice(0, 5).map(v => (
            <li key={v.id} className="flex items-center gap-4 py-3">
              <SafeImg src={v.image} alt="" className="w-14 h-10 shrink-0 rounded"/>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-dark text-sm truncate">{v.brand} {v.model}</div>
                <div className="text-xs text-grey">{v.year} · {fmtKm(v.mileage)}</div>
              </div>
              <div className="font-bold text-red text-sm">{fmtEUR(v.price_eur)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const AdminPageHeader = ({ title, onAdd, addLabel = "Ajouter" }) => (
  <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
    <h1 className="font-black text-dark text-3xl">{title}</h1>
    {onAdd && <button onClick={onAdd} className="bg-red text-white px-4 py-2 rounded font-bold text-sm bg-red-hover flex items-center gap-2"><Plus size={16}/>{addLabel}</button>}
  </div>
);

/* ===============================================================
   ADMIN — VEHICLES CRUD
=============================================================== */

const AdminVehicles = ({ data, refresh, showToast }) => {
  const [edit, setEdit] = useState(null);
  const [filter, setFilter] = useState('');
  const [saving, setSaving] = useState(false);

  const empty = { brand: '', model: '', version: '', type: 'neuf', year: 2025, mileage: 0, fuel: 'Essence', transmission: 'Manuelle', power: 100, color: '', doors: 5, seats: 5, price_eur: 0, body_type: 'Citadine', consumption: 0, emissions: 0, image: '', description: '', equipment: [], featured: false, price: 0 };

  const save = async (form) => {
    setSaving(true);
    const payload = { ...form };
    delete payload.created_at;
    let result;
    if (form.id) {
      const id = form.id;
      delete payload.id;
      result = await supabase.from('vehicles').update(payload).eq('id', id);
    } else {
      delete payload.id;
      result = await supabase.from('vehicles').insert([payload]);
    }
    setSaving(false);
    if (result.error) showToast('Erreur : ' + result.error.message, 'error');
    else { showToast(form.id ? 'Véhicule modifié' : 'Véhicule ajouté'); setEdit(null); refresh(); }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer ce véhicule ?')) return;
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) showToast('Erreur : ' + error.message, 'error');
    else { showToast('Véhicule supprimé'); refresh(); }
  };

  const filtered = data.vehicles.filter(v => `${v.brand} ${v.model} ${v.version || ''}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-8">
      <AdminPageHeader title="Véhicules" onAdd={() => setEdit({ ...empty })} addLabel="Ajouter un véhicule"/>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey"/>
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Rechercher..."
            className="w-full border rounded pl-9 pr-3 py-2 text-sm focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
        </div>
        <div className="text-xs text-grey">{filtered.length} / {data.vehicles.length}</div>
      </div>

      <div className="bg-white rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b" style={{borderColor: '#E5E7EB'}}>
            <tr className="text-xs uppercase tracking-wider text-grey">
              <th className="p-3">Photo</th><th className="p-3">Véhicule</th><th className="p-3">Type</th>
              <th className="p-3">Année</th><th className="p-3">Prix</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} className="border-b hover:bg-grey-light" style={{borderColor: '#E5E7EB'}}>
                <td className="p-3"><SafeImg src={v.image} alt="" className="w-14 h-10 rounded"/></td>
                <td className="p-3">
                  <div className="font-bold text-dark">{v.brand} {v.model}</div>
                  <div className="text-xs text-grey">{v.version}</div>
                </td>
                <td className="p-3"><span className={`text-xs uppercase font-bold px-2 py-1 rounded ${v.type === 'neuf' ? 'bg-red text-white' : 'bg-dark text-white'}`}>{v.type}</span></td>
                <td className="p-3 text-grey">{v.year}</td>
                <td className="p-3 font-bold text-red">{fmtEUR(v.price_eur)}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEdit({...v, equipment: Array.isArray(v.equipment) ? v.equipment : []})} className="p-1.5 text-grey hover:text-red rounded"><Edit2 size={14}/></button>
                    <button onClick={() => remove(v.id)} className="p-1.5 text-grey hover:text-red rounded"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-grey">Aucun véhicule</div>}
      </div>

      {edit && (
        <Modal title={edit.id ? `Modifier — ${edit.brand} ${edit.model}` : 'Nouveau véhicule'} onClose={() => setEdit(null)}>
          <form onSubmit={e => { e.preventDefault(); save(edit); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Marque *"><input required value={edit.brand} onChange={e => setEdit({...edit, brand: e.target.value})} className={inp} style={inpStyle}/></Field>
              <Field label="Modèle *"><input required value={edit.model} onChange={e => setEdit({...edit, model: e.target.value})} className={inp} style={inpStyle}/></Field>
              <Field label="Version" full><input value={edit.version || ''} onChange={e => setEdit({...edit, version: e.target.value})} className={inp} style={inpStyle}/></Field>
              <Field label="Type"><select value={edit.type} onChange={e => setEdit({...edit, type: e.target.value})} className={inp} style={inpStyle}><option value="neuf">Neuf</option><option value="occasion">Occasion</option></select></Field>
              <Field label="Carrosserie"><select value={edit.body_type} onChange={e => setEdit({...edit, body_type: e.target.value})} className={inp} style={inpStyle}>{BODY_TYPES.map(b => <option key={b}>{b}</option>)}</select></Field>
              <Field label="Année"><input type="number" value={edit.year} onChange={e => setEdit({...edit, year: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
              <Field label="Kilométrage"><input type="number" value={edit.mileage} onChange={e => setEdit({...edit, mileage: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
              <Field label="Carburant"><select value={edit.fuel} onChange={e => setEdit({...edit, fuel: e.target.value})} className={inp} style={inpStyle}>{FUELS.map(b => <option key={b}>{b}</option>)}</select></Field>
              <Field label="Boîte"><select value={edit.transmission} onChange={e => setEdit({...edit, transmission: e.target.value})} className={inp} style={inpStyle}>{TRANSMISSIONS.map(b => <option key={b}>{b}</option>)}</select></Field>
              <Field label="Puissance (ch)"><input type="number" value={edit.power} onChange={e => setEdit({...edit, power: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
              <Field label="Couleur"><input value={edit.color || ''} onChange={e => setEdit({...edit, color: e.target.value})} className={inp} style={inpStyle}/></Field>
              <Field label="Portes"><input type="number" value={edit.doors} onChange={e => setEdit({...edit, doors: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
              <Field label="Places"><input type="number" value={edit.seats} onChange={e => setEdit({...edit, seats: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
              <Field label="Prix EUR *"><input required type="number" value={edit.price_eur} onChange={e => setEdit({...edit, price_eur: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
              <Field label="URL Image" full><input value={edit.image || ''} onChange={e => setEdit({...edit, image: e.target.value})} className={inp} style={inpStyle} placeholder="https://..."/></Field>
              <Field label="Description" full><textarea rows={3} value={edit.description || ''} onChange={e => setEdit({...edit, description: e.target.value})} className={`${inp} resize-none`} style={inpStyle}/></Field>
              <Field label="Équipements (un par ligne)" full><textarea rows={4} value={(edit.equipment || []).join('\n')} onChange={e => setEdit({...edit, equipment: e.target.value.split('\n').filter(x => x.trim())})} className={`${inp} resize-none`} style={inpStyle}/></Field>
              <Field label="" full>
                <label className="flex items-center gap-2 text-dark cursor-pointer text-sm"><input type="checkbox" checked={edit.featured || false} onChange={e => setEdit({...edit, featured: e.target.checked})} className="w-4 h-4 accent-red"/>Mettre en avant sur la page d'accueil</label>
              </Field>
            </div>
            <div className="flex gap-2 pt-4 border-t" style={{borderColor: '#E5E7EB'}}>
              <button type="submit" disabled={saving} className="bg-red text-white px-5 py-2.5 rounded font-bold text-sm bg-red-hover flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 size={14} className="anim-spin"/> : <Save size={14}/>}{saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button type="button" onClick={() => setEdit(null)} className="border px-5 py-2.5 rounded font-bold text-sm text-grey hover:text-red hover:border-red" style={{borderColor: '#E5E7EB'}}>Annuler</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

/* ===============================================================
   ADMIN — ARTICLES
=============================================================== */

const AdminArticles = ({ data, refresh, showToast }) => {
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const empty = { category: 'Actualités', title: '', excerpt: '', content: '', image: '', date: new Date().toLocaleDateString('fr-FR'), author: 'admin', read_time: '5 min' };

  const save = async (form) => {
    setSaving(true);
    const payload = { ...form };
    let result;
    if (form.id) { const id = form.id; delete payload.id; delete payload.created_at; result = await supabase.from('articles').update(payload).eq('id', id); }
    else { delete payload.id; delete payload.created_at; result = await supabase.from('articles').insert([payload]); }
    setSaving(false);
    if (result.error) showToast('Erreur : ' + result.error.message, 'error');
    else { showToast('Article sauvegardé'); setEdit(null); refresh(); }
  };
  const remove = async (id) => {
    if (!confirm('Supprimer ?')) return;
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) showToast('Erreur : ' + error.message, 'error'); else { showToast('Article supprimé'); refresh(); }
  };

  return (
    <div className="p-8">
      <AdminPageHeader title="Articles" onAdd={() => setEdit({...empty})} addLabel="Nouvel article"/>
      <div className="bg-white rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b" style={{borderColor: '#E5E7EB'}}>
            <tr className="text-xs uppercase tracking-wider text-grey">
              <th className="p-3">Image</th><th className="p-3">Titre</th><th className="p-3">Catégorie</th><th className="p-3">Date</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.articles.map(a => (
              <tr key={a.id} className="border-b hover:bg-grey-light" style={{borderColor: '#E5E7EB'}}>
                <td className="p-3"><SafeImg src={a.image} alt="" className="w-14 h-10 rounded"/></td>
                <td className="p-3 font-bold text-dark">{a.title}</td>
                <td className="p-3"><span className="text-xs uppercase font-bold px-2 py-1 rounded bg-red/10 text-red">{a.category}</span></td>
                <td className="p-3 text-grey">{a.date}</td>
                <td className="p-3"><div className="flex justify-end gap-2">
                  <button onClick={() => setEdit({...a})} className="p-1.5 text-grey hover:text-red"><Edit2 size={14}/></button>
                  <button onClick={() => remove(a.id)} className="p-1.5 text-grey hover:text-red"><Trash2 size={14}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.articles.length === 0 && <div className="p-8 text-center text-grey">Aucun article</div>}
      </div>
      {edit && (
        <Modal title={edit.id ? 'Modifier article' : 'Nouvel article'} onClose={() => setEdit(null)}>
          <form onSubmit={e => { e.preventDefault(); save(edit); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Catégorie"><select value={edit.category} onChange={e => setEdit({...edit, category: e.target.value})} className={inp} style={inpStyle}>{ARTICLE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Auteur"><input value={edit.author || ''} onChange={e => setEdit({...edit, author: e.target.value})} className={inp} style={inpStyle}/></Field>
              <Field label="Date"><input value={edit.date || ''} onChange={e => setEdit({...edit, date: e.target.value})} className={inp} style={inpStyle}/></Field>
              <Field label="Temps lecture"><input value={edit.read_time || ''} onChange={e => setEdit({...edit, read_time: e.target.value})} className={inp} style={inpStyle}/></Field>
              <Field label="Titre *" full><input required value={edit.title} onChange={e => setEdit({...edit, title: e.target.value})} className={inp} style={inpStyle}/></Field>
              <Field label="Image URL" full><input value={edit.image || ''} onChange={e => setEdit({...edit, image: e.target.value})} className={inp} style={inpStyle}/></Field>
              <Field label="Extrait" full><textarea rows={2} value={edit.excerpt || ''} onChange={e => setEdit({...edit, excerpt: e.target.value})} className={`${inp} resize-none`} style={inpStyle}/></Field>
              <Field label="Contenu" full><textarea rows={6} value={edit.content || ''} onChange={e => setEdit({...edit, content: e.target.value})} className={`${inp} resize-none`} style={inpStyle}/></Field>
            </div>
            <div className="flex gap-2 pt-4 border-t" style={{borderColor: '#E5E7EB'}}>
              <button type="submit" disabled={saving} className="bg-red text-white px-5 py-2.5 rounded font-bold text-sm bg-red-hover flex items-center gap-2 disabled:opacity-50">{saving ? <Loader2 size={14} className="anim-spin"/> : <Save size={14}/>}Enregistrer</button>
              <button type="button" onClick={() => setEdit(null)} className="border px-5 py-2.5 rounded font-bold text-sm text-grey hover:text-red hover:border-red" style={{borderColor: '#E5E7EB'}}>Annuler</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

/* ===============================================================
   ADMIN — GALLERY
=============================================================== */

const AdminGallery = ({ data, refresh, showToast }) => {
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const save = async (form) => {
    setSaving(true);
    const payload = { ...form };
    let result;
    if (form.id) { const id = form.id; delete payload.id; result = await supabase.from('gallery').update(payload).eq('id', id); }
    else { delete payload.id; result = await supabase.from('gallery').insert([payload]); }
    setSaving(false);
    if (result.error) showToast('Erreur : ' + result.error.message, 'error');
    else { showToast('Photo sauvegardée'); setEdit(null); refresh(); }
  };
  const remove = async (id) => {
    if (!confirm('Supprimer ?')) return;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) showToast('Erreur : ' + error.message, 'error'); else { showToast('Photo supprimée'); refresh(); }
  };
  return (
    <div className="p-8">
      <AdminPageHeader title="Galerie" onAdd={() => setEdit({ src: '', caption: '', position: 0 })} addLabel="Ajouter une photo"/>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.gallery.map(g => (
          <div key={g.id} className="bg-white rounded shadow-sm overflow-hidden">
            <SafeImg src={g.src} alt="" className="aspect-square w-full"/>
            <div className="p-3">
              <div className="text-dark text-sm truncate font-medium">{g.caption}</div>
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setEdit({...g})} className="p-1 text-grey hover:text-red"><Edit2 size={12}/></button>
                <button onClick={() => remove(g.id)} className="p-1 text-grey hover:text-red"><Trash2 size={12}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <Modal title={edit.id ? 'Modifier photo' : 'Nouvelle photo'} onClose={() => setEdit(null)}>
          <form onSubmit={e => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="URL de l'image *"><input required value={edit.src} onChange={e => setEdit({...edit, src: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Légende"><input value={edit.caption || ''} onChange={e => setEdit({...edit, caption: e.target.value})} className={inp} style={inpStyle}/></Field>
            {edit.src && <SafeImg src={edit.src} alt="" className="aspect-video"/>}
            <div className="flex gap-2 pt-4 border-t" style={{borderColor: '#E5E7EB'}}>
              <button type="submit" disabled={saving} className="bg-red text-white px-5 py-2.5 rounded font-bold text-sm bg-red-hover flex items-center gap-2 disabled:opacity-50">{saving ? <Loader2 size={14} className="anim-spin"/> : <Save size={14}/>}Enregistrer</button>
              <button type="button" onClick={() => setEdit(null)} className="border px-5 py-2.5 rounded font-bold text-sm text-grey hover:text-red hover:border-red" style={{borderColor: '#E5E7EB'}}>Annuler</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

/* ===============================================================
   ADMIN — CONTACTS
=============================================================== */

const AdminContacts = ({ data, refresh, showToast }) => {
  const remove = async (id) => {
    if (!confirm('Supprimer cette demande ?')) return;
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) showToast('Erreur : ' + error.message, 'error'); else { showToast('Demande supprimée'); refresh(); }
  };
  return (
    <div className="p-8">
      <AdminPageHeader title="Demandes de contact"/>
      {data.contacts.length === 0 ? (
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <Mail size={48} className="mx-auto text-grey mb-4"/>
          <div className="font-black text-dark text-xl mb-2">Aucune demande pour l'instant</div>
          <div className="text-sm text-grey">Les demandes envoyées via le formulaire de contact apparaîtront ici.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {data.contacts.map(c => (
            <div key={c.id} className="bg-white rounded shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-black text-dark">{c.name}</div>
                  <div className="text-xs text-grey mt-0.5">
                    <a href={`mailto:${c.email}`} className="hover:text-red">{c.email}</a>
                    <span className="mx-1">·</span>
                    <a href={`tel:${c.phone}`} className="hover:text-red">{c.phone}</a>
                    {c.city && <><span className="mx-1">·</span>{c.city}</>}
                  </div>
                </div>
                <button onClick={() => remove(c.id)} className="p-1.5 text-grey hover:text-red"><Trash2 size={14}/></button>
              </div>
              {c.subject && <div className="font-bold text-dark mb-2 text-sm">{c.subject}</div>}
              <div className="text-grey text-sm whitespace-pre-wrap">{c.message}</div>
              <div className="text-xs text-grey mt-3 pt-3 border-t" style={{borderColor: '#E5E7EB'}}>
                Reçu le {new Date(c.created_at).toLocaleString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===============================================================
   ADMIN — SITE INFO
=============================================================== */

const AdminSiteInfo = ({ data, refresh, showToast }) => {
  const [f, setF] = useState(data.siteInfo);
  const [saving, setSaving] = useState(false);
  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...f };
    delete payload.id;
    const { error } = await supabase.from('site_info').update(payload).eq('id', 1);
    setSaving(false);
    if (error) showToast('Erreur : ' + error.message, 'error');
    else { showToast('Infos enregistrées'); refresh(); }
  };
  const updHour = (idx, key, val) => {
    const hours = [...(f.hours || [])];
    hours[idx] = { ...hours[idx], [key]: val };
    setF({ ...f, hours });
  };
  return (
    <div className="p-8">
      <AdminPageHeader title="Infos du site"/>
      <form onSubmit={save} className="bg-white rounded shadow-sm p-6 space-y-6 max-w-3xl">
        <div>
          <h3 className="font-black text-dark mb-3">Identité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nom du site"><input value={f.name || ''} onChange={e => setF({...f, name: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Tagline"><input value={f.tagline || ''} onChange={e => setF({...f, tagline: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Année fondation"><input type="number" value={f.since || ''} onChange={e => setF({...f, since: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
          </div>
        </div>

        <div className="pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
          <h3 className="font-black text-dark mb-3">Coordonnées</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="E-mail"><input value={f.email || ''} onChange={e => setF({...f, email: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Téléphone France"><input value={f.phone || ''} onChange={e => setF({...f, phone: e.target.value, phone_raw: e.target.value.replace(/\s/g,'')})} className={inp} style={inpStyle}/></Field>
            <Field label="Téléphone Algérie"><input value={f.phone_alg || ''} onChange={e => setF({...f, phone_alg: e.target.value, phone_alg_raw: e.target.value.replace(/\s/g,'')})} className={inp} style={inpStyle}/></Field>
            <Field label="WhatsApp"><input value={f.whatsapp || ''} onChange={e => setF({...f, whatsapp: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Adresse" full><input value={f.address || ''} onChange={e => setF({...f, address: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Code postal & ville"><input value={f.zip || ''} onChange={e => setF({...f, zip: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Pays"><input value={f.country || ''} onChange={e => setF({...f, country: e.target.value})} className={inp} style={inpStyle}/></Field>
          </div>
        </div>

        <div className="pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
          <h3 className="font-black text-dark mb-3">Réseaux sociaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Facebook URL"><input value={f.facebook || ''} onChange={e => setF({...f, facebook: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Instagram URL"><input value={f.instagram || ''} onChange={e => setF({...f, instagram: e.target.value})} className={inp} style={inpStyle}/></Field>
          </div>
        </div>

        <div className="pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
          <h3 className="font-black text-dark mb-3">Horaires</h3>
          <div className="space-y-2">
            {(f.hours || []).map((h, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-3">
                <input value={h.day} onChange={e => updHour(idx, 'day', e.target.value)} className={inp} style={inpStyle} placeholder="Jour"/>
                <input value={h.time} onChange={e => updHour(idx, 'time', e.target.value)} className={inp} style={inpStyle} placeholder="Horaire"/>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
          <h3 className="font-black text-dark mb-3">Page À propos</h3>
          <Field label="Histoire"><textarea rows={5} value={f.about_story || ''} onChange={e => setF({...f, about_story: e.target.value})} className={`${inp} resize-none`} style={inpStyle}/></Field>
          <div className="mt-4">
            <Field label="Citation / Signature"><input value={f.about_quote || ''} onChange={e => setF({...f, about_quote: e.target.value})} className={inp} style={inpStyle}/></Field>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
          <button type="submit" disabled={saving} className="bg-red text-white px-6 py-2.5 rounded font-bold text-sm bg-red-hover flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="anim-spin"/> : <Save size={14}/>}Enregistrer toutes les modifications
          </button>
        </div>
      </form>
    </div>
  );
};

/* ===============================================================
   ADMIN — ACCOUNTS
=============================================================== */

const AdminAccounts = ({ data, refresh, showToast }) => {
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const save = async (form) => {
    setSaving(true);
    const payload = { ...form };
    let result;
    if (form.id) { const id = form.id; delete payload.id; delete payload.created_at; result = await supabase.from('admin_accounts').update(payload).eq('id', id); }
    else { delete payload.id; delete payload.created_at; payload.last_login = 'Jamais'; result = await supabase.from('admin_accounts').insert([payload]); }
    setSaving(false);
    if (result.error) showToast('Erreur : ' + result.error.message, 'error');
    else { showToast('Compte sauvegardé'); setEdit(null); refresh(); }
  };
  const remove = async (id) => {
    if (!confirm('Supprimer ce compte ?')) return;
    const { error } = await supabase.from('admin_accounts').delete().eq('id', id);
    if (error) showToast('Erreur : ' + error.message, 'error'); else { showToast('Compte supprimé'); refresh(); }
  };
  return (
    <div className="p-8">
      <AdminPageHeader title="Comptes administrateurs" onAdd={() => setEdit({ username: '', email: '', password_hash: '', role: 'Éditeur' })} addLabel="Nouveau compte"/>
      <div className="bg-white rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b" style={{borderColor: '#E5E7EB'}}>
            <tr className="text-xs uppercase tracking-wider text-grey">
              <th className="p-3">Identifiant</th><th className="p-3">E-mail</th><th className="p-3">Rôle</th><th className="p-3">Dernière connexion</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.adminAccounts.map(a => (
              <tr key={a.id} className="border-b hover:bg-grey-light" style={{borderColor: '#E5E7EB'}}>
                <td className="p-3 font-bold text-dark">{a.username}</td>
                <td className="p-3 text-grey">{a.email}</td>
                <td className="p-3"><span className={`text-xs uppercase font-bold px-2 py-1 rounded ${a.role === 'Super Admin' ? 'bg-red text-white' : 'bg-dark text-white'}`}>{a.role}</span></td>
                <td className="p-3 text-grey text-xs">{a.last_login || 'Jamais'}</td>
                <td className="p-3"><div className="flex justify-end gap-2">
                  <button onClick={() => setEdit({...a})} className="p-1.5 text-grey hover:text-red"><Edit2 size={14}/></button>
                  <button onClick={() => remove(a.id)} className="p-1.5 text-grey hover:text-red"><Trash2 size={14}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {edit && (
        <Modal title={edit.id ? 'Modifier compte' : 'Nouveau compte'} onClose={() => setEdit(null)}>
          <form onSubmit={e => { e.preventDefault(); save(edit); }} className="space-y-4">
            <Field label="Identifiant *"><input required value={edit.username} onChange={e => setEdit({...edit, username: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="E-mail *"><input required type="email" value={edit.email || ''} onChange={e => setEdit({...edit, email: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Mot de passe *"><input required type="text" value={edit.password_hash || ''} onChange={e => setEdit({...edit, password_hash: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Rôle"><select value={edit.role} onChange={e => setEdit({...edit, role: e.target.value})} className={inp} style={inpStyle}><option>Super Admin</option><option>Éditeur</option><option>Modérateur</option></select></Field>
            <div className="flex gap-2 pt-4 border-t" style={{borderColor: '#E5E7EB'}}>
              <button type="submit" disabled={saving} className="bg-red text-white px-5 py-2.5 rounded font-bold text-sm bg-red-hover flex items-center gap-2 disabled:opacity-50">{saving ? <Loader2 size={14} className="anim-spin"/> : <Save size={14}/>}Enregistrer</button>
              <button type="button" onClick={() => setEdit(null)} className="border px-5 py-2.5 rounded font-bold text-sm text-grey hover:text-red hover:border-red" style={{borderColor: '#E5E7EB'}}>Annuler</button>
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
  const [data, setData] = useState({
    siteInfo: {}, vehicles: [], articles: [], gallery: [], adminAccounts: [], contacts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState('home');
  const [selected, setSelected] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [adminPage, setAdminPage] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      const [si, vh, ar, gl, ac, ct] = await Promise.all([
        supabase.from('site_info').select('*').eq('id', 1).single(),
        supabase.from('vehicles').select('*').order('id', { ascending: false }),
        supabase.from('articles').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery').select('*').order('position', { ascending: true }),
        supabase.from('admin_accounts').select('*').order('id', { ascending: true }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      ]);
      if (si.error) throw si.error;
      setData({
        siteInfo: si.data || {},
        vehicles: vh.data || [],
        articles: ar.data || [],
        gallery: gl.data || [],
        adminAccounts: ac.data || [],
        contacts: ct.data || [],
      });
      setLoading(false);
    } catch (err) {
      console.error('Erreur Supabase:', err);
      setError(err.message || JSON.stringify(err));
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const navigate = (p, payload) => {
    if (payload) setSelected(payload);
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const openVehicle = (v) => navigate('detail', v);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={() => { setError(null); setLoading(true); loadData(); }} />;

  if (showLogin && !adminUser) {
    return <AdminLogin onLogin={u => { setAdminUser(u); setShowLogin(false); }} onCancel={() => setShowLogin(false)} />;
  }

  if (adminUser) {
    let admEl;
    if (adminPage === 'dashboard') admEl = <AdminDashboard data={data} />;
    else if (adminPage === 'vehicles') admEl = <AdminVehicles data={data} refresh={loadData} showToast={showToast} />;
    else if (adminPage === 'articles') admEl = <AdminArticles data={data} refresh={loadData} showToast={showToast} />;
    else if (adminPage === 'gallery') admEl = <AdminGallery data={data} refresh={loadData} showToast={showToast} />;
    else if (adminPage === 'contacts') admEl = <AdminContacts data={data} refresh={loadData} showToast={showToast} />;
    else if (adminPage === 'site-info') admEl = <AdminSiteInfo data={data} refresh={loadData} showToast={showToast} />;
    else if (adminPage === 'accounts') admEl = <AdminAccounts data={data} refresh={loadData} showToast={showToast} />;
    return (
      <AdminLayout current={adminPage} navAdmin={setAdminPage} onLogout={() => setAdminUser(null)} user={adminUser} data={data}>
        {admEl}
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </AdminLayout>
    );
  }

  let pageEl;
  if (page === 'home') pageEl = <HomePage data={data} navigate={navigate} openVehicle={openVehicle} />;
  else if (page === 'catalog-neuf') pageEl = <CatalogPage data={data} filterType="neuf" openVehicle={openVehicle} navigate={navigate} />;
  else if (page === 'catalog-occasion') pageEl = <CatalogPage data={data} filterType="occasion" openVehicle={openVehicle} navigate={navigate} />;
  else if (page === 'detail') pageEl = <VehicleDetailPage vehicle={selected} data={data} navigate={navigate} openVehicle={openVehicle} />;
  else if (page === 'testimonials') pageEl = <TestimonialsPage data={data} navigate={navigate} />;
  else if (page === 'about') pageEl = <AboutPage data={data} navigate={navigate} />;
  else if (page === 'contact') pageEl = <ContactPage data={data} vehicle={selected} navigate={navigate} />;

  return (
    <div className="bg-white min-h-screen">
      <GlobalStyles />
      <Header page={page} navigate={navigate} siteInfo={data.siteInfo} />
      {pageEl}
      <Footer navigate={navigate} openAdmin={() => setShowLogin(true)} siteInfo={data.siteInfo} />
      <WhatsAppFAB siteInfo={data.siteInfo} />
    </div>
  );
}
