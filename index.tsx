import React, { useState, useEffect, useRef, useMemo, ErrorInfo, ReactNode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Activity, 
  ArrowLeft,
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
  Radio,
  History,
  TrendingDown,
  ArrowUpRight,
  Calendar,
  CheckCheck,
  Wrench,
  Trash2,
  HeartPulse,
  ChevronLeft,
  DollarSign,
  LogOut,
  Loader2,
  Send,
  Waves,
  ZapOff,
  Crosshair,
  RefreshCw,
  Image as LucideImage,
  ArrowDownRight,
  Wallet,
  Clock,
  ExternalLink,
  Mic,
  MicOff,
  Speaker,
  Edit3,
  Save,
  FileText,
  XCircle,
  User,
  CreditCard,
  ArrowDown,
  Search,
  HelpCircle,
  Info
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob, LiveConnectSession } from "@google/genai";
import { apiService } from './services/apiService';

// --- Types & Interfaces ---

type Plan = 'Free Trial' | 'Starter' | 'Pro' | 'Unlimited';
type EngineStatus = 'Active' | 'Paused' | 'Optimizing' | 'Draft';
type TransactionStatus = 'Completed' | 'Processing' | 'Auditing';

interface UserData {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  role: 'User' | 'Admin'; 
  balance: number;
  lifetimeYield: number;
  totalWithdrawn: number;
}

interface Transaction {
  id: string;
  engineId?: string; 
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status: TransactionStatus;
}

interface Engine {
  id: string;
  name: string;
  type: string;
  model: string;
  status: EngineStatus;
  revenue: number;
  lastSync: string;
  performance: number;
  config: any;
  imageUrl?: string;
  history?: number[]; 
}

interface GridIntelligence {
  macroBriefing: string;
  tacticalDirectives: string[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

// --- Constants ---

const DEFAULT_ENGINE_IMAGE = "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200&auto=format&fit=crop";

const ENGINE_TEMPLATES = [
  { id: 'affiliate', name: 'Affiliate Magnet', description: 'Automated traffic routing to high-ticket offers using social signal nodes.', icon: TrendingUp, color: 'text-blue-500', yield: 'High Velocity' },
  { id: 'newsletter', name: 'Newsletter Engine', description: 'AI-curated content delivery with dynamic ad placement slots.', icon: Mail, color: 'text-purple-500', yield: 'Steady Growth' },
  { id: 'digital-product', name: 'Digital Delivery', description: 'Complete sales funnel with automated license and asset delivery.', icon: Database, color: 'text-emerald-500', yield: 'Passive Max' },
  { id: 'saas-reseller', name: 'SaaS Resell Node', description: 'Automated white-label provisioning and seat management.', icon: Layers, color: 'text-orange-500', yield: 'Subscription Yield' },
  { id: 'content-bot', name: 'Content Arbitrage', description: 'AI content generation node targeting low-competition search niches.', icon: Sparkles, color: 'text-pink-500', yield: 'Search Arbitrage' },
];

const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Layout, admin: false },
    { id: 'treasury', label: 'Treasury Hub', icon: DollarSign, admin: false },
    { id: 'hub', label: 'Neural Bridge', icon: BrainCircuit, admin: false },
    { id: 'knowledge', label: 'Knowledge Base', icon: FileText, admin: false },
    { id: 'admin', label: 'Admin Matrix', icon: Shield, admin: true },
    { id: 'settings', label: 'Terminal Prefs', icon: Settings, admin: false },
];

const BUILDER_TUTORIAL = [
  { step: 1, title: "Neural Core Selection", description: "Select a 'Topology' from our pre-validated templates. Each model uses specialized AI agents to generate specific yield profiles.", icon: Layers },
  { step: 2, title: "Operational Briefing", description: "Define the directive. Give your node a unique designator and brief the Neural Core on your specific market targets.", icon: Edit3 },
  { step: 3, title: "Logic Verification", description: "Review the synthesized architecture. Ensure the strategic logic is robust before finalizing the core.", icon: ShieldCheck },
  { step: 4, title: "Visual Synthesis", description: "Render a unique visual identifier for the Grid registry. Once rendered, the node is ready for deployment.", icon: LucideImage }
];

// --- Helper Components: Error Boundaries ---

interface SectionErrorBoundaryProps {
  children?: ReactNode;
  name?: string;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

// Fix: Correctly extending the destructured Component class from react to resolve property access and state errors
class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: any): SectionErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Neural Error in [${this.props.name || 'Component'}]:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 animate-in zoom-in-95 duration-500">
          <Card blueprint className="max-w-xl mx-auto p-12 border border-red-500/30 bg-red-500/5 text-center space-y-8 glass shadow-glow">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <ZapOff size={64} className="text-red-500 animate-pulse" />
              <div className="absolute inset-0 bg-red-500 blur-2xl opacity-10 animate-pulse"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">Neural Link Interrupted</h3>
              <p className="text-[10px] font-black uppercase text-red-500 tracking-[0.4em] italic">Critical Exception in {this.props.name || 'Module'} Stream</p>
              <p className="text-sm italic text-white/40 font-medium leading-relaxed max-sm mx-auto">
                The neural core has encountered an unhandled diagnostic state. 
                Operational continuity preserved via localized isolation.
              </p>
            </div>
            <div className="pt-4 flex flex-col items-center gap-4">
              <Button variant="danger" icon={RefreshCw} onClick={this.handleReset} className="px-12 py-4 shadow-glow transition-all">
                AUTHORIZE RE-SYNC
              </Button>
            </div>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Helper Functions ---

