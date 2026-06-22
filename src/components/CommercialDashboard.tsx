import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Zap, HelpCircle, Check, Copy, Layers, GitBranch, Terminal } from 'lucide-react';
import { TranslationSet } from '../types/translations';

interface CommercialDashboardProps {
  t: TranslationSet;
  lang: string;
}

export const CommercialDashboard: React.FC<CommercialDashboardProps> = ({ t, lang }) => {
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  const isChinese = lang.includes('zh');

  const uiLocal = {
    titleTag: isChinese ? "ProjectGuard AI · 集成与发布中心" : "ProjectGuard AI · Integration Hub",
    hookTitle: isChinese ? "Git Pre-commit 钩子配置" : "Git Pre-commit Hook Config",
    actionTitle: isChinese ? "GitHub Actions CI 工作流" : "GitHub Actions CI Workflow",
    p1Title: isChinese ? "第一步: 写入本地 Git Hook" : "Step 1: Write Local Git Hook",
    p1Desc: isChinese ? "在您的本地项目根路径创建 .git/hooks/pre-commit 文件并授权可执行。它将在您每次提交前检查物理模块行数与耦合关系。" : "Create a .git/hooks/pre-commit file in your repository and make it executable. It automatically audits modular coupling prior to commits.",
    p2Title: isChinese ? "第二步: 注入 CI / CD 强制卡阈值" : "Step 2: Inject CI/CD Merge Blocker",
    p2Desc: isChinese ? "将规则校验挂载到流水线，当团队提交非标代码导致物理边界跨越或循环引入时，流水线自动触发阻断，捍卫代码质量。" : "Mount rule auditing directly in your continuous integration runner. It fails the pull request whenever a module rule is violated.",
    p3Title: isChinese ? "第三步: 技术栈全同构指引" : "Step 3: Polyframework Cohesive Alignment",
    p3Desc: isChinese ? "无需依赖重型后端。AST 看门狗将纯运算下沉至本地静态分析环境中。对 React、Next.js、Vue、Svelte 等开发模式均支持在开箱即用状态下完美拦截。" : "No heavy backend needed. The AST sentinel executes 100% inside client/CI sandboxes, fully supporting React, Next.js, Vue, and Svelte out of the box."
  };

  const codeHook = `#!/bin/sh
# .git/hooks/pre-commit
# ProjectGuard AI: Static AST boundary audit before commit

echo "🛡️ ProjectGuard AI: Guarding local code boundaries..."
npx projectguard-ci --contract ARCHITECTURE.json --check-changed
`;

  const codeCI = `name: ProjectGuard Compliance CI
on: [push, pull_request]

jobs:
  guard_architecture:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install Lint Checker
        run: npm install -g projectguard-ci
      - name: Match AST Architectural Constraints
        run: projectguard-ci --contract ./ARCHITECTURE.json
`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAction(id);
    setTimeout(() => setCopiedAction(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Premium Hero Promo Box */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-mono text-indigo-300 uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            {uiLocal.titleTag}
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl md:text-2xl font-bold font-sans text-neutral-50 tracking-tight">
              {isChinese ? "💎 架构契约与多层开发流水线极速集成" : "💎 Core CI/CD Pipeline & Workspace Integration"}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {isChinese 
                ? "ProjectGuard AI 的引擎作为零侵入的静态抽象语法树 (AST) 检验插件设计。通过将规则声明配置在代码层，您可在日常开发周期、Git Hook 触发时刻、以及团队云端 CI/CD 构建流水线中无缝挂载。"
                : "ProjectGuard AI provides zero-friction developer guardrails. By declaring contract boundaries filewise, you enforce clean-code limits across your local IDE loops, pre-commit events, and multi-file GitHub actions."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-bold">
                {isChinese ? "离线解析底座" : "NATIVE PARSER ENGINE"}
              </span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                100% Client-Side
              </span>
              <p className="text-[10px] text-slate-400">
                {isChinese ? "不进行任何模型或代码外传，完全保护软件资产安全。" : "Guarantees full security of complex software pipelines offline."}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-bold">
                {isChinese ? "模型退化阻断率" : "MODEL DRIFT STOPPED"}
              </span>
              <span className="text-base font-bold text-orange-400 font-mono">
                99.8% Effective
              </span>
              <p className="text-[10px] text-slate-400">
                {isChinese ? "防止长序列对话中大语言模型由于惰性懒惰注入无用巨型逻辑。" : "Locks down LLM focus scopes, avoiding bloated monolithic files."}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-bold">
                {isChinese ? "插拔式免服务器部署" : "SERVERLESS OR HIGHLY INVASIVE"}
              </span>
              <span className="text-base font-bold text-indigo-300 font-mono">
                Plug & Play Node
              </span>
              <p className="text-[10px] text-slate-400">
                {isChinese ? "无需安装 docker CI 镜像或庞大依赖，毫秒级扫描。" : "No docker compilation setups required. Parses trees instantly."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Local Git Precommit hook block */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Terminal className="w-5 h-5 text-indigo-600" />
              <h3 className="font-sans font-bold text-slate-900 text-sm">{uiLocal.hookTitle}</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              {uiLocal.p1Desc}
            </p>

            <div className="relative bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-indigo-200 overflow-x-auto shadow-inner leading-relaxed">
              <pre>{codeHook}</pre>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex justify-end">
            <button
              onClick={() => handleCopy(codeHook, 'hook')}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors w-full justify-center"
            >
              {copiedAction === 'hook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAction === 'hook' ? (isChinese ? "已成功复制脚本内容" : "Config Script Copied!") : (isChinese ? "复制 Git Hook 脚本配置" : "Copy Pre-commit Hook Script")}
            </button>
          </div>
        </div>

        {/* GitHub Actions hook block */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <GitBranch className="w-5 h-5 text-violet-600" />
              <h3 className="font-sans font-bold text-slate-900 text-sm">{uiLocal.actionTitle}</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              {uiLocal.p2Desc}
            </p>

            <div className="relative bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto shadow-inner leading-relaxed">
              <pre>{codeCI}</pre>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex justify-end">
            <button
              onClick={() => handleCopy(codeCI, 'ci')}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors w-full justify-center"
            >
              {copiedAction === 'ci' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAction === 'ci' ? (isChinese ? "已复制 Workflow YAML" : "Pipeline Config Copied") : (isChinese ? "复制 Pipeline YAML 配置文件" : "Copy GitHub Actions YAML")}
            </button>
          </div>
        </div>

      </div>

      {/* Integration walkthrough tips */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
        <h4 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-600" />
          {isChinese ? "团队多端环境自适应指引" : "Cross-Team Environments Alignment Guidance"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h5 className="font-bold text-xs text-slate-800">{isChinese ? "React & Vite 项目" : "React & Vite Standard"}</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">{isChinese ? "内置对 TSX 句法的快速支持，无缝识别 imports 指引，可将 Presentation 视图层从逻辑资产中干净理析。" : "Scans TSX syntax structures dynamically to decouple state handlers from rendering components seamlessly."}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-xs text-slate-800">{isChinese ? "Next.js 契约约束" : "Next.js App Router Structure"}</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">{isChinese ? "支持配置特殊的 app-router 指纹，有效识别 page.tsx / layout.tsx 角色，规避 Linter 破坏服务端组件机制。" : "Differentiates folder page-roles, avoiding accidental boundary restrictions in server-side Next.js layouts."}</p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-xs text-slate-800">{isChinese ? "Vue.js & Svelte" : "Vue SFC & Svelte 5 Models"}</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">{isChinese ? "利用 AST 解析器对脚本字段（script setup）与状态底物进行智能抽取，对单文件组件物理重构依然适用。" : "Uses fine-tuned parser models to split templates cleanly from underlying utils and definitions."}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
