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
  Waves
} from 'lucide-react';
import { GoogleGenAI, Type, Modality, LiveServerMessage, Blob, GenerateContentResponse } from "@google/genai";

// --- Types & Interfaces ---

type Plan = 'Free Trial' | 'Starter' | 'Pro' | 'Unlimited';
type EngineStatus = 'Active' | 'Paused' | 'Optimizing' | 'Draft';
type TransactionStatus = 'Completed' | 'Processing' | 'Auditing';

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
  }
];

const AVAILABLE_MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', description: 'High-speed neural routing. Ideal for rapid yield iterations.', icon: Zap },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', description: 'Deep reasoning architecture. Best for complex moats.', icon: BrainCircuit }
];

// --- Helper Functions ---

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

// --- Specialized Components ---

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

const Card = ({ children, className = '', hover = false, onClick, blueprint = false, ...props }: any) => (
  <div onClick={onClick} className={`glass rounded-2xl p-6 transition-all duration-500 relative overflow-hidden ${hover ? 'hover:border-white/20 hover:bg-white/5 hover:-translate-y-1' : ''} ${className} ${onClick ? 'cursor-pointer' : ''}`} {...props}>
    {blueprint && <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>}
    {children}
  </div>
);

const Badge = ({ children, variant = 'info', className = '', live = false, onClick }: any) => {
  const variants: any = {
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border border-green-500/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    neutral: "bg-white/5 text-white/50 border border-white/10",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20"
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
          {/* Central Hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse shadow-glow"></div>
            <div className="absolute w-24 h-24 border border-blue-600/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute w-32 h-32 border border-blue-600/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          </div>
          {/* Orbital Nodes */}
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
  const stripped = engines.map(({ imageUrl, ...rest }) => rest);
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
        <div ref={logRef} className="h-48 bg-black/40 border border-blue-600/20 rounded-xl p-8 font-mono text-left text-blue-500 text-xs overflow-y-auto scrollbar-hide space-y-2 glass">
          {logs.map((l, i) => <div key={i} className="animate-in fade-in slide-in-from-left-4">{l}</div>)}
          <div className="w-2 h-4 bg-blue-500 animate-pulse inline-block align-middle ml-1"></div>
        </div>
      </div>
    </div>
  );
};

