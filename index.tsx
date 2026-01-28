import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Activity, 
  ArrowLeft,
  Check, 
  ChevronRight, 
  Cpu, 
  Database, 
  Mail, 
  Menu, 
  Plus, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  X,
  Zap,
  Shield,
  Layers, 
  Layout, 
  BrainCircuit, 
  ExternalLink, 
  MicOff, 
  ArrowRight, 
  Clock, 
  Unlock, 
  Users,
  DollarSign, 
  UserPlus,
  AlertTriangle,
  BookOpen,
  LogOut,
  Banknote,
  Terminal,
  Wifi,
  Radio,
  Lock,
  User,
  RefreshCw,
  ShieldAlert,
  ShieldX,
  Trash2,
  FileText as FileIcon,
  HeartPulse,
  Receipt,
  Landmark,
  History,
  Wallet,
  Monitor,
  Command,
  Search,
  Server,
  Globe,
  Waves,
  Image as ImageIcon,
  ChevronLeft,
  Pause,
  Play,
  TrendingDown,
  Bell,
  Info,
  ArrowUpRight,
  Filter,
  Calendar,
  CheckCheck,
  Tag,
  ShieldQuestion,
  ToggleLeft,
  ToggleRight,
  Bookmark,
  Fingerprint,
  Wrench,
  FileSearch,
  RotateCcw,
  ShieldOff,
  ZapOff,
  XCircle
} from 'lucide-react';
import { GoogleGenAI, Type, Modality, LiveServerMessage, Blob, GenerateContentResponse } from "@google/genai";

// --- Types & Interfaces ---

type Plan = 'Free Trial' | 'Starter' | 'Pro' | 'Unlimited';
type EngineStatus = 'Active' | 'Paused' | 'Optimizing' | 'Draft';
type TransactionStatus = 'Completed' | 'Processing' | 'Auditing';

interface NotificationPrefs {
  yieldMilestones: boolean;
  liquidityExits: boolean;
  gridSignals: boolean;
  securityAlerts: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  password?: string;
  plan: Plan;
  role: 'User' | 'Admin'; 
  onboarded: boolean;
  balance: number;
  lifetimeYield: number;
  totalWithdrawn: number;
  notificationPrefs?: NotificationPrefs;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status: TransactionStatus;
  method?: string;
  txHash?: string;
}

interface EngineConfig {
  attackVector?: string;
  lever?: string;
  moat?: string;
  projectedRevenue?: string;
  strategyName?: string;
  prompt?: string;
  name?: string;
  visualPrompt?: string;
}

interface Engine {
  id: string;
  name: string;
  type: string;
  status: EngineStatus;
  revenue: number;
  uptime: number;
  lastSync: string;
  performance: number;
  transactions: number;
  config: EngineConfig;
  imageUrl?: string;
  history?: number[]; 
}

interface Article {
  id: string;
  title: string;
  category: 'Getting Started' | 'Engine Strategies' | 'Advanced Tactics' | 'Grid Economics' | 'Tutorials';
  author: string;
  publishedDate: string;
  content: string;
  featured?: boolean;
  published?: boolean;
}

interface GridNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  read: boolean;
}

// --- Constants & Config ---

const ENGINE_TEMPLATES = [
  { id: 'affiliate', name: 'Affiliate Magnet', description: 'Automated traffic routing to high-ticket offers using social signal nodes.', icon: TrendingUp, color: 'text-blue-500', yield: 'High Velocity' },
  { id: 'newsletter', name: 'Newsletter Engine', description: 'AI-curated content delivery with dynamic ad placement slots.', icon: Mail, color: 'text-purple-500', yield: 'Steady Growth' },
  { id: 'digital-product', name: 'Digital Delivery', description: 'Complete sales funnel with automated license and asset delivery.', icon: Database, color: 'text-emerald-500', yield: 'Passive Max' },
  { id: 'saas-reseller', name: 'SaaS Resell Node', description: 'Automated white-label provisioning and seat management.', icon: Layers, color: 'text-orange-500', yield: 'Subscription Yield' },
  { id: 'content-bot', name: 'Content Arbitrage', description: 'AI content generation node targeting low-competition search niches.', icon: Sparkles, color: 'text-pink-500', yield: 'Search Arbitrage' },
];

const MOCK_ARTICLES: Article[] = [
  { 
    id: 'intro-sovereignty', 
    title: 'Introduction to Sovereign Revenue', 
    category: 'Getting Started', 
    author: 'The Architect', 
    publishedDate: '2024-07-15', 
    featured: true, 
    published: true,
    content: `Sovereign Revenue represents a paradigm shift in wealth creation. By leveraging autonomous matrix nodes, architects can bypass traditional labor markets and establish self-sustaining yield streams. This protocol focuses on cognitive scalability and the removal of human latency from the profit cycle.` 
  },
  { 
    id: 'builder-guide', 
    title: 'Mastering the Architect\'s Brief', 
    category: 'Tutorials', 
    author: 'The Architect', 
    publishedDate: '2025-01-20', 
    featured: true, 
    published: true,
    content: `Architecting a successful AutoIncome Engine requires a blend of strategic intent and neural precision. The brief is the DNA of your node; if the briefing is ambiguous, the node will suffer from logic drift.` 
  },
  { 
    id: 'grid-economics-101', 
    title: 'Grid Economics: Maximizing Node Density', 
    category: 'Grid Economics', 
    author: 'Vortex', 
    publishedDate: '2025-02-01', 
    featured: false, 
    published: true,
    content: `Understanding the relationship between node latency and capital throughput is essential. By optimizing the Grid protocol, an architect can increase yield by 15-20% without increasing resource overhead. Density is not just volume; it's the intelligent arrangement of logic nodes.` 
  },
  { 
    id: 'security-protocols', 
    title: 'Fortifying Your Moat', 
    category: 'Advanced Tactics', 
    author: 'ShieldMaster', 
    publishedDate: '2025-02-05', 
    featured: false, 
    published: true,
    content: `Your economic moat is only as strong as your logic isolation. Use distinct neural paths for cross-cluster settlements to avoid single-point logical failures. Resilience is the cornerstone of sovereign wealth.` 
  },
  { 
    id: 'automation-v6', 
    title: 'Auto-Negotiation Engines', 
    category: 'Engine Strategies', 
    author: 'The Architect', 
    publishedDate: '2025-02-10', 
    featured: false, 
    published: true,
    content: `V6 engines now support real-time bid negotiation for affiliate placements. This allows for dynamic profit adjustment based on global traffic volatility. Automating the negotiation phase removes human bias and maximizes tick-by-tick yield.` 
  },
  { 
    id: 'newsletter-monetization', 
    title: 'Advanced Newsletter Arbitrage', 
    category: 'Engine Strategies', 
    author: 'Oracle', 
    publishedDate: '2025-02-12', 
    featured: false, 
    published: true,
    content: `Curating high-signal newsletters for executive niches allows for massive ad premiums. By utilizing AI-driven audience segmentation, you can deliver hyper-relevant content that yields 4x higher CTR than generic summaries.` 
  }
];

const AVAILABLE_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', description: 'High-speed neural routing. Ideal for rapid yield iterations.', icon: Zap },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', description: 'Deep reasoning architecture. Best for complex moats.', icon: BrainCircuit }
];

// --- Helper Functions ---

