import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Sparkles, TrendingUp, Zap, HelpCircle, Check, Copy, Flame, Layers } from 'lucide-react';
import { TranslationSet } from '../types/translations';

interface CommercialDashboardProps {
  t: TranslationSet;
  lang: string;
}

export const CommercialDashboard: React.FC<CommercialDashboardProps> = ({ t, lang }) => {
  const [copiedSkill, setCopiedSkill] = useState(false);
  const [mau, setMau] = useState<number>(350);
  const [price, setPrice] = useState<number>(9.9);

  const isChinese = lang.includes('zh');

  const uiLocal = {
    titleTag: isChinese ? "AI Codegen Guard · 商业转化中心" : "AI Codegen Guard · Monetization Hub",
    serverlessNet: isChinese ? "纯静态免维护" : "Pure Static Serverless",
    marginCostValue: isChinese ? "$0.00 / 纯静态" : "$0.00 / Static",
    defenceRate: isChinese ? "99.8% 约束压制" : "99.8% Force Intercept",
    zeroInvasive: isChinese ? "0% 无缝无感接入" : "0% Seamless Integration",
    pain1Sub: isChinese ? "外界 AI 在上下文变长时的“多态偷懒”和“粘稠退化”" : "Lazy behaviors and memory leaks of models",
    pain2Sub: isChinese ? "无需在物理仓库部署繁杂庞大的物理 AST 扫描器" : "No slow and heavy server dependencies required",
    pain3Sub: isChinese ? "刚性底物核心层与弹性命名感知，杜绝框架破损" : "Strict unidirectional flows + adaptive naming conventions",
    netProfitLabel: isChinese ? "预计净利润" : "Predicted Monthly Profit",
    monthlySuffix: isChinese ? "/ 月" : "/ mo",
    subscribersSuffix: isChinese ? " 人" : " users",
    specPackageTemplate: isChinese ? "独立 Skill 规范封包模板" : "Pro Skill Encapsulation Template",
    exportDesc: isChinese ? "您可以一键获取闭源发布包的标准描述元 JSON，将其粘贴到您的发布商管理面板中：" : "Export self-contained metadata JSON to easily submit and publish your closed-source skill in the marketplace catalog:"
  };

  // Profit calculations
  const grossRevenue = Math.round(mau * price);
  const serverCost = 0; // Purely serverless sandbox
  const netProfit = grossRevenue - serverCost;

  const copyMarketplaceIntegrationConfig = () => {
    const config = `{
  "skill_name": "AI Codegen Guard",
  "version": "1.0.0",
  "category": "Architectural Governance",
  "pricing": {
    "type": "subscription",
    "recommended_price_usd": 9.9
  },
  "runtime": "Pure client-side static parser",
  "monetization_anchors": {
    "marginal_cost": 0.00,
    "attention_lock_index": "99.8%",
    "deployment_invasiveness": "Zero-trust client hook"
  }
}`;
    navigator.clipboard.writeText(config);
    setCopiedSkill(true);
    setTimeout(() => setCopiedSkill(false), 2000);
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
              {t.commHeader}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {t.commSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-bold">{t.commAnchorCost}</span>
              <span className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-1">
                {uiLocal.marginCostValue}
              </span>
              <p className="text-[10px] text-slate-400">{t.commAnchorCostDesc}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-bold">{t.commAnchorDefense}</span>
              <span className="text-lg font-bold text-orange-400 font-mono">
                {uiLocal.defenceRate}
              </span>
              <p className="text-[10px] text-slate-400">{t.commAnchorDefenseDesc}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-bold">{t.commAnchorInvasiveness}</span>
              <span className="text-lg font-bold text-indigo-300 font-mono">
                {uiLocal.zeroInvasive}
              </span>
              <p className="text-[10px] text-slate-400">{t.commAnchorInvasivenessDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pain points breakdown cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-sans font-semibold text-slate-900 border-b pb-3 text-base flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              {t.commPainPointsTitle}
            </h3>

            <div className="space-y-4">
              
              {/* Pain Item 1 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] uppercase font-mono font-bold rounded-md">
                    {t.commPain1Title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Memory Falloff Defense</span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">{uiLocal.pain1Sub}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.commPain1Desc}
                </p>
              </div>

              {/* Pain Item 2 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] uppercase font-mono font-bold rounded-md">
                    {t.commPain2Title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Zero-trust Sandbox</span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">{uiLocal.pain2Sub}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.commPain2Desc}
                </p>
              </div>

              {/* Pain Item 3 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] uppercase font-mono font-bold rounded-md">
                    {t.commPain3Title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Elastic Stack Naming</span>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">{uiLocal.pain3Sub}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.commPain3Desc}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Dynamic Calculator & Config segment */}
        <div className="space-y-6">
          
          {/* Revenue Estimator Slider */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <h3 className="font-sans font-semibold text-slate-900 pb-2 border-b flex items-center gap-1.5 text-sm">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
              {t.commCalcTitle}
            </h3>

            <div className="space-y-4">
              {/* Slider 1: Subscribers count */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{t.commCalcSubscribers}</span>
                  <span className="text-indigo-600 font-mono font-bold">{mau}{uiLocal.subscribersSuffix}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={mau}
                  onChange={(e) => setMau(parseInt(e.target.value))}
                  className="w-full Accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Price per subscriber */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{t.commCalcPrice}</span>
                  <span className="text-emerald-600 font-mono font-bold">${price}</span>
                </div>
                <input
                  type="range"
                  min="3.9"
                  max="49"
                  step="0.5"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="w-full Accent-emerald-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Results Matrix Visual Card */}
              <div className="p-4 bg-emerald-50/55 border border-emerald-100 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium font-sans">{t.commCalcRevenue}</span>
                  <span className="font-mono font-bold text-slate-700">${grossRevenue}</span>
                </div>
                
                <div className="flex justify-between items-center text-xs text-red-500 border-t border-dashed border-emerald-200 pt-1.5">
                  <span className="font-sans">{t.commCalcServerCost}</span>
                  <span className="font-mono font-bold">$0.00 ({uiLocal.serverlessNet})</span>
                </div>

                <div className="flex justify-between items-center text-sm pt-2 border-t border-emerald-200">
                  <span className="font-bold text-emerald-950 font-sans">{uiLocal.netProfitLabel}</span>
                  <span className="font-mono text-base font-extrabold text-emerald-650 tracking-tight">
                    ${netProfit} {uiLocal.monthlySuffix} (100%)
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                {t.commCalcDisclaimer}
              </p>
            </div>
          </div>

          {/* Integration download configs */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-rose-50">
                <Layers className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="font-sans font-semibold text-slate-900 text-sm">{uiLocal.specPackageTemplate}</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                {uiLocal.exportDesc}
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={copyMarketplaceIntegrationConfig}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors w-full justify-center"
              >
                {copiedSkill ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSkill ? t.commExportCopied : t.commExportBtn}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