// --- Login & Sign Up ---
const LoginScreen = ({ onLogin, onSignUp, isGridEmpty }: { onLogin: (email: string, pass: string) => string | undefined, onSignUp: (name: string, email: string, pass: string) => string | undefined, isGridEmpty: boolean }) => {
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
          <div className="text-center pt-2">
            {!isGridEmpty && (
                <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="text-xs font-black italic uppercase text-white/40 hover:text-blue-500 transition-colors tracking-widest">
                {mode === 'login' ? "Need an account? Create Identity" : "Already registered? Authenticate"}
                </button>
            )}
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

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            onUpdate({ name, email, password: pass });
            setSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-white">Architect Profile</h1>
                <Button variant="outline" onClick={onCancel} icon={ArrowLeft}>Back</Button>
            </div>
            <Card blueprint className="space-y-8 p-10 glass">
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
                {success && <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs italic text-center">Credentials Synchronized Successfully.</div>}
                <Button onClick={handleSave} loading={saving} icon={ShieldCheck} className="w-full">Update Architect Identity</Button>
            </Card>
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
          responseModalities: [Modality.AUDIO],
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

const EngineBuilder = ({ onDeploy, onCancel }: { onDeploy: (e: Engine) => void, onCancel: () => void }) => {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<any>(null);
  const [model, setModel] = useState(AVAILABLE_MODELS[0].id);
  const [brief, setBrief] = useState("");
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<{title: string, message: string, code: string} | null>(null);

  const handleArchitect = async () => {
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
            contents: { parts: [{ text: `Architect a new passive income engine based on template "${template.name}" and briefing: "${brief}". Provide strategy details in JSON format exactly according to the schema.` }] },
            config: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        strategyName: { type: Type.STRING },
                        attackVector: { type: Type.STRING },
                        lever: { type: Type.STRING },
                        moat: { type: Type.STRING },
                        projectedRevenue: { type: Type.STRING },
                        visualPrompt: { type: Type.STRING, description: "Detailed visual description for iconography generation." },
                    },
                    required: ["name", "strategyName", "attackVector", "lever", "moat", "projectedRevenue", "visualPrompt"]
                }
            }
        });
        
        const text = resp.text;
        if (!text) throw new Error("UPLINK_TIMEOUT: No response from neural core.");
        configData = sanitizeAndParseJson(text);
        setLogs(prev => [...prev, `> Node identified as: ${configData.name}`]);
        setLogs(prev => [...prev, "> Logic configuration established."]);

        setLogs(prev => [...prev, "> Synthesizing unique visual iconography via neural rendering..."]);
        const imgResp: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: `Cyberpunk isometric machinery iconography for a node named ${configData.name}. Style: glowing blue neon, dark metallic finish. Scene: ${configData.visualPrompt}` }] },
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
    } catch (err: any) {
        setIsArchitecting(false);
        setError({
          title: "Architecture Failure",
          message: err.message || "An internal uplink error occurred during synthesis.",
          code: "ERR_SYNTH_GENERAL"
        });
        return;
    }
    
    setLogs(prev => [...prev, "> Finalizing deployment package. Initializing Node..."]);
    setTimeout(() => {
        setIsArchitecting(false);
        onDeploy({
            id: `engine_${Date.now()}`,
            name: configData.name || "Untitled Node",
            type: template.name,
            status: 'Active',
            revenue: 0, uptime: 100, performance: 95 + Math.random() * 5, transactions: 0,
            lastSync: new Date().toISOString(),
            config: configData,
            imageUrl: synthesizedUrl,
        });
    }, 1500);
  };

  if(error) return (
    <div className="max-w-3xl mx-auto py-20 px-4 animate-in zoom-in-95 duration-500">
      <Card blueprint className="p-12 border-red-500/30 bg-red-500/[0.02] text-center space-y-8 shadow-glow glass">
         <ShieldX size={48} className="text-red-500 mx-auto animate-pulse" />
         <h2 className="text-3xl font-black italic uppercase text-white">{error.title}</h2>
         <p className="text-white/60 italic text-sm leading-relaxed">{error.message}</p>
         <div className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={() => { setError(null); setStep(3); }} icon={RefreshCw}>Recalibrate Briefing</Button>
            <Button variant="outline" onClick={onCancel} icon={X}>Abort</Button>
         </div>
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
        <div className="h-48 font-mono text-left text-xs overflow-y-auto scrollbar-hide space-y-2 p-6 bg-black/60 rounded-lg border border-white/5">
          {logs.map((l, i) => <p key={i} className="text-green-400 animate-in fade-in slide-in-from-left-1">{l}</p>)}
          <div className="w-2 h-4 bg-green-400 animate-pulse inline-block align-middle ml-1"></div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in max-w-5xl mx-auto py-10 px-4 relative">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 pb-8 border-b border-white/5">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Node Deployment</h1>
          <p className="text-white/40 text-sm italic font-medium">Phase {step} of 4: {['Topology', 'Neural Core', 'Briefing', 'Final Registry'][step-1]}</p>
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
          <div className="animate-in slide-in-from-right-4 duration-500">
            <Card blueprint className="p-10 space-y-6 glass">
              <label className="text-[10px] font-black uppercase text-white/30 tracking-widest italic flex items-center gap-2">
                <Terminal size={14} className="text-blue-500" /> Establish Mission Constraints
              </label>
              <textarea 
                value={brief} 
                onChange={e => setBrief(e.target.value)} 
                rows={6} 
                placeholder={`Example: "Identify high-velocity affiliate signals in the enterprise SaaS sector."`} 
                className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 outline-none text-white italic focus:border-blue-600 transition-all text-lg leading-relaxed glass"
              ></textarea>
              <p className="text-[10px] text-white/20 italic">Architect briefing acts as the cognitive DNA for node logic.</p>
            </Card>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in zoom-in-95 duration-500">
            <Card blueprint className="p-10 space-y-10 bg-white/[0.01] glass">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
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
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Core Briefing DNA</p>
                  <p className="text-white/80 italic text-sm bg-black/20 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap">{brief || "Default logic applied."}</p>
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
          <Button onClick={() => setStep(prev => prev + 1)} icon={ArrowRight} disabled={step === 1 && !template}>
            Continue
          </Button>
        ) : (
          <Button size="lg" onClick={handleArchitect} icon={Zap} className="px-12 shadow-glow">
            Initiate Grid Deployment
          </Button>
        )}
      </div>
    </div>
  );
};

