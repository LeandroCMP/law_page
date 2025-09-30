import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./components/src/ui/button";
import { Card, CardContent } from "./components/src/ui/card";

import {
  Phone,
  Mail,
  Scale,
  Gavel,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Handshake,
  Building2,
  Instagram,
  Linkedin,
  Clock3,
  X,
} from "lucide-react";
import { useEffect, useState, useRef, type JSX } from "react";

// Fallback seguro para URLs da Zyro (remove transformações do CDN caso haja bloqueio de hotlink)
function fallbackAsset(url: string) {
  try {
    // remove o segmento "/cdn-cgi/image/.../" mantendo o caminho final
    return url.replace(/\/cdn-cgi\/image\/[^/]+\//, '/');
  } catch { return url; }
}

// Máscara de telefone (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  // Evita travar parênteses ao apagar: só aplica () quando houver 3+ dígitos
  if (d.length < 3) return d;
  const p1 = d.slice(0, 2);
  if (d.length <= 10) {
    const p2 = d.slice(2, 6);
    const p3 = d.slice(6, 10);
    return "(" + p1 + ") " + p2 + (p3 ? "-" + p3 : "");
  }
  const p2 = d.slice(2, 7);
  const p3 = d.slice(7, 11);
  return "(" + p1 + ") " + p2 + (p3 ? "-" + p3 : "");
}

// --- Paleta consistente ---
const COLORS = {
  bg1: "#f7f6f4",
  bg2: "#161616",
  ink: "#2b2b2b",
  inkSoft: "#7a7a7a",
  black: "#111111",
  accent: "#c19a6b",
  accent2: "#a67d52",
  border: "#ecebe9",
} as const;

// Ícone WhatsApp inline (usado fora do menu)
function WhatsappIcon(props: { size?: number; color?: string }) {
  const { size = 18, color = "currentColor" } = props || {};
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" fill={color} aria-hidden focusable="false">
      <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.82.74 5.58 2.15 8.01L.5 31.5l7.66-2.06A15.44 15.44 0 0 0 16 31.5c8.56 0 15.5-6.94 15.5-15.5S24.56.5 16 .5Zm0 28c-2.53 0-5.01-.66-7.18-1.91l-.51-.3-4.55 1.22 1.21-4.43-.33-.54A13.47 13.47 0 0 1 2.5 16c0-7.44 6.06-13.5 13.5-13.5S29.5 8.56 29.5 16 23.44 28.5 16 28.5Zm7.36-10.61c-.4-.2-2.36-1.16-2.72-1.29-.36-.13-.62-.2-.89.2-.27.4-1.03 1.29-1.26 1.56-.23.27-.46.3-.86.1-.4-.2-1.68-.62-3.2-1.98-1.18-1.05-1.98-2.35-2.21-2.75-.23-.4-.02-.62.18-.82.18-.18.4-.46.6-.69.2-.23.27-.4.4-.66.13-.27.07-.5-.03-.7-.1-.2-.89-2.14-1.22-2.94-.32-.77-.65-.66-.89-.67h-.76c-.27 0-.7.1-1.06.5-.36.4-1.4 1.37-1.4 3.34s1.43 3.87 1.63 4.14c.2.27 2.82 4.3 6.84 6.02.96.42 1.7.67 2.28.86.96.3 1.84.26 2.53.16.77-.12 2.36-.96 2.69-1.88.33-.92.33-1.7.23-1.88-.1-.18-.36-.3-.76-.5Z" />
    </svg>
  );
}