const formatCurrency = (val: any) => {
  const num = typeof val === 'number' && !isNaN(val) ? val : 0;
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const generateTxHash = () => {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 40; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const generateMockHistory = (base: number, length: number = 24) => {
  return Array.from({ length }).map(() => base + (Math.random() * 10 - 5));
};

// --- Specialized Components ---

const MetabolismTicker = ({ value, label = "Metabolism", isMain = false }: { value: number, label?: string, isMain?: boolean }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [delta, setDelta] = useState(0);
  const [showDelta, setShowDelta] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value > prevValue.current) {
      const diff = value - prevValue.current;
      setDelta(diff);
      setShowDelta(true);
      const deltaTimer = setTimeout(() => setShowDelta(false), 2000);

      const start = displayValue;
      const end = value;
      const duration = 800;
      let startTime: number | null = null;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setDisplayValue(start + (end - start) * progress);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      prevValue.current = value;
      return () => clearTimeout(deltaTimer);
    }
    prevValue.current = value;
  }, [value]);

  return (
    <div className="space-y-0.5 relative group">
      <p className={`font-black uppercase text-white/40 italic ${isMain ? 'text-[10px]' : 'text-[9px]'}`}>{label}</p>
      <div className="flex items-baseline gap-2 overflow-visible">
        <span className={`font-black italic leading-none transition-colors duration-500 ${isMain ? 'text-4xl md:text-5xl text-white' : 'text-3xl text-green-400 drop-shadow-lg'}`}>
          ${formatCurrency(displayValue)}
        </span>
        {showDelta && (
          <span className="absolute -top-2 right-0 font-mono text-[10px] font-black text-emerald-400 animate-in slide-in-from-bottom-2 fade-out duration-1000 fill-mode-forwards pointer-events-none">
            +{(delta).toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
};

const PerformanceGauge = ({ value }: { value: number }) => {
  const prevValue = useRef(value);
  const [isJittering, setIsJittering] = useState(false);

  useEffect(() => {
    if (Math.abs(value - prevValue.current) > 0.01) {
      setIsJittering(true);
      const timer = setTimeout(() => setIsJittering(false), 1000);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div className="text-right flex flex-col justify-end">
      <p className="text-[9px] font-black uppercase text-white/40 italic">Efficiency</p>
      <div className="flex items-center justify-end gap-2">
        <span className={`text-lg font-black italic transition-all duration-300 ${isJittering ? 'text-blue-400 scale-110' : 'text-blue-500'} leading-none drop-shadow-lg`}>
          {value.toFixed(1)}%
        </span>
        <div className={`w-1 h-1 rounded-full ${value > 90 ? 'bg-green-500 shadow-[0_0_8px_#10b981]' : 'bg-yellow-500 shadow-[0_0_8px_#f59e0b]'} ${isJittering ? 'animate-ping' : ''}`}></div>
      </div>
    </div>
  );
};

const PerformanceTrend = ({ data, height = 32, width = 96, strokeWidth = 4, showGradient = true }: { data: number[], height?: number, width?: number, strokeWidth?: number, showGradient?: boolean }) => {
  if (!data || data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 10;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (((val - min) / range) * (100 - padding * 2) + padding);
    return `${x},${y}`;
  }).join(' ');

  const first = data[0];
  const last = data[data.length - 1];
  const isUp = last >= first;
  const color = isUp ? "#10b981" : "#ef4444";

  return (
    <div style={{ height, width }} className="relative overflow-visible">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        {showGradient && (
          <defs>
            <linearGradient id={`grad-${color.replace('#','')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        )}
        {showGradient && (
          <path
            d={`M 0,100 L ${points} L 100,100 Z`}
            fill={`url(#grad-${color.replace('#','')})`}
            className="transition-all duration-1000"
          />
        )}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="transition-all duration-1000 drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]"
        />
      </svg>
    </div>
  );
};

const PerformanceTimeline = ({ history }: { history: number[] }) => {
  const [period, setPeriod] = useState<'Hourly' | 'Daily' | 'Weekly'>('Hourly');
  
  const data = useMemo(() => {
    if (period === 'Hourly') return history;
    if (period === 'Daily') return generateMockHistory(history[history.length - 1], 7);
    return generateMockHistory(history[history.length - 1], 12);
  }, [period, history]);

  const stats = useMemo(() => {
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const peak = Math.max(...data);
    const low = Math.min(...data);
    return { avg, peak, low };
  }, [data]);

  return (
    <Card blueprint className="p-8 space-y-8 glass">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
             <Calendar size={20} className="text-blue-500" /> Performance Timeline
          </h3>
          <p className="text-[10px] font-black uppercase text-white/20 italic tracking-widest">Diagnostic Logic Fluctuations</p>
        </div>
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
          {['Hourly', 'Daily', 'Weekly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase italic tracking-widest transition-all ${period === p ? 'bg-blue-600 text-white shadow-glow-sm' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-64 w-full bg-black/20 rounded-2xl p-6 border border-white/5 group">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <PerformanceTrend data={data} height={200} width={100} strokeWidth={2} />
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-6 py-10">
          {[1, 2, 3, 4].map(i => <div key={i} className="w-full border-t border-white/[0.03]"></div>)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Peak Signal', value: `${stats.peak.toFixed(2)}%`, color: 'text-emerald-500' },
          { label: 'Mean Drift', value: `${stats.avg.toFixed(2)}%`, color: 'text-blue-500' },
          { label: 'Floor Level', value: `${stats.low.toFixed(2)}%`, color: 'text-red-500' }
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <p className="text-[9px] font-black uppercase text-white/30 italic">{s.label}</p>
            <p className={`text-xl font-black italic ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

const Logo = ({ size = 40, className = "", animate = false }: { size?: number, className?: string, animate?: boolean }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative group">
      <div className={`absolute inset-0 bg-blue-600 blur-lg opacity-40 group-hover:opacity-80 transition-opacity ${animate ? 'animate-pulse' : ''}`}></div>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-2xl overflow-visible">
        <path d="M50 5L10 25V75L50 95L90 75V25L50 5Z" fill="#0070f3" fillOpacity="0.1" stroke="#0070f3" strokeWidth="4" className={animate ? 'animate-[pulse_4s_infinite]' : ''}/>
        <circle cx="50" cy="50" r="22" stroke="#0070f3" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_15s_linear_infinite]"/>
        <path d="M35 50H65M50 35V65" stroke="white" strokeWidth="4" strokeLinecap="round" className={animate ? 'animate-[bounce_2s_infinite]' : ''}/>
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-white text-xl font-black italic tracking-tighter uppercase">AutoIncome</span>
      <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Engines™</span>
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false, size = 'md', type = 'button', loading = false }: any) => {
  const base = "flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 relative overflow-hidden group whitespace-nowrap";
  const sizes: any = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg" };
  const variants: any = {
    primary: "bg-[#0070f3] hover:bg-blue-500 text-white shadow-glow",
    secondary: "bg-white/10 hover:bg-white/20 text-white",
    outline: "border border-white/20 hover:border-white/40 text-white",
    ghost: "text-white/60 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20",
    success: "bg-green-600 hover:bg-green-500 text-white",
    gold: "bg-[#b8860b]/20 hover:bg-[#b8860b]/40 border border-[#b8860b]/30 text-[#ffd700]"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {loading ? (<Activity size={18} className="animate-spin" />) : Icon && (<Icon size={size === 'sm' ? 16 : 18} />)}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', hover = false, onClick, blueprint = false, image, ...props }: any) => (
  <div 
    onClick={onClick} 
    className={`glass rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group
      ${hover ? 'hover:border-blue-500/40 hover:bg-white/5 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-glow-sm' : ''} 
      ${className} 
      ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`} 
    {...props}
  >
    {blueprint && <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>}
    {image && (
      <>
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 pointer-events-none overflow-hidden transition-opacity duration-500">
          <img src={image} className="w-full h-full object-cover animate-ken-burns group-hover:scale-110 transition-transform duration-700" alt="" />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity duration-500">
            <div className="absolute inset-y-0 -inset-x-full w-[50%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep"></div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(rgba(0,112,243,0.05)_1px,transparent_1px)] bg-[length:100%_4px] mix-blend-overlay"></div>
      </>
    )}
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

const Badge = ({ children, variant = 'info', className = '', live = false, onClick }: any) => {
  const variants: any = {
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border border-green-500/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    neutral: "bg-white/5 text-white/50 border border-white/10",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20",
    gold: "bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20"
  };
  return (<button onClick={onClick} disabled={!onClick} className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-black italic transition-all ${onClick ? 'hover:scale-105 active:scale-95' : ''} ${variants[variant]} ${className}`}>
    {live && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
    {children}
  </button>);
};

// --- Network topology visualizer ---
const NetworkTopology = ({ nodeCount }: { nodeCount: number }) => {
  return (
    <div className="relative h-48 w-full bg-black/40 rounded-2xl overflow-hidden border border-white/5 group">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-blue-600"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse shadow-glow"></div>
            <div className="absolute w-24 h-24 border border-blue-600/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute w-32 h-32 border border-blue-600/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          </div>
          {Array.from({ length: Math.max(3, nodeCount) }).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-glow-sm"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * (360 / Math.max(3, nodeCount))}deg) translate(50px) rotate(-${i * (360 / Math.max(3, nodeCount))}deg)`
              }}
            >
              <div className="absolute inset-[-10px] border-t border-blue-500/20 rounded-full animate-ping"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">Grid Link: Synchronized</span>
      </div>
    </div>
  );
};

// --- Storage Utils ---
const saveEnginesToStorage = (engines: Engine[]) => {
  const stripped = engines.map(({ imageUrl, ...rest }) => ({ ...rest, imageUrl }));
  localStorage.setItem('autoincome_engines', JSON.stringify(stripped));
};

// --- Handshake ---
const SystemHandshake = ({ onComplete }: { onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sequence = [
      "AUTHENTICATING ARCHITECT CREDENTIALS...",
      "HANDSHAKE ESTABLISHED VIA NEURAL-LINK-7",
      "DECRYPTING SOVEREIGNTY PROTOCOLS...",
      "FETCHING ACTIVE NODE TOPOLOGY...",
      "SYNCING TREASURY BALANCE (USD/BTC)...",
      "GRID ACCESS GRANTED. WELCOME BACK."
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${sequence[i]}`]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-12 text-center animate-in fade-in zoom-in-95 duration-1000">
        <Logo size={80} animate className="justify-center" />
        <div ref={logRef} className="h-48 bg-black/40 border border-blue-600/20 rounded-xl p-8 font-mono text-left text-blue-500 text-xs overflow-y-auto scrollbar-hide glass">
          {logs.map((l, i) => <div key={i} className="animate-in fade-in slide-in-from-left-4 mb-2">{l}</div>)}
          <div className="w-2 h-4 bg-blue-500 animate-pulse inline-block align-middle ml-1"></div>
        </div>
      </div>
    </div>
  );
};

// --- Login & Sign Up ---
const LoginScreen = ({ onLogin, onSignUp, isGridEmpty, onPurge }: { onLogin: (email: string, pass: string) => string | undefined, onSignUp: (name: string, email: string, pass: string) => string | undefined, isGridEmpty: boolean, onPurge: () => void }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(isGridEmpty ? 'signup' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      let err;
      if (mode === 'login') {
        err = onLogin(email, password);
      } else {
        err = onSignUp(name, email, password);
      }
      if (err) { setError(err); setLoading(false); }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 blueprint-bg opacity-[0.05]"></div>
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px] animate-grid-pulse"></div>
      <div className="relative z-10 w-full max-w-md">
        <Card className="p-10 space-y-8 glass" blueprint>
          <div className="text-center space-y-4">
            <Logo size={60} className="justify-center" animate />
            <h1 className="text-2xl font-black italic uppercase text-white tracking-tighter">Grid Access Terminal</h1>
            <p className="text-sm text-white/40 italic">
              {isGridEmpty ? 'The seat of the Lead Architect is vacant. Initialize Identity.' : (mode === 'login' ? 'Authenticate to architect sovereignty.' : 'Initialize your architect identity.')}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 italic tracking-widest">Architect Alias</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"/>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full h-12 bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 text-white focus:outline-none focus:border-blue-600 transition-all" placeholder="e.g. CyberNode_01" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/30 italic tracking-widest">Uplink Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"/>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full h-12 bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 text-white focus:outline-none focus:border-blue-600 transition-all" placeholder="architect@grid.io" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/30 italic tracking-widest">Secret Passphrase</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"/>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full h-12 bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 text-white focus:outline-none focus:border-blue-600 transition-all" placeholder="••••••••" />
              </div>
            </div>
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center italic flex items-center gap-2 justify-center"><AlertTriangle size={14}/>{error}</div>}
            <Button type="submit" size="lg" className="w-full" loading={loading} icon={mode === 'login' ? Unlock : UserPlus}>
              {loading ? (mode === 'login' ? 'Authenticating...' : 'Initializing...') : (mode === 'login' ? 'Access Grid' : 'Initialize Identity')}
            </Button>
          </form>
          <div className="text-center pt-2 space-y-4">
            {!isGridEmpty && (
                <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="text-xs font-black italic uppercase text-white/40 hover:text-blue-500 transition-colors tracking-widest block w-full">
                {mode === 'login' ? "Need an account? Create Identity" : "Already registered? Authenticate"}
                </button>
            )}
            <button onClick={onPurge} className="text-[9px] font-black uppercase text-white/10 hover:text-red-500 transition-colors tracking-widest block w-full">
              Reset Grid Session (Legacy Cleanup)
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Ticker ---
const GlobalActivityTicker = () => {
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    const news = [
      "NODE-422 yield spike: +12% performance increase in Hong Kong cluster.",
      "New Architect joined from San Francisco. Matrix expansion ongoing.",
      "Freedom Wheels™ strategy update: 'Momentum Arbitrage' nodes optimized for Q4 signals.",
      "Treasury withdrawal of $2,440.00 processed successfully.",
      "Neural uplink latency reduced by 40ms in European data center."
    ];
    setMessages([...news, ...news]);
  }, []);
  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-black/80 border-t border-white/5 backdrop-blur-md z-[100] flex items-center overflow-hidden">
      <div className="flex items-center gap-4 px-4 h-full border-r border-white/10 bg-blue-600/20 whitespace-nowrap">
        <Wifi size={14} className="text-blue-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Global Feed</span>
      </div>
      <div className="flex-1 whitespace-nowrap flex animate-[scroll_60s_linear_infinite]">
        {messages.map((m, i) => (
          <span key={i} className="px-12 text-[10px] font-bold text-white/40 italic flex items-center gap-2">
            <Radio size={10} className="text-white/20" /> {m}
          </span>
        ))}
      </div>
    </div>
  );
};

// --- Profile & Settings ---
const ProfileSettings = ({ user, onUpdate, onCancel }: { user: UserData, onUpdate: (u: Partial<UserData>) => void, onCancel: () => void }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [pass, setPass] = useState(user.password || '');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Default preferences if none exist
    const [prefs, setPrefs] = useState<NotificationPrefs>(user.notificationPrefs || {
      yieldMilestones: true,
      liquidityExits: true,
      gridSignals: true,
      securityAlerts: true
    });

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            onUpdate({ name, email, password: pass, notificationPrefs: prefs });
            setSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    const togglePref = (key: keyof NotificationPrefs) => {
      setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const PrefRow = ({ label, desc, icon: Icon, active, onToggle }: any) => (
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${active ? 'bg-blue-600/20 text-blue-500' : 'bg-white/5 text-white/20'}`}>
            <Icon size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-white italic tracking-widest">{label}</p>
            <p className="text-[9px] text-white/30 italic">{desc}</p>
          </div>
        </div>
        <button onClick={onToggle} className={`transition-all ${active ? 'text-blue-500' : 'text-white/20'}`}>
          {active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
        </button>
      </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-white">Architect Profile</h1>
                <Button variant="outline" onClick={onCancel} icon={ArrowLeft}>Back</Button>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <Card blueprint className="space-y-8 p-10 glass">
                  <h3 className="text-xl font-black italic uppercase text-white border-b border-white/5 pb-4">Architect Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-white/40 tracking-widest italic">Alias / Name</label>
                          <div className="relative">
                              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"/>
                              <input value={name} onChange={e => setName(e.target.value)} className="w-full h-12 bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 focus:border-blue-600 outline-none text-white transition-all"/>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-black uppercase text-white/40 tracking-widest italic">Uplink Email</label>
                          <div className="relative">
                              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"/>
                              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full h-12 bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 focus:border-blue-600 outline-none text-white transition-all"/>
                          </div>
                      </div>
                  </div>
              </Card>

              <Card blueprint className="space-y-8 p-10 glass">
                  <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <Bell size={20} className="text-blue-500" />
                    <h3 className="text-xl font-black italic uppercase text-white">Notification Uplink</h3>
                  </div>
                  <p className="text-xs text-white/40 italic">Configure automated communication protocols for Treasury Hub events.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PrefRow 
                      label="Yield Milestones" 
                      desc="Get notified when grid nodes hit liquidity targets." 
                      icon={TrendingUp} 
                      active={prefs.yieldMilestones}
                      onToggle={() => togglePref('yieldMilestones')}
                    />
                    <PrefRow 
                      label="Liquidity Exits" 
                      desc="Confirmations for capital withdrawal requests." 
                      icon={Banknote} 
                      active={prefs.liquidityExits}
                      onToggle={() => togglePref('liquidityExits')}
                    />
                    <PrefRow 
                      label="Grid Signals" 
                      desc="Real-time alerts for engine performance shifts." 
                      icon={Radio} 
                      active={prefs.gridSignals}
                      onToggle={() => togglePref('gridSignals')}
                    />
                    <PrefRow 
                      label="Security Overrides" 
                      desc="Critical alerts for privileged role changes." 
                      icon={ShieldAlert} 
                      active={prefs.securityAlerts}
                      onToggle={() => togglePref('securityAlerts')}
                    />
                  </div>
              </Card>
            </div>

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs italic text-center animate-in zoom-in-95">
                Architect Identity and Communication Protocols Synchronized.
              </div>
            )}
            
            <Button onClick={handleSave} loading={saving} icon={ShieldCheck} className="w-full py-6">Update Global Configuration</Button>
        </div>
    );
};

// --- Architect Uplink ---
const LiveArchitectUplink = ({ onExit }: { onExit: () => void }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [currentOutput, setCurrentOutput] = useState("");
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            if (!audioContextRef.current) return;
            const source = audioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob: Blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current.destination);
            setIsActive(true);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
            if (msg.serverContent?.outputTranscription) {
              const text = msg.serverContent.outputTranscription.text;
              setCurrentOutput(prev => prev + text);
            }
            if (msg.serverContent?.turnComplete) { 
              setTranscription(prev => [...prev, currentOutput]); 
              setCurrentOutput(""); 
            }
            const modelTurn = msg.serverContent?.modelTurn;
            const audioBase64 = modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (audioBase64 && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioBase64), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
          },
          onerror: (e) => console.error("Live Error", e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are the Lead Architect of the AutoIncome Engine grid. Provide strategic sovereignty advice.'
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { console.error(err); }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    setIsActive(false);
  };
  useEffect(() => () => stopSession(), []);

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8 animate-in fade-in duration-500 pb-16 px-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">Architect Hub</h1>
        <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"><X size={24} /></button>
      </div>
      <Card className="h-[500px] flex flex-col glass" blueprint>
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isActive ? 'bg-blue-600 shadow-glow' : 'bg-white/5'}`}><BrainCircuit size={24} /></div>
          <span className="text-xl font-black italic uppercase text-white tracking-tighter">{isActive ? 'Uplink Established' : 'Neural Standby'}</span>
        </div>
        <div className="flex-1 p-8 overflow-y-auto space-y-4 font-mono text-sm scrollbar-hide bg-black/40">
          {transcription.map((t, i) => <p key={i} className="text-white/80 italic animate-in fade-in slide-in-from-left-2">{t}</p>)}
          {currentOutput && <p className="text-blue-400 italic animate-pulse">{currentOutput}</p>}
          {transcription.length === 0 && !currentOutput && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
              <MicOff size={48} />
              <p className="text-xs uppercase tracking-widest font-black italic">Neural uplink quiet.</p>
            </div>
          )}
        </div>
        <div className="p-6 bg-black flex justify-center border-t border-white/5">
          {!isActive ? <Button size="lg" className="w-full" onClick={startSession} icon={Zap}>Initiate Uplink</Button> : <Button variant="danger" size="lg" className="w-full" onClick={stopSession} icon={MicOff}>Sever Connection</Button>}
        </div>
      </Card>
    </div>
  );
};

// --- Decommissioning Components ---

const DecommissionNodeModal = ({ 
  engine, 
  onConfirm, 
  onCancel 
}: { 
  engine: Engine, 
  onConfirm: () => void, 
  onCancel: () => void 
}) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-md relative">
        <Card blueprint className="p-10 space-y-8 shadow-3xl border-red-500/20 glass text-center">
          <div className="flex flex-col items-center gap-4">
             <div className="p-4 rounded-full bg-red-500/10 text-red-500 animate-pulse">
                <Trash2 size={48} />
             </div>
             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-tight">Decommission Node</h3>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-4">
              <p className="text-sm text-white/80 italic leading-relaxed">
                CRITICAL: You are initiating the permanent decommissioning of node <span className="text-red-400 font-bold">"{engine.name}"</span>.
              </p>
              
              <section className="text-left space-y-3">
                 <h4 className="text-[10px] font-black uppercase text-red-400 tracking-widest italic flex items-center gap-2"><AlertTriangle size={14} /> System Implications</h4>
                 <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[10px] text-white/40 italic"><ZapOff size={12} className="text-red-500" /> Immediate termination of yield generation logic.</li>
                    <li className="flex items-center gap-2 text-[10px] text-white/40 italic"><ShieldOff size={12} className="text-red-500" /> Permanent deletion of node configuration DNA.</li>
                    <li className="flex items-center gap-2 text-[10px] text-white/40 italic"><Database size={12} className="text-red-500" /> Purging of neural telemetry and history logs.</li>
                    <li className="flex items-center gap-2 text-[10px] text-white/40 italic"><XCircle size={12} className="text-red-500" /> Irreversible removal from Grid Registry.</li>
                 </ul>
              </section>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onConfirm} variant="danger" size="lg" className="w-full h-14" icon={Trash2}>Confirm Decommissioning</Button>
            <Button onClick={onCancel} variant="outline" className="w-full" icon={X}>Abort Protocol</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Engine Builder Components ---

function sanitizeAndParseJson(rawText: string | undefined): any {
    if (!rawText || typeof rawText !== 'string') throw new Error("NEURAL_EMPTY_SIGNAL: Undefined signal.");
    let sanitizedText = rawText.trim();
    const jsonMatch = sanitizedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("SCHEMA_VIOLATION: Response does not contain valid structural DNA.");
    sanitizedText = jsonMatch[0];
    try { return JSON.parse(sanitizedText); } 
    catch (e) { throw new Error(`SYNTACTIC_NOISE: Failed to parse neural config.`); }
}

const DeploymentConfirmationModal = ({ 
  config, 
  onConfirm, 
  onCancel 
}: { 
  config: { name: string, type: string, model: string, brief: string }, 
  onConfirm: () => void, 
  onCancel: () => void 
}) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-lg relative">
        <Card blueprint className="p-10 space-y-10 shadow-3xl border-blue-500/20 glass">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 mx-auto text-blue-500 animate-pulse">
               <Fingerprint size={32} />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Deployment Protocol</h2>
            <p className="text-white/40 text-xs italic">Review and authorize node architecture synchronization.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
             <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <p className="text-[9px] font-black uppercase text-white/30 italic flex items-center gap-2"><Tag size={10} /> Node Identification</p>
                <p className="text-lg font-black italic text-blue-400 uppercase truncate">{config.name}</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase text-white/30 italic flex items-center gap-2"><Layers size={10} /> Topology</p>
                    <p className="text-sm font-bold italic text-white uppercase">{config.type}</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase text-white/30 italic flex items-center gap-2"><Cpu size={10} /> Neural Core</p>
                    <p className="text-sm font-bold italic text-white uppercase">{config.model}</p>
                </div>
             </div>
             <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <p className="text-[9px] font-black uppercase text-white/30 italic flex items-center gap-2"><Terminal size={10} /> Encoded Briefing</p>
                <p className="text-[11px] text-white/60 italic leading-relaxed line-clamp-2">{config.brief || "Standard autonomous protocol selected."}</p>
             </div>
          </div>

          <div className="flex flex-col gap-3">
             <Button onClick={onConfirm} size="lg" className="w-full h-16 shadow-glow" icon={ShieldCheck}>Authorize Uplink</Button>
             <Button onClick={onCancel} variant="outline" className="w-full">Back to Adjustments</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

interface BuilderError {
  title: string;
  message: string;
  code: string;
  failurePoint: string;
  remedy: string;
  technicalLogs?: string[];
}

const EngineBuilder = ({ onDeploy, onCancel }: { onDeploy: (e: Engine) => void, onCancel: () => void }) => {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<any>(null);
  const [model, setModel] = useState(AVAILABLE_MODELS[0].id);
  const [brief, setBrief] = useState("");
  const [customName, setCustomName] = useState("");
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<BuilderError | null>(null);

  const handleArchitect = async () => {
    setShowConfirm(false);
    setIsArchitecting(true);
    setError(null);
    setLogs(["> ARCHITECTURE PROTOCOL INITIATED..."]);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    let configData: EngineConfig = {};
    let synthesizedUrl: string | undefined = undefined;

    try {
        setLogs(prev => [...prev, "> Handshaking with neural core for logic topology..."]);
        const resp: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: { parts: [{ text: `Architect a new passive income engine named "${customName}" based on template "${template.name}" and briefing: "${brief}". Provide strategy details in JSON format exactly according to the schema.` }] },
            config: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        strategyName: { type: Type.STRING },
                        attackVector: { type: Type.STRING },
                        lever: { type: Type.STRING },
                        moat: { type: Type.STRING },
                        projectedRevenue: { type: Type.STRING },
                        visualPrompt: { type: Type.STRING, description: "Detailed visual description for iconography generation." },
                    },
                    required: ["strategyName", "attackVector", "lever", "moat", "projectedRevenue", "visualPrompt"]
                }
            }
        }).catch(e => {
            throw { 
              title: "Neural Core Uplink Error", 
              message: "Failed to establish a stable logic channel with the neural processor.", 
              code: "ERR_CORE_DISCONNECT",
              failurePoint: "NEURAL_SYNTHESIS_PHASE",
              remedy: "Verify API key status and network topology stability before re-initializing.",
              originalError: e
            };
        });
        
        const text = resp.text;
        if (!text) throw { 
          title: "Logic DNA Nullified", 
          message: "The neural core returned an empty logic signal.", 
          code: "ERR_EMPTY_DNA",
          failurePoint: "SYNTACTIC_DECODING",
          remedy: "The briefing may be too ambiguous. Try providing more specific operational constraints."
        };

        try {
          configData = sanitizeAndParseJson(text);
        } catch (e) {
          throw {
            title: "DNA Parsing Violation",
            message: "The synthesized strategy DNA contains logical contradictions or syntax noise.",
            code: "ERR_JSON_CORRUPTION",
            failurePoint: "DATA_STRUCT_DECODING",
            remedy: "The neural core drifted out of schema bounds. Recalibrate briefing and retry deployment."
          };
        }
        
        const finalName = customName.trim();
        setLogs(prev => [...prev, `> Node identified as: ${finalName}`]);
        setLogs(prev => [...prev, "> Logic configuration established."]);

        setLogs(prev => [...prev, "> Synthesizing unique abstract visual iconography via neural rendering..."]);
        const imgResp: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: `Abstract technological data visualization, neural network background, cyberpunk digital art, glowing blue and violet lines, dark obsidian surfaces, 4k high definition, detailed isometric machinery silhouette for an income engine named ${finalName}. Visual focus: ${configData.visualPrompt}` }] },
            config: {
              imageConfig: {
                aspectRatio: "16:9"
              }
            }
        }).catch(e => {
           setLogs(prev => [...prev, "> [WARN] Neural iconography failed. Proceeding with fallback placeholder."]);
           return { candidates: [] } as any;
        });

        const imgParts = imgResp.candidates?.[0]?.content?.parts;
        if (imgParts) {
            for (const part of imgParts) {
                if (part.inlineData) {
                    synthesizedUrl = `data:image/png;base64,${part.inlineData.data}`;
                    setLogs(prev => [...prev, "> [OK] Neural iconography rendered successfully."]);
                    break;
                }
            }
        }
        
        setLogs(prev => [...prev, "> Finalizing deployment package. Initializing Node..."]);
        setTimeout(() => {
            setIsArchitecting(false);
            const basePerformance = 95 + Math.random() * 5;
            onDeploy({
                id: `engine_${Date.now()}`,
                name: finalName,
                type: template.name,
                status: 'Active',
                revenue: 0, uptime: 100, performance: basePerformance, transactions: 0,
                lastSync: new Date().toISOString(),
                config: configData,
                imageUrl: synthesizedUrl,
                history: generateMockHistory(basePerformance)
            });
        }, 1500);

    } catch (err: any) {
        setIsArchitecting(false);
        setError({
          title: err.title || "Unknown Grid Error",
          message: err.message || "An unhandled exception occurred during node synthesis.",
          code: err.code || "ERR_SYNTH_UNHANDLED",
          failurePoint: err.failurePoint || "INTERNAL_ARCH_PROTOCOL",
          remedy: err.remedy || "Attempt to re-initialize the deployment uplink. If persistent, purge node cache.",
          technicalLogs: [err.originalError?.toString() || err.toString()]
        });
        return;
    }
  };

  if(error) return (
    <div className="max-w-4xl mx-auto py-20 px-4 animate-in zoom-in-95 duration-500">
      <Card blueprint className="p-12 border-red-500/30 bg-red-500/[0.01] space-y-10 shadow-3xl glass relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <ShieldAlert size={200} className="text-red-500" />
         </div>
         
         <header className="space-y-4 relative z-10">
            <div className="flex items-center gap-4">
               <div className="p-3 rounded-xl bg-red-500/10 text-red-500 animate-pulse">
                  <ShieldX size={32} />
               </div>
               <div className="space-y-1">
                  <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">{error.title}</h2>
                  <p className="text-[10px] font-black uppercase text-red-500/60 tracking-[0.3em] italic">System Diagnostic Report</p>
               </div>
            </div>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <section className="space-y-6">
               <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-white/30 italic flex items-center gap-2"><FileSearch size={14} /> Failure Details</h4>
                  <p className="text-sm text-white/80 italic leading-relaxed">{error.message}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                     <p className="text-[9px] font-black uppercase text-white/30 italic">Error Code</p>
                     <p className="text-xs font-mono text-red-400 font-bold">{error.code}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                     <p className="text-[9px] font-black uppercase text-white/30 italic">Failure Point</p>
                     <p className="text-xs font-mono text-white/60 font-bold">{error.failurePoint}</p>
                  </div>
               </div>
            </section>

            <section className="space-y-6">
               <div className="p-6 rounded-2xl bg-blue-600/[0.03] border border-blue-500/20 space-y-3 shadow-glow-sm">
                  <h4 className="text-[10px] font-black uppercase text-blue-400/60 italic flex items-center gap-2"><Wrench size={14} /> Recommended Protocol</h4>
                  <p className="text-sm text-white/80 italic leading-relaxed">{error.remedy}</p>
               </div>
               <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3 glass">
                  <h4 className="text-[10px] font-black uppercase text-white/20 italic flex items-center gap-2"><Terminal size={14} /> Trace History</h4>
                  <div className="max-h-24 overflow-y-auto scrollbar-hide space-y-1">
                     {error.technicalLogs?.map((log, i) => (
                        <p key={i} className="text-[9px] font-mono text-white/30 truncate">{log}</p>
                     ))}
                     <p className="text-[9px] font-mono text-blue-500/40">--- END OF STACK ---</p>
                  </div>
               </div>
            </section>
         </div>

         <footer className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5 relative z-10">
            <Button variant="secondary" onClick={() => { setError(null); setStep(3); }} icon={RotateCcw} className="flex-1 h-14">Recalibrate Identity DNA</Button>
            <Button variant="outline" onClick={onCancel} icon={X} className="h-14">Abort Deployment</Button>
         </footer>
      </Card>
    </div>
  );

  if(isArchitecting) return (
    <div className="max-w-3xl mx-auto py-20 px-4 space-y-8">
      <Card blueprint className="p-10 text-center space-y-8 shadow-glow glass">
        <div className="relative">
          <Activity size={48} className="text-blue-500 mx-auto animate-spin" />
          <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-ping"></div>
        </div>
        <h3 className="text-2xl font-black italic uppercase text-white">Synthesizing Architecture</h3>
        <div className="h-48 font-mono text-left text-xs overflow-y-auto scrollbar-hide space-y-2 p-6 bg-black/60 rounded-lg border border-white/5 glass">
          {logs.map((l, i) => <p key={i} className="text-green-400 animate-in fade-in slide-in-from-left-1 mb-1">{l}</p>)}
          <div className="w-2 h-4 bg-green-400 animate-pulse inline-block align-middle ml-1"></div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in max-w-5xl mx-auto py-10 px-4 relative">
      {showConfirm && (
        <DeploymentConfirmationModal 
          config={{ 
            name: customName, 
            type: template?.name || 'N/A', 
            model: AVAILABLE_MODELS.find(m => m.id === model)?.name || 'N/A', 
            brief 
          }} 
          onConfirm={handleArchitect} 
          onCancel={() => setShowConfirm(false)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 pb-8 border-b border-white/5">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Node Deployment</h1>
          <p className="text-white/40 text-sm italic font-medium">Phase {step} of 4: {['Topology', 'Neural Core', 'Identity & Strategy', 'Final Registry'][step-1]}</p>
        </div>
        <div className="flex items-center gap-3">
          {[1,2,3,4].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${step === s ? 'bg-blue-600 border-blue-500 text-white shadow-glow' : step > s ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-white/20'}`}>
              {step > s ? <Check size={20} /> : s}
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
            {ENGINE_TEMPLATES.map((t) => (
              <Card key={t.id} blueprint className={`p-8 border-2 transition-all cursor-pointer ${template?.id === t.id ? 'border-blue-600 bg-blue-600/5 shadow-glow-sm' : 'border-white/5 hover:border-white/20'}`} onClick={() => setTemplate(t)}>
                <t.icon size={32} className={`mb-4 ${t.color}`} />
                <h4 className="text-2xl font-black italic uppercase text-white mb-2">{t.name}</h4>
                <p className="text-sm text-white/40 italic leading-relaxed">{t.description}</p>
                <Badge variant="info" className="mt-4">{t.yield}</Badge>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
            {AVAILABLE_MODELS.map(m => (
              <Card key={m.id} blueprint className={`p-8 border-2 transition-all cursor-pointer ${model === m.id ? 'border-blue-600 bg-blue-600/5 shadow-glow-sm' : 'border-white/5 hover:border-white/20'}`} onClick={() => setModel(m.id)}>
                <m.icon size={32} className="mb-4 text-blue-500" />
                <h4 className="text-2xl font-black italic uppercase text-white mb-2">{m.name}</h4>
                <p className="text-sm text-white/40 italic">{m.description}</p>
              </Card>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
            <Card blueprint className="p-10 space-y-10 glass">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest italic flex items-center gap-2">
                  <Tag size={14} className="text-blue-500" /> Node Alias (Display Name)
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="e.g. Maverick Yield Core"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 pl-14 outline-none text-white italic focus:border-blue-600 transition-all text-xl glass placeholder:text-white/10"
                    maxLength={32}
                  />
                  <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/20">
                    {customName.length}/32
                  </div>
                </div>
                {!customName.trim() && <p className="text-[9px] text-red-400/60 font-black uppercase italic tracking-widest px-2">Identity required for deployment uplink.</p>}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest italic flex items-center gap-2">
                  <Terminal size={14} className="text-blue-500" /> Strategic Mission Briefing
                </label>
                <textarea 
                  value={brief} 
                  onChange={e => setBrief(e.target.value)} 
                  rows={4} 
                  placeholder={`Example: "Focus on automated affiliate signals in high-growth SaaS niches."`} 
                  className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 outline-none text-white italic focus:border-blue-600 transition-all text-lg leading-relaxed glass"
                ></textarea>
                <p className="text-[10px] text-white/20 italic">Architect briefing provides the unique cognitive logic for node optimization.</p>
              </div>
            </Card>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in zoom-in-95 duration-500">
            <Card blueprint className="p-10 space-y-10 bg-white/[0.01] glass">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Node Alias</p>
                     <span className="text-xl font-black italic uppercase text-blue-400">{customName || "[UNNAMED_CORE]"}</span>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Node Topology</p>
                     <span className="text-xl font-black italic uppercase text-white">{template?.name}</span>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Neural Model</p>
                     <span className="text-xl font-black italic uppercase text-white">{AVAILABLE_MODELS.find(m => m.id === model)?.name}</span>
                  </div>
               </div>
               <div className="space-y-4 pt-10 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Encoded Briefing DNA</p>
                  <p className="text-white/80 italic text-sm bg-black/20 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap">{brief || "Default autonomous logic applied."}</p>
               </div>
            </Card>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <Button variant="outline" onClick={step === 1 ? onCancel : () => setStep(prev => prev - 1)} icon={step === 1 ? X : ArrowLeft}>
          {step === 1 ? 'Cancel' : 'Previous'}
        </Button>
        {step < 4 ? (
          <Button onClick={() => setStep(prev => prev + 1)} icon={ArrowRight} disabled={(step === 1 && !template) || (step === 3 && !customName.trim())}>
            Continue
          </Button>
        ) : (
          <Button size="lg" onClick={() => setShowConfirm(true)} icon={Zap} className="px-12 shadow-glow">
            Initiate Grid Deployment
          </Button>
        )}
      </div>
    </div>
  );
};

// --- Security Override Modal ---
const SecurityOverrideModal = ({ 
  targetName, 
  onConfirm, 
  onCancel, 
  isSelf 
}: { 
  targetName: string, 
  onConfirm: () => void, 
  onCancel: () => void, 
  isSelf: boolean 
}) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-md relative">
        <Card blueprint className="p-10 space-y-8 shadow-3xl border-red-500/20 glass text-center">
          <div className="flex flex-col items-center gap-4">
             <div className="p-4 rounded-full bg-red-500/10 text-red-500 animate-pulse">
                <ShieldAlert size={48} />
             </div>
             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Security Override Required</h3>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-4">
              <p className="text-sm text-white/80 italic leading-relaxed">
                {isSelf 
                  ? "CRITICAL_WARNING: You are attempting to revoke your OWN Administrative authority. This action is IRREVERSIBLE without external intervention." 
                  : `AUTHENTICATION_CHALLENGE: You are revoking Admin authority from node "${targetName}".`}
              </p>
              
              <section className="text-left space-y-3">
                 <h4 className="text-[10px] font-black uppercase text-red-400 tracking-widest italic flex items-center gap-2"><XCircle size={14} /> Operational Impact Log</h4>
                 <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[10px] text-white/40 italic"><ShieldOff size={12} className="text-red-500" /> Revocation of Grid Governance access.</li>
                    <li className="flex items-center gap-2 text-[10px] text-white/40 italic"><ZapOff size={12} className="text-red-500" /> Loss of privileged Engine management.</li>
                    <li className="flex items-center gap-2 text-[10px] text-white/40 italic"><Terminal size={12} className="text-red-500" /> Termination of high-level audit trails.</li>
                    <li className="flex items-center gap-2 text-[10px] text-white/40 italic"><Layout size={12} className="text-red-500" /> Downgrade to Citizen-class node link.</li>
                 </ul>
              </section>
            </div>
            
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-red-400/60 italic text-left">
              ACTION_ID: REVOKE_PRIVILEGED_ACCESS<br/>
              TIMESTAMP: {new Date().toISOString()}<br/>
              STATUS: PENDING_AUTHORIZATION
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onConfirm} variant="danger" size="lg" className="w-full h-14" icon={ShieldX}>Authorize Override</Button>
            <Button onClick={onCancel} variant="outline" className="w-full" icon={X}>Abort Protocol</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- View Components ---

const AdminDashboard = ({ 
  users, 
  engines, 
  currentUserId, 
  onUpdateUser, 
  onToggleEngineStatus,
  onDeleteEngine
}: { 
  users: UserData[], 
  engines: Engine[], 
  currentUserId: string, 
  onUpdateUser: (id: string, update: Partial<UserData>) => void, 
  onToggleEngineStatus: (id: string) => void,
  onDeleteEngine: (id: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'engines' | 'content'>('users');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [confirmingAction, setConfirmingAction] = useState<UserData | null>(null);
  const [decommissioningEngine, setDecommissioningEngine] = useState<Engine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [statusFilter, setStatusFilter] = useState<EngineStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<string | 'All'>('All');

  const tabs = [
    { id: 'users', label: 'Architect Registry', icon: Users },
    { id: 'engines', label: 'Engine Management', icon: HeartPulse },
    { id: 'content', label: 'Content Control', icon: BookOpen }
  ] as const;

  const handleRoleToggle = (targetUser: UserData) => {
    if (targetUser.role === 'Admin') {
      setConfirmingAction(targetUser);
    } else {
      executeRoleChange(targetUser);
    }
  };

  const executeRoleChange = (targetUser: UserData) => {
    setUpdatingUserId(targetUser.id);
    const newRole: 'User' | 'Admin' = targetUser.role === 'Admin' ? 'User' : 'Admin';
    setTimeout(() => {
        onUpdateUser(targetUser.id, { role: newRole });
        setUpdatingUserId(null);
        setConfirmingAction(null);
    }, 800);
  };

  const filteredEngines = useMemo(() => {
    return engines.filter(e => {
        const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
        const matchesType = typeFilter === 'All' || e.type === typeFilter;
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
    });
  }, [engines, statusFilter, typeFilter, searchTerm]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(engines.map(e => e.type)));
  }, [engines]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 px-4 pb-24 max-w-7xl mx-auto">
      {confirmingAction && (
        <SecurityOverrideModal 
          targetName={confirmingAction.name} 
          isSelf={confirmingAction.id === currentUserId}
          onConfirm={() => executeRoleChange(confirmingAction)}
          onCancel={() => setConfirmingAction(null)}
        />
      )}

      {decommissioningEngine && (
        <DecommissionNodeModal 
          engine={decommissioningEngine}
          onConfirm={() => {
            onDeleteEngine(decommissioningEngine.id);
            setDecommissioningEngine(null);
          }}
          onCancel={() => setDecommissioningEngine(null)}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Grid Governance</h1>
          <p className="text-white/40 text-sm italic flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-500" /> Lead Architect Command Terminal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Privileged Nodes', value: users.filter(u => u.role === 'Admin').length, icon: ShieldCheck, color: 'text-blue-500' },
          { label: 'Citizen Nodes', value: users.filter(u => u.role === 'User').length, icon: User, color: 'text-white/40' },
          { label: 'Active Engines', value: engines.length, icon: Cpu, color: 'text-emerald-500' },
          { label: 'System Integrity', value: 'OPTIMAL', icon: Activity, color: 'text-purple-500' }
        ].map((stat, i) => (
          <Card key={i} blueprint className="p-8 space-y-4 glass">
            <div className="flex items-center gap-3">
              <stat.icon size={16} className={stat.color} />
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl w-fit border border-white/10 backdrop-blur-xl glass">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase italic tracking-widest transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-glow' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Card blueprint className="p-0 border border-white/5 shadow-2xl overflow-hidden glass">
            {activeTab === 'users' && (
                <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[800px]">
                    <thead>
                    <tr className="text-left text-[9px] uppercase font-black text-white/20 italic tracking-widest border-b border-white/5 bg-white/[0.01]">
                        <th className="p-6">Architect / Alias</th>
                        <th className="p-6">Grid Email</th>
                        <th className="p-6">Authority Role</th>
                        <th className="p-6 text-right">Liquidity Pool</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {users.map(u => (
                        <tr key={u.id} className={`hover:bg-white/[0.02] transition-colors group ${updatingUserId === u.id ? 'opacity-50 grayscale cursor-wait' : ''}`}>
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-white/40 group-hover:border-blue-500 transition-colors ${u.role === 'Admin' ? 'border-blue-600/50' : ''}`}>
                                {u.role === 'Admin' ? <Shield size={18} className="text-blue-500" /> : <User size={18} />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black italic uppercase text-white tracking-tighter block">{u.name}</span>
                                {u.id === currentUserId && <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest italic">Identity Uplinked</span>}
                            </div>
                            </div>
                        </td>
                        <td className="p-6 text-xs text-white/40 italic font-medium">{u.email}</td>
                        <td className="p-6">
                                <Badge 
                                variant={u.role === 'Admin' ? 'danger' : 'neutral'} 
                                onClick={() => handleRoleToggle(u)}
                                className={`group-hover:scale-105 transition-transform min-w-[90px] justify-center ${u.role === 'Admin' ? 'shadow-glow-sm' : ''}`}
                                >
                                {u.role}
                                </Badge>
                        </td>
                        <td className="p-6 text-right font-black italic text-lg text-white">
                            <span className={(u.balance ?? 0) > 0 ? 'text-green-400' : 'text-white/40'}>${formatCurrency(u.balance)}</span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}

            {activeTab === 'engines' && (
                <div className="space-y-6 p-6">
                  <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-white/5">
                     <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                        <Filter size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">Filters:</span>
                     </div>
                     
                     <div className="relative group flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Node Alias or Type..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-xs font-black italic text-white focus:outline-none focus:border-blue-500 transition-all glass"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                     </div>

                     <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-white italic focus:outline-none focus:border-blue-500"
                     >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Optimizing">Optimizing</option>
                     </select>

                     <select 
                        value={typeFilter} 
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-white italic focus:outline-none focus:border-blue-500"
                     >
                        <option value="All">All Node Types</option>
                        {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>

                     <div className="ml-auto text-[10px] font-black uppercase text-white/20 tracking-widest italic">
                        Nodes Found: {filteredEngines.length}
                     </div>
                  </div>

                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[800px]">
                        <thead>
                        <tr className="text-left text-[9px] uppercase font-black text-white/20 italic tracking-widest border-b border-white/5">
                            <th className="p-6">Engine ID</th>
                            <th className="p-6">Type</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Performance</th>
                            <th className="p-6 text-right">Aggregate Yield</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredEngines.length > 0 ? filteredEngines.map(engine => (
                            <tr key={engine.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6 font-black italic uppercase text-white tracking-tighter">{engine.name}</td>
                            <td className="p-6">
                                <span className="text-[10px] font-black uppercase text-white/40 italic">{engine.type}</span>
                            </td>
                            <td className="p-6">
                                <Badge variant={engine.status === 'Active' ? 'success' : 'warning'} live={engine.status === 'Active'}>{engine.status}</Badge>
                            </td>
                            <td className="p-6">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-white/40 text-xs">{(engine.performance ?? 0).toFixed(1)}%</span>
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${engine.performance}%` }}></div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-6 text-right font-black italic text-lg text-green-400">${formatCurrency(engine.revenue)}</td>
                            <td className="p-6 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                      onClick={() => onToggleEngineStatus(engine.id)}
                                      className={`p-3 rounded-xl transition-all ${engine.status === 'Active' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                                      title={engine.status === 'Active' ? 'Override: Pause' : 'Override: Resume'}
                                  >
                                      {engine.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                                  </button>
                                  <button 
                                      onClick={() => setDecommissioningEngine(engine)}
                                      className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                                      title="Decommission Node"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                                </div>
                            </td>
                            </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="p-24 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-20">
                                    <FileSearch size={48} />
                                    <p className="font-black uppercase tracking-[0.3em] text-xs italic">No matching nodes found in registry</p>
                                </div>
                            </td>
                          </tr>
                        )}
                        </tbody>
                    </table>
                  </div>
                </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const TreasuryHub = ({ 
  user, 
  transactions, 
  onOpenWithdraw, 
  notifications, 
  onDismissNotification, 
  onMarkAllAsRead 
}: { 
  user: UserData, 
  transactions: Transaction[], 
  onOpenWithdraw: () => void, 
  notifications: GridNotification[],
  onDismissNotification: (id: string) => void,
  onMarkAllAsRead: () => void
}) => {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 px-4 pb-24 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Treasury Hub</h1>
          <p className="text-white/40 text-sm italic">Liquidity management & Yield settlement.</p>
        </div>
        <Button onClick={onOpenWithdraw} icon={Banknote} size="lg" className="shadow-glow" variant="gold">Process Liquidity Exit</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card blueprint className="p-8 glass">
          <MetabolismTicker value={user.balance} isMain label="Available Liquidity" />
        </Card>
        {[
          { label: 'Settled Yield', value: user.totalWithdrawn, icon: Landmark, color: 'text-emerald-500' },
          { label: 'Lifetime Protocol Yield', value: user.lifetimeYield, icon: History, color: 'text-purple-500' }
        ].map((stat, i) => (
          <Card key={i} blueprint className="p-8 space-y-4 glass">
            <div className="flex items-center gap-3">
              <stat.icon size={16} className={stat.color} />
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-white italic tracking-tighter leading-none">
              ${formatCurrency(stat.value)}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter flex items-center gap-3">
            <Receipt className="text-blue-500" /> Transaction Ledger
          </h2>
          <Card blueprint className="p-0 overflow-hidden border border-white/5 glass">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-left text-[9px] uppercase font-black text-white/20 italic tracking-widest border-b border-white/5 bg-white/[0.01]">
                    <th className="p-6">Timestamp</th>
                    <th className="p-6">Identifier</th>
                    <th className="p-6">Amount (USD)</th>
                    <th className="p-6 text-right">Settlement Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {safeTransactions.length > 0 ? safeTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6 text-[10px] text-white/40 font-mono italic">{new Date(tx.date).toLocaleString()}</td>
                      <td className="p-6 text-xs font-black italic uppercase text-white">{tx.description}</td>
                      <td className={`p-6 text-lg font-black italic ${tx.type === 'debit' ? 'text-white' : 'text-green-400'}`}>
                        {tx.type === 'debit' ? '-' : '+'}${formatCurrency(tx.amount)}
                      </td>
                      <td className="p-6 text-right text-[10px] font-bold uppercase text-white/40">{tx.method}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-24 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                              <History size={48} />
                              <p className="font-black uppercase tracking-[0.3em] text-xs">No records in ledger</p>
                          </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter flex items-center gap-3">
              <Bell className="text-blue-500" /> Grid Signals
            </h2>
            {notifications.some(n => !n.read) && (
              <button 
                onClick={onMarkAllAsRead}
                className="text-[9px] font-black uppercase italic tracking-widest text-blue-500 hover:text-white transition-colors flex items-center gap-1"
              >
                <CheckCheck size={12} /> Mark all read
              </button>
            )}
          </div>
          <Card blueprint className="p-6 space-y-6 glass min-h-[400px]">
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 rounded-xl bg-white/[0.02] border space-y-2 group hover:border-blue-500/30 transition-all animate-in slide-in-from-right-4 duration-300 relative overflow-hidden ${n.read ? 'border-white/5 opacity-60' : 'border-blue-500/20 shadow-glow-sm'}`}>
                    {!n.read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>}
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${n.type === 'success' ? 'bg-green-500' : n.type === 'critical' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                          <span className="text-[10px] font-black uppercase text-white italic tracking-widest">{n.title}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-[8px] text-white/20 font-mono uppercase italic">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         <button 
                          onClick={() => onDismissNotification(n.id)}
                          className="p-1 hover:bg-white/10 rounded-md text-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Dismiss Signal"
                         >
                           <X size={12} />
                         </button>
                       </div>
                    </div>
                    <p className="text-[11px] text-white/60 italic leading-relaxed pr-4">{n.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 space-y-4 opacity-10">
                <Radio size={48} />
                <p className="text-[10px] font-black uppercase tracking-widest text-center italic">Awaiting grid signals...</p>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
};

const WithdrawalTerminal = ({ user, onClose, onWithdraw }: { user: UserData, onClose: () => void, onWithdraw: (amt: number, method: string) => void }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Bank Transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return setError("INVALID_LIQUIDITY_INPUT: Enter a valid amount.");
    if (val > (user.balance ?? 0)) return setError("INSUFFICIENT_LIQUIDITY: Amount exceeds node balance.");
    
    setIsProcessing(true);
    setTimeout(() => {
      onWithdraw(val, method);
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-lg relative">
        <Card blueprint className="p-10 space-y-8 shadow-3xl border-gold/20 glass">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
               <Banknote className="text-[#ffd700]" /> Liquidity Exit
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"><X size={20}/></button>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Exit Volume (USD)</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"/>
                <input 
                  type="number" 
                  step="0.01" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-2xl font-black italic text-white focus:outline-none focus:border-blue-600 transition-all glass"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-between text-[10px] italic font-bold text-white/20">
                 <span>MAX: ${formatCurrency(user.balance)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Settlement Route</label>
              <div className="grid grid-cols-2 gap-4">
                {['Bank Transfer', 'Crypto (USDT)', 'PayPal', 'Wire'].map(m => (
                  <button 
                    key={m} 
                    type="button" 
                    onClick={() => setMethod(m)}
                    className={`h-12 rounded-xl border font-black italic uppercase text-[10px] tracking-widest transition-all ${method === m ? 'bg-[#ffd700]/10 border-[#ffd700]/40 text-[#ffd700] shadow-glow-sm' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-bold uppercase tracking-widest italic text-center">{error}</div>}

            <Button type="submit" variant="gold" size="lg" className="w-full h-14" loading={isProcessing} icon={Zap}>
              {isProcessing ? 'Processing Exit...' : 'Authorize Liquidity Exit'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

// --- Learning Hub ---
const LearningHub = ({ onSelectArticle }: { onSelectArticle: (id: string) => void }) => {
  const [filter, setFilter] = useState<'All' | Article['category']>('All');

  const { featured, standard } = useMemo(() => {
    const matched = MOCK_ARTICLES.filter(a => filter === 'All' || a.category === filter);
    return {
      featured: matched.filter(a => a.featured),
      standard: matched.filter(a => !a.featured)
    };
  }, [filter]);

  return (
    <div className="space-y-16 animate-in fade-in duration-700 px-4 pb-24 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Knowledge Base</h1>
          <p className="text-white/40 text-sm italic">Mastering the grid and sovereign wealth protocols.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['All', 'Getting Started', 'Engine Strategies', 'Advanced Tactics', 'Grid Economics', 'Tutorials'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all ${filter === cat ? 'bg-blue-600 text-white shadow-glow-sm' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {featured.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
             <Sparkles size={20} className="text-[#ffd700]" />
             <h2 className="text-xl font-black italic uppercase tracking-widest text-white/80">Featured Highlights</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featured.map(article => (
              <Card 
                key={article.id} 
                hover 
                onClick={() => onSelectArticle(article.id)} 
                className="p-10 border-gold/20 bg-[#ffd700]/[0.02] shadow-gold/5 group relative overflow-hidden" 
                blueprint
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Bookmark size={120} className="text-[#ffd700]" strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="gold" className="shadow-glow-sm">Featured Briefing</Badge>
                    <Badge variant="info">{article.category}</Badge>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black italic uppercase text-white leading-none tracking-tighter group-hover:text-[#ffd700] transition-colors">{article.title}</h3>
                  <p className="text-lg text-white/60 italic leading-relaxed line-clamp-3">{article.content}</p>
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                          <User size={18} className="text-white/40" />
                       </div>
                       <span className="text-[10px] font-black uppercase text-white/40 italic tracking-widest">{article.author}</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-gold/30 text-gold" icon={ArrowRight}>Read Briefing</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-8">
        <div className="flex items-center gap-3">
           <BookOpen size={20} className="text-blue-500" />
           <h2 className="text-xl font-black italic uppercase tracking-widest text-white/80">General Briefings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {standard.map(article => (
            <Card key={article.id} hover onClick={() => onSelectArticle(article.id)} className="flex flex-col h-full glass border-white/5">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="info">{article.category}</Badge>
              </div>
              <h3 className="text-2xl font-black italic uppercase text-white leading-tight mb-4 group-hover:text-blue-500 transition-colors tracking-tighter">{article.title}</h3>
              <p className="text-sm text-white/60 italic line-clamp-3 mb-6 flex-1">{article.content}</p>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <User size={12} className="text-white/20" />
                  <span className="text-[10px] font-black uppercase text-white/30 italic">{article.author}</span>
                </div>
                <ChevronRight size={16} className="text-blue-500" />
              </div>
            </Card>
          ))}
          {standard.length === 0 && featured.length === 0 && (
            <div className="col-span-full py-32 text-center glass rounded-3xl border border-dashed border-white/10 opacity-20">
               <Search size={48} className="mx-auto mb-4" />
               <p className="text-xs font-black uppercase italic tracking-widest">No briefings found matching criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// --- Article View ---
const ArticleView = ({ article, onBack }: { article: Article, onBack: () => void }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8 animate-in fade-in duration-500 pb-24 px-4">
      <Button variant="ghost" onClick={onBack} icon={ArrowLeft} size="sm">Back to Base</Button>
      <article className="space-y-12">
        <header className="space-y-6">
          <div className="flex items-center gap-3">
             <Badge variant="info">{article.category}</Badge>
             {article.featured && <Badge variant="gold">Featured Briefing</Badge>}
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">{article.title}</h1>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase text-white/40 italic tracking-widest">
            <span className="flex items-center gap-2"><User size={14} className="text-blue-500"/> {article.author}</span>
            <span className="flex items-center gap-2"><Clock size={14} className="text-blue-500"/> {article.publishedDate}</span>
          </div>
        </header>
        <Card blueprint className="p-10 md:p-16 glass">
          <div className="prose prose-invert max-w-none text-white/80 italic text-lg leading-relaxed space-y-6 whitespace-pre-wrap">
            {article.content}
          </div>
        </Card>
      </article>
    </div>
  );
};

// --- Engine Detail View ---
const EngineDetailView = ({ 
  engine, 
  onBack,
  onDeleteRequest
}: { 
  engine: Engine, 
  onBack: () => void,
  onDeleteRequest: (e: Engine) => void
}) => {
  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12 animate-in fade-in duration-500 pb-24 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-white/20 hover:text-white transition-colors flex items-center gap-2 italic tracking-widest mb-4">
            <ArrowLeft size={12} /> Return to Grid
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">{engine.name}</h1>
            <Badge variant={engine.status === 'Active' ? 'success' : 'warning'} live={engine.status === 'Active'}>{engine.status}</Badge>
          </div>
          <p className="text-white/40 text-sm italic">{engine.type} • ID: {engine.id}</p>
        </div>
        <div className="flex gap-4">
           <Button variant="secondary" icon={Settings}>Configure Node</Button>
           <Button variant="danger" icon={Trash2} onClick={() => onDeleteRequest(engine)}>Decommission</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PerformanceTimeline history={engine.history || []} />
          
          <Card blueprint className="p-10 space-y-8 glass">
            <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-3">
              <Database size={20} className="text-blue-500" /> Cognitive Architecture (Briefing)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Strategy Alias', value: engine.config.strategyName },
                { label: 'Attack Vector', value: engine.config.attackVector },
                { label: 'Economic Moat', value: engine.config.moat },
                { label: 'Yield Lever', value: engine.config.lever }
              ].map((c, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-white/30 italic">{c.label}</p>
                  <p className="text-sm font-bold text-white italic">{c.value || 'DEFAULT_LOGIC'}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-6 border-t border-white/5">
              <p className="text-[9px] font-black uppercase text-white/30 italic">Target Projected Revenue</p>
              <p className="text-2xl font-black italic text-emerald-500">{engine.config.projectedRevenue}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card blueprint className="p-8 glass space-y-6">
            <MetabolismTicker value={engine.revenue} isMain label="Node Cumulative Yield" />
            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/40 italic">Uptime</span>
                  <span className="text-sm font-black italic text-white">{(engine.uptime ?? 100).toFixed(2)}%</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/40 italic">Sync Cycle</span>
                  <span className="text-sm font-black italic text-white">{new Date(engine.lastSync).toLocaleTimeString()}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-white/40 italic">Throughput</span>
                  <span className="text-sm font-black italic text-white">{engine.transactions} ops</span>
               </div>
            </div>
          </Card>

          {engine.imageUrl && (
            <Card className="p-0 border border-white/5 overflow-hidden group">
               <img src={engine.imageUrl} alt="" className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <span className="text-[10px] font-black uppercase italic tracking-widest text-white/60">Neural Visualization Generated</span>
               </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Shell ---
const App = () => {
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState<UserData | null>(null);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<GridNotification[]>([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isVisualizing, setIsVisualizing] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<GridNotification | null>(null);
  const [decommissioningEngine, setDecommissioningEngine] = useState<Engine | null>(null);

  const addNotification = (title: string, message: string, type: GridNotification['type']) => {
    const newN: GridNotification = {
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      title, message, type, read: false
    };
    setNotifications(prev => [newN, ...prev].slice(0, 15)); 
    setToast(newN);
    setTimeout(() => setToast(null), 5000);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    try {
        const storedUsers = localStorage.getItem('autoincome_all_users');
        let registered = storedUsers ? JSON.parse(storedUsers) : [];
        if (!Array.isArray(registered)) registered = [];
        setAllUsers(registered);

        const savedUser = localStorage.getItem('autoincome_user');
        if (savedUser) { 
            const parsed = JSON.parse(savedUser);
            if (parsed && typeof parsed === 'object') {
                setUser({
                    ...parsed,
                    balance: typeof parsed.balance === 'number' ? parsed.balance : 0,
                    lifetimeYield: typeof parsed.lifetimeYield === 'number' ? parsed.lifetimeYield : 0,
                    totalWithdrawn: typeof parsed.totalWithdrawn === 'number' ? parsed.totalWithdrawn : 0,
                    notificationPrefs: parsed.notificationPrefs || {
                      yieldMilestones: true,
                      liquidityExits: true,
                      gridSignals: true,
                      securityAlerts: true
                    }
                });
                setIsBooting(true); 
            }
        }

        const savedEngines = localStorage.getItem('autoincome_engines');
        if (savedEngines) {
            const parsed = JSON.parse(savedEngines) as Engine[];
            const migrated = parsed.map(e => ({
                ...e,
                history: e.history || generateMockHistory(e.performance)
            }));
            setEngines(migrated);
        }

        const savedTransactions = localStorage.getItem('autoincome_transactions');
        if (savedTransactions) {
            const parsed = JSON.parse(savedTransactions);
            setTransactions(Array.isArray(parsed) ? parsed : []);
        }
    } catch (e) {
        console.error("GRID_BOOT_FAILURE: Corrupted local data detected.", e);
        localStorage.removeItem('autoincome_user');
    }
  }, []);

  useEffect(() => {
    const backfill = async () => {
      const enginesToBackfill = engines.filter(e => !e.imageUrl && !isVisualizing[e.id]);
      if (enginesToBackfill.length === 0) return;

      const target = enginesToBackfill[0];
      setIsVisualizing(prev => ({ ...prev, [target.id]: true }));

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const resp = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `Abstract tech pattern, neural web, futuristic isometric 3d visualization for an automation engine called "${target.name}" of type "${target.type}". Neon accents, high-end digital design, 4k resolution.` }] },
          config: { imageConfig: { aspectRatio: "16:9" } }
        });

        const part = resp.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) {
          const url = `data:image/png;base64,${part.inlineData.data}`;
          setEngines(prev => {
            const updated = prev.map(e => e.id === target.id ? { ...e, imageUrl: url } : e);
            saveEnginesToStorage(updated);
            return updated;
          });
        }
      } catch (err) {
        console.warn(`Failed to backfill visualization for ${target.id}`);
      } finally {
        setIsVisualizing(prev => ({ ...prev, [target.id]: false }));
      }
    };
    
    if (engines.length > 0) backfill();
  }, [engines, isVisualizing]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      let totalTickRevenue = 0;
      setEngines(prevEngines => {
        const updated = prevEngines.map(e => {
          if (e.status === 'Active') {
            const tick = Math.random() * 0.05;
            totalTickRevenue += tick;
            const newPerformance = Math.max(0, Math.min(100, (e.performance ?? 90) + (Math.random() - 0.5)));
            const newHistory = [...(e.history || generateMockHistory(e.performance)).slice(1), newPerformance];
            return { ...e, revenue: (e.revenue ?? 0) + tick, performance: newPerformance, history: newHistory };
          }
          return e;
        });
        saveEnginesToStorage(updated);
        return updated;
      });

      if (totalTickRevenue > 0) {
        setUser(prevUser => {
          if (!prevUser) return null;
          const oldMilestone = Math.floor(prevUser.balance / 100);
          const newBalance = (prevUser.balance ?? 0) + totalTickRevenue;
          const newMilestone = Math.floor(newBalance / 100);
          
          if (newMilestone > oldMilestone) {
            addNotification("Yield Milestone", `Grid node liquidity has surpassed $${newMilestone * 100}.00.`, 'success');
          }

          const updated = { 
            ...prevUser, 
            balance: newBalance, 
            lifetimeYield: (prevUser.lifetimeYield ?? 0) + totalTickRevenue 
          };
          localStorage.setItem('autoincome_user', JSON.stringify(updated));
          return updated;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleLogin = (email: string, pass: string) => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found && (found.password === pass)) { 
      const sessionUser = {
        ...found,
        balance: found.balance ?? 0,
        lifetimeYield: found.lifetimeYield ?? 0,
        totalWithdrawn: found.totalWithdrawn ?? 0,
        notificationPrefs: found.notificationPrefs || {
          yieldMilestones: true,
          liquidityExits: true,
          gridSignals: true,
          securityAlerts: true
        }
      };
      setUser(sessionUser); 
      localStorage.setItem('autoincome_user', JSON.stringify(sessionUser)); 
      setIsBooting(true); 
      addNotification("Uplink Secure", "Neural handshake complete. Welcome back, Architect.", 'info');
      return undefined; 
    }
    return "Handshake failed. Architect credentials invalid.";
  };

  const handleSignUp = (name: string, email: string, pass: string) => {
    const isFirst = allUsers.length === 0;
    const newUser: UserData = { 
      id: `user_${Date.now()}`, 
      name, email, password: pass, 
      plan: isFirst ? 'Unlimited' : 'Free Trial', 
      role: isFirst ? 'Admin' : 'User',
      onboarded: true, 
      balance: isFirst ? 1337 : 0,
      lifetimeYield: isFirst ? 1337 : 0,
      totalWithdrawn: 0,
      notificationPrefs: {
        yieldMilestones: true,
        liquidityExits: true,
        gridSignals: true,
        securityAlerts: true
      }
    };
    const updatedUsers = [...allUsers, newUser]; 
    setAllUsers(updatedUsers); 
    localStorage.setItem('autoincome_all_users', JSON.stringify(updatedUsers));
    setUser(newUser); 
    localStorage.setItem('autoincome_user', JSON.stringify(newUser)); 
    setIsBooting(true); 
    addNotification("Protocol Initialized", "Identity registered in global registry. Grid access granted.", 'success');
    return undefined;
  };

  const handleDeploy = (engine: Engine) => { 
    const newEngines = [engine, ...engines]; 
    setEngines(newEngines); 
    saveEnginesToStorage(newEngines); 
    setView('dashboard'); 
    addNotification("Node Deployed", `Engine "${engine.name}" has been synchronized with the grid.`, 'success');
  };
  
  const handleWithdrawal = (amt: number, method: string) => {
    if (!user) return;
    const u = { 
        ...user, 
        balance: (user.balance ?? 0) - amt, 
        totalWithdrawn: (user.totalWithdrawn ?? 0) + amt 
    };
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString(),
      description: 'Capital Liquidity Exit',
      amount: amt,
      type: 'debit',
      status: 'Completed',
      method,
      txHash: generateTxHash()
    };
    const newTxs = [tx, ...(Array.isArray(transactions) ? transactions : [])];
    setUser(u);
    setTransactions(newTxs);
    localStorage.setItem('autoincome_user', JSON.stringify(u));
    localStorage.setItem('autoincome_transactions', JSON.stringify(newTxs));
    addNotification("Liquidity Exit Processed", `Successful settlement of $${formatCurrency(amt)} via ${method}.`, 'success');
  };

  const handleAdminUserUpdate = (id: string, update: Partial<UserData>) => {
    const updatedAll = allUsers.map(u => u.id === id ? {...u, ...update} : u);
    setAllUsers(updatedAll);
    localStorage.setItem('autoincome_all_users', JSON.stringify(updatedAll));
    if (user && user.id === id) {
      const updatedSelf = {...user, ...update};
      setUser(updatedSelf);
      localStorage.setItem('autoincome_user', JSON.stringify(updatedSelf));
    }
  };

  const handleDeleteEngine = (id: string) => {
    const engineToDelete = engines.find(e => e.id === id);
    const updated = engines.filter(e => e.id !== id);
    setEngines(updated);
    saveEnginesToStorage(updated);
    addNotification("Node Decommissioned", `Engine "${engineToDelete?.name || id}" has been purged from grid.`, 'critical');
    if (view.startsWith('engine-')) setView('dashboard');
  };

  const handlePurge = () => {
    if (confirm("ARCHITECT_OVERRIDE: This will purge all local matrix data and sever existing uplinks. Proceed?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleToggleEngineStatus = (id: string) => {
    setEngines(prev => {
      const updated = prev.map(e => {
        if (e.id === id) {
          const newStatus: EngineStatus = e.status === 'Active' ? 'Paused' : 'Active';
          addNotification("Node Status Shift", `Node "${e.name}" is now ${newStatus.toUpperCase()}.`, 'info');
          return { ...e, status: newStatus };
        }
        return e;
      });
      saveEnginesToStorage(updated);
      return updated;
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Layout },
    { id: 'treasury', label: 'Treasury Hub', icon: DollarSign },
    { id: 'hub', label: 'Architect Uplink', icon: BrainCircuit },
    { id: 'learning', label: 'Knowledge Base', icon: BookOpen },
    { id: 'admin', label: 'Grid Governance', icon: Shield, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  const renderContent = () => {
    if (!user) return null;

    if (view === 'dashboard') {
      return (
        <div className="space-y-12 animate-in fade-in duration-700 px-4 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Command Center</h1>
              <p className="text-white/40 text-sm italic">Active Node Registry</p>
            </div>
            <Button onClick={() => setView('builder')} icon={Plus} size="lg" className="shadow-glow">Architect New Node</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card blueprint className="p-10 space-y-2 border-l-4 border-blue-600 shadow-glow glass min-h-[160px] flex flex-col justify-center">
                  <MetabolismTicker value={user.balance} isMain label="Capital Volume" />
                </Card>
                <Card blueprint className="p-10 space-y-2 glass min-h-[160px] flex flex-col justify-center">
                  <div className="text-[10px] font-black uppercase text-white/30 italic">Uplink Health</div>
                  <div className="text-4xl md:text-5xl font-black text-green-400 italic tracking-tighter leading-none">OPTIMAL</div>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {engines.map(e => (
                  <Card 
                    key={e.id} 
                    hover 
                    image={e.imageUrl}
                    onClick={() => setView(`engine-${e.id}`)} 
                    className="min-h-[260px] p-8 border border-white/5 flex flex-col justify-between glass overflow-hidden" 
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div className="space-y-1">
                          <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors leading-none">{e.name}</h4>
                          <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] italic">{e.type}</p>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(event) => { event.stopPropagation(); handleToggleEngineStatus(e.id); }}
                            className={`p-2 rounded-lg transition-all ${e.status === 'Active' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                            title={e.status === 'Active' ? 'Pause Engine' : 'Resume Engine'}
                          >
                            {e.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                          <Badge variant={e.status === 'Active' ? 'success' : 'warning'} live={e.status === 'Active'}>{e.status}</Badge>
                        </div>
                        {isVisualizing[e.id] && <Badge variant="info" className="animate-pulse"><Activity size={8}/> Syncing</Badge>}
                       </div>
                    </div>

                    <div className="my-2 border-t border-b border-white/5 py-3 flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase text-white/20 tracking-widest italic">24h Performance Trend</p>
                          <div className="flex items-center gap-2">
                            {e.history && (e.history[e.history.length-1] >= e.history[0] ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />)}
                            <span className={`text-[10px] font-bold italic ${e.history && e.history[e.history.length-1] >= e.history[0] ? 'text-emerald-500' : 'text-red-500'}`}>
                              {e.history ? `${(e.history[e.history.length-1] - e.history[0]).toFixed(2)}%` : 'N/A'}
                            </span>
                          </div>
                       </div>
                       <PerformanceTrend data={e.history || []} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <MetabolismTicker value={e.revenue} />
                      <PerformanceGauge value={e.performance} />
                    </div>
                  </Card>
                ))}
                {engines.length === 0 && (
                  <Card className="md:col-span-2 py-24 text-center space-y-6 glass border-dashed" blueprint hover>
                      <p className="text-white/20 font-black uppercase italic tracking-[0.3em] text-xs">No active nodes established</p>
                      <Button variant="outline" onClick={() => setView('builder')} icon={Plus}>Initialize Grid Node</Button>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="space-y-8">
              <Card blueprint className="p-8 glass space-y-6">
                <h3 className="text-xs font-black italic uppercase tracking-[0.2em] text-white/40">Network Topology</h3>
                <NetworkTopology nodeCount={engines.length} />
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold italic uppercase tracking-widest text-white/20">
                    <span>Architect's Notes</span>
                    <History size={12} />
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-[11px] text-white/60 italic leading-relaxed">
                    "Maintain focus on high-velocity affiliate signals. The current grid stability is nominal, but expansion into Newsletter nodes is recommended for long-term moat fortification."
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'builder': return <EngineBuilder onDeploy={handleDeploy} onCancel={() => setView('dashboard')} />;
      case 'learning': return <LearningHub onSelectArticle={id => setView(`article-${id}`)} />;
      case 'settings': return <ProfileSettings user={user} onUpdate={(u) => setUser({...user, ...u})} onCancel={() => setView('dashboard')} />;
      case 'admin': return <AdminDashboard users={allUsers} engines={engines} currentUserId={user.id} onUpdateUser={handleAdminUserUpdate} onToggleEngineStatus={handleToggleEngineStatus} onDeleteEngine={(id) => setDecommissioningEngine(engines.find(e => e.id === id) || null)} />;
      case 'hub': return <LiveArchitectUplink onExit={() => setView('dashboard')} />;
      case 'treasury': return (
        <TreasuryHub 
          user={user} 
          transactions={transactions} 
          onOpenWithdraw={() => setIsWithdrawModalOpen(true)} 
          notifications={notifications}
          onDismissNotification={handleDismissNotification}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      );
      default:
        if (view.startsWith('article-')) {
          const article = MOCK_ARTICLES.find(a => a.id === view.slice(8));
          return article ? <ArticleView article={article} onBack={() => setView('learning')} /> : <div className="p-20 text-center opacity-40">Article not found in grid storage.</div>;
        }
        if (view.startsWith('engine-')) {
          const engine = engines.find(e => e.id === view.slice(7));
          return engine ? <EngineDetailView engine={engine} onBack={() => setView('dashboard')} onDeleteRequest={(e) => setDecommissioningEngine(e)} /> : <div className="p-20 text-center opacity-40">Engine node not found.</div>;
        }
        return <div className="p-20 text-center opacity-40 italic">Invalid Grid View. Returning to Command Center...</div>;
    }
  };

  if (!user) return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} isGridEmpty={allUsers.length === 0} onPurge={handlePurge} />;
  if (isBooting) return <SystemHandshake onComplete={() => setIsBooting(false)} />;

  return (
    <div className="relative min-h-screen bg-[#050505] md:flex text-white selection:bg-blue-600 selection:text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none blueprint-bg opacity-[0.3]"></div>
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(0,112,243,0.02)_1px,transparent_1px)] bg-[length:100%_8px] animate-neural-scan opacity-[0.1]"></div>
      
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-6 animate-in slide-in-from-top-4 duration-300">
           <div className="glass border border-blue-500/30 rounded-2xl p-4 flex items-start gap-4 shadow-3xl">
              <div className={`p-2 rounded-lg ${toast.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                 {toast.type === 'success' ? <ShieldCheck size={20}/> : <Info size={20}/>}
              </div>
              <div className="space-y-1">
                 <h4 className="text-xs font-black uppercase italic text-white tracking-widest leading-none">{toast.title}</h4>
                 <p className="text-[11px] text-white/60 italic leading-relaxed">{toast.message}</p>
              </div>
              <button onClick={() => setToast(null)} className="ml-auto text-white/20 hover:text-white transition-colors">
                <X size={14}/>
              </button>
           </div>
        </div>
      )}

      {decommissioningEngine && (
        <DecommissionNodeModal 
          engine={decommissioningEngine}
          onConfirm={() => {
            handleDeleteEngine(decommissioningEngine.id);
            setDecommissioningEngine(null);
          }}
          onCancel={() => setDecommissioningEngine(null)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full z-[70] w-72 border-r border-white/5 p-8 flex flex-col bg-black/90 backdrop-blur-3xl transition-transform duration-500 -translate-x-full md:relative md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : ''}`}>
        <Logo size={40} animate />
        <nav className="space-y-2 mt-12 flex-1 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (!item.adminOnly || user.role === 'Admin') && (
            <button key={item.id} onClick={() => { setView(item.id); setIsMenuOpen(false); }} className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] italic transition-all group ${view === item.id ? 'bg-blue-600 text-white shadow-glow' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20} className={view === item.id ? 'text-white' : 'text-white/20 group-hover:text-blue-500'} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-8 space-y-4">
          <div className="flex items-center gap-4 w-full p-2 rounded-xl text-left bg-white/[0.02] border border-white/5 glass">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black italic border transition-all ${user.role === 'Admin' ? 'bg-blue-600/20 border-blue-500 text-blue-500' : 'bg-white/5 border-white/10 text-white/20'}`}>
                {user.role === 'Admin' ? <Shield size={20} /> : (user.name ? user.name.charAt(0) : 'A')}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-black italic uppercase text-white truncate leading-tight">{user.name}</div>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{user.role} • {user.plan}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={() => { setUser(null); localStorage.removeItem('autoincome_user'); }} icon={LogOut}>Sever Uplink</Button>
        </div>
      </aside>

      <main className="flex-1 w-full p-6 md:p-12 lg:p-16 pb-24 overflow-y-auto relative z-10">
        <header className="mb-12 flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(true)} className={`md:hidden p-3 bg-black/50 rounded-2xl text-white backdrop-blur-2xl border border-white/10 ${isMenuOpen ? 'opacity-0' : ''}`}>
             <Menu size={24}/>
          </button>
          <div className="hidden md:flex items-center gap-6 p-2 px-4 bg-white/[0.02] border border-white/5 rounded-full glass">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Grid: Active</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <Wifi size={12} className="text-blue-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Latency: 22ms</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white/[0.02] border border-white/5 rounded-full glass text-white/40 hover:text-white transition-colors"><Search size={20}/></button>
            <button className="relative p-3 bg-white/[0.02] border border-white/5 rounded-full glass text-white/40 hover:text-white transition-colors" onClick={() => setView('treasury')}>
              <Bell size={20}/>
              {notifications.some(n => !n.read) && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-black shadow-glow-sm"></span>}
            </button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {isWithdrawModalOpen && <WithdrawalTerminal user={user} onClose={() => setIsWithdrawModalOpen(false)} onWithdraw={handleWithdrawal} />}
      <GlobalActivityTicker />
    </div>
  );
};

const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);