// --- View Components ---

const EngineDetailView = ({ engine, onBack }: { engine: Engine, onBack: () => void }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-24 px-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button variant="outline" onClick={onBack} icon={ArrowLeft} size="sm">Back</Button>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">{engine.name}</h1>
        </div>
        <Badge variant="success" live={engine.status === 'Active'}>{engine.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card blueprint className="lg:col-span-1 p-0 overflow-hidden border border-white/10 aspect-square flex items-center justify-center bg-black/40 glass">
           {engine.imageUrl ? (
             <img src={engine.imageUrl} alt={engine.name} className="w-full h-full object-cover" />
           ) : (
             <Cpu size={120} className="text-blue-600/20" />
           )}
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Card blueprint className="p-8 space-y-2 border-l-4 border-green-500 glass">
               <span className="text-[10px] font-black uppercase text-white/30 italic">Generated Yield</span>
               <p className="text-4xl font-black text-white italic tracking-tighter">${engine.revenue.toFixed(2)}</p>
            </Card>
            <Card blueprint className="p-8 space-y-2 border-l-4 border-blue-500 glass">
               <span className="text-[10px] font-black uppercase text-white/30 italic">Performance Index</span>
               <p className="text-4xl font-black text-white italic tracking-tighter">{engine.performance.toFixed(1)}%</p>
            </Card>
          </div>

          <Card blueprint className="p-8 space-y-6 glass">
            <h3 className="text-xl font-black italic uppercase text-white tracking-tighter border-b border-white/5 pb-4">Neural Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Attack Vector', value: engine.config.attackVector },
                { label: 'Strategic Lever', value: engine.config.lever },
                { label: 'Economic Moat', value: engine.config.moat },
                { label: 'Projected Monthly Yield', value: engine.config.projectedRevenue },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-white/20 italic">{item.label}</p>
                   <p className="text-sm font-bold text-white/80 italic">{item.value || 'N/A'}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const LearningHub = ({ onSelectArticle }: { onSelectArticle: (id: string) => void }) => {
  return (
    <div className="space-y-16 animate-in fade-in duration-700 px-4 pb-24 max-w-6xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Knowledge Base</h1>
        <p className="text-white/40 text-sm italic">Master autonomous wealth architecture.</p>
      </div>

      <section className="space-y-8">
        <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter flex items-center gap-3">
          <BookOpen className="text-blue-500" /> Featured Briefings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_ARTICLES.map(article => (
            <Card key={article.id} hover onClick={() => onSelectArticle(article.id)} className="p-8 space-y-4 border border-white/5 group glass">
               <Badge variant="info">{article.category}</Badge>
               <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter group-hover:text-blue-400 transition-colors">{article.title}</h3>
               <p className="text-xs text-white/40 italic leading-relaxed">Architected by {article.author} • {article.publishedDate}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const ArticleView = ({ article, onBack }: { article: Article, onBack: () => void }) => {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-10 animate-in fade-in duration-500 px-4 pb-24">
      <Button variant="outline" onClick={onBack} icon={ArrowLeft} size="sm">Back</Button>
      <div className="space-y-6">
        <Badge variant="info">{article.category}</Badge>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">{article.title}</h1>
        <div className="flex items-center gap-4 text-xs text-white/40 italic border-y border-white/5 py-4">
          <span className="flex items-center gap-2"><User size={14} /> {article.author}</span>
          <span className="flex items-center gap-2"><Clock size={14} /> {article.publishedDate}</span>
        </div>
      </div>
      <div className="prose prose-invert max-w-none">
         <p className="text-xl italic text-white/80 leading-relaxed mb-8">{article.content}</p>
      </div>
    </div>
  );
};

const AdminDashboard = ({ users, engines, currentUserId, onUpdateUser }: { users: UserData[], engines: Engine[], currentUserId: string, onUpdateUser: (id: string, update: Partial<UserData>) => void }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'engines' | 'content'>('users');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const tabs = [
    { id: 'users', label: 'Architect Registry', icon: Users },
    { id: 'engines', label: 'Node Diagnostics', icon: HeartPulse },
    { id: 'content', label: 'Content Control', icon: BookOpen }
  ] as const;

  const handleRoleToggle = (targetUser: UserData) => {
    if (targetUser.id === currentUserId) {
        alert("CRITICAL_SECURITY_LOCK: You cannot revoke your own Administrative privileges.");
        return;
    }
    setUpdatingUserId(targetUser.id);
    const newRole: 'User' | 'Admin' = targetUser.role === 'Admin' ? 'User' : 'Admin';
    setTimeout(() => {
        onUpdateUser(targetUser.id, { role: newRole });
        setUpdatingUserId(null);
    }, 800);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 px-4 pb-24 max-w-7xl mx-auto">
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
                            <span className="text-sm font-black italic uppercase text-white tracking-tighter block">{u.name}</span>
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
                            <span className={u.balance > 0 ? 'text-green-400' : 'text-white/40'}>${u.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}

            {activeTab === 'engines' && (
                <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[800px]">
                    <thead>
                    <tr className="text-left text-[9px] uppercase font-black text-white/20 italic tracking-widest border-b border-white/5 bg-white/[0.01]">
                        <th className="p-6">Engine ID</th>
                        <th className="p-6">Grid Status</th>
                        <th className="p-6">Performance</th>
                        <th className="p-6 text-right">Aggregate Yield</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {engines.map(engine => (
                        <tr key={engine.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6 font-black italic uppercase text-white tracking-tighter">{engine.name}</td>
                        <td className="p-6">
                            <Badge variant="success" live={engine.status === 'Active'}>{engine.status}</Badge>
                        </td>
                        <td className="p-6 font-mono text-white/40 text-xs">{engine.performance.toFixed(1)}%</td>
                        <td className="p-6 text-right font-black italic text-lg text-green-400">${engine.revenue.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}

            {activeTab === 'content' && (
                <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[600px]">
                    <thead>
                    <tr className="text-left text-[9px] uppercase font-black text-white/20 italic tracking-widest border-b border-white/5 bg-white/[0.01]">
                        <th className="p-6">Article Identifier</th>
                        <th className="p-6">Category</th>
                        <th className="p-6 text-right">Terminal</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {MOCK_ARTICLES.map(article => (
                        <tr key={article.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6 font-black italic uppercase text-white tracking-tighter">{article.title}</td>
                        <td className="p-6 text-xs text-white/40 italic">{article.category}</td>
                        <td className="p-6 text-right">
                            <button className="text-white/20 hover:text-blue-500 transition-colors"><ExternalLink size={14}/></button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const TreasuryHub = ({ user, transactions, onOpenWithdraw }: { user: UserData, transactions: Transaction[], onOpenWithdraw: () => void }) => {
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
        {[
          { label: 'Available Liquidity', value: user.balance, icon: Wallet, color: 'text-blue-500' },
          { label: 'Settled Yield', value: user.totalWithdrawn, icon: Landmark, color: 'text-emerald-500' },
          { label: 'Lifetime Protocol Yield', value: user.lifetimeYield, icon: History, color: 'text-purple-500' }
        ].map((stat, i) => (
          <Card key={i} blueprint className="p-8 space-y-4 glass">
            <div className="flex items-center gap-3">
              <stat.icon size={16} className={stat.color} />
              <span className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">{stat.label}</span>
            </div>
            <p className="text-3xl font-black text-white italic tracking-tighter leading-none">
              ${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </Card>
        ))}
      </div>

      <section className="space-y-8">
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
                {transactions.length > 0 ? transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 text-[10px] text-white/40 font-mono italic">{new Date(tx.date).toLocaleString()}</td>
                    <td className="p-6 text-xs font-black italic uppercase text-white">{tx.description}</td>
                    <td className={`p-6 text-lg font-black italic ${tx.type === 'debit' ? 'text-white' : 'text-green-400'}`}>
                      {tx.type === 'debit' ? '-' : '+'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="p-6 text-right text-[10px] font-bold uppercase text-white/40">{tx.method}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-white/20 italic font-black uppercase tracking-widest text-xs">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
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
    if (val > user.balance) return setError("INSUFFICIENT_LIQUIDITY: Amount exceeds node balance.");
    
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
                 <span>MAX: ${user.balance.toFixed(2)}</span>
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

// --- Main App Shell ---
const App = () => {
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState<UserData | null>(null);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem('autoincome_all_users');
    let registered = storedUsers ? JSON.parse(storedUsers) : [];
    setAllUsers(registered);
    const savedUser = localStorage.getItem('autoincome_user');
    if (savedUser) { 
      setUser(JSON.parse(savedUser)); 
      setIsBooting(true); 
    }
    const savedEngines = localStorage.getItem('autoincome_engines');
    if (savedEngines) setEngines(JSON.parse(savedEngines));
    const savedTransactions = localStorage.getItem('autoincome_transactions');
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      let totalTickRevenue = 0;
      setEngines(prevEngines => {
        const updated = prevEngines.map(e => {
          if (e.status === 'Active') {
            const tick = Math.random() * 0.05;
            totalTickRevenue += tick;
            return { ...e, revenue: e.revenue + tick, performance: Math.max(0, Math.min(100, e.performance + (Math.random() - 0.5))) };
          }
          return e;
        });
        saveEnginesToStorage(updated);
        return updated;
      });

      if (totalTickRevenue > 0) {
        setUser(prevUser => {
          if (!prevUser) return null;
          const updated = { ...prevUser, balance: prevUser.balance + totalTickRevenue, lifetimeYield: prevUser.lifetimeYield + totalTickRevenue };
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
      setUser(found); 
      localStorage.setItem('autoincome_user', JSON.stringify(found)); 
      setIsBooting(true); 
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
      totalWithdrawn: 0
    };
    const updatedUsers = [...allUsers, newUser]; 
    setAllUsers(updatedUsers); 
    localStorage.setItem('autoincome_all_users', JSON.stringify(updatedUsers));
    setUser(newUser); 
    localStorage.setItem('autoincome_user', JSON.stringify(newUser)); 
    setIsBooting(true); 
    return undefined;
  };

  const handleDeploy = (engine: Engine) => { 
    const newEngines = [engine, ...engines]; 
    setEngines(newEngines); 
    saveEnginesToStorage(newEngines); 
    setView('dashboard'); 
  };
  
  const handleWithdrawal = (amt: number, method: string) => {
    if (!user) return;
    const u = { ...user, balance: user.balance - amt, totalWithdrawn: user.totalWithdrawn + amt };
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
    const newTxs = [tx, ...transactions];
    setUser(u);
    setTransactions(newTxs);
    localStorage.setItem('autoincome_user', JSON.stringify(u));
    localStorage.setItem('autoincome_transactions', JSON.stringify(newTxs));
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

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Layout },
    { id: 'treasury', label: 'Treasury Hub', icon: DollarSign },
    { id: 'hub', label: 'Architect Uplink', icon: BrainCircuit },
    { id: 'learning', label: 'Knowledge Base', icon: BookOpen },
    { id: 'admin', label: 'Grid Governance', icon: Shield, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  const renderContent = () => {
    if (view === 'dashboard') return (
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
              <Card blueprint className="p-10 space-y-2 border-l-4 border-blue-600 shadow-glow glass">
                <div className="text-[10px] font-black uppercase text-white/30 italic">Capital Volume</div>
                <div className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none">${user?.balance.toFixed(2)}</div>
              </Card>
              <Card blueprint className="p-10 space-y-2 glass">
                <div className="text-[10px] font-black uppercase text-white/30 italic">Uplink Health</div>
                <div className="text-4xl md:text-5xl font-black text-green-400 italic tracking-tighter leading-none">OPTIMAL</div>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {engines.map(e => (
                <Card key={e.id} hover onClick={() => setView(`engine-${e.id}`)} className="p-8 border border-white/5 flex flex-col sm:flex-row gap-8 items-center group glass" blueprint>
                  <div className="w-24 h-24 rounded-2xl bg-black/40 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-blue-500/30 transition-all">
                    {e.imageUrl ? <img src={e.imageUrl} className="w-full h-full object-cover" /> : <Cpu size={32} className="text-blue-600/30" />}
                  </div>
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex justify-between items-start">
                       <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors leading-none">{e.name}</h4>
                       <Badge variant="success" live={e.status === 'Active'}>Live</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black uppercase text-white/20 italic">Metabolism</p>
                        <span className="text-2xl font-black italic text-green-400 leading-none">${e.revenue.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-white/20 italic">Efficiency</p>
                        <span className="text-lg font-black italic text-blue-500 leading-none">{e.performance.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {engines.length === 0 && (
                <Card className="md:col-span-2 py-24 text-center space-y-6 glass border-dashed" blueprint>
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
    if(view === 'builder') return <EngineBuilder onDeploy={handleDeploy} onCancel={() => setView('dashboard')} />;
    if(view === 'learning') return <LearningHub onSelectArticle={id => setView(`article-${id}`)} />;
    if(view === 'settings') return <ProfileSettings user={user!} onUpdate={(u) => setUser({...user!, ...u})} onCancel={() => setView('dashboard')} />;
    if(view.startsWith('article-')) return <ArticleView article={MOCK_ARTICLES.find(a => a.id === view.slice(8))!} onBack={() => setView('learning')} />;
    if(view === 'admin') return <AdminDashboard users={allUsers} engines={engines} currentUserId={user!.id} onUpdateUser={handleAdminUserUpdate} />;
    if(view === 'hub') return <LiveArchitectUplink onExit={() => setView('dashboard')} />;
    if(view === 'treasury') return <TreasuryHub user={user!} transactions={transactions} onOpenWithdraw={() => setIsWithdrawModalOpen(true)} />;
    if(view.startsWith('engine-')) {
        const engine = engines.find(e => e.id === view.slice(7));
        return engine ? <EngineDetailView engine={engine} onBack={() => setView('dashboard')} /> : null;
    }
    return null;
  };

  if (!user) return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} isGridEmpty={allUsers.length === 0} />;
  if (isBooting) return <SystemHandshake onComplete={() => setIsBooting(false)} />;

  return (
    <div className="relative min-h-screen bg-[#050505] md:flex text-white selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none blueprint-bg opacity-[0.3]"></div>
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(0,112,243,0.02)_1px,transparent_1px)] bg-[length:100%_8px] animate-neural-scan opacity-[0.1]"></div>
      
      <aside className={`fixed top-0 left-0 h-full z-[70] w-72 border-r border-white/5 p-8 flex flex-col bg-black/90 backdrop-blur-3xl transition-transform duration-500 -translate-x-full md:relative md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : ''}`}>
        <Logo size={40} animate />
        <nav className="space-y-2 mt-12 flex-1 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (!item.adminOnly || user.role === 'Admin') && (
            <button key={item.id} onClick={() => { setView(item.id); setIsMenuOpen(false); }} className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] italic transition-all group ${view.startsWith(item.id) ? 'bg-blue-600 text-white shadow-glow' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20} className={view.startsWith(item.id) ? 'text-white' : 'text-white/20 group-hover:text-blue-500'} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/5 pt-8 space-y-4">
          <div className="flex items-center gap-4 w-full p-2 rounded-xl text-left bg-white/[0.02] border border-white/5 glass">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black italic border transition-all ${user.role === 'Admin' ? 'bg-blue-600/20 border-blue-500 text-blue-500' : 'bg-white/5 border-white/10 text-white/20'}`}>
                {user.role === 'Admin' ? <Shield size={20} /> : user.name.charAt(0)}
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
            <button className="p-3 bg-white/[0.02] border border-white/5 rounded-full glass text-white/40 hover:text-white transition-colors"><Clock size={20}/></button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {isWithdrawModalOpen && <WithdrawalTerminal user={user!} onClose={() => setIsWithdrawModalOpen(false)} onWithdraw={handleWithdrawal} />}
      <GlobalActivityTicker />
    </div>
  );
};

const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);
