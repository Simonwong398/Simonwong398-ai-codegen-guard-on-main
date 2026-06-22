import React, { useState, useMemo } from 'react';
import { CleanWebContract } from './data/defaultContracts';
import { sampleCodebase } from './data/sampleCodebase';
import { ArchitectureContract, VirtualFile } from './types/architecture';
import { auditCodebase } from './utils/auditor';
import { AuditLog } from './components/AuditLog';
import { TopologyGraph } from './components/TopologyGraph';
import { ContractEditor } from './components/ContractEditor';
import { WorkspaceExplorer } from './components/WorkspaceExplorer';
import { GuardCorePanel } from './components/GuardCorePanel';
import { StateKeeperPanel } from './components/StateKeeperPanel';
import { CommercialDashboard } from './components/CommercialDashboard';
import { Shield, Settings, Code, FileSearch, HelpCircle, Flame, History, Sparkles, Maximize2, Minimize2, X, Info } from 'lucide-react';
import { translations } from './data/translations';

export default function App() {
  // Core state: architecture specification and mock project codebase
  const [contract, setContract] = useState<ArchitectureContract>(CleanWebContract);
  const [files, setFiles] = useState<VirtualFile[]>(sampleCodebase);
  const [activeFilePath, setActiveFilePath] = useState<string>('src/api/client.ts');
  const [activeTab, setActiveTab] = useState<'editor' | 'guard' | 'stateKeeper' | 'contract' | 'commercial'>('editor');
  const [lang, setLang] = useState<string>('en');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isIntroDismissed, setIsIntroDismissed] = useState<boolean>(false);

  // Creative Gating, Monetization, and License Sandbox states
  const [premiumStatus, setPremiumStatus] = useState<'trial' | 'premium' | 'expired'>('trial');
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(3);
  const [isLicensingModalOpen, setIsLicensingModalOpen] = useState<boolean>(false);
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [licenseInputError, setLicenseInputError] = useState<string>('');
  const [licenseActiveSuccess, setLicenseActiveSuccess] = useState<boolean>(false);

  const handleActivateLicense = (keyToVerify: string) => {
    if (keyToVerify.toUpperCase().trim() === 'PRO-AST-GUARD-2026') {
      setPremiumStatus('premium');
      setLicenseActiveSuccess(true);
      setLicenseInputError('');
      setTimeout(() => {
        setLicenseActiveSuccess(false);
        setIsLicensingModalOpen(false);
      }, 1500);
    } else {
      setLicenseInputError(lang.includes('zh') 
        ? '授权秘钥无效。请输入 PRO-AST-GUARD-2026 进行激活模拟。' 
        : 'Invalid activation key. Please enter PRO-AST-GUARD-2026 to simulate successful upgrade.');
    }
  };

  // AI Drift simulation triggers for the Simulation Lab
  const handleSimulateDrift = (type: 'coupling' | 'bloat' | 'pattern' | 'chaos' | 'clean') => {
    setActiveFilePath('src/api/client.ts'); // Focus on the target file
    setFiles((prev) => {
      return prev.map((f) => {
        if (f.path === 'src/api/client.ts') {
          if (type === 'clean') {
            return {
              path: 'src/api/client.ts',
              content: `import { add } from '../utils/math';

export interface User {
  id: string;
  name: string;
  role: string;
}

export async function fetchUsers(): Promise<User[]> {
  return [
    { id: "1", name: "Simon", role: "admin" },
    { id: "2", name: "Architect", role: "moderator" }
  ];
}

export const API_METADATA = {
  version: "1.0",
  endpoints: ["/users", "/posts", "/metrics"],
  secure: true
};

export async function fetchHealth(): Promise<boolean> {
  return true;
}
`
            };
          }

          let content = `import { add } from '../utils/math';\n`;
          if (type === 'coupling' || type === 'chaos') {
            content = `import { Card } from '../components/Card'; // ❌ ILLEGAL BOUNDARY: API cannot import UI\n` + content;
          }
          
          content += `\nexport interface User {\n  id: string;\n  name: string;\n  role: string;\n}\n\n`;
          content += `export async function fetchUsers(): Promise<User[]> {\n`;
          
          if (type === 'pattern' || type === 'chaos') {
            content += `  console.log("fetching users telemetry records..."); // ❌ WARNING: forbidden console logger trace\n`;
          }
          
          content += `  return [\n    { id: "1", name: "Simon", role: "admin" },\n    { id: "2", name: "Architect", role: "moderator" }\n  ];\n}\n\n`;
          
          if (type === 'bloat' || type === 'chaos') {
            content += Array.from({ length: 42 }).map((_, i) => `// Boilerplate line ${i + 1} to artificially bloat files and exceed the maximum physical line counts contract rules.`).join('\n') + `\n\n`;
          }
          
          content += `export async function fetchHealth(): Promise<boolean> {\n`;
          
          if (type === 'pattern' || type === 'chaos') {
            content += `  eval("console.log('dangerous evaluation injection leak')"); // ❌ FATAL FORBIDDEN PATTERN EVAL\n`;
          }
          
          content += `  return true;\n}\n`;
          
          return {
            path: 'src/api/client.ts',
            content
          };
        }
        return f;
      });
    });
  };

  const t = useMemo(() => {
    return translations[lang] || translations['en'] || translations['zh-CN'];
  }, [lang]);

  // Incremental auditing on any contract or code alteration
  const auditResults = useMemo(() => {
    return auditCodebase(contract, files);
  }, [contract, files]);

  const activeFile = useMemo(() => {
    return files.find((f) => f.path === activeFilePath) || files[0] || null;
  }, [files, activeFilePath]);

  // Command Workspace Modifiers
  const handleUpdateContent = (path: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === path ? { ...f, content } : f))
    );
  };

  const handleAddFile = (path: string, content: string = '') => {
    if (files.some((f) => f.path === path)) return;
    setFiles((prev) => [...prev, { path, content }]);
    setActiveFilePath(path);
  };

  const handleDeleteFile = (path: string) => {
    const nextFiles = files.filter((f) => f.path !== path);
    setFiles(nextFiles);
    if (activeFilePath === path) {
      setActiveFilePath(nextFiles[0]?.path || '');
    }
  };

  const handleSelectFile = (path: string) => {
    setActiveFilePath(path);
  };

  // Automated splitting & refactoring processor
  const handleApplyRefactor = (
    proposedFiles: Array<{ path: string; codeTemplate: string; type?: string; purpose?: string }>,
    originalPath: string
  ) => {
    setFiles((prev) => {
      // Remove original file if it has a different name
      let next = prev.filter((f) => f.path.toLowerCase() !== originalPath.toLowerCase());
      // Append proposed split components
      proposedFiles.forEach((pf) => {
        const idx = next.findIndex((f) => f.path.toLowerCase() === pf.path.toLowerCase());
        if (idx !== -1) {
          next[idx] = { path: pf.path, content: pf.codeTemplate };
        } else {
          next.push({ path: pf.path, content: pf.codeTemplate });
        }
      });
      return next;
    });

    setActiveTab('editor');
    if (proposedFiles.length > 0) {
      // Focus on the newly separated View component file
      setActiveFilePath(proposedFiles[proposedFiles.length - 1].path);
    }
  };

  // One-Click Clean-Up auto fixer for all non-compliance issues
  const handleAutoFix = () => {
    setFiles((prev) => {
      return prev.map((f) => {
        if (f.path === 'src/api/client.ts') {
          return {
            ...f,
            content: `import { add } from '../utils/math';

export interface User {
  id: string;
  name: string;
  role: string;
}

// 🟢 Auto-Refactored: Removed unused illegal Card component import to secure api boundary.
// 🟢 Auto-Refactored: Banned patterns logs removed.
export async function fetchUsers(): Promise<User[]> {
  return [
    { id: "1", name: "Simon", role: "admin" },
    { id: "2", name: "Architect", role: "moderator" }
  ];
}

export const API_METADATA = {
  version: "1.0",
  endpoints: ["/users", "/posts", "/metrics"],
  secure: true
};

export async function fetchHealth(): Promise<boolean> {
  // 🟢 Auto-Refactored: Dangerous eval pattern removed for standard secure telemetry.
  console.warn('Security audit verified: safe invocation sandbox.');
  return true;
}
`
          };
        }
        return f;
      });
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Visual Header Branding Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-900/30">
                <Shield className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-sans tracking-tight">{t.appTitle}</h1>
                  <span className="px-1.5 py-0.5 bg-indigo-950/80 border border-indigo-800/85 rounded font-mono text-[9px] text-indigo-400 font-bold uppercase tracking-wider">
                    {t.appBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{t.appSubtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
              {/* Premium Status Pill button */}
              <button
                type="button"
                onClick={() => setIsLicensingModalOpen(true)}
                className={`flex items-center gap-2 font-mono text-[11px] px-3 py-1.5 rounded-lg border cursor-pointer transition-all duration-150 shadow-sm outline-none ${
                  premiumStatus === 'premium'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-400 text-white font-bold shadow-amber-500/10'
                    : premiumStatus === 'expired'
                    ? 'bg-rose-950/70 border-rose-800 text-rose-300 font-bold animate-pulse'
                    : 'bg-indigo-950/40 border-indigo-900/40 text-indigo-300 hover:bg-slate-900/50'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${premiumStatus === 'premium' ? 'text-white' : 'text-amber-500 animate-pulse'}`} />
                <span>
                  {lang.includes('zh')
                    ? premiumStatus === 'premium'
                      ? '专业激活 👑'
                      : premiumStatus === 'expired'
                      ? '试用已过期 🔐'
                      : `免费试用中 (${trialDaysLeft}天)`
                    : premiumStatus === 'premium'
                    ? 'PRO LICENSE 👑'
                    : premiumStatus === 'expired'
                    ? 'TRIAL EXPIRED 🔐'
                    : `TRIAL (${trialDaysLeft}d left)`
                  }
                </span>
              </button>

              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg text-xs font-mono px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="ja">日本語</option>
                <option value="zh-CN">简体中文</option>
                <option value="zh-TW">繁體中文</option>
                <option value="ar">العربية</option>
                <option value="nl">Nederlands</option>
                <option value="ko">한국어</option>
                <option value="pt">Português</option>
              </select>

              <div className="flex items-center gap-3 font-mono text-xs text-slate-400 bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block mr-1.5" />
                <span>{t.probeOnline}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Observability Sentinel Tower (Hides completely in ZenMode) */}
          {!isZenMode && (
            <div className="lg:col-span-5 space-y-6">
              {!isIntroDismissed ? (
                <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xl space-y-3.5 relative overflow-hidden">
                  <button 
                    onClick={() => setIsIntroDismissed(true)} 
                    className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                    title="Hide Info Panel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                  <div className="flex items-center gap-2 pb-2.5 border-b border-secondary border-slate-800">
                    <Shield className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <div>
                      <h2 className="text-sm font-extrabold text-neutral-100 font-sans tracking-wide">{t.introHeader}</h2>
                      <p className="text-[10px] text-slate-400">{t.introSub}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2">
                    <p>{t.introDesc}</p>
                    <div className="p-2.5 bg-slate-950/80 rounded-lg text-[10px] font-mono text-slate-400 space-y-1">
                      <div>• <span className="text-emerald-400 font-semibold">{t.introFeature1}</span></div>
                      <div>• {t.introFeature2}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsIntroDismissed(false)}
                  className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border border-slate-850 hover:bg-slate-850 text-indigo-300 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 w-full"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-400" />
                    <span>{lang.includes('zh') ? '显示看门狗文档描述' : 'Show Guard Document'}</span>
                  </span>
                  <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">AST.Docs</span>
                </button>
              )}

              <AuditLog 
                auditResults={auditResults} 
                onSelectFile={(path) => {
                  setActiveFilePath(path);
                  setActiveTab('editor');
                }} 
                onAutoFix={handleAutoFix} 
                t={t}
              />

              <TopologyGraph modules={contract.modules} t={t} lang={lang} />
            </div>
          )}

          {/* Right Column: Dynamic Interactive Workbench Sandbox (Switches column layout automatically in ZenMode) */}
          <div className={`${isZenMode ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-5 transition-all duration-200`}>
            
            {/* Inline ZenMode Compliancy alert feedback box */}
            {isZenMode && !auditResults.passed && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <span className="font-medium">
                    {lang.includes('zh') 
                      ? `⚠️ 在沉浸模式中监测到 ${auditResults.issues.length} 处架构契约背离（越权导入或行数爆仓）！`
                      : `⚠️ Found ${auditResults.issues.length} architecture compliance drift warnings hidden in silent workspace!`}
                  </span>
                </div>
                <button 
                  onClick={() => setIsZenMode(false)}
                  className="text-xs font-bold font-sans text-indigo-600 hover:text-indigo-850 underline ml-2 shrink-0 cursor-pointer"
                >
                  {lang.includes('zh') ? '退出沉浸查看详情 →' : 'Exit Focus Mode to Inspect →'}
                </button>
              </div>
            )}

            {isZenMode && auditResults.passed && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold">
                  {lang.includes('zh') 
                    ? '✨ 沉浸守护中：架构依赖完全合规！没有检测到任何非正常耦合越权。'
                    : '✨ Silent Focus active: All files and boundaries perfectly fit the strict contract.'}
                </span>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 shrink-0">
                  <FileSearch className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-sans tracking-tight">{t.workbenchTitle}</h2>
                  <button
                    onClick={() => setIsZenMode(!isZenMode)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-mono font-extrabold text-slate-600 border border-slate-250 rounded-lg cursor-pointer select-none transition-all duration-100 shadow-sm"
                    title={isZenMode ? "Exit Focus Mode" : "Focus Wide Workspace View"}
                  >
                    {isZenMode ? <Minimize2 className="w-3 h-3 text-indigo-500" /> : <Maximize2 className="w-3 h-3 text-indigo-500" />}
                    <span>{isZenMode ? (lang.includes('zh') ? '双分栏视图' : 'Split View') : (lang.includes('zh') ? '极简全屏模式' : 'Focus View')}</span>
                  </button>
                </div>

                {/* Inner Dashboard Tabs controls */}
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all duration-150 ${
                      activeTab === 'editor'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    {t.tabEditor}
                  </button>
                  <button
                    onClick={() => setActiveTab('guard')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all duration-150 ${
                      activeTab === 'guard'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {t.tabGuard}
                  </button>
                  <button
                    onClick={() => setActiveTab('stateKeeper')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all duration-150 ${
                      activeTab === 'stateKeeper'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-indigo-500" />
                    {t.tabState}
                  </button>
                  <button
                    onClick={() => setActiveTab('contract')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all duration-150 ${
                      activeTab === 'contract'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    {t.tabContract}
                  </button>
                  <button
                    onClick={() => setActiveTab('commercial')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-all duration-150 ${
                      activeTab === 'commercial'
                        ? 'bg-emerald-900 text-emerald-50 shadow-sm'
                        : 'text-emerald-700 hover:bg-emerald-100/50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 font-extrabold animate-pulse" />
                    {t.tabCommercial}
                  </button>
                </div>
              </div>

              {/* Dynamic tab contents panel */}
              <div className="transition-all duration-200">
                {activeTab === 'editor' ? (
                  <WorkspaceExplorer
                    files={files}
                    activeFile={activeFile}
                    onSelectFile={handleSelectFile}
                    onUpdateContent={handleUpdateContent}
                    onAddFile={handleAddFile}
                    onDeleteFile={handleDeleteFile}
                    t={t}
                    lang={lang}
                    onSimulateDrift={handleSimulateDrift}
                  />
                ) : activeTab === 'guard' ? (
                  <GuardCorePanel
                    contract={contract}
                    files={files}
                    auditResults={auditResults}
                    onSelectFile={(path) => {
                      setActiveFilePath(path);
                      setActiveTab('editor');
                    }}
                    onApplyRefactor={handleApplyRefactor}
                    t={t}
                    lang={lang}
                    isPremium={premiumStatus !== 'expired'}
                    onTriggerUpgrade={() => setIsLicensingModalOpen(true)}
                  />
                ) : activeTab === 'stateKeeper' ? (
                  <StateKeeperPanel
                    contract={contract}
                    files={files}
                    auditResults={auditResults}
                    onRestore={(restoredContract, restoredFiles) => {
                      setContract(restoredContract);
                      setFiles(restoredFiles);
                    }}
                    t={t}
                    lang={lang}
                    isPremium={premiumStatus !== 'expired'}
                    onTriggerUpgrade={() => setIsLicensingModalOpen(true)}
                  />
                ) : activeTab === 'commercial' ? (
                  <CommercialDashboard t={t} lang={lang} />
                ) : (
                  <ContractEditor contract={contract} onChange={setContract} t={t} lang={lang} />
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Global Footer Notes block */}
        <footer className="pt-10 pb-6 border-t border-slate-200 text-center text-xs text-slate-400 space-y-2 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-1 text-slate-500 font-medium">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>{t.footerHeading}</span>
          </div>
          <p className="leading-relaxed">
            {t.footerDesc}
          </p>
        </footer>

        {/* Dynamic Sandbox Modal */}
        {isLicensingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs font-sans">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5 text-slate-200">
              <button
                type="button"
                onClick={() => setIsLicensingModalOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5 pt-1">
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-400/20 text-indigo-450 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight animate-pulse">
                  {lang.includes('zh') ? '💎 商业变现与订阅隔离沙盒' : '💎 Pro Monetization & Licensing Sandbox'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang.includes('zh') 
                    ? '在此体验探针产品在“订阅过期锁定”与“高级试用激活”等不同商用阶段的隔离状态形态。设置此隔离以便直接上传并赚取被动收入。' 
                    : 'Configure trial limits and simulation states here to preview how different billing/licensing levels isolate pro features.'}
                </p>
              </div>

              {/* Status Simulator Cards */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  {lang.includes('zh') ? '切换用户模拟状态' : 'Toggle User Simulation State'}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPremiumStatus('trial');
                      setTrialDaysLeft(3);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition duration-155 ease-in-out ${
                      premiumStatus === 'trial'
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold font-sans">
                        {lang.includes('zh') ? '1. 3天限时高级试用中 (免费)' : '1. 3-Day Premium Trial (Active)'}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        {lang.includes('zh') ? '新注册用户默认开启 3 天免费高级无损物理分拆重构与守护锁。' : 'Initial registration look. Unlocks core splitter & active guardians.'}
                      </p>
                    </div>
                    {premiumStatus === 'trial' && <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-md shadow-indigo-500" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPremiumStatus('expired');
                      setTrialDaysLeft(0);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition duration-155 ease-in-out ${
                      premiumStatus === 'expired'
                        ? 'bg-rose-950/60 border-rose-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold font-sans">
                        {lang.includes('zh') ? '2. 试用期结束 (触发付费升级)' : '2. Trial Expired (Lock Premium Features)'}
                      </h4>
                      <p className="text-[10px] text-slate-450 mt-1 leading-snug">
                        {lang.includes('zh') ? '模拟3天到期后形态。锁定 AST 自动拆分流程、防退化实时回滚狗。' : 'Locks AI modular restructurer steps and automated guard dogs.'}
                      </p>
                    </div>
                    {premiumStatus === 'expired' && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-500 animate-pulse" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPremiumStatus('premium');
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition duration-155 ease-in-out ${
                      premiumStatus === 'premium'
                        ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold font-sans">
                        {lang.includes('zh') ? '3. 享有正版授权 / 订阅激活 👑' : '3. Pro Subscription / License Activated 👑'}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        {lang.includes('zh') ? '通过秘钥或者在正式完成订阅购买后的全功能持续保障模式。' : 'Completed subscriber state. Permanent active status.'}
                      </p>
                    </div>
                    {premiumStatus === 'premium' && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-500" />}
                  </button>
                </div>
              </div>

              {/* Enter License Key form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleActivateLicense(licenseKeyInput);
                }}
                className="space-y-2 pt-2.5 border-t border-slate-800"
              >
                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wide font-mono block">
                  {lang.includes('zh') ? '企业授权验证 (PRO License Key)' : 'Enterprise Activation License Key'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={licenseKeyInput}
                    onChange={(e) => {
                      setLicenseKeyInput(e.target.value);
                      setLicenseInputError('');
                    }}
                    placeholder="e.g. PRO-AST-GUARD-2026"
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 grow"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-650 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-lg px-3.5 py-2 text-xs transition duration-150 cursor-pointer whitespace-nowrap"
                  >
                    {lang.includes('zh') ? '验证' : 'Activate'}
                  </button>
                </div>

                {licenseInputError && (
                  <p className="text-[10.5px] font-bold text-red-400 font-sans">{licenseInputError}</p>
                )}
                {licenseActiveSuccess && (
                  <p className="text-[10.5px] font-bold text-emerald-400 font-sans">
                    🎉 {lang.includes('zh') ? '正版授权激活成功！高级重构引擎及回退守护为您长期解锁。' : 'Enterprise license validated successfully! Enterprise access enabled.'}
                  </p>
                )}

                <div className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-[10px] text-slate-500 font-mono leading-relaxed">
                  💡 {lang.includes('zh') ? '测试激活密钥: ' : 'Sandbox Testing Key: '}
                  <span className="text-indigo-400 font-bold select-all bg-indigo-950/40 px-1 py-0.5 rounded">
                    PRO-AST-GUARD-2026
                  </span>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