const formatCurrency = (val: any) => {
  const num = typeof val === 'number' && !isNaN(val) ? val : 0;
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const isEngineIdle = (engine: Engine) => {
  if (engine.status !== 'Active') return true;
  const lastSyncTime = new Date(engine.lastSync).getTime();
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  return lastSyncTime < oneHourAgo;
};

const generateMockHistory = (base: number, length: number = 24) => {
  return Array.from({ length }).map(() => base + (Math.random() * 10 - 5));
};

// --- Audio Helper Functions for Live API ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Atomic Components ---

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
      setDisplayValue(value);
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
          <span className="absolute -top-2 right-0 font-mono text-[10px] font-black text-emerald-400 animate-in slide-in-from-bottom-2 fade-out duration-1000 pointer-events-none">
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
      setTimeout(() => setIsJittering(false), 1000);
      prevValue.current = value;
    }
  }, [value]);
  return (
    <div className="text-right flex flex-col justify-end">
      <p className="text-[9px] font-black uppercase text-white/40 italic">Efficiency</p>
      <div className="flex items-center justify-end gap-2">
        <span className={`text-lg font-black italic transition-all duration-300 ${isJittering ? 'text-blue-400 scale-110' : 'text-blue-500'} leading-none drop-shadow-lg`}>
          {value.toFixed(1)}%
        </span>
        <div className={`w-1.5 h-1.5 rounded-full ${value > 90 ? 'bg-green-500' : 'bg-yellow-500'} shadow-[0_0_8px_currentColor] ${isJittering ? 'animate-ping' : ''}`}></div>
      </div>
    </div>
  );
};

const PerformanceChart = ({ data }: { data: number[] }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((v - min) / range) * 100
  }));
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="w-full h-16 mt-2 relative">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={pathData}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-500 drop-shadow-glow-sm"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`${pathData} L 100,100 L 0,100 Z`}
          fill="url(#grad)"
          className="opacity-20"
        />
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const RecalibrationOverlay = ({ label = "Recalibrating Core..." }: { label?: string }) => {
  return (
    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-[6px] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-blue-600/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <BrainCircuit size={40} className="text-blue-500 animate-pulse" />
      </div>
      <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 italic">{label.toUpperCase()}</span>
    </div>
  );
};

const Card = ({ children, className = '', hover = false, onClick, blueprint = false, image, isPending }: any) => (
  <div onClick={onClick} className={`glass rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group ${hover ? 'hover:border-blue-500/40 hover:scale-[1.01] hover:shadow-glow-sm' : ''} ${className} ${onClick ? 'cursor-pointer' : ''}`}>
    {blueprint && <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>}
    {image && (
      <>
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 pointer-events-none overflow-hidden transition-opacity">
          <img src={image} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
      </>
    )}
    <div className="relative z-10 h-full">{children}</div>
    {isPending && <RecalibrationOverlay label="Recalibrating Core" />}
  </div>
);