export default function LawFirmLanding() {
  // --- Refs ---
  const introRef = useRef<HTMLElement | null>(null);
  const combinedRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  // --- State ---
  const [heroReady, setHeroReady] = useState(false);
  const [parallax, setParallax] = useState(0);
  const [teamIndex, setTeamIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [consumerModalOpen, setConsumerModalOpen] = useState(false);
  // fallback funcional para sticky
  const [fixHeader, setFixHeader] = useState(false);
  const [headerH, setHeaderH] = useState(0);

  // Drag do carrossel
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);

  // --- Config ---
  const CONFIG = {
    HERO_BG_URL: "https://www.univel.br/wp-content/uploads/2024/10/view-3d-justice-scales-1-scaled.jpg",
    LOGO_URL: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=246,fit=crop,trim=38.366336633663366;104.21641791044776;38.366336633663366;104.21641791044776/A3QOJ5k1y3cZR1PX/e_-_simbolo_branco_page-0001-removebg-preview-removebg-preview-m2Wap9a13gfL9klR.png",
    LOGO_MENU_DARK: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,fit=crop,q=95/A3QOJ5k1y3cZR1PX/e_page-0001__1_-removebg-preview-AwvDk6zLlQh1z740.png",
    PORTRAIT_URL: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=2300,fit=crop,trim=0;105.23556581986143;0;0/A3QOJ5k1y3cZR1PX/whatsapp-image-2025-09-21-at-20.02.31-Yg245gQRkPfnGg6p.jpeg",
    TEAM_PHOTO_EDIMARA: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=697,fit=crop/A3QOJ5k1y3cZR1PX/whatsapp-image-2025-09-21-at-20.15.55-AGBzv7yw1Gikbrb3.jpeg",
    TEAM_PHOTO_JULIA: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=1088,fit=crop/A3QOJ5k1y3cZR1PX/whatsapp-image-2025-09-22-a-s-12.07.47_938e876e5-A0xvrWW8rPCgV3yx.jpg",
    INSTAGRAM: "https://www.instagram.com/edimaraduran.adv/",
    LINKEDIN: "https://www.linkedin.com/in/edimara-duran-a79b81145/",
    EMAIL: "advogadaedimaraduran.com.br",
    TEL_DISPLAY: "(17) 99714-5705",
    TEL_HREF: "+5517997145705",
  } as const;

  const WA_NUMBER = "5517997145705";
  const WA_MESSAGE = "Olá, gostaria de saber mais sobre seus serviços!!";
  const waLink = () => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

  const team = [
    { name: "Edimara Duran", oab: "OAB/SP 526.456", photo: CONFIG.TEAM_PHOTO_EDIMARA },
    { name: "Júlia Bellussi", oab: "OAB/SP 495.591", photo: fallbackAsset(CONFIG.TEAM_PHOTO_JULIA) },
  ];

  const containerCls = "max-w-6xl mx-auto px-4 sm:px-6";

  // --- Preload e Parallax ---
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHeroReady(true);
    img.onerror = () => setHeroReady(true);
    img.src = CONFIG.HERO_BG_URL;
  }, []);


  useEffect(() => {
    if (!consumerModalOpen) return;
    const { body, documentElement } = document;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [consumerModalOpen]);

  

  useEffect(() => {
    // observa scroll para fallback de sticky
    const hdr = headerRef.current as HTMLElement | null;
    const getTop = () => (hdr ? hdr.offsetTop : 0);
    const getH = () => (hdr ? hdr.offsetHeight : 0);
    let headerTop = getTop();
    setHeaderH(getH());

    const onScroll = () => {
      const y = window.scrollY || 0;
      setFixHeader(y >= headerTop);
    };
    const onResize = () => {
      headerTop = getTop();
      setHeaderH(getH());
      onScroll();
    };
    onResize();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    let raf: number | undefined;
    const onScroll = () => {
      const cover = introRef.current as HTMLElement | null;
      const max = cover ? cover.offsetHeight : 600;
      const sc = Math.max(0, Math.min(window.scrollY, max));
      const val = sc * 0.25;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setParallax(val));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // Snap simples da capa (um scroll desce/volta)
  useEffect(() => {
    const cover = introRef.current;
    const next = combinedRef.current;
    if (!cover || !next) return;

    const getHeaderH = () => headerRef.current?.offsetHeight ?? 0;
    const getNextTop = () => Math.max(next.offsetTop - getHeaderH(), 0);
    let snapping = false;

    const snapTo = (top: number) => {
      if (snapping) return;
      snapping = true;
      window.scrollTo({ top, behavior: 'smooth' });
      const start = performance.now();
      const tick = () => {
        const done = Math.abs(window.scrollY - top) < 2 || performance.now() - start > 1500;
        if (!done) requestAnimationFrame(tick); else snapping = false;
      };
      requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      const nextTop = getNextTop();
      const atTop = window.scrollY < 16;
      const between = window.scrollY > 0 && window.scrollY < nextTop - 8;
      if (snapping) { e.preventDefault(); return; }
      if (atTop && e.deltaY > 10) { e.preventDefault(); snapTo(nextTop); }
      else if (between && e.deltaY < -10) { e.preventDefault(); snapTo(0); }
    };

    const onKey = (e: KeyboardEvent) => {
      const nextTop = getNextTop();
      if (snapping) { e.preventDefault(); return; }
      const downs = ['PageDown','ArrowDown',' '];
      const ups = ['PageUp','ArrowUp','Home'];
      if (downs.includes(e.key) && window.scrollY < 16) { e.preventDefault(); snapTo(nextTop); }
      else if (ups.includes(e.key) && window.scrollY > 0 && window.scrollY < nextTop - 8) { e.preventDefault(); snapTo(0); }
    };

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = e.changedTouches[0].clientY - startY;
      const nextTop = getNextTop();
      const atTop = window.scrollY < 16;
      const between = window.scrollY > 0 && window.scrollY < nextTop - 8;
      if (snapping) return;
      if (atTop && dy < -30) snapTo(nextTop);
      else if (between && dy > 30) snapTo(0);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Scroll helper com offset do header sticky
  const scrollToId = (id: string) => {
    const el = document.getElementById(id.replace('#', '')) || document.querySelector(id);
    const headerH = headerRef.current?.offsetHeight ?? 0;
    if (el) {
      const y = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - headerH - 6;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // --- Gestos do carrossel ---
  const onPointerDown = (e: any) => {
    setIsDragging(true);
    const x = e.clientX ?? (e.touches ? e.touches[0]?.clientX : 0) ?? 0;
    setDragStartX(x);
    setDragDelta(0);
    try { e.currentTarget?.setPointerCapture?.(e.pointerId); } catch {}
  };
  const onPointerMove = (e: any) => {
    if (!isDragging) return;
    const x = e.clientX ?? (e.touches ? e.touches[0]?.clientX : 0) ?? 0;
    setDragDelta(x - dragStartX);
  };
  const onPointerUp = () => {
    if (!isDragging) return;
    const threshold = 60;
    const dx = dragDelta;
    setIsDragging(false);
    setDragDelta(0);
    if (dx > threshold) setTeamIndex((v)=> (v-1+team.length)%team.length);
    else if (dx < -threshold) setTeamIndex((v)=> (v+1)%team.length);
  };

  // helper ícone de card
  const cardIcon = (el: JSX.Element) => (
    <div className="w-12 h-12 flex items-center justify-center rounded-full" style={{ background: COLORS.accent, color: '#fff' }}>{el}</div>
  );

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col" style={{ color: COLORS.ink, background: COLORS.bg1, overflowX: 'hidden', fontFamily: "'Merriweather', serif" }}>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Playfair+Display:wght@500;700;800&display=swap');
html,body{margin:0;overflow-x:hidden}
*{box-sizing:border-box}
body{font-family:'Merriweather', serif;}
h1,h2,h3,.font-display{font-family:'Playfair Display', serif; letter-spacing:.2px}
.consumer-modal-shell{--modal-max: min(92vh, 720px);max-height:var(--modal-max);}
.consumer-modal-scroll,.consumer-modal-aside-scroll{scrollbar-width:thin;scrollbar-color:${COLORS.accent} rgba(193,154,107,0.18);scrollbar-gutter:stable both-edges;overscroll-behavior:contain;}
.consumer-modal-scroll::-webkit-scrollbar,.consumer-modal-aside-scroll::-webkit-scrollbar{width:12px;background:transparent;}
.consumer-modal-scroll::-webkit-scrollbar-track,.consumer-modal-aside-scroll::-webkit-scrollbar-track{background:linear-gradient(180deg,rgba(193,154,107,0.14)0%,rgba(193,154,107,0.06)100%);border-radius:999px;}
.consumer-modal-scroll::-webkit-scrollbar-thumb,.consumer-modal-aside-scroll::-webkit-scrollbar-thumb{background:${COLORS.accent};border-radius:999px;border:3px solid rgba(255,255,255,0.8);box-shadow:inset 0 0 0 1px rgba(0,0,0,0.06);}
.consumer-modal-scroll::-webkit-scrollbar-thumb:hover,.consumer-modal-aside-scroll::-webkit-scrollbar-thumb:hover{background:${COLORS.accent2};}
@media (max-width: 767px){
  .consumer-modal-shell{--modal-max: min(96vh, 720px);}
  .consumer-modal-scroll::-webkit-scrollbar,.consumer-modal-aside-scroll::-webkit-scrollbar{width:10px;}
}
@media (min-width: 1280px){
  .consumer-modal-shell{--modal-max: min(88vh, 760px);}
}
`}</style>

      {/* CAPA */}
      <section id="top" ref={introRef} className="relative h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${CONFIG.HERO_BG_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translate3d(0, ${-parallax}px, 0)`,
          opacity: heroReady ? 1 : 0,
          transition: 'opacity .4s ease',
        }} />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,.7)' }} />
        {/* textura da capa */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.12]" style={{backgroundImage:'radial-gradient(rgba(255,255,255,.25) 1px, transparent 1px)', backgroundSize:'6px 6px'}} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <img src={CONFIG.LOGO_URL} alt="Logo Advocacia Duran" className="w-28 h-28 mb-4 object-contain" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = CONFIG.LOGO_MENU_DARK; }} />
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.8}} className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white">Advocacia Duran</motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:.1}} className="mt-3 text-xl md:text-2xl text-white/90">Edimara Duran</motion.p>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:1,delay:.2}} className="mt-1 text-base md:text-lg text-white/80">OAB/SP 526.456</motion.p>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}} className="absolute bottom-8 flex flex-col items-center text-white/80">
            <span className="text-sm mb-2">deslize</span>
            <div className="w-[2px] h-10 bg-white/60 rounded-full overflow-hidden">
              <motion.span className="block w-full h-full bg-white" initial={{y:'-100%'}} animate={{y:['-100%','100%']}} transition={{duration:1.6, repeat:Infinity, ease:'easeInOut'}} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* MENU sticky (após capa) */}
      <header ref={headerRef} className={`w-full flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 ${fixHeader ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-[9999] border-b bg-white/80 backdrop-blur-md isolate pointer-events-auto`} style={{ borderColor: COLORS.border }}>
        <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }} className="flex items-center gap-3 group cursor-pointer" aria-label="Voltar ao topo">
          <img src={CONFIG.LOGO_MENU_DARK} alt="Logo Advocacia Duran" className="w-14 h-14 md:w-16 md:h-16 object-contain transition-transform group-hover:scale-[1.03] cursor-pointer" />
          <span className="font-bold text-lg md:text-xl" style={{ color: COLORS.ink }}>Advocacia Duran</span>
        </button>
        {/* Botão mobile */}
        <button
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          className="md:hidden p-2 rounded-lg border cursor-pointer transition-colors"
          style={{ borderColor: COLORS.border }}
          onClick={()=>setMobileOpen(v=>!v)}
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M4 7h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                d: mobileOpen ? "M6 6l12 12" : "M4 7h16",
              }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
            <motion.path
              d="M4 12h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                opacity: mobileOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            <motion.path
              d="M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                d: mobileOpen ? "M6 18L18 6" : "M4 17h16",
              }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
          </motion.svg>
        </button>
        <nav role="navigation" className="hidden md:flex gap-6 font-medium items-center">
          <button onClick={() => scrollToId('#sobre')} className="cursor-pointer transition-colors hover:text-[#c19a6b]">Sobre</button>
          <button onClick={() => scrollToId('#areas')} className="cursor-pointer transition-colors hover:text-[#c19a6b]">Áreas</button>
          <button onClick={() => scrollToId('#equipe')} className="cursor-pointer transition-colors hover:text-[#c19a6b]">Equipe</button>
          <button onClick={() => scrollToId('#contato')} className="cursor-pointer transition-colors hover:text-[#c19a6b]">Contato</button>
        </nav>
      </header>
      {/* spacer para manter layout quando fixed */}
      {fixHeader && <div style={{height: headerH}} aria-hidden></div>}
      {/* Menu mobile */}
      
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b bg-white/95 backdrop-blur-sm px-4 sm:px-6 overflow-hidden"
            style={{ borderColor: COLORS.border }}
          >
            <div className="py-3 flex flex-col gap-1">
              <button onClick={() => { scrollToId('#sobre'); setMobileOpen(false); }} className="text-left py-2 cursor-pointer transition-colors hover:text-[#c19a6b]">Sobre</button>
              <button onClick={() => { scrollToId('#areas'); setMobileOpen(false); }} className="text-left py-2 cursor-pointer transition-colors hover:text-[#c19a6b]">Áreas</button>
              <button onClick={() => { scrollToId('#equipe'); setMobileOpen(false); }} className="text-left py-2 cursor-pointer transition-colors hover:text-[#c19a6b]">Equipe</button>
              <button onClick={() => { scrollToId('#contato'); setMobileOpen(false); }} className="text-left py-2 cursor-pointer transition-colors hover:text-[#c19a6b]">Contato</button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* SOBRE + EXCELÊNCIA */}
      <section id="sobre" ref={combinedRef} className="relative py-16 md:py-24" style={{ background: `linear-gradient(180deg, ${COLORS.bg1} 0%, rgba(193,154,107,.08) 100%)` }}>
        {/* textura */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.12]" style={{backgroundImage:'radial-gradient(rgba(0,0,0,.08) 1px, transparent 1px)', backgroundSize:'6px 6px', zIndex:0}} />
        <div className={containerCls + " relative z-10"}>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
            <motion.div initial={{opacity:0,x:-40}} whileInView={{opacity:1,x:0}} viewport={{amount:0.3}} transition={{duration:.7}}>
              <h2 className="text-3xl md:text-5xl font-extrabold inline-block pb-2" style={{ position:'relative' }}>
                Excelência em Direito
                <span style={{ position:'absolute', left:0, bottom:0, width:72, height:2, background: COLORS.accent }} />
              </h2>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm" style={{ background: 'rgba(17,17,17,.06)', border: `1px solid ${COLORS.border}`, color: COLORS.ink }}>
                Escritório 100% online • Atendimento em todo o Brasil
              </div>
              <p className="mt-6 text-[17px] leading-relaxed max-w-prose" style={{ color: COLORS.inkSoft }}>
                Atuação estratégica e humanizada com foco em resultados. Atendimento digital em todo o Brasil, sem perder a proximidade: conduzimos cada etapa com transparência, linguagem acessível e atualização constante do cliente.
              </p>
              <p className="mt-4 text-[17px] leading-relaxed max-w-prose" style={{ color: COLORS.inkSoft }}>
                Referência em Direito de Família, Sucessões, Consumidor e Civil. Do primeiro contato à solução final, priorizamos eficiência, sigilo e acolhimento.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href={waLink()} target="_blank" rel="noopener noreferrer">
                  <Button className="cursor-pointer transition-opacity hover:opacity-90 min-h-[48px] px-5 rounded-xl" style={{ background: COLORS.black, color: COLORS.bg1 }}>
                    Contato WhatsApp
                  </Button>
                </a>
                <Button className="cursor-pointer transition-all duration-200 hover:opacity-100 hover:bg-[rgba(193,154,107,.12)] hover:border-[rgba(193,154,107,.8)] hover:shadow-sm hover:-translate-y-[1px] min-h-[48px] px-5 rounded-xl border-2" style={{ background:'transparent', color: COLORS.accent, borderColor: COLORS.accent }} onClick={() => scrollToId('#contato')}>
                  Falar com a equipe
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,scale:.95}} whileInView={{opacity:1,scale:1}} viewport={{amount:0.3}} transition={{duration:.7}} className="flex justify-center">
              <img src={CONFIG.PORTRAIT_URL} alt="Foto da Responsável" className="rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg object-cover" style={{ aspectRatio: '3 / 4' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ÁREAS DE ATUAÇÃO */}
      <section id="areas" className="relative py-16 md:py-24" style={{ background: `linear-gradient(180deg, rgba(193,154,107,.12) 0%, ${COLORS.bg1} 100%)` }}>
        {/* textura */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.12]" style={{backgroundImage:'radial-gradient(rgba(0,0,0,.08) 1px, transparent 1px)', backgroundSize:'6px 6px', zIndex:0}} />
        <div className={containerCls + " relative z-10"}>
          <h2 className="text-3xl font-bold text-center mb-12 inline-block pb-2" style={{ position:'relative' }}>
            Áreas de Atuação
            <span style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', bottom:0, width:72, height:2, background: COLORS.accent }} />
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Scale />, title: 'Direito de Família', desc: 'Divórcios, guarda, alimentos e partilha.', action: 'contact' },
              { icon: <Gavel />, title: 'Direito Sucessório', desc: 'Inventários, testamentos e regularização patrimonial.', action: 'contact' },
              { icon: <ShieldCheck />, title: 'Direito do Consumidor', desc: 'Defesa contra práticas abusivas, cobranças e contratos.', action: 'modal' },
              { icon: <FileText />, title: 'Contratos e Direito Civil', desc: 'Elaboração, revisão e execução contratual.', action: 'contact' },
              { icon: <Building2 />, title: 'Direito Imobiliário', desc: 'Compra, venda, locação e disputas possessórias.', action: 'contact' },
              { icon: <Handshake />, title: 'Mediação e Acordos', desc: 'Soluções consensuais com segurança jurídica.', action: 'contact' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{amount:0.2}} transition={{delay:i*.08}}>
                <Card
                  role="button"
                  tabIndex={0}
                  aria-haspopup={item.action === 'modal' ? 'dialog' : undefined}
                  className="rounded-2xl border bg-white/90 shadow-md transition hover:-translate-y-[2px] hover:shadow-xl"
                  style={{ border: `1px solid ${COLORS.border}` }}
                  onClick={() => {
                    if (item.action === 'modal') setConsumerModalOpen(true);
                    else scrollToId('#contato');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (item.action === 'modal') setConsumerModalOpen(true);
                      else scrollToId('#contato');
                    }
                  }}
                >
                  <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                    {cardIcon(item.icon)}
                    <h3 className="text-xl font-semibold" style={{ color: COLORS.ink }}>{item.title}</h3>
                    <p className="text-sm" style={{ color: COLORS.inkSoft }}>{item.desc}</p>
                    <span className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: COLORS.accent }}>
                      {item.action === 'modal' ? 'Saiba mais' : 'Solicitar contato'}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {consumerModalOpen && (
          <motion.div
            key="consumer-modal"
            className="fixed inset-0 z-[10050] flex items-center justify-center overflow-y-auto px-4 py-8 md:py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Fechar modal"
              className="absolute inset-0 bg-black/65"
              onClick={() => setConsumerModalOpen(false)}
            ></button>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="consumer-modal-title"
              aria-describedby="consumer-modal-description"
              className="consumer-modal-shell relative w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-[rgba(193,154,107,0.18)] blur-3xl" aria-hidden></div>
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(193,154,107,.6) 0, rgba(193,154,107,0) 55%)' }}
                aria-hidden
              ></div>
              <div className="relative flex h-full min-h-0 flex-col md:flex-row" style={{ minHeight: '60vh' }}>
                <aside className="relative flex min-h-0 w-full flex-shrink-0 flex-col bg-gradient-to-br from-[#1f1d1b] via-[#2b2118] to-[#5a3d23] px-7 py-8 text-white md:w-[320px] md:overflow-hidden lg:w-[360px]">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.25) 0, transparent 55%)' }}
                    aria-hidden
                  ></div>
                  <div className="consumer-modal-aside-scroll relative z-10 flex h-full flex-col gap-6 overflow-y-auto pr-1 pb-6 sm:pr-2">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                      Defesa do Consumidor
                    </span>
                    <h3 id="consumer-modal-title" className="text-2xl font-bold leading-tight md:text-[28px] lg:text-[30px]">
                      Representação estratégica para proteger seus direitos de consumo
                    </h3>
                    <p id="consumer-modal-description" className="text-sm leading-relaxed text-white/80 md:text-base">
                      Atuamos para equilibrar a relação entre consumidores e fornecedores, combatendo abusos, recuperando prejuízos e negociando acordos vantajosos.
                    </p>
                    <div className="space-y-4 text-sm text-white/90">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#f9d8aa]" />
                        <div>
                          <p className="text-base font-semibold text-white">Resposta ágil</p>
                          <p className="text-sm text-white/75">Diagnóstico inicial e medidas de urgência com retorno em até 24 horas úteis.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#f9d8aa]" />
                        <div>
                          <p className="text-base font-semibold text-white">Acompanhamento contínuo</p>
                          <p className="text-sm text-white/75">Atualizações claras em cada etapa, com linguagem acessível e canal direto com a equipe.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#f9d8aa]" />
                        <div>
                          <p className="text-base font-semibold text-white">Negociação estratégica</p>
                          <p className="text-sm text-white/75">Buscamos resolver conflitos com rapidez, priorizando acordos eficazes antes de acionar o Judiciário.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-3 pt-2">
                      <a href={waLink()} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button
                          className="w-full justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold shadow-sm transition hover:-translate-y-[2px] hover:shadow-md"
                          style={{ background: '#ffffff', color: COLORS.black, borderRadius: 16 }}
                        >
                          <WhatsappIcon size={18} /> Conversar pelo WhatsApp
                        </Button>
                      </a>
                      <Button
                        className="w-full justify-center gap-2 rounded-xl border px-5 py-3 text-base font-semibold text-white transition hover:bg-white/15"
                        style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 16 }}
                        onClick={() => {
                          setConsumerModalOpen(false);
                          scrollToId('#contato');
                        }}
                      >
                        Falar com a equipe
                      </Button>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/60">
                        <Clock3 size={14} /> Atendimento em todo o Brasil
                      </div>
                    </div>
                  </div>
                </aside>
                <div className="relative flex min-h-0 flex-1 flex-col bg-white">
                  <button
                    type="button"
                    className="absolute right-5 top-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 text-[#2b2b2b] shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(193,154,107,0.6)]"
                    style={{ borderColor: COLORS.border }}
                    aria-label="Fechar modal"
                    onClick={() => setConsumerModalOpen(false)}
                  >
                    <X size={18} />
                  </button>
                  <div className="consumer-modal-scroll relative flex-1 overflow-y-auto px-7 py-10 sm:px-9 md:px-12 md:py-12">
                    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 md:gap-12">
                      <section className="rounded-3xl border p-6 md:p-8" style={{ borderColor: COLORS.border, background: `linear-gradient(145deg, ${COLORS.bg1}, #fff)` }}>
                        <h4 className="text-lg font-semibold" style={{ color: COLORS.ink }}>
                          Soluções jurídicas completas
                        </h4>
                        <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: COLORS.inkSoft }}>
                          Avaliamos cada cenário com rigor técnico para definir a estratégia adequada, atuando tanto na esfera judicial quanto na administrativa.
                        </p>
                        <ul className="mt-5 space-y-4 text-sm leading-relaxed md:text-base" style={{ color: COLORS.inkSoft }}>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                            <span>Indenizações por danos morais e materiais em fraudes, atrasos, vícios ou entregas não realizadas.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                            <span>Contestação de cobranças indevidas, juros abusivos e cláusulas que ferem o Código de Defesa do Consumidor.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                            <span>Acordos e ações contra bancos, financeiras, operadoras de telefonia, planos de saúde e e-commerce.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                            <span>Revisão de contratos com falta de transparência, cobranças ocultas ou cláusulas abusivas.</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                            <span>Defesa administrativa junto a Procon, Senacon e demais órgãos de proteção ao consumidor.</span>
                          </li>
                        </ul>
                      </section>
                      <section className="rounded-3xl border p-6 md:p-8" style={{ borderColor: COLORS.border, background: '#fefbf7' }}>
                        <h4 className="text-lg font-semibold" style={{ color: COLORS.ink }}>
                          Como guiamos sua demanda
                        </h4>
                        <div className="mt-5 grid gap-6 sm:grid-cols-3">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `${COLORS.accent}1a`, color: COLORS.accent }}>
                                <Phone size={18} />
                              </div>
                              <span className="text-sm font-semibold" style={{ color: COLORS.ink }}>Diagnóstico</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>Coleta detalhada de documentos e cronologia para mapear riscos e urgências.</p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `${COLORS.accent}1a`, color: COLORS.accent }}>
                                <FileText size={18} />
                              </div>
                              <span className="text-sm font-semibold" style={{ color: COLORS.ink }}>Estratégia</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>Definição das medidas cabíveis, estimativa de prazos e alinhamento com o cliente.</p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `${COLORS.accent}1a`, color: COLORS.accent }}>
                                <Handshake size={18} />
                              </div>
                              <span className="text-sm font-semibold" style={{ color: COLORS.ink }}>Execução</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>Negociações firmes e protocolos ágeis para alcançar a reparação mais eficiente.</p>
                          </div>
                        </div>
                      </section>
                      <section className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-3xl border p-6 md:p-7" style={{ borderColor: COLORS.border }}>
                          <h4 className="text-lg font-semibold" style={{ color: COLORS.ink }}>
                            Diferenciais
                          </h4>
                          <ul className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
                            <li className="flex items-start gap-3">
                              <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                              <span>Atendimento personalizado, humanizado e totalmente online.</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                              <span>Comunicação constante sobre cada etapa do processo.</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                              <span>Ações preventivas para reduzir riscos e fortalecer negociações.</span>
                            </li>
                          </ul>
                        </div>
                        <div className="rounded-3xl border p-6 md:p-7" style={{ borderColor: COLORS.border, background: 'rgba(17,17,17,0.03)' }}>
                          <h4 className="text-lg font-semibold" style={{ color: COLORS.ink }}>
                            Casos recorrentes
                          </h4>
                          <ul className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
                            <li className="flex items-start gap-3">
                              <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                              <span>Cancelamentos de viagens, compras on-line e entregas não realizadas.</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                              <span>Falhas em serviços bancários, financiamentos, seguros e cartões.</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <CheckCircle2 className="mt-1 h-5 w-5" style={{ color: COLORS.accent }} />
                              <span>Planos de saúde que negam coberturas essenciais ou limitam tratamentos.</span>
                            </li>
                          </ul>
                        </div>
                      </section>
                      <section className="rounded-3xl border p-6 md:p-8" style={{ borderColor: COLORS.border }}>
                        <p className="text-base leading-relaxed" style={{ color: COLORS.ink }}>
                          Cada estratégia é pensada para evitar desgastes, acelerar resultados e garantir que o fornecedor seja responsabilizado com base no Código de Defesa do Consumidor.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
                          Trabalhamos com transparência, estimando valores recuperáveis, prazos médios e alternativas viáveis para que você tome decisões com segurança.
                        </p>
                      </section>
                      <section className="rounded-3xl bg-[#111111] p-6 text-white md:p-8">
                        <div className="space-y-2">
                          <h4 className="text-xl font-semibold">Pronto para iniciar sua defesa?</h4>
                          <p className="text-sm leading-relaxed text-white/80 md:text-base">
                            Compartilhe o que aconteceu com você. Nossa equipe retorna rapidamente com as primeiras orientações e o plano de ação recomendado.
                          </p>
                        </div>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                            <Button
                              className="w-full justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold text-[#111111] transition hover:opacity-90"
                              style={{ background: '#f8e9d7', borderRadius: 16 }}
                            >
                              <WhatsappIcon size={18} /> Iniciar atendimento
                            </Button>
                          </a>
                          <Button
                            className="w-full justify-center rounded-xl border border-white/40 px-5 py-3 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                            style={{ background: 'transparent', borderRadius: 16 }}
                            onClick={() => {
                              setConsumerModalOpen(false);
                              scrollToId('#contato');
                            }}
                          >
                            Agendar conversa
                          </Button>
                        </div>
                        <div className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
                          <div className="flex items-center gap-3">
                            <Phone size={16} />
                            <span>{CONFIG.TEL_DISPLAY}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail size={16} />
                            <span>{CONFIG.EMAIL}</span>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOSSA EQUIPE (carrossel) */}
      <section id="equipe" className="relative py-16 md:py-24" style={{ background: `linear-gradient(180deg, ${COLORS.bg2} 0%, #0f0f0f 100%)`, color:'#fff' }}>
        {/* textura */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.12]" style={{backgroundImage:'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize:'6px 6px', zIndex:0}} />
        <motion.div className={containerCls + " relative z-10"}
          initial={{opacity:0, y:40}}
          whileInView={{opacity:1, y:0}}
          viewport={{amount:0.3, once:false}}
          transition={{duration:.6}}>
          <h2 className="text-3xl font-bold text-center mb-10 inline-block pb-2 relative">
            Nossa Equipe
            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 block" style={{ width:72, height:2, background: COLORS.accent }} />
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
            <div className={`flex transition-transform duration-300 ease-out ${isDragging ? 'select-none cursor-grabbing' : 'cursor-grab'}`}
                 style={{ transform: `translateX(calc(-${teamIndex*100}% + ${dragDelta}px))` }}
                 onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
                 onTouchStart={onPointerDown} onTouchMove={onPointerMove} onTouchEnd={onPointerUp}>
              {team.map((m, idx) => (
                <div key={idx} className="min-w-full">
                  <div className="grid md:grid-cols-2 gap-10 items-stretch p-6">
                    <div className="flex justify-center">
                      <div className="rounded-2xl p-2" style={{ background: `linear-gradient(135deg, ${COLORS.accent}40, ${COLORS.accent2}26)` }}>
                        <div
                          className={`rounded-2xl overflow-hidden bg-white shadow-xl flex items-center justify-center ${idx === 0 ? 'w-[320px] h-[420px] sm:w-[360px] sm:h-[480px]' : 'w-[280px] h-[360px] sm:w-[320px] sm:h-[420px]'}`}
                        >
                          <img src={m.photo} alt={m.name} loading={m.name==='Júlia Bellussi' ? 'eager' : undefined} referrerPolicy={m.name==='Júlia Bellussi' ? 'no-referrer' : undefined} crossOrigin={m.name==='Júlia Bellussi' ? 'anonymous' : undefined} onError={(e)=>{ const el=e.currentTarget as HTMLImageElement; if(m.name==='Júlia Bellussi'){ if(!el.dataset.triedcdn){ el.dataset.triedcdn='1'; el.src = CONFIG.TEAM_PHOTO_JULIA; } else if(!el.dataset.triedclean){ el.dataset.triedclean='1'; el.src = fallbackAsset(CONFIG.TEAM_PHOTO_JULIA); } } else { if(!el.dataset.fallback){ el.dataset.fallback='1'; el.src = fallbackAsset(m.photo); } } }} className="object-cover w-full h-full" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center h-full md:pr-4">
                      <h3 className="text-2xl font-bold">{m.name}</h3>
                      <p className="mt-1 text-white/70">{m.oab}</p>
                      <p className="mt-4 text-white/80 max-w-prose">{m.name === 'Júlia Bellussi' ? 'Especialista em Direito Previdenciário, com foco em planejamentos de aposentadoria, análise de contribuições e estratégias para garantir o acesso aos direitos dos clientes.' : 'Atuação dedicada em Direito de Família, Sucessões e Direito Civil. Atendimento humano, estratégico e transparente para cada caso.'}</p>
                      <div className="mt-6 flex gap-3 items-center">
                        <a href={waLink()} target="_blank" rel="noopener noreferrer">
                          <Button className="cursor-pointer transition-opacity hover:opacity-90 min-h-[44px] px-5 rounded-xl shadow-none" style={{ background: COLORS.black, color: COLORS.bg1 }}><WhatsappIcon size={18}/> WhatsApp</Button>
                        </a>
                        <Button className="cursor-pointer transition-all duration-200 hover:opacity-100 hover:bg-[rgba(193,154,107,.12)] hover:border-[rgba(193,154,107,.8)] hover:shadow-sm hover:-translate-y-[1px] min-h-[44px] px-5 rounded-xl border-2" style={{ background:'transparent', color: COLORS.accent, borderColor: COLORS.accent }} onClick={() => scrollToId('#sobre')}>Sobre</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button className="cursor-pointer text-3xl leading-none px-7 py-2 rounded-xl border-2" style={{ borderColor: COLORS.accent, color:'#fff' }} onClick={() => setTeamIndex((v)=> (v-1+team.length)%team.length)} aria-label="Anterior">‹</button>
            <div className="flex items-center gap-2">
              {team.map((_,i)=> (
                <button key={i} onClick={()=>setTeamIndex(i)} aria-label={`Slide ${i+1}`} className="w-3 h-3 rounded-full border" style={{ background: teamIndex===i? COLORS.accent : '#7a7a7a', borderColor: teamIndex===i? COLORS.accent : 'rgba(0,0,0,.2)' }} />
              ))}
            </div>
            <button className="cursor-pointer text-3xl leading-none px-7 py-2 rounded-xl border-2" style={{ borderColor: COLORS.accent, color:'#fff' }} onClick={() => setTeamIndex((v)=> (v+1)%team.length)} aria-label="Próximo">›</button>
          </div>
        </motion.div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="relative py-16 md:py-24" style={{ background: `linear-gradient(180deg, ${COLORS.bg1} 0%, rgba(193,154,107,.08) 100%)` }}>
        {/* textura */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.12]" style={{backgroundImage:'radial-gradient(rgba(0,0,0,.08) 1px, transparent 1px)', backgroundSize:'6px 6px', zIndex:0}} />
        <div className={containerCls + " relative z-10"}>
          <h2 className="text-3xl font-bold text-center mb-12 inline-block pb-2 relative">
            Entre em Contato
            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 block" style={{ width:72, height:2, background: COLORS.accent }} />
          </h2>
          <div className="flex flex-col md:flex-row items-start justify-center gap-10 md:gap-14">
            <motion.div initial={{opacity:0,x:-50}} whileInView={{opacity:1,x:0}} viewport={{amount:0.3}} transition={{duration:.7}} className="flex flex-col gap-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm" style={{ border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center gap-3"><Phone /><a href={`tel:${CONFIG.TEL_HREF}`} className="underline-offset-4 hover:underline">{CONFIG.TEL_DISPLAY}</a></div>
              <div className="flex items-center gap-3"><Mail /><a href={`mailto:${CONFIG.EMAIL}`} className="underline-offset-4 hover:underline">{CONFIG.EMAIL}</a></div>
              <div className="mt-2" style={{ color: COLORS.inkSoft }}>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-2" style={{ background: 'rgba(193,154,107,.1)', border: '1px solid rgba(193,154,107,.35)' }}>
                  <Clock3 size={16} />
                  <span className="font-semibold">Horário:</span>
                  <span>Seg a Sex • 08:00–17:00</span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="border rounded-full p-2" style={{ borderColor: COLORS.border }}><Instagram size={18}/></a>
                <a href={CONFIG.LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="border rounded-full p-2" style={{ borderColor: COLORS.border }}><Linkedin size={18}/></a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="border rounded-full p-2" style={{ borderColor: COLORS.border }}><WhatsappIcon size={18} /></a>
              </div>
            </motion.div>

            <motion.form initial="hidden" whileInView="show" viewport={{amount:0.3}}
              variants={{hidden:{opacity:0,x:50},show:{opacity:1,x:0,transition:{staggerChildren:0.08,delayChildren:0.1,duration:0.6}}}}
              className="flex flex-col gap-4 w-full md:w-1/2 bg-white shadow-md p-6 rounded-2xl" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const nome = String(fd.get('nome')||'').trim();
                const email = String(fd.get('email')||'').trim();
                const tel = String(fd.get('tel')||'').trim();
                const msg = String(fd.get('mensagem')||'').trim();
                const emailOk = /.+@.+\..+/.test(email);
                if (!nome || !emailOk || !msg) { alert('Por favor, preencha Nome, Email válido e Mensagem.'); return; }
                const mailto = `mailto:ins4nehs@gmail.com?subject=${encodeURIComponent('Contato pelo site - Advocacia Duran')}&body=${encodeURIComponent(`Nome: ${nome}\nEmail: ${email}\nTelefone: ${tel}\n\nMensagem:\n${msg}`)}`;
                window.location.href = mailto;
              }}>
              <motion.input name="nome" variants={{hidden:{opacity:0,y:10},show:{opacity:1,y:0,transition:{duration:.35}}}} type="text" placeholder="Nome" className="border p-3 rounded-xl" required />
              <motion.input name="email" variants={{hidden:{opacity:0,y:10},show:{opacity:1,y:0,transition:{duration:.35}}}} type="email" placeholder="Email" className="border p-3 rounded-xl" required />
              <motion.input
                name="tel"
                variants={{hidden:{opacity:0,y:10},show:{opacity:1,y:0,transition:{duration:.35}}}}
                type="tel"
                placeholder="Telefone (XX) XXXXX-XXXX"
                className="border p-3 rounded-xl"
                onInput={(e)=>{ const el = e.currentTarget as HTMLInputElement; el.value = maskPhone(el.value); }}
              />
              <motion.textarea name="mensagem" variants={{hidden:{opacity:0,y:10},show:{opacity:1,y:0,transition:{duration:.35}}}} placeholder="Mensagem" rows={4} className="border p-3 rounded-xl" required />
              <motion.div variants={{hidden:{opacity:0,y:10},show:{opacity:1,y:0,transition:{duration:.35}}}}>
                <Button className="cursor-pointer transition-opacity hover:opacity-90 w-full min-h-[48px] rounded-xl" style={{ background: COLORS.black, color: COLORS.bg1 }} type="submit">Enviar</Button>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </section>

      {/* CTA flutuante WhatsApp */}
      <motion.a href={waLink()} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 rounded-full flex items-center gap-2 px-4 py-3" style={{ background: COLORS.black, color: COLORS.bg1 }} whileHover={{scale:1.06}} whileTap={{scale:0.96}}>
        <WhatsappIcon size={18} color="#25D366" />
        <span className="hidden sm:inline">Falar no WhatsApp</span>
      </motion.a>

      {/* RODAPÉ */}
      <footer className="text-center py-8" style={{ background: COLORS.black, color: COLORS.bg1, position:'relative' }}>
        <span className="absolute left-0 right-0 top-0" style={{ height:2, background: `${COLORS.accent}99` }} />
        <div className={containerCls + " relative z-10"}>© 2025 Advocacia Duran - Todos os direitos reservados.</div>
      </footer>
    </div>
  );
}
