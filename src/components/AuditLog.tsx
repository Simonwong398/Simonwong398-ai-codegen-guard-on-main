import React from 'react';
import { AuditResults, AuditIssue } from '../types/architecture';
import { ShieldCheck, ShieldAlert, AlertTriangle, Bug, HelpCircle, FileText, Share2, Sparkles } from 'lucide-react';
import { TranslationSet } from '../data/translations';

interface AuditLogProps {
  auditResults: AuditResults;
  onSelectFile?: (filePath: string) => void;
  onAutoFix?: () => void;
  t: TranslationSet;
}

export const AuditLog: React.FC<AuditLogProps> = ({ auditResults, onSelectFile, onAutoFix, t }) => {
  const { passed, issues, metrics } = auditResults;

  const score = Math.max(0, 100 - issues.reduce((acc, iss) => acc + (iss.severity === 'error' ? 15 : 5), 0));

  // Dynamic values depending on language structure
  const isChinese = t.appTitle.includes("Guard") && t.tabEditor.includes("源码");

  return (
    <div className="space-y-6">
      {/* Metrics Bento Grid Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Compliance Rating Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl border ${
            passed 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
              : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            {passed ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6 animate-bounce" />}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
              {t.scoreStatusTitle}
            </span>
            <h4 className="text-sm font-bold text-slate-800 font-sans truncate">
              {passed ? t.scoreStatusHealthy : t.scoreStatusWarning}
            </h4>
            <span className="text-xs text-slate-500">
              {isChinese ? `架构评分: ${score}分` : `Architecture Score: ${score}`}
            </span>
          </div>
        </div>

        {/* Dynamic Coupling Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-600 p-3 rounded-xl">
            <Share2 className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
              {isChinese ? '耦合系数' : 'Coupling Factor'}
            </span>
            <h4 className="text-lg font-bold text-slate-800 font-mono">
              {metrics.couplingIndex}%
            </h4>
            <span className="text-xs text-slate-500 block truncate">
              {isChinese ? '重叠越权系数越低越好' : 'Lower coupling ensures independence'}
            </span>
          </div>
        </div>

        {/* Circular Link Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl border ${
            metrics.cycleCount > 0 
              ? 'bg-red-50 border-red-200 text-red-600' 
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <Bug className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
              {t.contractAllowCycles}
            </span>
            <h4 className="text-lg font-bold text-slate-800 font-mono">
              {metrics.cycleCount} {isChinese ? '处循环' : 'Cycles'}
            </h4>
            <span className="text-xs text-slate-500 block truncate">
              {metrics.cycleCount > 0 
                ? (isChinese ? '🚫 存在底层循环依赖风险' : '🚫 Circular dependencies detected') 
                : (isChinese ? '🎉 依赖方向完全单向' : '🎉 Strict unidirectional flows')}
            </span>
          </div>
        </div>

        {/* Files analyzed Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-slate-50 border border-slate-200 text-slate-600 p-3 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
              {t.scoreMetricsFiles}
            </span>
            <h4 className="text-lg font-bold text-slate-800 font-sans">
              {metrics.totalFiles} {isChinese ? '个文件' : 'Files'}
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              {isChinese ? `共计 ${metrics.totalLines} 行` : `${metrics.totalLines} Total Lines`}
            </span>
          </div>
        </div>

      </div>

      {/* Issues list detail trace */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-semibold text-slate-800 text-sm">
              🛑 {t.scoreIssueCount} ({issues.length})
            </h3>
            <span className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
              {t.scoreIncrementalAst}
            </span>
          </div>
          {issues.length > 0 && onAutoFix && (
            <button
              onClick={onAutoFix}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-lg text-[11px] font-semibold cursor-pointer transition-all duration-150 shadow-sm"
              title={isChinese ? "一键重构、消除所有不合规和越权引用" : "One-click auto-refactor all violations"}
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-300 animate-pulse" />
              {t.scoreAutoFixBtn}
            </button>
          )}
        </div>

        {issues.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-500 stroke-1" />
            <p className="font-semibold text-slate-800 text-sm">{t.scoreNoViolation}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {issues.map((issue) => {
              const isError = issue.severity === 'error';
              return (
                <div
                  key={issue.id}
                  className="p-5 hover:bg-slate-50 transition-colors duration-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    {/* Tags line */}
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase font-mono border ${
                        isError
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-amber-50 border-amber-200 text-amber-600'
                      }`}>
                        {isError ? <ShieldAlert className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        {isError 
                          ? (isChinese ? 'ERROR (重度越权)' : 'FATAL VIOLATION') 
                          : (isChinese ? 'WARNING (警示不合规)' : 'WARNING BOUNDARY')}
                      </span>
                      
                      <span className="text-xs font-mono text-slate-400">
                        {issue.ruleId.toUpperCase()}
                      </span>
                    </div>

                    {/* File reference link */}
                    <button
                      onClick={() => onSelectFile && onSelectFile(issue.filePath)}
                      className="font-mono text-xs text-slate-500 hover:text-indigo-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isChinese ? '文件' : 'File'}: {issue.filePath}</span>
                      {issue.lineNumber && (
                        <span className="font-bold text-slate-800">
                          [{isChinese ? `第 ${issue.lineNumber} 行` : `Line ${issue.lineNumber}`}]
                        </span>
                      )}
                    </button>

                    {/* Problem message */}
                    <p className="text-sm text-slate-800 font-medium font-sans">
                      {issue.message}
                    </p>

                    {/* Offending code snippet render */}
                    {issue.offendingText && (
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 max-w-full overflow-x-auto text-xs font-mono text-slate-200 mt-2">
                        <span className="text-[10px] text-slate-500 block mb-1">
                          {isChinese ? '问题代码片段：' : 'Offending code line:'}
                        </span>
                        <code>{issue.offendingText}</code>
                      </div>
                    )}
                  </div>

                  {/* Architecture quick fix advisory */}
                  <div className="sm:w-60 bg-indigo-50/40 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 space-y-1.5">
                    <span className="flex items-center gap-1.5 font-bold font-sans text-indigo-950">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                      {isChinese ? '首席架构师忠告' : 'Chief Architect Advisory'}
                    </span>
                    <p className="text-indigo-950/80 leading-normal">
                      {issue.ruleId === 'import-boundary' && 
                        (isChinese 
                          ? '存在直接越权耦合！请考虑依赖抽象注入，或将交互操作下推层级。' 
                          : 'Forbidden dependency path! Abstract interface or reference via decoupled states.')}
                      {issue.ruleId === 'line-count' && 
                        (isChinese 
                          ? '文件规模偏大。请提取纯方法，或将 UI 分割拆解到单独视图层，实现无损物理拆分。' 
                          : 'File has grown bloated. Split presentation components out from core logical engines.')}
                      {issue.ruleId === 'forbidden-pattern' && 
                        (isChinese 
                          ? '检测到系统内禁止采用的指令操作。请改用标准安全的代替。' 
                          : 'Forbidden security patterns matched. Avoid using loose unsafe eval context.')}
                      {issue.ruleId === 'missing-test' && 
                        (isChinese 
                          ? '该核心隔离区未提供任何配套测试用例，不利于后期敏捷维护。' 
                          : 'Missing test suites. Add unit checking configurations for robust governance.')}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
