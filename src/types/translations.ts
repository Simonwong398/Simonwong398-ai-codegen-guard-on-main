export interface TranslationSet {
  // Common
  appTitle: string;
  appBadge: string;
  appSubtitle: string;
  probeOnline: string;

  // Intro Block
  introHeader: string;
  introSub: string;
  introDesc: string;
  introFeature1: string;
  introFeature2: string;

  // Tabs
  tabEditor: string;
  tabGuard: string;
  tabState: string;
  tabContract: string;
  tabCommercial: string;

  // Audit Log / Scorecard
  scoreTitle: string;
  scoreLabel: string;
  scoreStatusHealthy: string;
  scoreStatusWarning: string;
  scoreStatusTitle: string;
  scoreIssueCount: string;
  scoreIncrementalAst: string;
  scoreAutoFixBtn: string;
  scoreNoViolation: string;
  scoreMetricsFiles: string;
  scoreMetricsErrors: string;
  scoreMetricsWarnings: string;

  // Topology Map
  topoHeader: string;
  topoSub: string;
  topoDirection: string;

  // Workspace
  workbenchTitle: string;
  workbenchTip: string;
  btnDelete: string;
  btnAddFile: string;
  placeholderFilename: string;

  // Contract Editor
  contractHeader: string;
  contractProjName: string;
  contractMaxLines: string;
  contractForbiddenPatterns: string;
  contractAllowCycles: string;
  contractElasticTitle: string;
  contractPreset: string;
  contractExtension: string;
  contractNaming: string;
  contractSlogan: string;

  // Guard / Lossless Splitting
  guardFileExceeded: string;
  guardAnalysisTitle: string;
  guardSchemeTitle: string;
  guardStep1: string;
  guardStep2: string;
  guardStep3: string;
  guardCopyBtn: string;
  guardCopied: string;
  guardApplyBtn: string;

  // State Keeper
  stateHeader: string;
  stateCurrentVersion: string;
  stateHistoryList: string;
  stateNoHistory: string;
  stateRollbackBtn: string;

  // Commercial / Monetization
  commHeader: string;
  commSub: string;
  commAnchorCost: string;
  commAnchorCostDesc: string;
  commAnchorDefense: string;
  commAnchorDefenseDesc: string;
  commAnchorInvasiveness: string;
  commAnchorInvasivenessDesc: string;
  commPainPointsTitle: string;
  commPain1Title: string;
  commPain1Desc: string;
  commPain2Title: string;
  commPain2Desc: string;
  commPain3Title: string;
  commPain3Desc: string;
  commCalcTitle: string;
  commCalcSubscribers: string;
  commCalcPrice: string;
  commCalcRevenue: string;
  commCalcServerCost: string;
  commCalcNetProfit: string;
  commCalcDisclaimer: string;
  commExportBtn: string;
  commExportCopied: string;

  // Global Footer
  footerHeading: string;
  footerDesc: string;
}