const Badge = ({ children, variant = 'info', live = false }: any) => {
  const variants: any = {
    success: "bg-green-500/10 text-green-400 border border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    neutral: "bg-white/5 text-white/50 border border-white/10",
  };
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-black italic ${variants[variant]}`}>
      {live && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>}
      {children}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false, size = 'md', loading = false }: any) => {
  const base = "flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 relative overflow-hidden group whitespace-nowrap";
  const variants: any = {
    primary: "bg-[#0070f3] hover:bg-blue-500 text-white shadow-glow",
    secondary: "bg-white/10 hover:bg-white/20 text-white",
    outline: "border border-white/20 hover:border-white/40 text-white",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20",
    success: "bg-green-600 hover:bg-green-500 text-white",
    ghost: "bg-transparent hover:bg-white/5 text-white/60 hover:text-white"
  };
  const sizeClass = size === 'sm' ? "px-4 py-2 text-sm" : "px-6 py-3";
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${base} ${sizeClass} ${variants[variant]} ${className}`}>
      {loading ? <Activity size={18} className="animate-spin" /> : Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- View Components ---

const KnowledgeBaseView = ({ onBack }: { onBack: () => void }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const topics = [
    "Grid Sovereignty Fundamentals",
    "Neural Core Optimization",
    "Treasury Withdrawal Protocols",
    "Admin Matrix Oversite",
    "Passive Revenue Topology"
  ];

  const fetchArticle = async (topic: string) => {
    setSelectedTopic(topic);
    setLoading(true);
    try {
      const response = await apiService.getKnowledgeArticle(topic);
      setContent(response.text || "No archive data found.");
    } catch (e) {
      setContent("Uplink to Neural Archive failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 px-4 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors"><ArrowLeft size={24}/></button>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Neural Archive</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {topics.map(t => (
            <button key={t} onClick={() => fetchArticle(t)} className={`w-full text-left p-4 rounded-xl text-xs font-black uppercase italic tracking-widest transition-all ${selectedTopic === t ? 'bg-blue-600 text-white shadow-glow' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
        <Card blueprint className="lg:col-span-3 p-10 glass min-h-[500px] relative">
          {loading ? <RecalibrationOverlay label="Accessing Records..." /> : (
            <div className="prose prose-invert max-w-none text-white/70 italic text-sm leading-relaxed whitespace-pre-wrap">
              {selectedTopic ? (
                <>
                  <h3 className="text-2xl font-black uppercase text-white mb-6 border-b border-white/10 pb-4">{selectedTopic}</h3>
                  {content}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-4 pt-24">
                   <FileText size={48} />
                   <p className="font-black uppercase tracking-widest">Select a topic from the directory</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const SettingsView = ({ user, onLogout, onBack }: { user: UserData, onLogout: () => void, onBack: () => void }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 px-4 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors"><ArrowLeft size={24}/></button>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Terminal Prefs</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card blueprint className="p-8 glass space-y-6">
           <h3 className="text-xl font-black uppercase italic text-blue-500">Architect Profile</h3>
           <div className="space-y-4">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-white/30 italic">Designation</p>
                 <p className="text-lg font-black italic text-white">{user.name}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-white/30 italic">Uplink ID</p>
                 <p className="text-lg font-black italic text-white">{user.email}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase text-white/30 italic">Current Node Plan</p>
                 <Badge variant="success">{user.plan}</Badge>
              </div>
           </div>
        </Card>
        <Card blueprint className="p-8 glass space-y-6 flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-black uppercase italic text-red-500">System Link</h3>
              <p className="text-xs italic text-white/40 mt-4 leading-relaxed">Disconnecting will sever the neural link and terminate active session buffers.</p>
           </div>
           <Button variant="danger" icon={LogOut} onClick={onLogout} className="py-4">Sever Neural Uplink</Button>
        </Card>
      </div>
    </div>
  );
};

const AdminMatrixView = ({ engines, transactions, onBack }: { engines: Engine[], transactions: Transaction[], onBack: () => void }) => {
  const globalYield = engines.reduce((acc, e) => acc + e.revenue, 0);
  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 px-4 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors"><ArrowLeft size={24}/></button>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Admin Matrix</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card blueprint className="p-6 text-center border-b-2 border-blue-500">
            <p className="text-[10px] font-black uppercase text-white/30 italic">Total Engines</p>
            <p className="text-3xl font-black italic text-white mt-1">{engines.length}</p>
         </Card>
         <Card blueprint className="p-6 text-center border-b-2 border-emerald-500">
            <p className="text-[10px] font-black uppercase text-white/30 italic">Active Nodes</p>
            <p className="text-3xl font-black italic text-white mt-1">{engines.filter(e => e.status === 'Active').length}</p>
         </Card>
         <Card blueprint className="p-6 text-center border-b-2 border-purple-500">
            <p className="text-[10px] font-black uppercase text-white/30 italic">Global Yield</p>
            <p className="text-3xl font-black italic text-emerald-400 mt-1">${formatCurrency(globalYield)}</p>
         </Card>
         <Card blueprint className="p-6 text-center border-b-2 border-orange-500">
            <p className="text-[10px] font-black uppercase text-white/30 italic">Processed Vol</p>
            <p className="text-3xl font-black italic text-white mt-1">${formatCurrency(totalVolume)}</p>
         </Card>
      </div>
      <Card blueprint className="p-8 glass overflow-hidden">
         <h3 className="text-xl font-black uppercase italic text-white mb-6">Grid Node Registry</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-xs italic font-medium">
               <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black uppercase text-white/30 tracking-widest">
                     <th className="pb-4">Node Designation</th>
                     <th className="pb-4">Topology</th>
                     <th className="pb-4">Revenue</th>
                     <th className="pb-4">Performance</th>
                     <th className="pb-4">Last Sync</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {engines.map(e => (
                    <tr key={e.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="py-4 text-white group-hover:text-blue-400 transition-colors font-black uppercase">{e.name}</td>
                       <td className="py-4 opacity-60">{e.type}</td>
                       <td className="py-4 text-emerald-400 font-black">${formatCurrency(e.revenue)}</td>
                       <td className="py-4 text-blue-400 font-black">{e.performance.toFixed(1)}%</td>
                       <td className="py-4 opacity-40">{new Date(e.lastSync).toLocaleTimeString()}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

// --- Treasury View ---

const TreasuryHub = ({ user, transactions, onWithdraw }: any) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) return;
    onWithdraw(amt);
    setWithdrawAmount("");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 px-4 pb-24">
      <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Treasury Hub</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card blueprint className="p-8 border-l-4 border-emerald-500 glass shadow-glow">
            <MetabolismTicker value={user.balance} isMain label="Available Liquidity" />
          </Card>
          <Card blueprint className="p-8 glass space-y-6">
            <h3 className="text-lg font-black italic uppercase text-white">Liquidity Exit</h3>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-black italic">$</span>
                <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-8 text-white outline-none focus:border-emerald-500 transition-all italic font-black" />
              </div>
              <Button variant="success" className="w-full py-4 shadow-glow" icon={Wallet} onClick={handleWithdraw} disabled={!withdrawAmount || parseFloat(withdrawAmount) > user.balance}>Authorize Withdrawal</Button>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-4">
             <Card blueprint className="p-4 glass text-center">
                <p className="text-[9px] font-black uppercase text-white/40 italic">Total Yield</p>
                <p className="text-xl font-black italic text-emerald-400 mt-1">${formatCurrency(user.lifetimeYield)}</p>
             </Card>
             <Card blueprint className="p-4 glass text-center">
                <p className="text-[9px] font-black uppercase text-white/40 italic">Exited Capital</p>
                <p className="text-xl font-black italic text-white/60 mt-1">${formatCurrency(user.totalWithdrawn)}</p>
             </Card>
          </div>
        </div>
        <Card blueprint className="lg:col-span-2 p-8 glass min-h-[500px] flex flex-col">
          <h3 className="text-lg font-black italic uppercase text-white mb-6 border-b border-white/5 pb-3">Transaction Registry</h3>
          <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide pr-2">
            {transactions.map((tx: Transaction) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {tx.type === 'credit' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div>
                    <p className="text-xs font-black italic text-white uppercase">{tx.description}</p>
                    <p className="text-[9px] font-black uppercase text-white/30 italic">{new Date(tx.date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black italic ${tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'credit' ? '+' : '-'}${formatCurrency(tx.amount)}
                  </p>
                  <Badge variant={tx.status === 'Completed' ? 'success' : 'warning'}>{tx.status}</Badge>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic space-y-4">
                 <History size={48} />
                 <p className="uppercase text-[10px] tracking-widest font-black">Registry Empty</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Specialized Components ---

const GridIntelligenceNode = ({ engines, treasury }: { engines: Engine[], treasury: number }) => {
  const [intel, setIntel] = useState<GridIntelligence | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const response = await apiService.getGridIntelligence(engines, treasury, []);
      const data = JSON.parse(response.text || '{}');
      setIntel(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntel();
  }, [engines.length]);

  if (!intel && !loading) return null;

  return (
    <Card blueprint className="p-8 border border-blue-500/20 glass relative overflow-hidden">
      {loading && <RecalibrationOverlay label="Synthesizing Intelligence..." />}
      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Radio size={20} className="text-blue-500 animate-pulse" />
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Grid Intelligence Core</h3>
            {intel && (
              <Badge variant={intel.riskLevel === 'Low' ? 'success' : intel.riskLevel === 'Critical' ? 'warning' : 'info'}>
                {intel.riskLevel} Risk
              </Badge>
            )}
          </div>
          <p className="text-sm italic text-white/70 leading-relaxed max-w-2xl">
            {intel?.macroBriefing || "Initializing macro-strategic analysis of current grid state..."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {intel?.tacticalDirectives.map((d, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black uppercase italic tracking-widest text-blue-400">
                {d}
              </div>
            ))}
          </div>
        </div>
        <Button variant="outline" icon={RefreshCw} onClick={fetchIntel} disabled={loading} className="shrink-0">Re-sync</Button>
      </div>
    </Card>
  );
};

const EngineBuilder = ({ onDeploy, onCancel, onNotify }: { onDeploy: (e: Engine) => void, onCancel: () => void, onNotify: (m: string, t: 'success' | 'warning') => void }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [nodeName, setNodeName] = useState("");
  const [briefing, setBriefing] = useState("");
  const [strategy, setStrategy] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSaveDraft = () => {
    const draft = {
      step,
      selectedTemplate,
      nodeName,
      briefing,
      strategy,
      imageUrl
    };
    localStorage.setItem('autoincome_builder_draft', JSON.stringify(draft));
    onNotify("Draft Saved to Local Registry", "success");
  };

  const handleLoadDraft = () => {
    const saved = localStorage.getItem('autoincome_builder_draft');
    if (!saved) return onNotify("No Draft Found in Registry", "warning");
    try {
      const draft = JSON.parse(saved);
      setStep(draft.step || 1);
      setSelectedTemplate(draft.selectedTemplate || null);
      setNodeName(draft.nodeName || "");
      setBriefing(draft.briefing || "");
      setStrategy(draft.strategy || null);
      setImageUrl(draft.imageUrl || "");
      onNotify("Draft Restored", "success");
    } catch (e) {
      onNotify("Corrupt Draft Data", "warning");
    }
  };

  const handleGenerateStrategy = async () => {
    if (!nodeName || !briefing) return onNotify("Incomplete Directive", "warning");
    setLoading(true);
    try {
      const response = await apiService.generateStrategy('gemini-3-flash-preview', nodeName, briefing, selectedTemplate.name);
      const data = JSON.parse(response.text || '{}');
      setStrategy(data);
      setStep(3);
    } catch (e) {
      onNotify("Synthesis Failure", "warning");
    } finally {
      setLoading(false);
    }
  };

  const generateVisual = async () => {
    setLoading(true);
    try {
      const response = await apiService.generateIcon(strategy?.visualPrompt || `Abstract cyberpunk technological icon for ${nodeName}`);
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setImageUrl(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
          break;
        }
      }
      setStep(4);
    } catch (e) {
      onNotify("Visual Synthesis Failure", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = () => {
    const newEngine: Engine = {
      id: `node_${Date.now()}`,
      name: nodeName,
      type: selectedTemplate.name,
      model: 'gemini-3-flash-preview',
      status: 'Active',
      revenue: 0,
      lastSync: new Date().toISOString(),
      performance: 85 + Math.random() * 15,
      config: strategy,
      imageUrl: imageUrl || DEFAULT_ENGINE_IMAGE
    };
    onDeploy(newEngine);
    localStorage.removeItem('autoincome_builder_draft');
  };

  const hasDraft = !!localStorage.getItem('autoincome_builder_draft');

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-24 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors"><ArrowLeft size={24}/></button>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Initialize Node</h1>
        </div>
        <div className="flex gap-3">
          {hasDraft && step === 1 && (
            <Button variant="outline" size="sm" icon={History} onClick={handleLoadDraft}>Restore Draft</Button>
          )}
          {step > 1 && (
            <Button variant="secondary" size="sm" icon={Save} onClick={handleSaveDraft}>Save Draft</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {BUILDER_TUTORIAL.map(s => (
          <div key={s.step} className={`relative p-4 rounded-xl border transition-all ${step === s.step ? 'bg-blue-600 border-blue-400 shadow-glow' : step > s.step ? 'bg-green-500/10 border-green-500/40 opacity-60' : 'bg-white/5 border-white/10 opacity-30'}`}>
            <p className="text-[10px] font-black italic uppercase text-white/40">Step {s.step}</p>
            <p className="text-xs font-black italic uppercase text-white truncate">{s.title}</p>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ENGINE_TEMPLATES.map(t => (
            <Card key={t.id} blueprint hover onClick={() => { setSelectedTemplate(t); setStep(2); }} className="p-8 glass border border-white/5 group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-white/5 ${t.color}`}><t.icon size={32} /></div>
                <Badge variant="info">{t.yield}</Badge>
              </div>
              <h3 className="text-2xl font-black italic uppercase text-white mb-2">{t.name}</h3>
              <p className="text-xs italic text-white/50 leading-relaxed">{t.description}</p>
            </Card>
          ))}
        </div>
      )}

      {step === 2 && (
        <Card blueprint className="p-10 glass space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Node Designation</label>
              <input value={nodeName} onChange={e => setNodeName(e.target.value)} placeholder="e.g. ALPHA-CORE-01" className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-xl font-black italic text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Operational Briefing</label>
              <textarea value={briefing} onChange={e => setBriefing(e.target.value)} rows={4} placeholder="Describe the market target, logic flow, and objective..." className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm italic text-white outline-none focus:border-blue-500 resize-none" />
            </div>
          </div>
          <div className="flex gap-4">
             <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
             <Button className="flex-1 py-4" onClick={handleGenerateStrategy} loading={loading}>Synthesize Strategy</Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card blueprint className="p-10 glass space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <h3 className="text-2xl font-black italic uppercase text-white">{strategy?.strategyName}</h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                       <p className="text-[9px] font-black uppercase text-blue-500 italic">Attack Vector</p>
                       <p className="text-xs italic text-white/70 mt-1">{strategy?.attackVector}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                       <p className="text-[9px] font-black uppercase text-blue-500 italic">Leverage Mechanism</p>
                       <p className="text-xs italic text-white/70 mt-1">{strategy?.lever}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                       <p className="text-[9px] font-black uppercase text-blue-500 italic">Defensive Moat</p>
                       <p className="text-xs italic text-white/70 mt-1">{strategy?.moat}</p>
                    </div>
                 </div>
              </div>
              <div className="flex flex-col justify-between">
                 <div className="text-center p-8 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                    <p className="text-[10px] font-black uppercase text-blue-500 italic">Projected Yield</p>
                    <p className="text-4xl font-black italic text-white mt-2">{strategy?.projectedRevenue}</p>
                 </div>
                 <div className="space-y-4 mt-8">
                    <Button className="w-full py-4" onClick={generateVisual} loading={loading}>Synthesize Visual Core</Button>
                    <Button variant="ghost" className="w-full" onClick={() => setStep(2)}>Re-brief</Button>
                 </div>
              </div>
           </div>
        </Card>
      )}

      {step === 4 && (
        <Card blueprint className="p-10 glass space-y-8 text-center">
           <div className="max-w-md mx-auto aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-glow mb-8">
              <img src={imageUrl || DEFAULT_ENGINE_IMAGE} className="w-full h-full object-cover" alt="Node Core" />
           </div>
           <div className="space-y-2">
              <h3 className="text-3xl font-black italic uppercase text-white">Visual Link Ready</h3>
              <p className="text-sm italic text-white/40">The node's visual signature has been stabilized and registered to the grid.</p>
           </div>
           <div className="flex gap-4 max-w-sm mx-auto">
              <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>Back</Button>
              <Button variant="success" className="flex-1 shadow-glow" onClick={handleDeploy}>Deploy to Grid</Button>
           </div>
        </Card>
      )}
    </div>
  );
};

const NeuralBridge = ({ onExit, onNotify }: { onExit: () => void, onNotify: (m: string, t: any) => void }) => {
  const [isActive, setIsActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [status, setStatus] = useState("Standby");
  
  const audioContextRef = useRef<{ input: AudioContext, output: AudioContext } | null>(null);
  const sessionRef = useRef<LiveConnectSession | null>(null);
  const sources = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTime = useRef(0);

  const startBridge = async () => {
    setStatus("Connecting...");
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = apiService.connectLive({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus("Uplink Active");
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (!isMicOn) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const base64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
              nextStartTime.current = Math.max(nextStartTime.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTime.current);
              nextStartTime.current += audioBuffer.duration;
              sources.current.add(source);
              source.onended = () => sources.current.delete(source);
            }
            if (msg.serverContent?.interrupted) {
              sources.current.forEach(s => s.stop());
              sources.current.clear();
              nextStartTime.current = 0;
            }
            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => [...prev.slice(-10), `Spirit: ${msg.serverContent!.outputTranscription!.text}`]);
            }
            if (msg.serverContent?.inputTranscription) {
              setTranscription(prev => [...prev.slice(-10), `Architect: ${msg.serverContent!.inputTranscription!.text}`]);
            }
          },
          onerror: () => setStatus("Uplink Error"),
          onclose: () => {
            setIsActive(false);
            setStatus("Disconnected");
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are the Grid Intelligence Core. Speak directly to the Architect about grid health and optimization. Be concise and authoritative.',
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (e) {
      onNotify("Failed to establish audio uplink", "warning");
      setStatus("Uplink Failed");
    }
  };

  const stopBridge = () => {
    sessionRef.current?.close();
    audioContextRef.current?.input.close();
    audioContextRef.current?.output.close();
    setIsActive(false);
    setIsMicOn(false);
    setStatus("Standby");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-24 px-4">
      <div className="flex items-center gap-4">
        <button onClick={onExit} className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors"><ArrowLeft size={24}/></button>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Neural Bridge</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card blueprint className="lg:col-span-1 p-8 glass flex flex-col items-center justify-center space-y-8">
           <div className="relative">
              <div className={`absolute inset-0 blur-2xl opacity-20 animate-pulse ${isActive ? 'bg-blue-500' : 'bg-white/10'}`}></div>
              <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isActive ? 'border-blue-500 shadow-glow' : 'border-white/10'}`}>
                 <Waves size={48} className={isActive ? 'text-blue-500 animate-pulse' : 'text-white/20'} />
              </div>
           </div>
           <div className="text-center">
              <p className="text-[10px] font-black uppercase text-white/30 tracking-widest italic">Uplink Status</p>
              <p className={`text-xl font-black italic mt-1 ${isActive ? 'text-blue-400' : 'text-white/50'}`}>{status}</p>
           </div>
           <div className="flex gap-4 w-full">
              {!isActive ? (
                <Button className="flex-1 py-4" icon={Zap} onClick={startBridge}>Establish Uplink</Button>
              ) : (
                <Button variant="danger" className="flex-1 py-4" icon={XCircle} onClick={stopBridge}>Sever Uplink</Button>
              )}
           </div>
           {isActive && (
              <Button variant={isMicOn ? 'success' : 'outline'} className="w-full py-4" icon={isMicOn ? Mic : MicOff} onClick={() => setIsMicOn(!isMicOn)}>
                 {isMicOn ? 'Microphone Active' : 'Microphone Muted'}
              </Button>
           )}
        </Card>

        <Card blueprint className="lg:col-span-2 p-8 glass min-h-[400px] flex flex-col">
           <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h3 className="text-sm font-black italic uppercase text-white">Neural Stream Transcription</h3>
              <Badge variant={isActive ? 'success' : 'neutral'} live={isActive}>{isActive ? 'Live' : 'Offline'}</Badge>
           </div>
           <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
              {transcription.map((line, i) => (
                <div key={i} className={`p-3 rounded-xl text-xs font-black italic tracking-widest border ${line.startsWith('Architect') ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/5 text-white/60'}`}>
                   {line}
                </div>
              ))}
              {transcription.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 italic space-y-4">
                   <Speaker size={48} />
                   <p className="uppercase text-[10px] tracking-widest">Awaiting Neural Signals</p>
                </div>
              )}
           </div>
        </Card>
      </div>
    </div>
  );
};

