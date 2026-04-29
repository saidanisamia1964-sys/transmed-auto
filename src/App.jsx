import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Phone, Mail, MapPin, ChevronRight, ChevronLeft, X, Calendar, Fuel,
  Clock, Search, Menu, Check, Car, Cog, MessageCircle, Facebook,
  Instagram, Lock, Ship, FileCheck, ArrowRight, Star, Loader2,
  LayoutDashboard, UserCog, Save, Plus, Edit2, Trash2, LogOut,
  Settings as SettingsIcon, Upload, ImagePlus, Palette, DoorOpen,
  Users, Sparkles, Gauge, Package
} from 'lucide-react';
import { supabase } from './supabase.js';

/* ===============================================================
   CONSTANTES
=============================================================== */

const LOGO_URL = 'https://ckmpdtfaifghmsdntrhp.supabase.co/storage/v1/object/public/site-assets/Image1.jpg';

// Liste fixe des marques (~40 marques principales du marché Algérie/France)
const ALL_BRANDS = [
  // Françaises
  'Alpine', 'Citroën', 'DS', 'Dacia', 'Peugeot', 'Renault',
  // Allemandes
  'Audi', 'BMW', 'Mercedes-Benz', 'Mini', 'Opel', 'Porsche', 'Smart', 'Volkswagen',
  // Italiennes
  'Alfa Romeo', 'Fiat', 'Ferrari', 'Lancia', 'Maserati',
  // Japonaises
  'Honda', 'Lexus', 'Mazda', 'Mitsubishi', 'Nissan', 'Subaru', 'Suzuki', 'Toyota',
  // Coréennes
  'Hyundai', 'Kia', 'SsangYong',
  // Autres européennes
  'Cupra', 'Jaguar', 'Land Rover', 'Seat', 'Skoda', 'Volvo',
  // Américaines
  'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ford', 'Jeep', 'Tesla',
  // Chinoises (montée Algérie)
  'BYD', 'Chery', 'Geely', 'MG',
].sort();

const FUELS = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
const TRANSMISSIONS = ['Manuelle', 'Automatique'];
const BODY_TYPES = ['Citadine', 'Berline', 'SUV', 'Break', 'Coupé', 'Cabriolet', 'Monospace', 'Pick-up', 'Utilitaire'];
const AVAILABILITIES = ['Disponible', 'Arrivage', 'Sur commande'];

const fmtEUR = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' €';
const fmtKm = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' km';

const STORAGE_BUCKET = 'vehicle-photos';

const availabilityStyle = (a) => {
  if (a === 'Disponible') return 'bg-green-600 text-white';
  if (a === 'Arrivage') return 'bg-amber-500 text-white';
  if (a === 'Sur commande') return 'bg-blue-600 text-white';
  return 'bg-grey-light text-dark';
};

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
    .scrollbar-thin::-webkit-scrollbar { width: 8px; height: 8px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: #F3F4F6; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #9CA3AF; border-radius: 4px; }
    /* Logo : fond rouge avec logo en blanc/contraste */
    .logo-wrap-header { background: white; padding: 4px 8px; border-radius: 4px; }
    .logo-wrap-footer { background: white; padding: 4px 8px; border-radius: 4px; display: inline-block; }
  `}</style>
);

const SafeImg = ({ src, alt, className, fit = 'cover' }) => (
  <div className={`relative img-fallback overflow-hidden ${className || ''}`}>
    <img src={src} alt={alt} loading="lazy" className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
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
   STORAGE HELPERS
=============================================================== */

const uploadFile = async (file, vehicleId) => {
  const ext = file.name.split('.').pop();
  const fileName = `${vehicleId || 'tmp'}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
  return { url: urlData.publicUrl, path: fileName };
};

const deleteFile = async (path) => {
  if (!path) return;
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
};

/* ===============================================================
   LOGO COMPONENT
=============================================================== */

const Logo = ({ size = 'normal', white = false }) => {
  const heights = { small: 'h-8', normal: 'h-10', large: 'h-14' };
  return (
    <div className={`logo-wrap-header inline-flex items-center`}>
      <img src={LOGO_URL} alt="S2M Autos" className={`${heights[size]} w-auto object-contain`}
        onError={(e) => { e.target.style.display = 'none'; }}/>
    </div>
  );
};

/* ===============================================================
   HEADER & FOOTER
=============================================================== */

