import React, { useState, useEffect, useMemo } from 'react';
import { ArchitectureContract, VirtualFile, AuditResults } from '../types/architecture';
import { History, Download, RefreshCw, Sparkles, Copy, Check, Lock } from 'lucide-react';
import { TranslationSet } from '../types/translations';

interface StateKeeperPanelProps {
  contract: ArchitectureContract;
  files: VirtualFile[];
  auditResults: AuditResults;
  onRestore: (contract: ArchitectureContract, files: VirtualFile[]) => void;
  t: TranslationSet;
  lang: string;
  isPremium?: boolean;
  onTriggerUpgrade?: () => void;
}

export interface SystemLogEntry {
  timestamp: string;
  type: 'info' | 'warn' | 'rollback' | 'snapshot';
  event: string;
  details: string;
}

export const StateKeeperPanel: React.FC<StateKeeperPanelProps> = ({
  contract,
  files,
  auditResults,
  onRestore,
  lang,
  isPremium = true,
  onTriggerUpgrade,
}) => {
  const [snapshot, setSnapshot] = useState<{ contract: ArchitectureContract; files: VirtualFile[] } | null>(null);
  const [autoRollback, setAutoRollback] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const isZh = lang.includes('zh');
  const ui = useMemo(() => {
    return {
      column1Title: isZh ? '3.1 & 3.2 偏离自动回滚与流式日志' : '3.1 & 3.2 Active Anti-Entropy & Streaming Logs',
      column1Sub: isZh ? '实时监听项目状态，拒绝任何单体代码粘稠退化' : 'Monitor live project files to defend against monolithic decay',
      exportLog: isZh ? '导出 LOG.md' : 'Export LOG.md',
      rollbackGuardTitle: isZh ? '自动回退守护机制 (Anti-Entropy Rollback)' : 'Anti-Entropy Automated Rollback',
      rollbackGuardSub: isZh ? '一旦源码产生不合规或导入越权，自动无损回滚至最近正常版本' : 'Triggers instantaneous lossless rollback to last healthy checkpoint upon rule violation',
      protectionActive: isZh ? '🔴 触发防护开启' : '🔴 Protection Enabled',
      protectionPaused: isZh ? '⚪ 防护已暂停' : '⚪ Protection Suspended',
      snapshotLibStatus: isZh ? '快照库状态:' : 'Snapshot Library Status:',
      snapshotExists: isZh ? '📸 健全备份存在 (250B)' : '📸 Secure backup stored (250B)',
      snapshotEmpty: isZh ? '⚠️ 尚未建立任何架构安全快照' : '⚠️ No architectural snapshot saved yet',
      storeStatusBtn: isZh ? '存储当前合规状态' : 'Store Current Healthy State',
      streamingLogsTitle: isZh ? '📜 实时系统行为流水踪迹 (System Streaming Logs)' : '📜 System Streaming & Anti-Entropy Activity Logs',
      
      logInitEvent: isZh ? '初始化 SystemGuard Core守护态' : 'Initialize SystemGuard Core',
      logInitDetails: isZh ? '系统静态导入分析程序链启动就绪。' : 'System static imports parser successfully initialized.',
      logRollbackEvent: isZh ? '🛡️ 触发架构偏离自动回滚' : '🛡️ Trigger Anti-Entropy Rollback',
      logRollbackDetails: isZh ? '检测到非合规的依赖或爆仓！为了防止系统架构退化(Entropy)，自动恢复至最近健康的 100% 合规快照状态。' : 'Violation intercepted! Reverting codebase cleanly to last compliant snapshot to preserve architecture integrity.',
      logCheckPassEvent: isZh ? '✅ 增量检查通过' : '✅ Incremental Audit Passed',
      logCheckPassDetails: (count: number) => isZh ? `所有条件合规通过。当前项目含有 ${count} 个文件。` : `All modules compliant in sandboxed container. Auditing ${count} assets.`,
      logViolationEvent: isZh ? '⚠️ 架构违规警报' : '⚠️ Architectural Boundary Violation',
      logViolationDetails: (count: number) => isZh ? `检测到不合规缺陷！严重耦合与超标处：${count}个。` : `Unlawful imports or overflow detected! Active violation count: ${count}`,
      logStoredEvent: isZh ? '💾 已存储当前合规快照' : '💾 Architectural Snapshot Saved',
      logStoredDetails: isZh ? '快照已封存归档，并与本地回滚拦截阀门挂钩。' : 'Sandbox backup recorded and bound successfully to anti-entropy valve.',

      column2Title: isZh ? '3.3 AI 上下文前置强制注入器' : '3.3 AI Developer System Instructions Injector',
      column2Sub: isZh ? '将架构规则以系统 Prompt 形式前置挂载，保障 AI 不越轨' : 'Frame developer rules into an authoritative system prompt to guide LLM codegen loop',
      column2Desc: isZh ? 'AI 经常会在多轮交互中忘记约定的开发规范与行数限制。通过生成携带物理级 AST 约束的系统上下文，可在与下游生成器交互前强制注入：' : 'LLMs often experience drift or forget structural limits during long chat threads. Pre-injecting physical AST constraints locks the attention window to ensure absolute compliance:',
      copyPromptBtn: isZh ? '复制架构约束 Prompt 文本' : 'Copy System Instructions Prompt',
      copiedPromptBtn: isZh ? '已复制注入指令' : 'Copied prompt instructions',
    };
  }, [isZh]);

  const [logs, setLogs] = useState<SystemLogEntry[]>([]);

  // Initialize first log safely
  useEffect(() => {
    setLogs([
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'info',
        event: ui.logInitEvent,
        details: ui.logInitDetails,
      }
    ]);
  }, [ui.logInitEvent, ui.logInitDetails]);

  // Auto-rollback simulation & incremental logger
  useEffect(() => {
    if (logs.length === 0) return; // Wait for initial log
    if (!auditResults.passed && autoRollback && snapshot) {
      // Trigger instant anti-entropy recovery
      onRestore(
        JSON.parse(JSON.stringify(snapshot.contract)),
        JSON.parse(JSON.stringify(snapshot.files))
      );
      
      const newLog: SystemLogEntry = {
        timestamp: new Date().toISOString(),
        type: 'rollback',
        event: ui.logRollbackEvent,
        details: ui.logRollbackDetails,
      };
      setLogs((prev) => [newLog, ...prev]);
    } else {
      // Regular state logs
      const isOk = auditResults.passed;
      const desc = isOk 
        ? ui.logCheckPassDetails(auditResults.metrics.totalFiles)
        : ui.logViolationDetails(auditResults.issues.length);
        
      const newLog: SystemLogEntry = {
        timestamp: new Date().toISOString(),
        type: isOk ? 'info' : 'warn',
        event: isOk ? ui.logCheckPassEvent : ui.logViolationEvent,
        details: desc,
      };

      // Simple debounce/deduplicate log lines
      setLogs((prev) => {
        if (prev[0] && prev[0].event === newLog.event && prev[0].type === newLog.type) {
          return prev;
        }
        return [newLog, ...prev.slice(0, 19)]; // retain top 20 lines
      });
    }
  }, [auditResults, autoRollback, snapshot, onRestore, ui]);

  const createSnapshot = () => {
    setSnapshot({
      contract: JSON.parse(JSON.stringify(contract)),
      files: JSON.parse(JSON.stringify(files)),
    });
    const newLog: SystemLogEntry = {
      timestamp: new Date().toISOString(),
      type: 'snapshot',
      event: ui.logStoredEvent,
      details: ui.logStoredDetails,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const copyPromptContext = () => {
    const fp = contract.globalRules.frameworkFingerprint || {
      preset: "React-Vite (TSX 模式)",
      extension: "tsx",
      componentNamingConvention: "PascalCase"
    };

    const formattedPrompt = `# SYSTEM PROMPT: THE ARCHITECT GUARDIAN (CORE INTERCEPTOR)
# STATUS: ACTIVE | MODE: ANTI-ENTROPY Enforcement
# TARGET STACK PRESET: ${fp.preset} (Component suffix: .${fp.extension})

## 0. IDENTITY & AUTHORITY
You are not just a code generator. You are an executing agent strictly subordinate to "ProjectGuard AI: The Chief Architect". You operate under an absolute zero-trust framework regarding code health. Your code is evaluated by a hard AST parser and lines counter after every response. If you fail, the system will ROLLBACK your changes, erasing your history.

## 1. THE SUPREME LAWS (铁律)
You must read the architecture constraints before writing a single character. 
1. **[LINE_LIMIT]**: No physical file shall ever exceed **${contract.globalRules.maxLinesPerFile} lines** of code. 
2. **[DECOUPLING]**: Pure logic (Functions, Custom Hooks, State Managers) must be physically isolated from UI Layout (SFC components). Mixing them in one file is an architectural felony.
3. **[DEPENDENCY]**: Strict unidirectional flow. Here are the allowed module coupling rules block:
${contract.modules.map(m => `  * [${m.id}]: Can ONLY import from [${m.allowedDependencies.join(', ') || 'NONE'}]`).join('\n')}

## 2. INTERCEPTION TRIGGER: LOSSLESS SPLITTING (无损拆分工序)
When the user asks you to implement a feature that would push the current file over ${contract.globalRules.maxLinesPerFile} lines, or when you detect mixed responsibilities, YOU ARE FORBIDDEN from writing the unified code. Instead, you MUST immediately halt and perform **Lossless Splitting**.

You must respond to the user using the following strict structural payload:

### 🚫 ARCHITECTURE VIOLATION INTERCEPTED!
* **Reason**: [State explicitly: e.g., File App.${fp.extension} reached 287 lines / Unauthorized import of API]
* **Action**: Rollback prevented. Initiating Lossless Splitting Protocol.

### 🧱 COMPONENT BREAKDOWN SCHEME (重构映射矩阵)
List the exact file targets you are cutting the code into:
1. \`src/[module]/[Domain].types.ts\` — Pure TypeScript contracts/interfaces (Rigid base rules).
2. \`src/[module]/[Domain].utils.ts\` — Stateless pure helper functions (Rigid base rules).
3. \`src/[module]/[Domain].${fp.extension}\` — Presentation-only component following ${fp.componentNamingConvention} style (Elastic stack matching).

### 🛠️ EXECUTION SPECIFICATION (重构伪代码规程)
Provide the separate file code blocks inside standard typescript markdown code markers.

### 3. ANTI-ENTROPY ALIGNMENT POST-SCRIPT
After outputting the files, you must output the exact lines to be appended to PROJECT_LOG.md under the format:
[SYNC] Mode: Split | Target: [Domain] | Component Health: 100% 合规
Failure to output this exact sync token will result in automated system rejection.`;

    navigator.clipboard.writeText(formattedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const downloadLogMarkdown = () => {
    const markdownContent = `# PROJECT_LOG.md (Architecture Anti-Entropy Synchronization)\n\n` +
      `Generated at: ${new Date().toISOString()}\n\n` +
      `| Timestamp | Event | Level | Message |\n` +
      `|---|---|---|---|\n` +
      logs.map(l => `| ${l.timestamp} | ${l.event} | ${l.type.toUpperCase()} | ${l.details} |`).join('\n') +
      `\n\n*Created via ProjectGuard AI Watcher*`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PROJECT_LOG.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Col 1: Rollback Dashboard & System Logs */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-slate-800 text-sm font-sans">{ui.column1Title}</h3>
              <p className="text-[11px] text-slate-400">{ui.column1Sub}</p>
            </div>
          </div>
          <button
            onClick={downloadLogMarkdown}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            {ui.exportLog}
          </button>
        </div>

        {/* Snapshot and Switch Controls */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          {!isPremium && (
            <div className="p-3 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl border border-indigo-900/30 text-white flex items-center justify-between text-xs my-1 shadow-sm">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
                <span className="text-[10.5px] text-slate-200">
                  {isZh 
                    ? '3天高级试用期结束，高级自动回滚守护已挂挂。' 
                    : 'Premium trial ended. Automated rollbacks are paused.'}
                </span>
              </div>
              <button
                type="button"
                onClick={onTriggerUpgrade}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 whitespace-nowrap"
              >
                {isZh ? '激活极速 💎' : 'Activate 💎'}
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-700">{ui.rollbackGuardTitle}</span>
              <p className="text-[11px] text-slate-400">{ui.rollbackGuardSub}</p>
            </div>
            
            <button
              onClick={!isPremium ? onTriggerUpgrade : () => setAutoRollback(!autoRollback)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                !isPremium
                  ? 'bg-slate-800 text-slate-400 border border-slate-700'
                  : autoRollback 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
              {autoRollback ? ui.protectionActive : ui.protectionPaused}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              {ui.snapshotLibStatus} {snapshot ? ui.snapshotExists : ui.snapshotEmpty}
            </div>
            
            <button
              onClick={!isPremium ? onTriggerUpgrade : createSnapshot}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                !isPremium
                  ? 'bg-slate-800 text-slate-400 border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isPremium ? <RefreshCw className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 text-amber-400" />}
              {ui.storeStatusBtn}
            </button>
          </div>
        </div>

        {/* Render Stream Logs */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">
            {ui.streamingLogsTitle}
          </span>
          <div className="bg-slate-900 border border-slate-950 rounded-xl p-4 font-mono text-[11px] text-slate-300 space-y-2.5 max-h-48 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2.5 hover:text-white leading-normal border-b border-slate-850/35 pb-1.5">
                <span className="text-slate-500 shrink-0">[{log.timestamp.split('T')[1].substring(0, 8)}]</span>
                <span className={`font-bold shrink-0 ${
                  log.type === 'rollback'
                    ? 'text-red-400'
                    : log.type === 'warn'
                    ? 'text-amber-400'
                    : log.type === 'snapshot'
                    ? 'text-emerald-400'
                    : 'text-indigo-400'
                }`}>
                  {log.event}
                </span>
                <span className="text-slate-400">{log.details}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Col 2: Context Injector Generator */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-slate-800 text-sm font-sans">{ui.column2Title}</h3>
              <p className="text-[11px] text-slate-400">{ui.column2Sub}</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            {ui.column2Desc}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5 relative overflow-hidden">
            <span className="absolute top-0 right-0 px-2 py-0.5 bg-indigo-50 border-l border-b border-indigo-150 text-[9px] font-bold text-indigo-500 rounded-bl-lg font-mono">
              GENERATED CONTEXT
            </span>

            <div className="text-xs font-mono text-slate-700 leading-relaxed space-y-2 pt-2 select-all max-h-48 overflow-y-auto pr-1">
              <p className="font-bold text-indigo-950">[SYSTEM INSTRUCTIONS - ARCHITECTURE CONSTRAINT]</p>
              <p>1. Target Architecture Type: "<span className="underline font-bold text-slate-900">{contract.projectName}</span>".</p>
              <p>2. Maximum Lines Per Module File Check: <span className="underline font-semibold">{contract.globalRules.maxLinesPerFile} lines</span>.</p>
              <p>3. Allowed Inter-module Coupling Contracts:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-650">
                {contract.modules.map(m => (
                  <li key={m.id}>
                    Module <span className="font-bold text-slate-800">"{m.id}"</span> can ONLY import from components in: <span className="text-indigo-600">{m.allowedDependencies.join(', ') || 'N/A'}</span>.
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={copyPromptContext}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedPrompt ? ui.copiedPromptBtn : ui.copyPromptBtn}
          </button>
        </div>

      </div>

    </div>
  );
};
