import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, LayoutDashboard, Database, Crosshair, Shield, Box, Users, AlertTriangle, BookOpen, Swords } from 'lucide-react';
import { useStore } from '../store/useStore';

const SideNav = ({ isOpen, setIsOpen }) => {
  const agentInfo = useStore(state => state.agentInfo);
  const language = useStore(state => state.language);
  const location = useLocation();
  
  const translations = {
    EN: { home: 'HOME', dash: 'DASHBOARD', skill: 'SKILL_TREE', missions: 'MISSIONS', armory: 'ARMORY', factions: 'FACTIONS', inv: 'INVENTORY', syn: 'SYNDICATE', raids: 'GLOBAL_RAIDS', textbooks: 'TEXTBOOKS', pvp: 'PVP_ARENA' },
    RU: { home: 'ГЛАВНАЯ', dash: 'ПАНЕЛЬ', skill: 'НАВЫКИ', missions: 'МИССИИ', armory: 'МАГАЗИН', factions: 'ФРАКЦИИ', inv: 'ИНВЕНТАРЬ', syn: 'КЛАН', raids: 'РЕЙДЫ', textbooks: 'УЧЕБНИКИ', pvp: 'PVP_АРЕНА' },
    UZ: { home: 'ASOSIY', dash: 'BOSHQARUV', skill: 'MAHORATLAR', missions: 'VAZIFALAR', armory: 'BOZOR', factions: 'FRAKSIYALAR', inv: 'INVENTAR', syn: 'KLAN', raids: 'REYDLAR', textbooks: 'DARSLIKLAR', pvp: 'PVP_ARENA' }
  };

  const t = translations[language] || translations.EN;

  const links = [
    { name: t.home, path: '/', icon: <Globe size={18}/> },
    { name: t.dash, path: '/dashboard', icon: <LayoutDashboard size={18}/> },
    { name: t.skill, path: '/academy', icon: <Database size={18}/> },
    { name: t.missions, path: '/missions', icon: <Crosshair size={18}/> },
    { name: t.armory, path: '/armory', icon: <Shield size={18}/> },
    { name: t.inv, path: '/inventory', icon: <Box size={18}/> },
    { name: t.syn, path: '/syndicate', icon: <Users size={18}/> },
    { name: t.raids, path: '/raids', icon: <AlertTriangle size={18} className="text-error" /> },
    { name: t.factions, path: '/factions', icon: <Globe size={18}/> },
    { name: t.textbooks, path: '/textbooks', icon: <BookOpen size={18}/> },
    { name: t.pvp, path: '/pvp', icon: <Swords size={18} className="text-red-400" /> },
  ];

  return (
    <aside 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`flex flex-col py-6 gap-2 fixed left-0 top-16 h-[calc(100vh-64px)] border-r border-cyan-500/20 bg-[#161B22]/95 backdrop-blur-xl shadow-[4px_0_30px_rgba(0,0,0,0.5)] font-code text-[10px] tracking-tighter transition-all duration-300 z-40 ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}`}
    >

      <nav className="flex-1 flex flex-col gap-1 mt-2">
        {links.map(l => {
           const isActive = location.pathname === l.path;
           return (
             <Link key={l.name} to={l.path} title={l.name} className={`group flex items-center px-6 py-3 gap-3 transition-all duration-300 border-l-4 active:scale-95 ${isActive ? 'bg-cyan-400/15 text-cyan-400 border-cyan-400 shadow-[inset_4px_0_15px_rgba(0,224,255,0.2)] drop-shadow-[0_0_10px_rgba(0,224,255,0.5)]' : 'text-slate-500 hover:text-cyan-300 hover:bg-cyan-900/20 border-transparent hover:border-cyan-500/50 hover:pl-8'}`}>
               <span className={`flex-shrink-0 transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_10px_rgba(0,224,255,1)] scale-110' : 'group-hover:drop-shadow-[0_0_10px_rgba(0,224,255,0.8)] group-hover:scale-125'}`}>{l.icon}</span> 
               <span className={`transition-opacity duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 md:opacity-0 overflow-hidden'} group-hover:tracking-widest`}>{l.name}</span>
             </Link>
           );
        })}
      </nav>
    </aside>
  );
};

export default SideNav;