const Header = ({ page, navigate, siteInfo }) => {
  const [open, setOpen] = useState(false);
  const links = [
    { id: 'home', label: 'Accueil' },
    { id: 'catalog-neuf', label: 'Véhicules Neufs' },
    { id: 'catalog-occasion', label: 'Véhicules d'occasion' },
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
          <div className="flex items-center justify-between py-3 gap-4">
            <button onClick={() => navigate('home')} className="flex items-center gap-3 shrink-0">
              <img src={LOGO_URL} alt="S2M Autos" className="h-12 md:h-14 w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}/>
              <div className="text-left hidden sm:block">
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
          <div className="logo-wrap-footer mb-4">
            <img src={LOGO_URL} alt="S2M Autos" className="h-12 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}/>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{siteInfo.tagline}.</p>
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
  <button onClick={onClick} className="group text-left bg-white border rounded overflow-hidden hover:shadow-lg flex flex-col" style={{borderColor: '#E5E7EB'}}>
    <div className="relative aspect-[16/10] overflow-hidden">
      <SafeImg src={v.image} alt={`${v.brand} ${v.model}`} className="w-full h-full" fit="contain" />
      <div className={`absolute top-2 left-2 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded ${v.type === 'neuf' ? 'bg-red text-white' : 'bg-dark text-white'}`}>
        {v.type}
      </div>
      {v.availability && v.availability !== 'Disponible' && (
        <div className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded ${availabilityStyle(v.availability)}`}>
          {v.availability}
        </div>
      )}
    </div>
    <div className="p-4 flex flex-col flex-1">
      <div className="text-xs text-grey font-semibold uppercase tracking-wider mb-1">{v.brand}</div>
      <h3 className="font-bold text-dark text-xl leading-tight mb-1 group-hover:text-red">{v.model}</h3>
      <div className="text-xs text-grey mb-3 line-clamp-1">{v.version}</div>
      <div className="text-3xl font-black text-red mb-3">{fmtEUR(v.price_eur)}</div>

      {/* Specs étendues */}
      <div className="grid grid-cols-2 gap-2 text-xs text-grey pt-3 border-t mb-3" style={{borderColor: '#E5E7EB'}}>
        <div className="flex items-center gap-1.5"><Calendar size={12} className="text-red"/>{v.year}</div>
        <div className="flex items-center gap-1.5"><Gauge size={12} className="text-red"/>{fmtKm(v.mileage)}</div>
        <div className="flex items-center gap-1.5"><Fuel size={12} className="text-red"/>{v.fuel}</div>
        <div className="flex items-center gap-1.5"><Cog size={12} className="text-red"/>{v.transmission === 'Manuelle' ? 'BVM' : 'BVA'}</div>
        <div className="flex items-center gap-1.5"><Sparkles size={12} className="text-red"/>{v.power} ch</div>
        <div className="flex items-center gap-1.5"><Car size={12} className="text-red"/>{v.body_type}</div>
      </div>

      {/* Bouton Voir en détail */}
      <div className="mt-auto pt-2 flex justify-end">
        <span className="inline-flex items-center gap-1 bg-red text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider group-hover:bg-red-hover">
          Voir en détail <ArrowRight size={12}/>
        </span>
      </div>
    </div>
  </button>
);

/* ===============================================================
   PAGE — HOME
=============================================================== */

const HomePage = ({ data, navigate, openVehicle }) => {
  const [searchBrand, setSearchBrand] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  // Compter le nombre de véhicules par marque
  const brandCounts = useMemo(() => {
    const counts = {};
    data.vehicles.forEach(v => { counts[v.brand] = (counts[v.brand] || 0) + 1; });
    return counts;
  }, [data.vehicles]);

  // Modèles disponibles selon la marque sélectionnée
  const availableModels = useMemo(() => {
    if (!searchBrand) return [];
    const models = [...new Set(data.vehicles.filter(v => v.brand === searchBrand).map(v => v.model))];
    return models.sort();
  }, [data.vehicles, searchBrand]);

  // Trier les marques : celles avec véhicules en premier, puis le reste grisé
  const sortedBrands = useMemo(() => {
    const withCount = ALL_BRANDS.filter(b => brandCounts[b]).sort((a, b) => {
      if (brandCounts[b] !== brandCounts[a]) return brandCounts[b] - brandCounts[a];
      return a.localeCompare(b);
    });
    const withoutCount = ALL_BRANDS.filter(b => !brandCounts[b]);
    return [...withCount, ...withoutCount];
  }, [brandCounts]);

  const recent = data.vehicles.slice(0, 8);
  const siteInfo = data.siteInfo;

 const submitSearch = () => {
  // Aller sur le catalogue COMPLET (neufs + occasions)
  navigate('catalog-all');
};

  return (
    <main>
      <section className="relative bg-dark text-white overflow-hidden">
  <div className="absolute inset-0">
    <SafeImg src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80" alt="" className="w-full h-full opacity-25" />
    <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/70 to-dark"/>
  </div>

  <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-16 lg:py-20 text-center">
    {/* TITRE PRINCIPAL */}
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 text-red">
      {siteInfo.name}
    </h1>

    {/* SOUS-TITRE */}
    <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-8 text-white uppercase tracking-wide">
      Spécialiste de l'export de véhicules vers l'Algérie
    </h2>

    {/* DEUX LIENS NEUFS / OCCASIONS */}
    <div className="flex justify-center gap-6 md:gap-12 mb-6 text-base md:text-xl font-bold uppercase tracking-wider">
      <button onClick={() => navigate('catalog-neuf')} className="text-red hover:text-white border-b-4 border-red pb-2 transition-colors">
        Véhicules Neufs
      </button>
      <button onClick={() => navigate('catalog-occasion')} className="text-white hover:text-red border-b-4 border-transparent hover:border-red pb-2 transition-all">
        Véhicules Occasions
      </button>
    </div>

    {/* BARRE DE RECHERCHE COMPACTE */}
    <div className="bg-white rounded-full shadow-2xl p-2 max-w-3xl mx-auto flex flex-col md:flex-row items-stretch gap-2">
      <select value={searchBrand} onChange={e => { setSearchBrand(e.target.value); setSearchModel(''); }} 
        className="flex-1 px-4 py-3 text-dark rounded-full md:rounded-full focus:outline-none cursor-pointer text-sm font-medium">
        <option value="">Marques</option>
        {sortedBrands.map(b => {
          const count = brandCounts[b];
          return (
            <option key={b} value={b} disabled={!count} style={!count ? {color: '#9CA3AF'} : {}}>
              {b} {count ? `(${count})` : ''}
            </option>
          );
        })}
      </select>
      <select value={searchModel} onChange={e => setSearchModel(e.target.value)} disabled={!searchBrand}
        className="flex-1 px-4 py-3 text-dark rounded-full focus:outline-none cursor-pointer text-sm font-medium disabled:bg-grey-light disabled:cursor-not-allowed">
        <option value="">{searchBrand ? 'Modèle' : 'Modèle'}</option>
        {availableModels.map(m => <option key={m}>{m}</option>)}
      </select>
      <input type="number" placeholder="Prix Max" value={searchPrice} onChange={e => setSearchPrice(e.target.value)} 
        className="flex-1 px-4 py-3 text-dark rounded-full focus:outline-none text-sm font-medium"/>
      <button onClick={submitSearch} className="bg-red hover:bg-red-hover text-white w-full md:w-14 h-12 rounded-full flex items-center justify-center shrink-0">
        <Search size={20}/>
      </button>
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
              <button onClick={() => navigate('catalog-all')} className="text-red font-bold uppercase tracking-wider text-sm flex items-center gap-1 hover:gap-2">
                Voir tout le catalogue <ArrowRight size={14}/>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              { n: '04', icon: Check, t: 'Livraison', d: 'Livraison du véhicule' },
            ].map(s => (
              <div key={s.n} className="bg-white p-6 rounded shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red text-white w-12 h-12 rounded flex items-center justify-center"><s.icon size={20}/></div>
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
            <p className="text-gray-300">Notre équipe vous répond du lundi au samedi.</p>
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

  // Compter et trier les marques pour le filtre
  const brandCounts = useMemo(() => {
    const counts = {};
    data.vehicles.filter(v => filterType === 'all' || v.type === filterType).forEach(v => {
      counts[v.brand] = (counts[v.brand] || 0) + 1;
    });
    return counts;
  }, [data.vehicles, filterType]);

  const filtered = useMemo(() => {
    let out = data.vehicles.filter(v => {
      if (filterType !== 'all' && v.type !== filterType) return false;
      if (search && !`${v.brand} ${v.model} ${v.version || ''}`.toLowerCase().includes(search.toLowerCase())) return false;
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

  const title = filterType === 'neuf' ? 'Véhicules Neufs' : filterType === 'occasion' ? "Véhicules d'occasion" : 'Tous les Véhicules';

  // Trier marques avec compteurs
  const sortedBrands = useMemo(() => {
    const withCount = ALL_BRANDS.filter(b => brandCounts[b]).sort((a, b) => brandCounts[b] - brandCounts[a]);
    const withoutCount = ALL_BRANDS.filter(b => !brandCounts[b]);
    return [...withCount, ...withoutCount];
  }, [brandCounts]);

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
              {sortedBrands.map(b => {
                const count = brandCounts[b];
                return <option key={b} value={b} disabled={!count} style={!count ? {color: '#9CA3AF'} : {}}>{b} {count ? `(${count})` : ''}</option>;
              })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(v => <VehicleCard key={v.id} v={v} onClick={() => openVehicle(v)} />)}
          </div>
        )}
      </section>
    </main>
  );
};

/* ===============================================================
   PAGE — VEHICLE DETAIL (avec galerie photos + toutes caractéristiques)
=============================================================== */

const VehicleDetailPage = ({ vehicle, data, navigate, openVehicle }) => {
  const [mainImage, setMainImage] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      if (!vehicle) return;
      const { data: imgs } = await supabase.from('vehicle_images').select('*').eq('vehicle_id', vehicle.id).order('position', { ascending: true });
      setVehicleImages(imgs || []);
      setMainImage(vehicle.image);
    };
    loadImages();
  }, [vehicle]);

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
  const allImages = [{ url: vehicle.image, isMain: true }, ...vehicleImages.map(i => ({ url: i.url, isMain: false }))];

  // TOUTES les caractéristiques (affichage complet)
  const allSpecs = [
    { l: 'Marque', v: vehicle.brand, icon: Car },
    { l: 'Modèle', v: vehicle.model, icon: Car },
    { l: 'Version', v: vehicle.version, icon: Sparkles },
    { l: 'Type', v: vehicle.type === 'neuf' ? 'Neuf' : 'Occasion', icon: Star },
    { l: 'Année', v: vehicle.year, icon: Calendar },
    { l: 'Kilométrage', v: fmtKm(vehicle.mileage), icon: Gauge },
    { l: 'Carburant', v: vehicle.fuel, icon: Fuel },
    { l: 'Boîte de vitesses', v: vehicle.transmission, icon: Cog },
    { l: 'Puissance', v: `${vehicle.power} ch`, icon: Sparkles },
    { l: 'Carrosserie', v: vehicle.body_type, icon: Car },
    { l: 'Couleur', v: vehicle.color, icon: Palette },
    { l: 'Portes', v: vehicle.doors, icon: DoorOpen },
    { l: 'Places', v: vehicle.seats, icon: Users },
    { l: 'Disponibilité', v: vehicle.availability || 'Disponible', icon: Package },
  ].filter(s => s.v !== null && s.v !== undefined && s.v !== '');

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
  <div className="relative bg-grey-light">
    <SafeImg src={mainImage || vehicle.image} alt="" className="aspect-[4/3]" fit="contain" />
    <div className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${vehicle.type === 'neuf' ? 'bg-red text-white' : 'bg-dark text-white'}`}>
      {vehicle.type}
    </div>
    {/* FLECHES NAVIGATION */}
    {allImages.length > 1 && (
      <>
        <button onClick={() => {
          const currentIdx = allImages.findIndex(img => img.url === mainImage);
          const prevIdx = (currentIdx - 1 + allImages.length) % allImages.length;
          setMainImage(allImages[prevIdx].url);
        }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-dark rounded-full flex items-center justify-center shadow-lg" title="Photo précédente">
          <ChevronLeft size={20}/>
        </button>
        <button onClick={() => {
          const currentIdx = allImages.findIndex(img => img.url === mainImage);
          const nextIdx = (currentIdx + 1) % allImages.length;
          setMainImage(allImages[nextIdx].url);
        }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-dark rounded-full flex items-center justify-center shadow-lg" title="Photo suivante">
          <ChevronRight size={20}/>
        </button>
        {/* Compteur photos */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded text-xs font-bold">
          {allImages.findIndex(img => img.url === mainImage) + 1} / {allImages.length}
        </div>
      </>
    )}
  </div>
  {/* MINIATURES (gardées en plus des flèches) */}
  {allImages.length > 1 && (
    <div className="p-3 grid grid-cols-5 gap-2 bg-grey-light border-t" style={{borderColor: '#E5E7EB'}}>
      {allImages.map((img, i) => (
        <button key={i} onClick={() => setMainImage(img.url)}
          className={`relative aspect-[4/3] overflow-hidden rounded bg-white ${mainImage === img.url ? 'ring-2 ring-red' : 'opacity-70 hover:opacity-100'}`}>
          <SafeImg src={img.url} alt="" className="w-full h-full" fit="contain"/>
        </button>
      ))}
    </div>
  )}
</div>
            <div className="lg:col-span-5 p-6 lg:p-8">
              <div className="text-xs text-grey font-semibold uppercase tracking-wider mb-1">{vehicle.brand} · {vehicle.year}</div>
              <h1 className="text-2xl lg:text-3xl font-black text-dark mb-1">{vehicle.model}</h1>
              <div className="text-grey mb-4">{vehicle.version}</div>

              {/* BADGE DISPONIBILITÉ au-dessus du prix */}
              {vehicle.availability && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider mb-3 ${availabilityStyle(vehicle.availability)}`}>
                  <Package size={12}/>{vehicle.availability}
                </div>
              )}

              <div className="bg-grey-light p-4 rounded mb-6">
                <div className="text-xs text-grey font-semibold uppercase mb-1">Prix export Algérie</div>
                <div className="text-4xl font-black text-red">{fmtEUR(vehicle.price_eur)}</div>
              </div>

              <div className="space-y-2 mb-6">
                <a href={`tel:${siteInfo.phone_raw}`} className="w-full bg-red text-white py-3.5 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center justify-center gap-2">
                  <Phone size={16}/>Appeler — {siteInfo.phone}
                </a>
                {siteInfo.whatsapp && (
                  <a href={`https://wa.me/${siteInfo.whatsapp.replace(/\D/g,'')}?text=Bonjour, je suis intéressé par le ${vehicle.brand} ${vehicle.model} ${vehicle.version || ''}`} className="w-full bg-[#25D366] text-white py-3.5 rounded font-bold uppercase text-sm tracking-wider hover:bg-[#1ebe57] flex items-center justify-center gap-2">
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

        {/* TOUTES les caractéristiques en dessous */}
        <div className="bg-white rounded shadow-sm mt-6 p-6 lg:p-8">
          <h2 className="text-xl font-black text-dark mb-6">Toutes les caractéristiques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allSpecs.map((s, i) => (
              <div key={i} className="border-l-4 border-red pl-3 py-2 bg-grey-light/50 rounded-r">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon size={14} className="text-red"/>
                  <div className="text-xs text-grey font-semibold uppercase tracking-wider">{s.l}</div>
                </div>
                <div className="font-bold text-dark text-sm">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {(vehicle.description || equipment.length > 0) && (
          <div className="bg-white rounded shadow-sm mt-6 p-6 lg:p-8">
            {vehicle.description && (
              <>
                <h2 className="text-xl font-black text-dark mb-4">Description</h2>
                <p className="text-grey leading-relaxed mb-6 whitespace-pre-wrap">{vehicle.description}</p>
              </>
            )}
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
        )}

        {similar.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-black text-dark mb-4">Véhicules similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(v => <VehicleCard key={v.id} v={v} onClick={() => openVehicle(v)} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

/* ===============================================================
   PAGES — ABOUT & CONTACT
=============================================================== */

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
              <div className="text-5xl font-black text-red mb-1">{siteInfo.since ? new Date().getFullYear() - siteInfo.since : '—'}</div>
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
    message: vehicle ? `Bonjour, je souhaite des informations pour l'export du ${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} vers l'Algérie.` : ''
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const siteInfo = data.siteInfo;

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from('contacts').insert([form]);
    setSending(false);
    if (error) { alert('Erreur : ' + error.message); }
    else {
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
                src={`https://maps.google.com/maps?q=${encodeURIComponent((siteInfo.address || '') + ' ' + (siteInfo.zip || ''))}&z=14&output=embed`}></iframe>
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
      .from('admin_accounts').select('*').eq('username', u).eq('password_hash', p).single();
    setLoading(false);
    if (error || !data) setErr('Identifiants incorrects.');
    else {
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
              <input value={u} onChange={e => setU(e.target.value)} className="w-full border rounded px-3 py-2.5 focus:border-red outline-none" style={{borderColor: '#E5E7EB'}} placeholder="admin"/>
            </div>
            <div>
              <label className="text-xs text-grey font-semibold uppercase tracking-wider mb-1 block">Mot de passe</label>
              <input type="password" value={p} onChange={e => setP(e.target.value)} className="w-full border rounded px-3 py-2.5 focus:border-red outline-none" style={{borderColor: '#E5E7EB'}}/>
            </div>
            {err && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded">{err}</div>}
            <button type="submit" disabled={loading} className="w-full bg-red text-white py-3 rounded font-bold uppercase text-sm tracking-wider bg-red-hover flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 size={14} className="anim-spin"/>Connexion...</> : 'Se connecter'}
            </button>
          </form>
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
    { id: 'contacts', icon: Mail, label: 'Demandes contact' },
    { id: 'site-info', icon: SettingsIcon, label: 'Infos du site' },
    { id: 'accounts', icon: UserCog, label: 'Comptes admin' },
  ];
  return (
    <div className="min-h-screen bg-grey-light flex">
      <GlobalStyles />
      <aside className="w-64 bg-dark text-white flex flex-col h-screen sticky top-0">
        <div className="p-5 border-b border-gray-700">
          <div className="logo-wrap-footer mb-2">
            <img src={LOGO_URL} alt="" className="h-10 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}/>
          </div>
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

const Modal = ({ children, onClose, title, wide }) => (
  <div onClick={onClose} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto cursor-pointer">
    <div onClick={e => e.stopPropagation()} className={`bg-white rounded shadow-2xl w-full ${wide ? 'max-w-5xl' : 'max-w-3xl'} my-8 cursor-default`}>
      <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10" style={{borderColor: '#E5E7EB'}}>
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
const inpStyle = { borderColor: '#E5E7EB' };

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
    { label: 'Demandes contact', val: data.contacts.length, sub: 'à traiter', icon: Mail },
    { label: 'Comptes admin', val: data.adminAccounts.length, sub: '', icon: UserCog },
  ];
  return (
    <div className="p-8">
      <h1 className="font-black text-dark text-3xl mb-2">Tableau de bord</h1>
      <p className="text-grey mb-8">Bienvenue dans votre espace de gestion</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
          {data.vehicles.length === 0 && <li className="text-center py-6 text-grey text-sm">Aucun véhicule pour le moment</li>}
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
   ADMIN — VEHICLE FORM (2 ÉTAPES + DISPONIBILITÉ + LISTE MARQUES)
=============================================================== */

const VehicleForm = ({ vehicle, onClose, onSaved, showToast }) => {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedVehicleId, setSavedVehicleId] = useState(vehicle?.id || null);

  const [info, setInfo] = useState({
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    version: vehicle?.version || '',
    type: vehicle?.type || 'neuf',
    year: vehicle?.year || 2025,
    mileage: vehicle?.mileage || 0,
    fuel: vehicle?.fuel || 'Essence',
    transmission: vehicle?.transmission || 'Manuelle',
    power: vehicle?.power || 100,
    color: vehicle?.color || '',
    doors: vehicle?.doors || 5,
    seats: vehicle?.seats || 5,
    price_eur: vehicle?.price_eur || 0,
    body_type: vehicle?.body_type || 'Citadine',
    description: vehicle?.description || '',
    equipment: Array.isArray(vehicle?.equipment) ? vehicle.equipment : [],
    featured: vehicle?.featured || false,
    image: vehicle?.image || '',
    image_storage_path: vehicle?.image_storage_path || null,
    price: vehicle?.price || 0,
    availability: vehicle?.availability || 'Disponible',
  });

  // Equipment géré comme texte multi-lignes (pour permettre Entrée)
  const [equipmentText, setEquipmentText] = useState((Array.isArray(vehicle?.equipment) ? vehicle.equipment : []).join('\n'));

  const mainFileRef = useRef(null);
  const galleryFileRef = useRef(null);
  const [mainImage, setMainImage] = useState(vehicle?.image || '');
  const [mainImagePath, setMainImagePath] = useState(vehicle?.image_storage_path || null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    const loadExisting = async () => {
      if (vehicle?.id) {
        const { data: imgs } = await supabase.from('vehicle_images').select('*').eq('vehicle_id', vehicle.id).order('position', { ascending: true });
        setGalleryImages(imgs || []);
      }
    };
    loadExisting();
  }, [vehicle?.id]);

  const saveStep1 = async (e) => {
    e.preventDefault();
    if (!info.brand) { showToast('Veuillez choisir une marque', 'error'); return; }
    setSaving(true);
    // Convertir le texte equipment en tableau (split par retour à la ligne)
    const equipment = equipmentText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const payload = { ...info, equipment };
    let result, vId;
    if (savedVehicleId) {
      vId = savedVehicleId;
      result = await supabase.from('vehicles').update(payload).eq('id', vId);
    } else {
      result = await supabase.from('vehicles').insert([payload]).select().single();
      if (!result.error) {
        vId = result.data.id;
        setSavedVehicleId(vId);
      }
    }
    setSaving(false);
    if (result.error) {
      showToast('Erreur : ' + result.error.message, 'error');
      return;
    }
    showToast('Infos enregistrées — passez aux photos');
    setStep(2);
  };

  const handleMainUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Photo trop lourde (max 5 MB)', 'error'); return; }
    setUploadingMain(true);
    try {
      if (mainImagePath) await deleteFile(mainImagePath);
      const { url, path } = await uploadFile(file, savedVehicleId);
      setMainImage(url);
      setMainImagePath(path);
      await supabase.from('vehicles').update({ image: url, image_storage_path: path }).eq('id', savedVehicleId);
      showToast('Photo principale enregistrée');
    } catch (err) {
      showToast('Erreur upload : ' + err.message, 'error');
    }
    setUploadingMain(false);
    e.target.value = '';
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} trop lourd, ignoré`, 'error'); continue; }
        const { url, path } = await uploadFile(file, savedVehicleId);
        const position = galleryImages.length + 1;
        const { data: newImg } = await supabase.from('vehicle_images').insert([{
          vehicle_id: savedVehicleId, url, storage_path: path, position,
        }]).select().single();
        setGalleryImages(prev => [...prev, newImg]);
      }
      showToast(`${files.length} photo${files.length > 1 ? 's' : ''} ajoutée${files.length > 1 ? 's' : ''}`);
    } catch (err) {
      showToast('Erreur upload : ' + err.message, 'error');
    }
    setUploadingGallery(false);
    e.target.value = '';
  };

  const removeGalleryImage = async (img) => {
    if (!confirm('Supprimer cette photo ?')) return;
    await deleteFile(img.storage_path);
    await supabase.from('vehicle_images').delete().eq('id', img.id);
    setGalleryImages(prev => prev.filter(x => x.id !== img.id));
    showToast('Photo supprimée');
  };

  const setAsMain = async (img) => {
    const oldMain = mainImage;
    const oldMainPath = mainImagePath;
    setMainImage(img.url);
    setMainImagePath(img.storage_path);
    await supabase.from('vehicles').update({ image: img.url, image_storage_path: img.storage_path }).eq('id', savedVehicleId);
    if (oldMain && oldMainPath) {
      const newPos = galleryImages.length + 1;
      const { data: newGalleryItem } = await supabase.from('vehicle_images').insert([{
        vehicle_id: savedVehicleId, url: oldMain, storage_path: oldMainPath, position: newPos,
      }]).select().single();
      await supabase.from('vehicle_images').delete().eq('id', img.id);
      setGalleryImages(prev => prev.filter(x => x.id !== img.id).concat(newGalleryItem));
    } else {
      await supabase.from('vehicle_images').delete().eq('id', img.id);
      setGalleryImages(prev => prev.filter(x => x.id !== img.id));
    }
    showToast('Photo principale changée');
  };

  const finish = () => { onSaved(); onClose(); };

  return (
    <Modal title={vehicle?.id ? `Modifier — ${vehicle.brand} ${vehicle.model}` : 'Nouveau véhicule'} onClose={onClose} wide>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{borderColor: '#E5E7EB'}}>
        <div className={`flex items-center gap-2 ${step === 1 ? 'text-red' : 'text-grey'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-red text-white' : savedVehicleId ? 'bg-green-500 text-white' : 'bg-grey-light text-grey'}`}>
            {savedVehicleId && step !== 1 ? <Check size={16}/> : '1'}
          </div>
          <span className="font-bold text-sm uppercase tracking-wider">Informations</span>
        </div>
        <div className="flex-1 h-px bg-grey-light"/>
        <div className={`flex items-center gap-2 ${step === 2 ? 'text-red' : 'text-grey'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-red text-white' : 'bg-grey-light text-grey'}`}>2</div>
          <span className="font-bold text-sm uppercase tracking-wider">Photos</span>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={saveStep1} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Marque *">
              <select required value={info.brand} onChange={e => setInfo({...info, brand: e.target.value})} className={inp} style={inpStyle}>
                <option value="">— Choisir une marque —</option>
                {ALL_BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Modèle *"><input required value={info.model} onChange={e => setInfo({...info, model: e.target.value})} className={inp} style={inpStyle} placeholder="ex: 3008"/></Field>
            <Field label="Version" full><input value={info.version} onChange={e => setInfo({...info, version: e.target.value})} className={inp} style={inpStyle} placeholder="ex: GT BlueHDi 130 EAT8"/></Field>
            <Field label="Type"><select value={info.type} onChange={e => setInfo({...info, type: e.target.value})} className={inp} style={inpStyle}><option value="neuf">Neuf</option><option value="occasion">Occasion</option></select></Field>
            <Field label="Disponibilité">
              <select value={info.availability} onChange={e => setInfo({...info, availability: e.target.value})} className={inp} style={inpStyle}>
                {AVAILABILITIES.map(a => <option key={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Carrosserie"><select value={info.body_type} onChange={e => setInfo({...info, body_type: e.target.value})} className={inp} style={inpStyle}>{BODY_TYPES.map(b => <option key={b}>{b}</option>)}</select></Field>
            <Field label="Année"><input type="number" value={info.year} onChange={e => setInfo({...info, year: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
            <Field label="Kilométrage"><input type="number" value={info.mileage} onChange={e => setInfo({...info, mileage: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
            <Field label="Carburant"><select value={info.fuel} onChange={e => setInfo({...info, fuel: e.target.value})} className={inp} style={inpStyle}>{FUELS.map(b => <option key={b}>{b}</option>)}</select></Field>
            <Field label="Boîte"><select value={info.transmission} onChange={e => setInfo({...info, transmission: e.target.value})} className={inp} style={inpStyle}>{TRANSMISSIONS.map(b => <option key={b}>{b}</option>)}</select></Field>
            <Field label="Puissance (ch)"><input type="number" value={info.power} onChange={e => setInfo({...info, power: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
            <Field label="Couleur"><input value={info.color} onChange={e => setInfo({...info, color: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Portes"><input type="number" value={info.doors} onChange={e => setInfo({...info, doors: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
            <Field label="Places"><input type="number" value={info.seats} onChange={e => setInfo({...info, seats: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
            <Field label="Prix EUR *"><input required type="number" value={info.price_eur} onChange={e => setInfo({...info, price_eur: parseInt(e.target.value)})} className={inp} style={inpStyle}/></Field>
            <Field label="Description" full><textarea rows={3} value={info.description} onChange={e => setInfo({...info, description: e.target.value})} className={`${inp} resize-none`} style={inpStyle}/></Field>
            <Field label="Équipements (un par ligne — appuyez sur Entrée pour aller à la ligne)" full>
              <textarea rows={6} value={equipmentText} onChange={e => setEquipmentText(e.target.value)}
                placeholder={"GPS\nClimatisation auto\nCaméra de recul\nJantes 17"}
                className={`${inp} resize-y font-mono text-xs`} style={inpStyle}/>
            </Field>
            <Field label="" full>
              <label className="flex items-center gap-2 text-dark cursor-pointer text-sm"><input type="checkbox" checked={info.featured} onChange={e => setInfo({...info, featured: e.target.checked})} className="w-4 h-4 accent-red"/>Mettre en avant sur la page d'accueil</label>
            </Field>
          </div>
          <div className="flex justify-between pt-4 border-t" style={{borderColor: '#E5E7EB'}}>
            <button type="button" onClick={onClose} className="border px-5 py-2.5 rounded font-bold text-sm text-grey hover:text-red hover:border-red" style={inpStyle}>Annuler</button>
            <button type="submit" disabled={saving} className="bg-red text-white px-6 py-2.5 rounded font-bold text-sm bg-red-hover flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 size={14} className="anim-spin"/> : null}
              {saving ? 'Enregistrement...' : (savedVehicleId ? 'Mettre à jour et passer aux photos' : 'Enregistrer et passer aux photos')}
              <ChevronRight size={14}/>
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-black text-dark mb-3">Photo principale</h3>
            <p className="text-sm text-grey mb-4">C'est la photo qui s'affichera dans le catalogue et en grand sur la fiche.</p>
            {mainImage ? (
              <div className="relative inline-block">
                <SafeImg src={mainImage} alt="" className="w-64 aspect-[4/3] rounded border" style={inpStyle}/>
                <button type="button" onClick={() => mainFileRef.current?.click()} className="absolute bottom-2 right-2 bg-red text-white px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1 bg-red-hover">
                  <Upload size={12}/>Changer
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => mainFileRef.current?.click()} disabled={uploadingMain}
                className="w-64 aspect-[4/3] border-2 border-dashed rounded flex flex-col items-center justify-center hover:border-red text-grey hover:text-red disabled:opacity-50" style={inpStyle}>
                {uploadingMain ? <Loader2 size={24} className="anim-spin mb-2"/> : <ImagePlus size={32} className="mb-2"/>}
                <span className="font-bold text-sm">{uploadingMain ? 'Upload...' : 'Choisir une photo'}</span>
                <span className="text-xs mt-1">JPG, PNG (max 5 MB)</span>
              </button>
            )}
            <input ref={mainFileRef} type="file" accept="image/*" onChange={handleMainUpload} className="hidden"/>
          </div>

          <div className="pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
              <div>
                <h3 className="font-black text-dark">Photos secondaires (galerie)</h3>
                <p className="text-sm text-grey">Photos additionnelles affichées sur la fiche véhicule.</p>
              </div>
              <button type="button" onClick={() => galleryFileRef.current?.click()} disabled={uploadingGallery}
                className="bg-red text-white px-4 py-2 rounded font-bold text-sm bg-red-hover flex items-center gap-2 disabled:opacity-50">
                {uploadingGallery ? <Loader2 size={14} className="anim-spin"/> : <Upload size={14}/>}
                {uploadingGallery ? 'Upload...' : 'Ajouter des photos'}
              </button>
              <input ref={galleryFileRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden"/>
            </div>

            {galleryImages.length === 0 ? (
              <div className="border-2 border-dashed rounded p-8 text-center text-grey" style={inpStyle}>
                <ImagePlus size={32} className="mx-auto mb-2"/>
                <p className="text-sm">Aucune photo secondaire</p>
                <p className="text-xs mt-1">Tu peux uploader plusieurs photos d'un coup</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {galleryImages.map(img => (
                  <div key={img.id} className="relative group border rounded overflow-hidden" style={inpStyle}>
                    <SafeImg src={img.url} alt="" className="aspect-[4/3]"/>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button type="button" onClick={() => setAsMain(img)} title="Définir comme principale"
                        className="bg-white text-dark px-2 py-1 rounded font-bold text-xs flex items-center gap-1 hover:bg-red hover:text-white">
                        <Star size={12}/>Principale
                      </button>
                      <button type="button" onClick={() => removeGalleryImage(img)} title="Supprimer"
                        className="bg-white text-dark p-1.5 rounded hover:bg-red hover:text-white">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
            <button type="button" onClick={() => setStep(1)} className="border px-5 py-2.5 rounded font-bold text-sm text-grey hover:text-red hover:border-red flex items-center gap-2" style={inpStyle}>
              <ChevronLeft size={14}/>Retour aux infos
            </button>
            <button type="button" onClick={finish} className="bg-red text-white px-6 py-2.5 rounded font-bold text-sm bg-red-hover flex items-center gap-2">
              <Check size={14}/>Terminer
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

/* ===============================================================
   ADMIN — VEHICLES LIST
=============================================================== */

const AdminVehicles = ({ data, refresh, showToast }) => {
  const [edit, setEdit] = useState(null);
  const [filter, setFilter] = useState('');

  const remove = async (vehicle) => {
    if (!confirm(`Supprimer "${vehicle.brand} ${vehicle.model}" ? Cette action supprimera aussi toutes ses photos.`)) return;
    const { data: imgs } = await supabase.from('vehicle_images').select('storage_path').eq('vehicle_id', vehicle.id);
    if (imgs) {
      const paths = imgs.filter(i => i.storage_path).map(i => i.storage_path);
      if (paths.length) await supabase.storage.from(STORAGE_BUCKET).remove(paths);
    }
    if (vehicle.image_storage_path) await deleteFile(vehicle.image_storage_path);
    const { error } = await supabase.from('vehicles').delete().eq('id', vehicle.id);
    if (error) showToast('Erreur : ' + error.message, 'error');
    else { showToast('Véhicule supprimé'); refresh(); }
  };

  const filtered = data.vehicles.filter(v => `${v.brand} ${v.model} ${v.version || ''}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-8">
      <AdminPageHeader title="Véhicules" onAdd={() => setEdit({})} addLabel="Ajouter un véhicule"/>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey"/>
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Rechercher..."
            className="w-full border rounded pl-9 pr-3 py-2 text-sm focus:border-red outline-none" style={inpStyle}/>
        </div>
        <div className="text-xs text-grey">{filtered.length} / {data.vehicles.length}</div>
      </div>

      <div className="bg-white rounded shadow-sm overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-sm">
          <thead className="border-b" style={inpStyle}>
            <tr className="text-xs uppercase tracking-wider text-grey">
              <th className="p-3">Photo</th><th className="p-3">Véhicule</th><th className="p-3">Type</th>
              <th className="p-3">Dispo</th><th className="p-3">Année</th><th className="p-3">Prix</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id} className="border-b hover:bg-grey-light" style={inpStyle}>
                <td className="p-3"><SafeImg src={v.image} alt="" className="w-14 h-10 rounded"/></td>
                <td className="p-3">
                  <div className="font-bold text-dark">{v.brand} {v.model}</div>
                  <div className="text-xs text-grey">{v.version}</div>
                </td>
                <td className="p-3"><span className={`text-xs uppercase font-bold px-2 py-1 rounded ${v.type === 'neuf' ? 'bg-red text-white' : 'bg-dark text-white'}`}>{v.type}</span></td>
                <td className="p-3"><span className={`text-xs uppercase font-bold px-2 py-1 rounded ${availabilityStyle(v.availability || 'Disponible')}`}>{v.availability || 'Disponible'}</span></td>
                <td className="p-3 text-grey">{v.year}</td>
                <td className="p-3 font-bold text-red">{fmtEUR(v.price_eur)}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEdit(v)} className="p-1.5 text-grey hover:text-red rounded" title="Modifier"><Edit2 size={14}/></button>
                    <button onClick={() => remove(v)} className="p-1.5 text-grey hover:text-red rounded" title="Supprimer"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-grey">{data.vehicles.length === 0 ? 'Aucun véhicule. Cliquez sur "Ajouter un véhicule" pour commencer.' : 'Aucun résultat'}</div>}
      </div>

      {edit !== null && (
        <VehicleForm
          vehicle={edit.id ? edit : null}
          onClose={() => setEdit(null)}
          onSaved={refresh}
          showToast={showToast}
        />
      )}
    </div>
  );
};

/* ===============================================================
   ADMIN — CONTACTS (corrigé : recharge correctement)
=============================================================== */

const AdminContacts = ({ data, refresh, showToast }) => {
  const [loading, setLoading] = useState(false);

  // Recharger les données depuis Supabase au montage
  useEffect(() => {
    const reload = async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    };
    reload();
  }, []);

  const contacts = data.contacts || [];

  const remove = async (id) => {
    if (!confirm('Supprimer cette demande ?')) return;
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) showToast('Erreur : ' + error.message, 'error');
    else {
      showToast('Demande supprimée');
      refresh();
    }
  };

  return (
    <div className="p-8">
      <AdminPageHeader title="Demandes de contact"/>
      {loading ? (
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <Loader2 size={32} className="anim-spin mx-auto text-red mb-4"/>
          <p className="text-grey text-sm">Chargement des demandes...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded shadow-sm p-12 text-center">
          <Mail size={48} className="mx-auto text-grey mb-4"/>
          <div className="font-black text-dark text-xl mb-2">Aucune demande pour l'instant</div>
          <div className="text-sm text-grey">Les demandes envoyées via le formulaire de contact apparaîtront ici.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(c => (
            <div key={c.id} className="bg-white rounded shadow-sm p-5">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="min-w-0">
                  <div className="font-black text-dark">{c.name}</div>
                  <div className="text-xs text-grey mt-0.5 flex flex-wrap gap-x-2">
                    <a href={`mailto:${c.email}`} className="hover:text-red break-all">{c.email}</a>
                    <span>·</span>
                    <a href={`tel:${c.phone}`} className="hover:text-red">{c.phone}</a>
                    {c.city && <><span>·</span>{c.city}</>}
                  </div>
                </div>
                <button onClick={() => remove(c.id)} className="p-1.5 text-grey hover:text-red shrink-0"><Trash2 size={14}/></button>
              </div>
              {c.subject && <div className="font-bold text-dark mb-2 text-sm">{c.subject}</div>}
              <div className="text-grey text-sm whitespace-pre-wrap">{c.message}</div>
              <div className="text-xs text-grey mt-3 pt-3 border-t" style={inpStyle}>
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

        <div className="pt-6 border-t" style={inpStyle}>
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

        <div className="pt-6 border-t" style={inpStyle}>
          <h3 className="font-black text-dark mb-3">Réseaux sociaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Facebook URL"><input value={f.facebook || ''} onChange={e => setF({...f, facebook: e.target.value})} className={inp} style={inpStyle}/></Field>
            <Field label="Instagram URL"><input value={f.instagram || ''} onChange={e => setF({...f, instagram: e.target.value})} className={inp} style={inpStyle}/></Field>
          </div>
        </div>

        <div className="pt-6 border-t" style={inpStyle}>
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

        <div className="pt-6 border-t" style={inpStyle}>
          <h3 className="font-black text-dark mb-3">Page À propos</h3>
          <Field label="Histoire"><textarea rows={5} value={f.about_story || ''} onChange={e => setF({...f, about_story: e.target.value})} className={`${inp} resize-none`} style={inpStyle}/></Field>
          <div className="mt-4">
            <Field label="Citation / Signature"><input value={f.about_quote || ''} onChange={e => setF({...f, about_quote: e.target.value})} className={inp} style={inpStyle}/></Field>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t" style={inpStyle}>
          <button type="submit" disabled={saving} className="bg-red text-white px-6 py-2.5 rounded font-bold text-sm bg-red-hover flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="anim-spin"/> : <Save size={14}/>}Enregistrer
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
          <thead className="border-b" style={inpStyle}>
            <tr className="text-xs uppercase tracking-wider text-grey">
              <th className="p-3">Identifiant</th><th className="p-3">E-mail</th><th className="p-3">Rôle</th><th className="p-3">Dernière connexion</th><th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.adminAccounts.map(a => (
              <tr key={a.id} className="border-b hover:bg-grey-light" style={inpStyle}>
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
            <div className="flex gap-2 pt-4 border-t" style={inpStyle}>
              <button type="submit" disabled={saving} className="bg-red text-white px-5 py-2.5 rounded font-bold text-sm bg-red-hover flex items-center gap-2 disabled:opacity-50">{saving ? <Loader2 size={14} className="anim-spin"/> : <Save size={14}/>}Enregistrer</button>
              <button type="button" onClick={() => setEdit(null)} className="border px-5 py-2.5 rounded font-bold text-sm text-grey hover:text-red hover:border-red" style={inpStyle}>Annuler</button>
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
    siteInfo: {}, vehicles: [], adminAccounts: [], contacts: []
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
      const [si, vh, ac, ct] = await Promise.all([
        supabase.from('site_info').select('*').eq('id', 1).single(),
        supabase.from('vehicles').select('*').order('id', { ascending: false }),
        supabase.from('admin_accounts').select('*').order('id', { ascending: true }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      ]);
      if (si.error) throw si.error;
      setData({
        siteInfo: si.data || {},
        vehicles: vh.data || [],
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
  else if (page === 'catalog-all') pageEl = <CatalogPage data={data} filterType="all" openVehicle={openVehicle} navigate={navigate} />;
  else if (page === 'catalog-neuf') pageEl = <CatalogPage data={data} filterType="neuf" openVehicle={openVehicle} navigate={navigate} />;
  else if (page === 'catalog-occasion') pageEl = <CatalogPage data={data} filterType="occasion" openVehicle={openVehicle} navigate={navigate} />;
  else if (page === 'detail') pageEl = <VehicleDetailPage vehicle={selected} data={data} navigate={navigate} openVehicle={openVehicle} />;
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
