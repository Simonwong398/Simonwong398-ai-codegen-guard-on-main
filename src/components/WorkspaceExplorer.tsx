import React, { useState } from 'react';
import { VirtualFile } from '../types/architecture';
import { File, FolderOpen, Plus, Trash2, Code, ChevronRight, Activity, Flame, Shield, RefreshCw } from 'lucide-react';
import { TranslationSet } from '../types/translations';

interface WorkspaceExplorerProps {
  files: VirtualFile[];
  activeFile: VirtualFile | null;
  onSelectFile: (filePath: string) => void;
  onUpdateContent: (filePath: string, content: string) => void;
  onAddFile: (filePath: string, content?: string) => void;
  onDeleteFile: (filePath: string) => void;
  t: TranslationSet;
  lang: string;
  onSimulateDrift?: (type: 'coupling' | 'bloat' | 'pattern' | 'chaos' | 'clean') => void;
}

export const WorkspaceExplorer: React.FC<WorkspaceExplorerProps> = ({
  files,
  activeFile,
  onSelectFile,
  onUpdateContent,
  onAddFile,
  onDeleteFile,
  t,
  lang,
  onSimulateDrift,
}) => {
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const isChinese = lang.includes('zh');

  // Dynamic inline UI translations for WorkspaceExplorer specific labels
  const uiLocal = {
    cancel: isChinese ? "取消" : (lang === 'es' ? "Cancelar" : lang === 'fr' ? "Annuler" : lang === 'de' ? "Abbrechen" : lang === 'it' ? "Annulla" : lang === 'ja' ? "キャンセル" : lang === 'ko' ? "취소" : lang === 'pt' ? "Cancelar" : "Cancel"),
    confirm: isChinese ? "确定" : (lang === 'es' ? "Confirmar" : lang === 'fr' ? "Confirmer" : lang === 'de' ? "Bestätigen" : lang === 'it' ? "Conferma" : lang === 'ja' ? "確定" : lang === 'ko' ? "확인" : lang === 'pt' ? "Confirmar" : "Confirm"),
    linesSuffix: isChinese ? " 行代码" : (lang === 'es' ? " líneas de código" : lang === 'fr' ? " lignes de code" : lang === 'de' ? " Codezeilen" : lang === 'it' ? " righe di codice" : lang === 'ja' ? " 行のコード" : lang === 'ko' ? " 줄의 코드" : lang === 'pt' ? " linhas de código" : " lines of code"),
    compileStatus: isChinese ? "实时编译正常" : (lang === 'es' ? "Compilación correcta" : lang === 'fr' ? "Compilation OK" : lang === 'de' ? "Kompilierung OK" : lang === 'it' ? "Compilazione riuscita" : lang === 'ja' ? "コンパイル正常" : lang === 'ko' ? "컴파일 정상" : lang === 'pt' ? "Compilação bem-sucedida" : "Compile Ready"),
    emptyPrompt: isChinese ? "请在左侧侧栏中选择一个源码进行静态审查" : (lang === 'es' ? "Seleccione un archivo de código a la izquierda para inspeccionarlo" : lang === 'fr' ? "Sélectionnez un fichier à gauche pour l'inspecter" : lang === 'de' ? "Wählen Sie links eine Datei aus, um sie zu prüfen" : lang === 'it' ? "Seleziona un file a sinistra per ispezionarlo" : lang === 'ja' ? "左側のサイドバーからソースファイルを選択してください" : lang === 'ko' ? "검사할 소스 파일을 왼쪽에서 선택하십시오" : lang === 'pt' ? "Selecione um arquivo de código à esquerda para inspecionar" : "Please select a source file from the sidebar to inspect."),
    sandboxTip: isChinese ? "💡 依赖拦截测试: 写入非法导入即刻看到报错." : (lang === 'es' ? "💡 Prueba de bloqueo: agregue importaciones ilegales para ver el error." : lang === 'fr' ? "💡 Test d'interception : écrivez des imports illégaux pour voir l'erreur." : "💡 Dependency Sandbox: Add unauthorized imports to see real-time intercept blocks.")
  };

  // Group files inside visual hierarchy nodes
  const triggerAddFile = () => {
    if (!newFileName) return;
    const path = newFileName.startsWith('src/') ? newFileName : `src/${newFileName}`;
    onAddFile(path, `// Workspace Source for ${newFileName}\nimport { add } from './math';\n`);
    setNewFileName('');
    setIsCreating(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm text-slate-800 grid grid-cols-1 md:grid-cols-4 overflow-hidden min-h-[480px]">
      
      {/* File sidebar list controller */}
      <div className="md:col-span-1 bg-slate-50 border-r border-slate-250 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <FolderOpen className="w-4 h-4 text-slate-400" />
              {t.workbenchTitle}
            </span>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded cursor-pointer duration-100"
              title={t.btnAddFile}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isCreating && (
            <div className="mb-3.5 p-2 bg-white border border-indigo-100 rounded-lg space-y-2">
              <input
                type="text"
                placeholder={t.placeholderFilename}
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono"
              />
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] cursor-pointer"
                >
                  {uiLocal.cancel}
                </button>
                <button
                  onClick={triggerAddFile}
                  className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold cursor-pointer"
                >
                  {uiLocal.confirm}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {files.map((file) => {
              const isActive = activeFile?.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => onSelectFile(file.path)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <File className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    {file.path}
                  </span>
                  {!isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(file.path);
                      }}
                      className="text-slate-400 hover:text-red-500 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="p-3.5 bg-slate-950/95 text-slate-100 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-indigo-400 font-sans tracking-wide uppercase">
              <Activity className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>{isChinese ? "🤖 AI 代码生成退化实验室" : "🤖 AI Codegen Simulation Lab"}</span>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
              {isChinese 
                ? "模拟大模型在长上下文中胡乱写代码、越权导入或行数爆舱以测试 AST 看门狗探针的即刻拦截效果！" 
                : "Simulate poor LLM codegen drifts to test the immediate intercept defensive power of AST.Guard in real-time!"}
            </p>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => onSimulateDrift?.('coupling')}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-mono text-[9.5px] font-extrabold rounded border border-slate-800 cursor-pointer duration-100 uppercase text-left truncate"
                title={isChinese ? "越权引入 UI 依赖" : "Inject UI couplings into API module"}
              >
                🔥 {isChinese ? "越权耦合" : "UI Coupling"}
              </button>
              <button
                onClick={() => onSimulateDrift?.('bloat')}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-mono text-[9.5px] font-extrabold rounded border border-slate-800 cursor-pointer duration-100 uppercase text-left truncate"
                title={isChinese ? "使文件体积溢出" : "Artificially bloat module lines"}
              >
                📏 {isChinese ? "行数爆舱" : "Lines Bloat"}
              </button>
              <button
                onClick={() => onSimulateDrift?.('pattern')}
                className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-mono text-[9.5px] font-extrabold rounded border border-slate-800 cursor-pointer duration-100 uppercase text-left truncate"
                title={isChinese ? "注入禁用 eval / eval-regex 词意" : "Inject banned eval keywords"}
              >
                🚨 {isChinese ? "禁用禁条" : "Banned Regex"}
              </button>
              <button
                onClick={() => onSimulateDrift?.('chaos')}
                className="px-2 py-1 bg-rose-950/40 hover:bg-rose-950/60 text-rose-300 font-mono text-[9.5px] font-extrabold rounded border border-rose-900/50 cursor-pointer duration-100 uppercase text-left truncate"
                title={isChinese ? "一次性注入所有退化特征" : "Simulate total architectural collapse"}
              >
                💥 {isChinese ? "混沌突变" : "Chaos Drift"}
              </button>
            </div>

            <button
              onClick={() => onSimulateDrift?.('clean')}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1 bg-emerald-950/50 hover:bg-emerald-950/85 text-emerald-300 font-sans text-[10px] font-semibold rounded border border-emerald-900/60 cursor-pointer duration-100 mt-1"
            >
              <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{isChinese ? "⚡ 重构架构：使代码归位" : "⚡ Refactor Code: Reconstruct and Heal"}</span>
            </button>
          </div>
          
          <div className="text-[10px] text-slate-400 font-mono pl-1">
            <span>{uiLocal.sandboxTip}</span>
          </div>
        </div>
      </div>

      {/* Code Text Editor Buffer */}
      <div className="md:col-span-3 flex flex-col h-full">
        {activeFile ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tab Breadcrumb Bar */}
            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Code className="w-3.5 h-3.5 text-indigo-500" />
                {activeFile.path}
                <ChevronRight className="w-3 h-3 mx-0.5" />
                {activeFile.content.split('\n').length} {uiLocal.linesSuffix}
              </span>
              <span className="text-[10px] text-slate-400">{uiLocal.compileStatus}</span>
            </div>

            {/* Content Buffer Area */}
            <textarea
              value={activeFile.content}
              onChange={(e) => onUpdateContent(activeFile.path, e.target.value)}
              className="flex-1 w-full p-4 font-mono text-sm leading-relaxed bg-white text-slate-800 resize-none border-0 focus:outline-none focus:ring-0 overflow-y-auto"
              style={{ minHeight: '380px' }}
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 text-slate-400">
            <Code className="w-10 h-10 mb-2 stroke-1" />
            <p className="text-sm font-sans font-medium">{uiLocal.emptyPrompt}</p>
          </div>
        )}
      </div>
    </div>
  );
};

