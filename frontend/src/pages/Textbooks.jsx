import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  BookOpen, Search, Lock, ChevronRight, Star, Clock, Eye, Terminal,
  Shield, Globe, Cpu, Bug, Flame, Database, Radio, Wifi, Server,
  KeyRound, Layers, Filter, ArrowUpRight, CheckCircle, Zap, Brain,
  BookMarked, FileText, ExternalLink
} from 'lucide-react';

// ── Book Data ──
const BOOKS = [
  {
    id: 'b1', title: 'The Web Application Hacker\'s Handbook',
    author: 'Dafydd Stuttard & Marcus Pinto',
    desc: 'Полное руководство по обнаружению и эксплуатации уязвимостей веб-приложений. Covers XSS, SQLi, CSRF, authentication flaws, and more.',
    category: 'WEB', difficulty: 'INTERMEDIATE', pages: 912, rating: 4.8,
    icon: 'Globe', color: 'cyan', tags: ['XSS', 'SQLi', 'CSRF', 'Burp Suite'],
    chapters: ['Mapping the Application', 'Client-Side Controls', 'Authentication', 'Session Management', 'Access Controls', 'Input Validation', 'XSS Attacks', 'SQL Injection'],
    progress: 45, unlocked: true,
  },
  {
    id: 'b2', title: 'Penetration Testing with Kali Linux (PWK)',
    author: 'Offensive Security',
    desc: 'Официальный курс OSCP. Практическое руководство по тестированию на проникновение с использованием Kali Linux и реальных лабораторий.',
    category: 'PENTEST', difficulty: 'ADVANCED', pages: 850, rating: 4.9,
    icon: 'Terminal', color: 'red', tags: ['Kali', 'OSCP', 'Exploitation', 'Metasploit'],
    chapters: ['Kali Setup', 'Command Line', 'Passive Recon', 'Active Recon', 'Vulnerability Scanning', 'Buffer Overflows', 'Exploit Development', 'Privilege Escalation'],
    progress: 12, unlocked: true,
  },
  {
    id: 'b3', title: 'Hacking: The Art of Exploitation',
    author: 'Jon Erickson',
    desc: 'Глубокое погружение в программирование, сети, криптографию и эксплойты. Основа для понимания низкоуровневого хакинга.',
    category: 'EXPLOIT', difficulty: 'ADVANCED', pages: 488, rating: 4.7,
    icon: 'Bug', color: 'red', tags: ['C/C++', 'Buffer Overflow', 'Shellcode', 'Assembly'],
    chapters: ['Programming', 'Networking', 'Shellcode', 'Cryptology', 'Countermeasures'],
    progress: 0, unlocked: true,
  },
  {
    id: 'b4', title: 'Linux Basics for Hackers',
    author: 'OccupyTheWeb',
    desc: 'Начните с основ Linux: терминал, файловая система, скрипты и инструменты безопасности. Идеальный старт для новичков.',
    category: 'FUNDAMENTALS', difficulty: 'BEGINNER', pages: 248, rating: 4.5,
    icon: 'Terminal', color: 'secondary-container', tags: ['Linux', 'Bash', 'CLI', 'Scripting'],
    chapters: ['Getting Started', 'Filesystem', 'Networking', 'Managing Processes', 'User Environment', 'Bash Scripting', 'Security Tools', 'Logging'],
    progress: 88, unlocked: true,
  },
  {
    id: 'b5', title: 'Black Hat Python',
    author: 'Justin Seitz & Tim Arnold',
    desc: 'Python для хакеров: создание сетевых сканеров, снифферов, кейлоггеров и инструментов пентестинга.',
    category: 'TOOLS', difficulty: 'INTERMEDIATE', pages: 216, rating: 4.6,
    icon: 'Cpu', color: 'fuchsia', tags: ['Python', 'Scapy', 'Socket', 'Automation'],
    chapters: ['Network Basics', 'Raw Sockets', 'Scapy', 'Web Hacking', 'Extending Burp', 'GitHub C2', 'Windows Trojans', 'Forensics'],
    progress: 22, unlocked: true,
  },
  {
    id: 'b6', title: 'Practical Malware Analysis',
    author: 'Michael Sikorski & Andrew Honig',
    desc: 'Руководство по анализу и реверс-инжинирингу вредоносного ПО. Статический и динамический анализ, отладка, антиотладка.',
    category: 'MALWARE', difficulty: 'ADVANCED', pages: 800, rating: 4.8,
    icon: 'Bug', color: 'red', tags: ['Reverse Engineering', 'IDA Pro', 'Debugging', 'PE Format'],
    chapters: ['Static Analysis', 'Dynamic Analysis', 'IDA Pro', 'Assembly', 'Anti-Disassembly', 'Anti-Debugging', 'Packed Malware', 'Shellcode Analysis'],
    progress: 0, unlocked: false,
  },
  {
    id: 'b7', title: 'Network Security Assessment',
    author: 'Chris McNab',
    desc: 'Оценка безопасности сетей: сканирование, перечисление, атаки на протоколы и инфраструктуру.',
    category: 'NETWORK', difficulty: 'INTERMEDIATE', pages: 544, rating: 4.4,
    icon: 'Wifi', color: 'cyan', tags: ['Nmap', 'TCP/IP', 'DNS', 'SNMP'],
    chapters: ['Network Protocols', 'Scanning', 'Enumeration', 'Assessment', 'IP Services', 'Email Services', 'Web Services'],
    progress: 30, unlocked: true,
  },
  {
    id: 'b8', title: 'The Hacker Playbook 3',
    author: 'Peter Kim',
    desc: 'Red Team Edition: практические стратегии пентестинга в стиле спортивного плейбука с реальными кейсами.',
    category: 'PENTEST', difficulty: 'INTERMEDIATE', pages: 298, rating: 4.6,
    icon: 'Flame', color: 'red', tags: ['Red Team', 'AD', 'C2', 'Persistence'],
    chapters: ['The Setup', 'Before the Snap', 'The Throw', 'The Drive', 'The Screen', 'The Onside Kick', 'Special Teams'],
    progress: 55, unlocked: true,
  },
  {
    id: 'b9', title: 'Cryptography and Network Security',
    author: 'William Stallings',
    desc: 'Академический учебник по криптографии: шифрование, цифровые подписи, PKI, IPSec, SSL/TLS.',
    category: 'CRYPTO', difficulty: 'BEGINNER', pages: 752, rating: 4.3,
    icon: 'KeyRound', color: 'fuchsia', tags: ['AES', 'RSA', 'PKI', 'TLS'],
    chapters: ['Classical Encryption', 'Block Ciphers', 'Public Key Crypto', 'Key Management', 'Authentication', 'Digital Signatures', 'Network Security'],
    progress: 10, unlocked: true,
  },
  {
    id: 'b10', title: 'Social Engineering: The Science of Human Hacking',
    author: 'Christopher Hadnagy',
    desc: 'Психология и техники социальной инженерии: фишинг, претекстинг, влияние и манипуляция.',
    category: 'SOCIAL', difficulty: 'BEGINNER', pages: 320, rating: 4.5,
    icon: 'Brain', color: 'fuchsia', tags: ['Phishing', 'Pretexting', 'Influence', 'OSINT'],
    chapters: ['Information Gathering', 'Pretexting', 'Phishing', 'Influence & Persuasion', 'Nonverbal Communication', 'Building Your Toolkit'],
    progress: 0, unlocked: true,
  },
  {
    id: 'b11', title: 'Blue Team Handbook: SOC/SIEM/Threat Hunting',
    author: 'Don Murdoch',
    desc: 'Руководство для Blue Team: построение SOC, работа с SIEM, охота за угрозами и реагирование на инциденты.',
    category: 'DEFENSE', difficulty: 'INTERMEDIATE', pages: 264, rating: 4.4,
    icon: 'Shield', color: 'cyan', tags: ['SOC', 'SIEM', 'Threat Hunting', 'IR'],
    chapters: ['SOC Fundamentals', 'Log Analysis', 'SIEM Operations', 'Threat Hunting', 'Incident Response', 'Forensics'],
    progress: 0, unlocked: false,
  },
  {
    id: 'b12', title: 'Red Team Development and Operations',
    author: 'Joe Vest & James Tubberville',
    desc: 'Планирование, выполнение и отчётность Red Team операций на уровне предприятия. Продвинутая тактика атак.',
    category: 'PENTEST', difficulty: 'ELITE', pages: 350, rating: 4.7,
    icon: 'Flame', color: 'red', tags: ['Red Team', 'C2 Frameworks', 'TTPs', 'MITRE ATT&CK'],
    chapters: ['Planning', 'Engagement', 'Infrastructure', 'C2', 'Execution', 'Reporting'],
    progress: 0, unlocked: false,
  },
];