const EngineDetailView = ({ engine, transactions, isPending, onBack, onDeleteRequest, onUpdateEngine }: { 
  engine: Engine, 
  transactions: Transaction[], 
  isPending: boolean, 
  onBack: () => void, 
  onDeleteRequest: () => void,
  onUpdateEngine: (id: string, update: any) => void
}) => {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const chat = useMemo(() => apiService.createEngineChat(engine), [engine.id]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);
    
    try {
      const result = await chat.sendMessage({ message: userMsg });
      setChatHistory(prev => [...prev, { role: 'model', text: result.text || "Diagnostic: No response." }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Uplink Failure: Neural core unreachable." }]);
    } finally {
      setIsChatting(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-24 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors"><ArrowLeft size={24}/></button>
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">{engine.name}</h1>
            <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em] italic">{engine.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="danger" icon={Trash2} size="sm" onClick={onDeleteRequest}>Decommission</Button>
          <Button variant="outline" icon={Settings} size="sm" onClick={() => onUpdateEngine(engine.id, { status: engine.status === 'Active' ? 'Paused' : 'Active' })}>
            {engine.status === 'Active' ? 'Pause Node' : 'Activate Node'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card blueprint image={engine.imageUrl || DEFAULT_ENGINE_IMAGE} className="h-64 flex flex-col justify-end p-8">
            <div className="space-y-4 relative z-10">
              <MetabolismTicker value={engine.revenue} isMain label="Node Revenue" />
              <PerformanceGauge value={engine.performance} />
            </div>
          </Card>
          
          <Card blueprint className="p-8 glass space-y-4">
            <h3 className="text-xs font-black uppercase text-white/40 italic">Configuration Matrix</h3>
            <div className="space-y-3">
              {Object.entries(engine.config || {}).map(([k, v]: [string, any]) => (
                <div key={k} className="flex justify-between items-center text-[10px] font-black italic uppercase">
                  <span className="text-white/30 truncate mr-2">{k}</span>
                  <span className="text-white truncate max-w-[150px]">{String(v)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card blueprint className="lg:col-span-2 p-0 glass flex flex-col min-h-[600px] overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
            <BrainCircuit size={20} className="text-blue-500" />
            <h3 className="text-sm font-black uppercase italic text-white">Neural Spirit Uplink</h3>
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm italic font-medium leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-glow' : 'bg-white/5 text-white/70 border border-white/10'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl flex gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-6 bg-black/40 border-t border-white/5 flex gap-4">
            <input 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Query the Neural Spirit..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm italic text-white outline-none focus:border-blue-500"
            />
            <Button icon={Send} onClick={handleSendMessage} disabled={isChatting} />
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState<UserData | null>(null);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toast, setToast] = useState<{title: string, type: 'success' | 'warning'} | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());
  const [loginEmail, setLoginEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('autoincome_user');
    if (savedUser) { 
      setUser(JSON.parse(savedUser));
      const savedEngines = localStorage.getItem('autoincome_engines');
      if (savedEngines) setEngines(JSON.parse(savedEngines));
      const savedTxs = localStorage.getItem('autoincome_txs');
      if (savedTxs) setTransactions(JSON.parse(savedTxs));
    }
    setIsBooting(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('autoincome_user', JSON.stringify(user));
      localStorage.setItem('autoincome_engines', JSON.stringify(engines));
      localStorage.setItem('autoincome_txs', JSON.stringify(transactions));
    }
  }, [user, engines, transactions]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      let totalTickRevenue = 0;
      let newTxs: Transaction[] = [];
      setEngines(prev => prev.map(e => {
        if (e.status === 'Active' && !pendingUpdates.has(e.id)) {
          const tick = Math.random() * 0.05;
          totalTickRevenue += tick;
          if (Math.random() > 0.985) {
             newTxs.push({ 
               id: `ntx_${Date.now()}_${e.id}`, 
               engineId: e.id, 
               date: new Date().toISOString(), 
               description: `Yield: ${e.name}`, 
               amount: 5 + Math.random() * 15, 
               type: 'credit', 
               status: 'Completed' 
             });
          }
          return { ...e, revenue: (e.revenue ?? 0) + tick, lastSync: new Date().toISOString() };
        }
        return e;
      }));
      if (newTxs.length > 0) setTransactions(prev => [...newTxs, ...prev].slice(0, 100));
      if (totalTickRevenue > 0) {
        setUser(prev => prev ? ({ ...prev, balance: prev.balance + totalTickRevenue, lifetimeYield: prev.lifetimeYield + totalTickRevenue }) : null);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user?.id, engines.length, pendingUpdates]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearchResults(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotify = (title: string, type: 'success' | 'warning') => {
    setToast({ title, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (email: string) => {
    if (!email) return handleNotify("Architect ID Required", "warning");
    setUser({ id: 'u1', name: 'Lead Architect', email, plan: 'Unlimited', role: 'Admin', balance: 1337.42, lifetimeYield: 1337.42, totalWithdrawn: 0 });
    setIsBooting(true);
    setTimeout(() => setIsBooting(false), 2000);
  };

  const handleWithdraw = (amount: number) => {
    if (!user || user.balance < amount) return handleNotify("Insufficient Liquidity", "warning");
    setTransactions(prev => [{ id: `wtx_${Date.now()}`, date: new Date().toISOString(), description: 'Liquidity Exit', amount, type: 'debit', status: 'Completed' }, ...prev]);
    setUser({ ...user, balance: user.balance - amount, totalWithdrawn: user.totalWithdrawn + amount });
    handleNotify("Exit Authorized", "success");
  };

  const renderContent = () => {
    if (!user) return null;

    if (view === 'dashboard') {
      return (
        <SectionErrorBoundary name="Command Center">
          <div className="space-y-12 animate-in fade-in duration-700 px-4 pb-24">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Command Center</h1>
              <Button onClick={() => setView('builder')} icon={Plus} size="lg">Initialize New Node</Button>
            </div>
            <GridIntelligenceNode engines={engines} treasury={user.balance} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card blueprint onClick={() => setView('treasury')} hover className="p-10 border-l-4 border-blue-600 glass shadow-glow">
                <MetabolismTicker value={user.balance} isMain label="Total Liquidity" />
                <div className="absolute top-4 right-4 opacity-20"><ChevronRight size={24} className="text-blue-500" /></div>
              </Card>
              <Card blueprint className="p-10 glass border border-white/5">
                <div className="text-[10px] font-black uppercase text-white/30 italic tracking-widest">Uplink Status</div>
                <div className="text-4xl font-black text-green-400 italic tracking-tighter mt-2">STABILIZED</div>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {engines.map(e => (
                <Card key={e.id} hover image={e.imageUrl || DEFAULT_ENGINE_IMAGE} onClick={() => setView(`engine-${e.id}`)} className={`min-h-[280px] flex flex-col justify-between glass border border-white/5 shadow-2xl transition-all ${isEngineIdle(e) ? 'grayscale opacity-70' : ''}`} >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none truncate">{e.name}</h4>
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] italic">{e.type}</p>
                    </div>
                    <Badge variant={e.status === 'Active' ? 'success' : 'warning'} live={e.status === 'Active'}>{e.status}</Badge>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-4">
                    <MetabolismTicker value={e.revenue} />
                    <PerformanceGauge value={e.performance} />
                  </div>
                </Card>
              ))}
              {engines.length === 0 && (
                <div className="md:col-span-3 py-24 text-center space-y-4 opacity-30 cursor-pointer" onClick={() => setView('builder')}>
                  <LucideImage size={48} className="mx-auto text-white/20 mb-4" />
                  <p className="italic font-black uppercase text-xs tracking-widest">Node Registry Empty</p>
                </div>
              )}
            </div>
          </div>
        </SectionErrorBoundary>
      );
    }
    
    if (view === 'treasury') return <TreasuryHub user={user} transactions={transactions} onWithdraw={handleWithdraw} />;
    if (view === 'builder') return <EngineBuilder onDeploy={(e: Engine) => { setEngines(prev => [e, ...prev]); setView('dashboard'); handleNotify("Node Online", "success"); }} onCancel={() => setView('dashboard')} onNotify={handleNotify} />;
    if (view === 'hub') return <NeuralBridge onExit={() => setView('dashboard')} onNotify={handleNotify} />;
    if (view === 'knowledge') return <KnowledgeBaseView onBack={() => setView('dashboard')} />;
    if (view === 'settings') return <SettingsView user={user} onLogout={() => { setUser(null); setView('dashboard'); localStorage.clear(); }} onBack={() => setView('dashboard')} />;
    if (view === 'admin') return <AdminMatrixView engines={engines} transactions={transactions} onBack={() => setView('dashboard')} />;
    
    if (view.startsWith('engine-')) {
      const e = engines.find(node => node.id === view.slice(7));
      return e ? <EngineDetailView engine={e} transactions={transactions.filter(t => t.engineId === e.id)} isPending={pendingUpdates.has(e.id)} onBack={() => setView('dashboard')} onDeleteRequest={() => { setEngines(prev => prev.filter(n => n.id !== e.id)); setView('dashboard'); }} onUpdateEngine={(id: string, update: any) => { setEngines(prev => prev.map(node => node.id === id ? {...node, ...update} : node)); handleNotify("Node Updated", "success"); }} /> : null;
    }

    return <div className="p-12 text-center text-white/40 italic uppercase tracking-widest">Module Synchronized</div>;
  };

  if (isBooting) return <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-6"><BrainCircuit size={80} className="text-blue-500 animate-pulse mb-8" /><p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse italic">Establishing Neural Link...</p></div>;

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      <div className="fixed inset-0 blueprint-bg opacity-20"></div>
      <Card blueprint className="w-full max-w-md p-12 glass border-blue-500/20 text-center space-y-10 animate-in zoom-in-95 shadow-glow">
         <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Grid Access Request</h2>
         <div className="space-y-4">
           <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin(loginEmail)} placeholder="Architect ID (Email)" className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white outline-none focus:border-blue-600 italic text-center" />
           <Button onClick={() => handleLogin(loginEmail)} className="w-full py-6 text-xl shadow-glow italic" size="lg">Establish Link</Button>
         </div>
      </Card>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#050505] md:flex text-white selection:bg-blue-600 overflow-hidden">
      <div className="fixed inset-0 blueprint-bg opacity-30"></div>
      <aside className={`fixed top-0 left-0 h-full z-[70] w-72 border-r border-white/5 p-8 flex flex-col bg-black/90 backdrop-blur-3xl transition-transform duration-500 md:relative md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-xl font-black italic tracking-tighter uppercase mb-12">AutoIncome</div>
        <nav className="space-y-2 flex-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setView(item.id); setIsMenuOpen(false); }} className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest italic transition-all ${view === item.id ? 'bg-blue-600 shadow-glow' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
              <item.icon size={20} /> <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <Button variant="ghost" className="mt-auto opacity-40 hover:opacity-100" icon={LogOut} onClick={() => { setUser(null); localStorage.clear(); setView('dashboard'); }}>Sever Uplink</Button>
      </aside>
      <main className="flex-1 w-full p-6 md:p-12 overflow-y-auto relative z-10 scrollbar-hide">
        <header className="mb-12 flex items-center justify-between gap-6">
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-3 bg-black/50 rounded-2xl border border-white/10 shadow-glow-sm"><Menu size={24}/></button>
          <div ref={searchRef} className="flex-1 max-w-md relative z-50">
            <input placeholder="Find Grid Node..." value={searchQuery} onFocus={() => setShowSearchResults(true)} onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-6 text-sm italic glass outline-none focus:border-blue-500/40" />
            {showSearchResults && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 glass rounded-2xl border border-white/10 shadow-3xl">
                {engines.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5).map(engine => (
                  <button key={engine.id} onClick={() => { setView(`engine-${engine.id}`); setShowSearchResults(false); setSearchQuery(''); }} className="w-full text-left p-3 hover:bg-white/5 rounded-xl italic text-xs">{engine.name}</button>
                ))}
              </div>
            )}
          </div>
        </header>
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 glass border border-blue-500/30 rounded-2xl p-4 z-[1000] animate-in slide-in-from-top-4">
          <p className="text-[10px] font-black uppercase italic text-white tracking-widest flex items-center gap-2">
            <CheckCheck size={14} className="text-blue-500"/> {toast.title}
          </p>
        </div>
      )}
    </div>
  );
};

const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);