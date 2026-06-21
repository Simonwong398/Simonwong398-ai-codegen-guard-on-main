import { ArchitectureContract } from '../types/architecture';

export const CleanWebContract: ArchitectureContract = {
  projectName: "Clean Web Portal",
  version: "1.0.0",
  modules: [
    {
      id: "api",
      name: "API Service Layer",
      description: "Handles HTTP requests, client-side fetches, and server interaction proxy agents.",
      pathPattern: "src/api/**",
      allowedDependencies: ["utils"],
      maxLines: 200,
    },
    {
      id: "state",
      name: "State & Store Management",
      description: "Global client state stores, contexts, and reactive state nodes.",
      pathPattern: "src/stores/**",
      allowedDependencies: ["api", "utils"],
      maxLines: 150,
    },
    {
      id: "components",
      name: "Reusable UI Widgets",
      description: "Low-level, domain-agnostic styling blocks and micro-components.",
      pathPattern: "src/components/**",
      allowedDependencies: ["utils"],
      maxLines: 120,
    },
    {
      id: "views",
      name: "Main Feature Pages",
      description: "High-level page routes and entry feature layouts combining states & widgets.",
      pathPattern: "src/views/**",
      allowedDependencies: ["components", "state", "utils"],
      maxLines: 250,
    },
    {
      id: "utils",
      name: "Core Utilities & Helpers",
      description: "Pure stateless arithmetic, parsing helpers, and general utilities.",
      pathPattern: "src/utils/**",
      allowedDependencies: [],
      maxLines: 100,
    }
  ],
  globalRules: {
    maxLinesPerFile: 250,
    strictDependencyRules: true,
    allowCycles: false,
    forbiddenRegexPatterns: ["eval\\(", "debugger;", "localStorage\\."],
    frameworkFingerprint: {
      preset: "React-Vite (TSX 模式)",
      extension: "tsx",
      componentNamingConvention: "PascalCase"
    }
  }
};

export const HexagonalContract: ArchitectureContract = {
  projectName: "Core Hexagonal System",
  version: "1.2.0",
  modules: [
    {
      id: "domain",
      name: "Domain Core",
      description: "Pure enterprise level entities, operations, and strict types.",
      pathPattern: "src/domain/**",
      allowedDependencies: [],
      maxLines: 150,
    },
    {
      id: "ports",
      name: "Inbound & Outbound Ports",
      description: "Interface contracts and boundary signatures connecting core to drivers.",
      pathPattern: "src/ports/**",
      allowedDependencies: ["domain"],
      maxLines: 100,
    },
    {
      id: "adapters",
      name: "Infrastructure Adapters",
      description: "Implementations of ports: REST controllers, DB connectors, local-storage engines.",
      pathPattern: "src/adapters/**",
      allowedDependencies: ["ports", "domain"],
      maxLines: 200,
    }
  ],
  globalRules: {
    maxLinesPerFile: 200,
    strictDependencyRules: true,
    allowCycles: false,
    forbiddenRegexPatterns: ["console\\.log", "any"],
    frameworkFingerprint: {
      preset: "Next.js App Router (React-Server)",
      extension: "tsx",
      componentNamingConvention: "PascalCase"
    }
  }
};

export const SimpleClientContract: ArchitectureContract = {
  projectName: "Minimal Slate Client",
  version: "1.0.0",
  modules: [
    {
      id: "ui",
      name: "UI Components",
      description: "Stateless view controls & atomic elements.",
      pathPattern: "src/components/**",
      allowedDependencies: ["helpers"],
      maxLines: 150,
    },
    {
      id: "services",
      name: "Services & State",
      description: "Dynamic hooks and API wrappers.",
      pathPattern: "src/services/**",
      allowedDependencies: ["helpers"],
      maxLines: 200,
    },
    {
      id: "helpers",
      name: "Analytical Helpers",
      description: "Math utils and dates format engines.",
      pathPattern: "src/helpers/**",
      allowedDependencies: [],
      maxLines: 100,
    }
  ],
  globalRules: {
    maxLinesPerFile: 250,
    strictDependencyRules: false,
    allowCycles: false,
    forbiddenRegexPatterns: ["eval\\("],
    frameworkFingerprint: {
      preset: "Vue-SFC (Vue 单文件组件)",
      extension: "vue",
      componentNamingConvention: "kebab-case"
    }
  }
};