const CATEGORIES = ['ALL', 'FUNDAMENTALS', 'WEB', 'PENTEST', 'EXPLOIT', 'NETWORK', 'MALWARE', 'CRYPTO', 'TOOLS', 'SOCIAL', 'DEFENSE'];
const DIFFICULTIES = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ELITE'];

const ICON_MAP = { Globe, Terminal, Bug, Cpu, Wifi, Flame, KeyRound, Shield, Brain, BookOpen, Database, Radio, Server };

const diffColors = {
  BEGINNER: 'text-secondary-container border-secondary-container/40 bg-secondary-container/10',
  INTERMEDIATE: 'text-cyan-400 border-cyan-500/40 bg-cyan-400/10',
  ADVANCED: 'text-red-400 border-red-500/40 bg-red-400/10',
  ELITE: 'text-fuchsia-400 border-fuchsia-500/40 bg-fuchsia-400/10',
};

const catColorMap = {
  cyan: { border: 'border-cyan-500/30', hover: 'hover:border-cyan-400', text: 'text-cyan-400', bg: 'bg-cyan-400/5', headerBg: 'bg-cyan-900/10', glow: 'hover:shadow-[0_0_25px_rgba(0,224,255,0.1)]' },
  red: { border: 'border-red-500/30', hover: 'hover:border-red-400', text: 'text-red-400', bg: 'bg-red-400/5', headerBg: 'bg-red-900/10', glow: 'hover:shadow-[0_0_25px_rgba(248,113,113,0.1)]' },
  fuchsia: { border: 'border-fuchsia-500/30', hover: 'hover:border-fuchsia-400', text: 'text-fuchsia-400', bg: 'bg-fuchsia-400/5', headerBg: 'bg-fuchsia-900/10', glow: 'hover:shadow-[0_0_25px_rgba(217,70,239,0.1)]' },
  'secondary-container': { border: 'border-secondary-container/30', hover: 'hover:border-secondary-container', text: 'text-secondary-container', bg: 'bg-secondary-container/5', headerBg: 'bg-secondary-container/5', glow: 'hover:shadow-[0_0_25px_rgba(195,244,0,0.1)]' },
};

