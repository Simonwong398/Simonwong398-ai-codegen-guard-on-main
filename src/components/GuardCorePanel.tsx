import React, { useMemo, useState } from 'react';
import { ArchitectureContract, VirtualFile, AuditResults } from '../types/architecture';
import { findModuleForPath } from '../utils/auditor';
import { Scissors, LayoutList, Terminal, Check, Copy, Lock } from 'lucide-react';
import { TranslationSet } from '../types/translations';

interface GuardCorePanelProps {
  contract: ArchitectureContract;
  files: VirtualFile[];
  auditResults: AuditResults;
  onSelectFile: (filePath: string) => void;
  onApplyRefactor?: (proposedFiles: Array<{path: string; codeTemplate: string; type?: string; purpose?: string}>, originalPath: string) => void;
  t: TranslationSet;
  lang: string;
  isPremium?: boolean;
  onTriggerUpgrade?: () => void;
}

export const GuardCorePanel: React.FC<GuardCorePanelProps> = ({
  contract,
  files,
  onSelectFile,
  onApplyRefactor,
  lang,
  isPremium = true,
  onTriggerUpgrade,
}) => {
  const [selectedFileForSplit, setSelectedFileForSplit] = useState<string>(
    files[2]?.path || files[0]?.path || ''
  );
  const [copiedInstruction, setCopiedInstruction] = useState(false);

  const isZh = lang.includes('zh');
  const ui = {
    probeTitle: isZh ? '2.1 单文件行数探针' : '2.1 File Line-Count Warden',
    probeSub: isZh ? '实时审计全仓代码物理体量' : 'Real-time volume audit of project files',
    unassigned: isZh ? '无归属外部文件' : 'External file (no module)',
    lineUnit: isZh ? ' 行' : ' lines',
    viewArrow: isZh ? '点击查看 ➔' : 'Click to inspect ➔',
    genTitle: isZh ? '2.3 AST 无损拆分重构指令发生器' : '2.3 AST Lossless Splitting Instruction Generator',
    genSub: isZh ? '一键将庞大粘稠代码物理剥离为松耦合单元' : 'Isolate heavy monolithic codebases into modular units with ease',
    detectedExports: isZh ? '被检测方法/导出' : 'Detected Features / Exports',
    unitsCount: isZh ? ' 个' : ' units',
    exceededLimit: isZh ? '是否超过容纳契约?' : 'Exceeded Contract Threshold?',
    exceededAlert: isZh ? '⚠️ 严重爆仓' : '⚠️ Over Limit Threshold',
    healthOk: isZh ? '✅ 处于安全容量' : '✅ Within Safety Limits',
    recCount: isZh ? '重构推荐文件数' : 'Recommended Split Outlets',
    outletsUnit: isZh ? ' 处' : ' files',
    executionManual: isZh ? '🧱 重构演进工序清单 (Execution Manual)' : '🧱 Refactoring Evolution Milestones (Execution Manual)',
    finalTopology: isZh ? '📁 转换映射终态结构 (Final Topology Nodes)' : '📁 Transition Mapping Structure (Final Topology Nodes)',
    exportedFeatures: isZh ? '导出的方法与变量' : 'Exported Methods & Variables',
    noProposal: isZh ? '暂时无法获取文件的重构契约，请检查虚拟文件是否存在。' : 'Unable to query refactoring properties. Check file structure.',
    copiedTips: isZh ? '已复制拆分操作规程' : 'Copied refactoring procedure',
    copyTipsBtn: isZh ? '复制 AST 重构规程' : 'Copy AST Refactoring Steps',
    applyBtn: isZh ? '⚡ 一键无损拆分并应用在沙盒' : '⚡ Split & Apply in Sandbox Live',
  };

  const fileStats = useMemo(() => {
    return files.map((file) => {
      const lines = file.content.split('\n');
      const matchedModule = findModuleForPath(file.path, contract.modules);
      const limit = matchedModule?.maxLines ?? contract.globalRules.maxLinesPerFile;
      const pct = Math.min(100, Math.round((lines.length / limit) * 100));
      return {
        path: file.path,
        lineCount: lines.length,
        limit,
        percentage: pct,
        status: lines.length > limit ? 'danger' : lines.length > limit * 0.8 ? 'warning' : 'healthy',
        moduleName: matchedModule?.name || ui.unassigned,
      };
    });
  }, [files, contract, ui.unassigned]);

  // Generates smart refactoring recommendations for "Lossless Splitting"
  const splittingProposal = useMemo(() => {
    const targetFile = files.find((f) => f.path === selectedFileForSplit);
    if (!targetFile) return null;

    const lines = targetFile.content.split('\n');
    const exports = lines
      .map((line, idx) => {
        const funcMatch = line.match(/(?:export\s+const\s+(\w+)|export\s+async\s+function\s+(\w+)|export\s+function\s+(\w+)|export\s+class\s+(\w+)|export\s+interface\s+(\w+))/);
        if (funcMatch) {
          return {
            name: funcMatch[1] || funcMatch[2] || funcMatch[3] || funcMatch[4] || funcMatch[5],
            type: line.includes('interface')
              ? 'Interface'
              : line.includes('class')
              ? 'Class'
              : 'Function/Constant',
            line: idx + 1,
          };
        }
        return null;
      })
      .filter((e): e is { name: string; type: string; line: number } => e !== null);

    const isExceeded = lines.length > (findModuleForPath(targetFile.path, contract.modules)?.maxLines ?? contract.globalRules.maxLinesPerFile);

    // Formulate a structured lossless split strategy plan integrating Rigid Rules + Elastic State Naming
    const basePath = targetFile.path.replace(/\.[^/.]+$/, '');
    const dir = targetFile.path.substring(0, targetFile.path.lastIndexOf('/'));
    const baseName = targetFile.path.split('/').pop()?.split('.')[0] || 'module';

    const fp = contract.globalRules.frameworkFingerprint || {
      preset: "React-Vite (TSX 模式)",
      extension: "tsx",
      componentNamingConvention: "PascalCase"
    };

    const toPatternStyle = (str: string, style: 'PascalCase' | 'kebab-case' | 'CamelCase') => {
      const clean = str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      const parts = clean.split(/[-_]+/).filter(Boolean);
      if (parts.length === 0) return str;
      if (style === 'PascalCase') {
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
      } else if (style === 'kebab-case') {
        return parts.join('-');
      } else {
        return parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
      }
    };

    const formattedComponentName = toPatternStyle(baseName, fp.componentNamingConvention);
    const componentFilename = `${formattedComponentName}.${fp.extension}`;
    const componentPath = `${dir}/${componentFilename}`;

    const interfaces = exports.filter((e) => e.type === 'Interface');
    const utilities = exports.filter((e) => e.type !== 'Interface' && e.name.toLowerCase().includes('hash') || e.name.toLowerCase().includes('math') || e.name.toLowerCase().includes('average') || e.name.toLowerCase().includes('health'));
    const coreElements = exports.filter((e) => !interfaces.includes(e) && !utilities.includes(e));

    const proposedFiles = [
      {
        path: `${basePath}.types.ts`, // Rigid base rules
        type: isZh ? 'Types (刚性底物)' : 'Types (Rigid Substrate)',
        purpose: isZh ? '刚性约束：隔离通用抽象模型与类型定义 (.types.ts)' : 'Rigid constraint: isolate shared abstract models & type contracts (.types.ts)',
        exports: interfaces.map((i) => i.name),
        codeTemplate: `// Types library for ${baseName}\n` + interfaces.map(i => `export interface ${i.name} {\n  // Isolated couplers...\n}`).join('\n\n')
      },
      {
        path: `${basePath}.utils.ts`, // Rigid base rules
        type: isZh ? 'Utils (刚性工具)' : 'Utils (Rigid Helpers)',
        purpose: isZh ? '刚性约束：集中无状态纯算法与泛型工具集 (.utils.ts)' : 'Rigid constraint: aggregate stateless pure logic & helper algorithms (.utils.ts)',
        exports: utilities.map((u) => u.name),
        codeTemplate: `// Pure utilities extracted from ${baseName}\n` + utilities.map(u => `export function ${u.name}() {\n  // Extracted helper logic...\n}`).join('\n\n')
      },
      {
        path: componentPath, // Elastic Framework sensing rules
        type: isZh ? `View SFC (弹性 ${fp.preset})` : `View SFC (Elastic ${fp.preset})`,
        purpose: isZh ? `多态兼容：智能响应视图组件结构规则，使用 ${fp.componentNamingConvention} 框架后缀封装` : `Polymorphic adaptation: intuitively responsive view structures aligned to ${fp.componentNamingConvention} style matching`,
        exports: coreElements.map((c) => c.name),
        codeTemplate: `// Dynamic presentation-only view responding to preset: ${fp.preset}\nimport { ${interfaces.map(i => i.name).join(', ')} } from './${baseName}.types';\nimport { ${utilities.map(u => u.name).join(', ')} } from './${baseName}.utils';\n\n` + coreElements.map(c => `export function ${c.name}() {\n  // View rendering...\n}`).join('\n\n')
      }
    ].filter((f) => f.exports.length > 0 || f.path === componentPath);

    return {
      filePath: targetFile.path,
      lineCount: lines.length,
      isExceeded,
      exportsDetected: exports,
      proposedFiles,
      executionSteps: isZh ? [
        `第一步：在目录 \`${dir}\` 内创建具有弹性指纹格式的 \`${componentFilename}\` 文件，并创建刚性底层 \`${baseName}.types.ts\`。`,
        `第二步：执行 “AST Lossless Splitting” 剥离。复制转移所有的契约类型和无状态纯工具，实现逻辑 0 杂糅隔离。`,
        `第三步：在核心入口引入动态抽离产生的依赖元素，让单体代码轻量回归在 ${contract.globalRules.maxLinesPerFile} 行黄金警界线以下。`,
      ] : [
        `Step 1: Create \`${componentFilename}\` featuring elastic fingerprints structure in the \`${dir}\` directory, and instantiate a rigid \`${baseName}.types.ts\` module.`,
        `Step 2: Trigger lossless 'AST Lossless Splitting'. Extract and isolate all type schemas and stateless utilities away from view components.`,
        `Step 3: Include the dynamically generated abstractions or utilities inside the primary file, driving volume below the optimal limit of ${contract.globalRules.maxLinesPerFile} lines.`,
      ],
    };
  }, [selectedFileForSplit, files, contract, isZh]);

  const copyProposedRefactor = () => {
    if (!splittingProposal) return;
    const recipeText = `// ==========================================\n` +
      `// PROJECTGUARD AI - LOSSLESS SPLITTING PLAN\n` +
      `// Target Module File: ${splittingProposal.filePath}\n` +
      `// Current Volume: ${splittingProposal.lineCount} Lines\n` +
      `// ==========================================\n\n` +
      `[Refactoring Flow]\n` +
      splittingProposal.executionSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n') + `\n\n` +
      `[Code Boundary Splits]\n` +
      splittingProposal.proposedFiles.map(f => `📁 FILE: ${f.path}\nPurpose: ${f.purpose}\nFunctions: ${f.exports.join(', ') || 'N/A'}\n`).join('\n');

    navigator.clipboard.writeText(recipeText);
    setCopiedInstruction(true);
    setTimeout(() => setCopiedInstruction(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 2.1 File Line-Count Warden (Lint Guard Grid) */}
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <LayoutList className="w-4.5 h-4.5 text-indigo-600" />
          <div>
            <h3 className="font-semibold text-slate-800 text-sm font-sans">{ui.probeTitle}</h3>
            <p className="text-[11px] text-slate-400">{ui.probeSub}</p>
          </div>
        </div>

        <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
          {fileStats.map((stat) => (
            <div
              key={stat.path}
              onClick={() => onSelectFile(stat.path)}
              className="p-3 bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-lg cursor-pointer transition-all duration-150 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-1.5 z-10 relative">
                <span className="font-mono text-xs font-semibold text-slate-700 truncate max-w-[160px]">
                  {stat.path.split('/').pop()}
                </span>
                <span className={`font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  stat.status === 'danger'
                    ? 'bg-red-50 text-red-600 border border-red-150'
                    : stat.status === 'warning'
                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {stat.lineCount} / {stat.limit}{ui.lineUnit}
                </span>
              </div>

              {/* Progress volume indicator */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    stat.status === 'danger'
                      ? 'bg-red-500'
                      : stat.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
                <span>{stat.moduleName}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 font-bold">
                  {ui.viewArrow}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2.2 & 2.3 Lossless Splitting Interactive Generator */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-slate-800 text-sm font-sans">{ui.genTitle}</h3>
                <p className="text-[11px] text-slate-400">{ui.genSub}</p>
              </div>
            </div>

            {/* Target selector */}
            {isPremium && (
              <select
                value={selectedFileForSplit}
                onChange={(e) => setSelectedFileForSplit(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-700 outline-none cursor-pointer"
              >
                {files.map((f) => (
                  <option key={f.path} value={f.path}>
                    {f.path.split('/').pop()}
                  </option>
                ))}
              </select>
            )}
          </div>

          {!isPremium ? (
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-850 text-center space-y-4 shadow-xl relative overflow-hidden my-1">
              <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              <div className="w-12 h-12 bg-indigo-500/15 border border-indigo-400/30 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5 text-amber-500 font-bold" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm font-sans tracking-tight text-neutral-100">
                  {isZh ? '🔐 3天高级试用期已结束 - 请激活专业版 & 体验授权' : '🔐 3-Day Premium Trial Ended - Upgrade/Activate Pro'}
                </h4>
                <p className="text-[11px] text-slate-300 max-w-sm mx-auto leading-relaxed">
                  {isZh 
                    ? '一键 AST 无损分离、物理分仓代码推荐、以及容器逆熵回滚哨齿等自动化机制专属于 ProjectGuard AI 专业版。' 
                    : 'Interactive lossless AST file restructuring recommendations and custom code-splitting playbooks require a Premium License.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center pt-2">
                <button
                  type="button"
                  onClick={onTriggerUpgrade}
                  className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-md duration-150 w-full sm:w-auto"
                >
                  {isZh ? '💎 试用与配置激活授权' : '💎 Trial Status & License Activation'}
                </button>
                <button
                  type="button"
                  onClick={() => window.open('https://ai.studio/build', '_blank')}
                  className="px-3.5 py-1.5 border border-slate-705 hover:bg-slate-800 text-slate-300 rounded-lg text-xs transition duration-150 cursor-pointer w-full sm:w-auto"
                >
                  {isZh ? '了解应用上架设置' : 'Learn Store Settings'}
                </button>
              </div>
            </div>
          ) : splittingProposal ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Meta Summary widget card */}
                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-400 font-mono block">
                    {ui.detectedExports}
                  </span>
                  <span className="text-xl font-bold font-mono text-indigo-950">
                    {splittingProposal.exportsDetected.length}{ui.unitsCount}
                  </span>
                </div>

                <div className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-rose-500 font-mono block">
                    {ui.exceededLimit}
                  </span>
                  <span className={`text-sm font-extrabold ${splittingProposal.isExceeded ? 'text-red-650' : 'text-emerald-600'}`}>
                    {splittingProposal.isExceeded ? ui.exceededAlert : ui.healthOk}
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-500 font-mono block">
                    {ui.recCount}
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-950">
                    {splittingProposal.proposedFiles.length}{ui.outletsUnit}
                  </span>
                </div>

              </div>

              {/* Splitting steps plan outline */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">
                  {ui.executionManual}
                </p>
                <div className="space-y-2">
                  {splittingProposal.executionSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start p-2.5 bg-slate-50 rounded-lg border border-slate-150">
                      <span className="w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold text-white bg-slate-900 rounded-full shrink-0">
                        0{idx + 1}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refactored virtual split boundaries preview */}
              <div className="space-y-2.5 pt-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide font-mono">
                  {ui.finalTopology}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {splittingProposal.proposedFiles.map((file) => (
                    <div
                      key={file.path}
                      className="p-3 border border-slate-205 rounded-xl bg-white space-y-1.5 hover:shadow-xs duration-150"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-mono text-[10px] text-slate-700 font-bold truncate">
                          {file.path.split('/').pop()}
                        </span>
                        <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[8px] text-indigo-600 font-mono uppercase font-extrabold rounded">
                          {(file as any).type || 'NODE'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{file.purpose}</p>
                      
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[9px] uppercase font-bold tracking-wide text-slate-400 font-mono block mb-1">
                          {ui.exportedFeatures}
                        </span>
                        <div className="flex flex-wrap gap-1 min-h-[22px]">
                          {file.exports.length === 0 ? (
                            <span className="text-[10px] text-slate-300 italic font-mono">N/A</span>
                          ) : (
                            file.exports.map((exp) => (
                              <span
                                key={exp}
                                className="text-[9px] font-mono font-semibold px-1 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100"
                              >
                                {exp}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
              {ui.noProposal}
            </div>
          )}
        </div>

        {/* Action controllers footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {isPremium ? (
            <>
              <button
                type="button"
                onClick={copyProposedRefactor}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                {copiedInstruction ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedInstruction ? ui.copiedTips : ui.copyTipsBtn}
              </button>
              {onApplyRefactor && splittingProposal && (
                <button
                  type="button"
                  onClick={() => onApplyRefactor(splittingProposal.proposedFiles, selectedFileForSplit)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  {ui.applyBtn}
                </button>
              )}
            </>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-full text-center font-medium">
              ⚠️ {isZh ? '高级模块已锁定。请点击上方按钮输入订阅授权密码。' : 'Premium modules locked. Click key button to configure trial or activate.'}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
