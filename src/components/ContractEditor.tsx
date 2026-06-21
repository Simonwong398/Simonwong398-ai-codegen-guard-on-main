import React, { useState } from 'react';
import { ArchitectureContract, ModuleDefinition } from '../types/architecture';
import { CleanWebContract, HexagonalContract, SimpleClientContract } from '../data/defaultContracts';
import { FileCode, Plus, Trash2, Download, Copy, Check, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { TranslationSet } from '../types/translations';

interface ContractEditorProps {
  contract: ArchitectureContract;
  onChange: (updated: ArchitectureContract) => void;
  t: TranslationSet;
  lang: string;
}

export const ContractEditor: React.FC<ContractEditorProps> = ({ contract, onChange, t, lang }) => {
  const [copied, setCopied] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(contract.modules[0]?.id || null);

  const isChinese = lang.includes('zh');

  const uiLocal = {
    quickTemplates: isChinese ? "📐 快速应用规范模板" : (lang === 'es' ? "📐 Aplicar plantillas de arquitectura rápidamente" : "📐 Quick Architecture Templates"),
    cleanArch: isChinese ? "Clean Arch 规范 (Web MVC)" : "Clean Arch (Web MVC)",
    hexagonal: isChinese ? "Hexagonal 规范 (域边界)" : "Hexagonal Arch (Domain Border)",
    minimal: isChinese ? "Minimal Client 规范 (组件/模型)" : "Minimal Client (Component/Model)",
    version: isChinese ? "契约版本" : (lang === 'es' ? "Versión del contrato" : "Contract Version"),
    strictTitle: isChinese ? "严格依赖拦截 (Strict Mode)" : (lang === 'es' ? "Modo estricto" : "Strict Dependency Interception"),
    strictDesc: isChinese ? "禁止导入未定义在任何模块模式中的外部源" : "Block imports from files outside defined architectural sub-modules",
    maxLinesDesc: isChinese ? "单文件超过该阈值标记为不合规（极致推荐 250 行）" : "Flag files exceeding this size as violation (250 recommended)",
    subBorders: isChinese ? "🧱 模块子边界契约" : (lang === 'es' ? "🧱 Límites de submódulos" : "Sub-Module Boundary Rules"),
    addBorder: isChinese ? "添加边界模块" : (lang === 'es' ? "Agregar módulo" : "Add Module"),
    moduleKey: isChinese ? "模块唯一标识 (Key)" : "Module Identifier (Key)",
    moduleName: isChinese ? "模块展示名" : "Module Name",
    globPattern: isChinese ? "过滤规则 (Glob-Pattern)" : "Filter (Glob Pattern)",
    designIntent: isChinese ? "模块设计意图" : "Design Purpose",
    deleteModule: isChinese ? "删除该模块" : "Delete Module",
    allowedDeps: isChinese ? "🛡️ 允许直接依赖 (Coupled Channels)" : "Allowed Unidirectional Coupled Modules",
    copiedText: isChinese ? "复制成功" : "Copied!",
    copyText: isChinese ? "复制 JSON" : "Copy JSON",
    newModuleName: isChinese ? "新服务模块" : "New Service Module",
    newModuleDesc: isChinese ? "描述本模块的职责边界和设计初衷" : "Description of this service module's architectural intent.",
    globalRigidity: isChinese ? "🛡️ 全局校验刚度" : "Global Verification Strictness"
  };

  const applyTemplate = (tpl: ArchitectureContract) => {
    onChange(JSON.parse(JSON.stringify(tpl)));
  };

  const updateGlobal = (key: string, value: any) => {
    onChange({
      ...contract,
      globalRules: {
        ...contract.globalRules,
        [key]: value
      }
    });
  };

  const addModule = () => {
    const id = `mod-${Math.random().toString(36).substring(2, 6)}`;
    const newModule: ModuleDefinition = {
      id,
      name: uiLocal.newModuleName,
      description: uiLocal.newModuleDesc,
      pathPattern: `src/${id}/**`,
      allowedDependencies: [],
      maxLines: 250,
    };
    onChange({
      ...contract,
      modules: [...contract.modules, newModule]
    });
  };

  const removeModule = (id: string) => {
    const updatedModules = contract.modules.filter((m) => m.id !== id);
    // Remove references from other modules dependencies
    const cleaned = updatedModules.map((m) => ({
      ...m,
      allowedDependencies: m.allowedDependencies.filter((depId) => depId !== id)
    }));
    onChange({
      ...contract,
      modules: cleaned
    });
  };

  const updateModule = (index: number, updatedField: Partial<ModuleDefinition>) => {
    const nextModules = [...contract.modules];
    nextModules[index] = { ...nextModules[index], ...updatedField };
    onChange({
      ...contract,
      modules: nextModules
    });
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(contract, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Quick Seed Templates */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-sans font-medium text-slate-800 mb-3 text-sm">{uiLocal.quickTemplates}</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyTemplate(CleanWebContract)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            {uiLocal.cleanArch}
          </button>
          <button
            onClick={() => applyTemplate(HexagonalContract)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            {uiLocal.hexagonal}
          </button>
          <button
            onClick={() => applyTemplate(SimpleClientContract)}
            className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 text-sky-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            {uiLocal.minimal}
          </button>
        </div>
      </div>

      {/* Contract Core Info & Global Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-sans font-semibold text-slate-900 border-b pb-3 text-base">{t.contractHeader}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{t.contractProjName}</label>
              <input
                type="text"
                value={contract.projectName}
                onChange={(e) => onChange({ ...contract, projectName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">{uiLocal.version}</label>
              <input
                type="text"
                value={contract.version}
                onChange={(e) => onChange({ ...contract, version: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.contractElasticTitle}</span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">{t.contractPreset}</label>
                <select
                  value={contract.globalRules.frameworkFingerprint?.preset || "React-Vite"}
                  onChange={(e) => {
                    const preset = e.target.value;
                    let ext = "tsx";
                    let naming: 'PascalCase' | 'kebab-case' | 'CamelCase' = "PascalCase";
                    if (preset.includes("Vue")) {
                      ext = "vue";
                      naming = "kebab-case";
                    } else if (preset.includes("Svelte")) {
                      ext = "svelte";
                      naming = "PascalCase";
                    }
                    onChange({
                      ...contract,
                      globalRules: {
                        ...contract.globalRules,
                        frameworkFingerprint: { preset, extension: ext, componentNamingConvention: naming }
                      }
                    });
                  }}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="React-Vite">React + Vite</option>
                  <option value="Next.js App Router">Next.js App Router</option>
                  <option value="Vue-SFC">Vue.js SFC</option>
                  <option value="Svelte SFC">Svelte 5</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">{t.contractExtension}</label>
                <input
                  type="text"
                  value={contract.globalRules.frameworkFingerprint?.extension || "tsx"}
                  onChange={(e) => {
                    const fp = contract.globalRules.frameworkFingerprint || { preset: "React-Vite", extension: "tsx", componentNamingConvention: "PascalCase" };
                    onChange({
                      ...contract,
                      globalRules: {
                        ...contract.globalRules,
                        frameworkFingerprint: { ...fp, extension: e.target.value }
                      }
                    });
                  }}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-slate-50 focus:outline-none"
                  placeholder="tsx"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 mb-1 font-semibold">{t.contractNaming}</label>
                <select
                  value={contract.globalRules.frameworkFingerprint?.componentNamingConvention || "PascalCase"}
                  onChange={(e) => {
                    const fp = contract.globalRules.frameworkFingerprint || { preset: "React-Vite", extension: "tsx", componentNamingConvention: "PascalCase" };
                    onChange({
                      ...contract,
                      globalRules: {
                        ...contract.globalRules,
                        frameworkFingerprint: { ...fp, componentNamingConvention: e.target.value as any }
                      }
                    });
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none"
                >
                  <option value="PascalCase">PascalCase (e.g. HelloWidget)</option>
                  <option value="kebab-case">kebab-case (e.g. hello-widget)</option>
                  <option value="CamelCase">camelCase (e.g. helloWidget)</option>
                </select>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">{t.contractSlogan}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-sans font-semibold text-slate-900 border-b pb-3 text-base">{uiLocal.globalRigidity}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-medium text-slate-700">{uiLocal.strictTitle}</label>
                <span className="text-[11px] text-slate-400">{uiLocal.strictDesc}</span>
              </div>
              <input
                type="checkbox"
                checked={contract.globalRules.strictDependencyRules}
                onChange={(e) => updateGlobal('strictDependencyRules', e.target.checked)}
                className="w-4.5 h-4.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <label className="block text-xs font-medium text-slate-700">{t.contractMaxLines}</label>
                <span className="text-[11px] text-slate-400">{uiLocal.maxLinesDesc}</span>
              </div>
              <input
                type="number"
                value={contract.globalRules.maxLinesPerFile}
                onChange={(e) => updateGlobal('maxLinesPerFile', Math.max(10, parseInt(e.target.value) || 250))}
                className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-mono text-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Module Definition Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-semibold text-slate-900 text-lg">{uiLocal.subBorders} ({contract.modules.length})</h3>
          <button
            onClick={addModule}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            {uiLocal.addBorder}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {contract.modules.map((mod, i) => {
            const isExpanded = expandedModuleId === mod.id;
            return (
              <div key={mod.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-all duration-200">
                {/* Collapsible Header bar summary */}
                <div 
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  className="flex items-center justify-between px-5 py-3.5 bg-slate-100 hover:bg-slate-200/80 border-b border-slate-200/60 cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-1 px-2 border border-slate-300 text-[10px] font-mono font-bold text-slate-600 bg-white shadow-sm rounded">
                      {mod.id}
                    </span>
                    <span className="font-bold text-xs text-slate-800 truncate">{mod.name}</span>
                    <span className="text-[10px] text-slate-400 truncate hidden sm:inline font-mono">{mod.pathPattern}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] text-slate-400 font-mono font-bold">
                      {isExpanded 
                        ? (isChinese ? "收起规则" : "COLLAPSE SPEC") 
                        : (isChinese ? `直接耦合: [${mod.allowedDependencies.join(', ') || '无'}]` : `Coupled: [${mod.allowedDependencies.join(', ') || 'none'}]`)}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 animate-fade-in">
                      {/* Metas inputs */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{uiLocal.moduleKey}</label>
                          <input
                            type="text"
                            value={mod.id}
                            onChange={(e) => {
                              const newId = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
                              updateModule(i, { id: newId });
                              setExpandedModuleId(newId);
                            }}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-white focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{uiLocal.moduleName}</label>
                          <input
                            type="text"
                            value={mod.name}
                            onChange={(e) => updateModule(i, { name: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{uiLocal.globPattern}</label>
                          <input
                            type="text"
                            value={mod.pathPattern}
                            onChange={(e) => updateModule(i, { pathPattern: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-white focus:outline-none"
                            placeholder="src/api/**"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{uiLocal.designIntent}</label>
                          <input
                            type="text"
                            value={mod.description}
                            onChange={(e) => updateModule(i, { description: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => removeModule(mod.id)}
                        className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-150 flex items-center justify-center cursor-pointer md:mt-5 self-end md:self-auto shrink-0"
                        title={uiLocal.deleteModule}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Module dependencies matrices checkboxes */}
                    <div className="pt-4 border-t border-slate-200/60">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2.5">
                        {uiLocal.allowedDeps}
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {contract.modules
                          .filter((other) => other.id !== mod.id)
                          .map((other) => {
                            const isChecked = mod.allowedDependencies.includes(other.id);
                            return (
                              <label
                                key={other.id}
                                className={`flex items-center gap-2 px-2.5 py-1.5 border rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
                                  isChecked
                                    ? 'bg-slate-900 border-slate-800 text-white font-semibold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const deps = e.target.checked
                                      ? [...mod.allowedDependencies, other.id]
                                      : mod.allowedDependencies.filter((id) => id !== other.id);
                                    updateModule(i, { allowedDependencies: deps });
                                  }}
                                  className="hidden"
                                />
                                <span className="font-mono text-[10px] text-indigo-400 font-bold bg-slate-950/20 px-1 py-0.5 rounded">
                                  {other.id}
                                </span>
                                <span>{other.name}</span>
                              </label>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Export Controls */}
      <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-base text-white">ARCHITECTURE.json</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium cursor-pointer transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? uiLocal.copiedText : uiLocal.copyText}
            </button>
          </div>
        </div>
        <pre className="text-xs font-mono text-indigo-300 p-4 bg-slate-950 rounded-lg overflow-x-auto max-h-60 border border-slate-900">
          {JSON.stringify(contract, null, 2)}
        </pre>
      </div>
    </div>
  );
};