export default function Textbooks() {
  const agentInfo = useStore(s => s.agentInfo);
  const addXp = useStore(s => s.addXp);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [diffFilter, setDiffFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [bookProgress, setBookProgress] = useState({});

  const handleReadChapter = (bookId, chapterIndex, book) => {
    const currentProgress = bookProgress[bookId] || book.progress;
    const chaptersCount = book.chapters.length;
    const progressPerChapter = 100 / chaptersCount;
    const newProgress = Math.min(100, Math.round((chapterIndex + 1) * progressPerChapter));

    if (newProgress > currentProgress) {
      setBookProgress(prev => ({ ...prev, [bookId]: newProgress }));

      // Award XP based on difficulty
      const xpRewards = {
        'BEGINNER': 20,
        'INTERMEDIATE': 30,
        'ADVANCED': 50,
        'ELITE': 75
      };
      const xpAmount = xpRewards[book.difficulty] || 30;
      addXp(xpAmount, 'textbook', `${book.title} (Ch.${chapterIndex + 1})`);
    }
  };

  const filtered = useMemo(() => {
    return BOOKS.filter(b => {
      if (catFilter !== 'ALL' && b.category !== catFilter) return false;
      if (diffFilter !== 'ALL' && b.difficulty !== diffFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [search, catFilter, diffFilter]);

  const stats = useMemo(() => ({
    total: BOOKS.length,
    inProgress: BOOKS.filter(b => b.progress > 0 && b.progress < 100).length,
    completed: BOOKS.filter(b => b.progress >= 100).length,
    locked: BOOKS.filter(b => !b.unlocked).length,
  }), []);

  return (
    <div className="p-4 md:p-8 space-y-6 w-full animate-page-enter">

      {/* ══════ HEADER ══════ */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-cyan-500/20 pb-5">
        <div>
          <h1 className="text-2xl font-h1 text-cyan-400 flex items-center gap-3">
            <BookOpen size={28} className="drop-shadow-[0_0_10px_rgba(0,224,255,0.5)]" />
            HACKING LIBRARY
          </h1>
          <p className="text-gray-400 font-body text-sm mt-1">Изучайте учебники от лучших экспертов кибербезопасности. Прокачивайте знания, разблокируйте новые уровни.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border border-cyan-500/20 bg-cyan-400/5 font-code text-xs">
            <BookMarked size={14} className="text-cyan-400" />
            <span className="text-gray-400">{stats.total} BOOKS</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border border-secondary-container/20 bg-secondary-container/5 font-code text-xs">
            <FileText size={14} className="text-secondary-container" />
            <span className="text-gray-400">{stats.inProgress} IN PROGRESS</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border border-fuchsia-500/20 bg-fuchsia-400/5 font-code text-xs">
            <Lock size={14} className="text-fuchsia-400" />
            <span className="text-gray-400">{stats.locked} LOCKED</span>
          </div>
        </div>
      </header>

      {/* ══════ SEARCH & FILTERS ══════ */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search books, authors, or tags..."
            className="w-full bg-black/50 border border-cyan-500/20 focus:border-cyan-400 pl-10 pr-4 py-3 text-white font-code text-xs outline-none transition-colors placeholder-gray-600"
          />
        </div>
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          <Filter size={14} className="text-gray-500 flex-shrink-0" />
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-2 font-code text-[10px] tracking-widest border transition-all flex-shrink-0 ${catFilter === c ? 'bg-cyan-400/15 border-cyan-400 text-cyan-400' : 'border-surface-variant text-gray-500 hover:text-white hover:border-gray-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-code text-[10px] text-gray-500 tracking-widest mr-1">DIFFICULTY:</span>
        {DIFFICULTIES.map(d => (
          <button key={d} onClick={() => setDiffFilter(d)} className={`px-3 py-1.5 font-code text-[10px] tracking-widest border transition-all ${diffFilter === d ? (d === 'ALL' ? 'bg-cyan-400/15 border-cyan-400 text-cyan-400' : diffColors[d]) : 'border-surface-variant/50 text-gray-600 hover:text-gray-300'}`}>
            {d}
          </button>
        ))}
        <span className="font-code text-[10px] text-gray-600 ml-auto">{filtered.length} RESULT{filtered.length !== 1 ? 'S' : ''}</span>
      </div>

      {/* ══════ BOOKS GRID ══════ */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={48} className="text-gray-700 mb-4" />
          <div className="font-code text-gray-500 text-sm">NO MATCHING RESOURCES FOUND</div>
          <div className="font-code text-[10px] text-gray-600 mt-1">Try adjusting your filters or search query</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(book => {
            const cs = catColorMap[book.color];
            const IconComp = ICON_MAP[book.icon] || BookOpen;
            const isExpanded = expandedId === book.id;

            return (
              <div key={book.id}
                className={`glass-panel border ${cs.border} ${cs.hover} ${cs.glow} flex flex-col transition-all duration-500 ${!book.unlocked ? 'opacity-60' : ''} ${isExpanded ? 'row-span-2' : ''} hover:-translate-y-1 group relative overflow-hidden`}
              >
                {/* Locked overlay */}
                {!book.unlocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center">
                    <Lock size={32} className="text-gray-500 mb-2" />
                    <span className="font-code text-xs text-gray-400">REQUIRES LVL 18+</span>
                  </div>
                )}

                {/* Header */}
                <div className={`p-4 border-b border-white/5 ${cs.headerBg} flex items-start gap-3`}>
                  <div className={`w-12 h-12 rounded-lg ${cs.bg} ${cs.text} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border ${cs.border}`}>
                    <IconComp size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-code text-sm text-white font-bold leading-tight truncate group-hover:text-cyan-300 transition-colors">{book.title}</h3>
                    <div className="font-code text-[10px] text-gray-500 mt-0.5 truncate">{book.author}</div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col gap-3">
                  {/* Tags row */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`font-code text-[9px] px-1.5 py-0.5 border ${diffColors[book.difficulty]} font-bold`}>{book.difficulty}</span>
                    <span className="font-code text-[9px] px-1.5 py-0.5 border border-surface-variant text-gray-400">{book.category}</span>
                    <span className="font-code text-[9px] px-1.5 py-0.5 border border-surface-variant text-gray-500 flex items-center gap-1"><FileText size={8} /> {book.pages}p</span>
                    <span className="font-code text-[9px] px-1.5 py-0.5 border border-yellow-500/30 text-yellow-400 flex items-center gap-1"><Star size={8} /> {book.rating}</span>
                  </div>

                  {/* Description */}
                  <p className="font-body text-xs text-gray-400 leading-relaxed line-clamp-3">{book.desc}</p>

                  {/* Progress */}
                  {book.unlocked && (
                    <div className="mt-auto">
                      <div className="flex justify-between text-[10px] font-code text-gray-500 mb-1">
                        <span>PROGRESS</span>
                        <span className={(bookProgress[book.id] || book.progress) >= 100 ? 'text-secondary-container' : cs.text}>{bookProgress[book.id] || book.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-variant/50 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-1000 ${(bookProgress[book.id] || book.progress) >= 100 ? 'bg-secondary-container shadow-[0_0_8px_rgba(195,244,0,0.6)]' : (bookProgress[book.id] || book.progress) > 0 ? 'bg-cyan-400 shadow-[0_0_6px_rgba(0,224,255,0.4)]' : ''}`} style={{ width: `${bookProgress[book.id] || book.progress}%` }}></div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {book.tags.slice(0, 4).map(t => (
                      <span key={t} className="font-code text-[8px] text-gray-500 bg-white/[0.03] px-1.5 py-0.5 border border-white/5">#{t}</span>
                    ))}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="border-t border-white/5 p-3 flex items-center justify-between">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : book.id)}
                    className={`font-code text-[10px] ${cs.text} hover:underline flex items-center gap-1 transition-colors`}
                  >
                    <Eye size={12} /> {isExpanded ? 'HIDE' : 'CHAPTERS'}
                  </button>
                  {book.unlocked && book.progress > 0 && (
                    <span className="font-code text-[10px] text-gray-500 flex items-center gap-1">
                      <Clock size={10} /> CONTINUE READING
                    </span>
                  )}
                  {book.unlocked && book.progress === 0 && (
                    <span className="font-code text-[10px] text-secondary-container flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                      <Zap size={10} /> START READING
                    </span>
                  )}
                </div>

                {/* Expanded chapters */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-black/30 p-4 space-y-2" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div className="font-code text-[10px] text-gray-500 tracking-widest mb-2">TABLE OF CONTENTS</div>
                    {book.chapters.map((ch, i) => {
                      const currentProgress = bookProgress[book.id] || book.progress;
                      const chProgress = currentProgress > 0 ? (i < Math.ceil(book.chapters.length * (currentProgress / 100))) : false;
                      return (
                        <button
                          key={i}
                          onClick={() => book.unlocked && handleReadChapter(book.id, i, book)}
                          disabled={!book.unlocked}
                          className={`w-full flex items-center gap-2 p-2 border ${chProgress ? 'border-cyan-500/20 bg-cyan-400/5' : 'border-surface-variant/30'} transition-all hover:bg-white/[0.02] ${book.unlocked ? 'cursor-pointer hover:border-cyan-500/40' : 'cursor-not-allowed opacity-50'}`}
                        >
                          <span className="font-code text-[10px] text-gray-600 w-5">{String(i + 1).padStart(2, '0')}</span>
                          {chProgress ? <CheckCircle size={12} className="text-cyan-400 flex-shrink-0" /> : <div className="w-3 h-3 border border-gray-600 rounded-full flex-shrink-0"></div>}
                          <span className={`font-code text-xs ${chProgress ? 'text-white' : 'text-gray-500'} flex-1 text-left`}>{ch}</span>
                          {book.unlocked && !chProgress && (
                            <Zap size={12} className="text-secondary-container opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
