import React from 'react';
import { ModuleDefinition, ModuleNode } from '../types/architecture';
import { resolveTopology } from '../utils/topology';
import { GitCommit, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import { TranslationSet } from '../types/translations';

interface TopologyGraphProps {
  modules: ModuleDefinition[];
  t: TranslationSet;
  lang: string;
}

export const TopologyGraph: React.FC<TopologyGraphProps> = ({ modules, t, lang }) => {
  const { nodes, cycles } = resolveTopology(modules);

  const isChinese = lang.includes('zh');

  const uiLocal = {
    title: isChinese ? "拓扑依赖分层视图" : (lang === 'es' ? "Vista de capas jerárquicas" : lang === 'fr' ? "Vue en couches hiérarchiques" : lang === 'de' ? "Hierarchische Schichtenansicht" : lang === 'it' ? "Vista stratificata gerarchica" : lang === 'ja' ? "階層化された層ビュー" : lang === 'ko' ? "계층화된 레이어 뷰" : lang === 'pt' ? "Visualização de camadas hierárquicas" : "Hierarchical Layer View"),
    sub: t.topoSub,
    cyclesDetected: isChinese ? `检测到 ${cycles.length} 处循环依赖!` : (lang === 'es' ? `¡Se detectaron ${cycles.length} dependencias circulares!` : `Detected ${cycles.length} circular dependencies!`),
    empty: isChinese ? "尚未定义任何模块，请在下方契约器中添加" : (lang === 'es' ? "No se han definido módulos, agréguelos en el editor" : lang === 'fr' ? "Aucun module défini, veuillez les ajouter dans l'éditeur" : "No modules defined yet, please add them in the editor below"),
    dependsOn: isChinese ? "依赖于:" : (lang === 'es' ? "Depende de:" : lang === 'fr' ? "Dépend de:" : lang === 'de' ? "Hängt ab von:" : lang === 'it' ? "Dipende da:" : lang === 'ja' ? "依存先:" : lang === 'ko' ? "의존 대상:" : lang === 'pt' ? "Depende de:" : "Depends on:"),
    noDeps: isChinese ? "无外部依赖 (叶/底层模块)" : (lang === 'es' ? "Sin dependencias externas" : lang === 'fr' ? "Aucune dépendance externe" : "No external dependencies (leaf)"),
    cyclePaths: isChinese ? "🔁 检查出循环导入路径:" : (lang === 'es' ? "🔁 Rutas de dependencias circulares:" : "🔁 Circular dependency path tracks:"),
    pathIndex: isChinese ? "路径" : (lang === 'es' ? "Ruta" : lang === 'fr' ? "Chemin" : "Path")
  };

  // Group nodes by Level for lane rendering
  const levelsMap: Record<number, ModuleNode[]> = {};
  nodes.forEach((n) => {
    if (!levelsMap[n.level]) {
      levelsMap[n.level] = [];
    }
    levelsMap[n.level].push(n);
  });

  const levelIds = Object.keys(levelsMap)
    .map(Number)
    .sort((a, b) => b - a); // Top layers first

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-950 p-2 rounded-lg text-indigo-400 border border-indigo-800">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white font-sans">{uiLocal.title}</h3>
            <p className="text-xs text-slate-400">{uiLocal.sub}</p>
          </div>
        </div>
        {cycles.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-400 animate-pulse">
            <AlertCircle className="w-4 h-4" />
            <span>{uiLocal.cyclesDetected}</span>
          </div>
        )}
      </div>

      {nodes.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-lg text-slate-500">
          <GitCommit className="w-8 h-8 mb-2 stroke-1" />
          <p className="text-sm">{uiLocal.empty}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {levelIds.map((lvl) => {
            const laneNodes = levelsMap[lvl];
            return (
              <div key={lvl} className="relative group">
                {/* Lane Header */}
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                  <span>Level {lvl}</span>
                  <div className="h-[1px] flex-1 bg-slate-800" />
                </div>

                {/* Nodes container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {laneNodes.map((node) => {
                    const isCyclic = node.isCycleParticipant;
                    
                    return (
                      <div
                        key={node.id}
                        className={`p-4 rounded-xl border transition-all duration-300 relative ${
                          isCyclic
                            ? 'bg-red-950/20 border-red-900/50 hover:border-red-500/80 shadow-red-950/20 shadow-md'
                            : 'bg-slate-950 border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-950/10 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                            {node.id}
                          </span>
                          {isCyclic && (
                            <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800 font-mono">
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                              CYCLE
                            </span>
                          )}
                        </div>

                        <h4 className="font-medium text-slate-200 mt-2 font-sans">{node.label}</h4>

                        {/* Dependencies sub-list */}
                        <div className="mt-4 pt-3 border-t border-slate-900">
                          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1.5">
                            {uiLocal.dependsOn}
                          </p>
                          <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
                            {node.dependencies.length === 0 ? (
                              <span className="text-[10px] text-slate-600 font-mono italic">
                                {uiLocal.noDeps}
                              </span>
                            ) : (
                              node.dependencies.map((dep) => (
                                <span
                                  key={dep}
                                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-850"
                                >
                                  {dep}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cycle detail helper */}
      {cycles.length > 0 && (
        <div className="mt-6 p-4 bg-red-950/10 border border-red-900/40 rounded-xl">
          <p className="text-xs font-mono text-red-300 font-bold mb-2 uppercase tracking-wide">
            {uiLocal.cyclePaths}
          </p>
          <div className="space-y-1.5 font-mono text-xs">
            {cycles.map((path, idx) => (
              <div key={idx} className="flex items-center gap-2 text-red-200/80">
                <span className="bg-red-950/80 text-red-400 px-1.5 py-0.5 rounded border border-red-900 font-bold">
                  {uiLocal.pathIndex} #{idx + 1}
                </span>
                <span className="font-semibold tracking-tight">{path.join(' ➔ ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
