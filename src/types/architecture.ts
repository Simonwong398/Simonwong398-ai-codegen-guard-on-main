export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  pathPattern: string; // e.g. "src/api/**", "src/components/**"
  allowedDependencies: string[]; // ids of allowed modules to import from
  maxLines: number; // custom limit, defaults to 250
  requiredTestCoverage?: boolean;
}

export interface FrameworkFingerprint {
  preset: string; // e.g., "React-Vite", "Next.js App Router", "Vue-SFC", "Svelte"
  extension: string; // e.g., "tsx", "ts", "vue", "svelte"
  componentNamingConvention: 'PascalCase' | 'kebab-case' | 'CamelCase';
}

export interface GlobalRuleSet {
  maxLinesPerFile: number; // default global cap is 250
  strictDependencyRules: boolean; // if true, imports not inside modules are forbidden
  allowCycles: boolean; // default false
  forbiddenRegexPatterns: string[]; // regex patterns like "eval\\(" or "console\\.log"
  frameworkFingerprint?: FrameworkFingerprint;
}

export interface ArchitectureContract {
  projectName: string;
  version: string;
  modules: ModuleDefinition[];
  globalRules: GlobalRuleSet;
}

export interface VirtualFile {
  path: string;
  content: string;
}

export interface AuditIssue {
  id: string;
  filePath: string;
  moduleName?: string;
  lineNumber?: number;
  severity: 'error' | 'warning';
  ruleId: 'line-count' | 'import-boundary' | 'dependency-cycle' | 'forbidden-pattern' | 'missing-test';
  message: string;
  offendingText?: string;
}

export interface AuditResults {
  timestamp: string;
  passed: boolean;
  issues: AuditIssue[];
  metrics: {
    totalFiles: number;
    totalLines: number;
    couplingIndex: number; // ratio of actual dependencies to potential allowed ones
    cycleCount: number;
  };
  moduleNodes: ModuleNode[];
}

export interface ModuleNode {
  id: string;
  label: string;
  level: number; // topological level
  dependencies: string[];
  isCycleParticipant?: boolean;
  fileCount: number;
  totalLines: number;
}
