---
name: ai-code-splitter-drift-guard
description: An AST architectural governance tool to enforce strict module boundaries, visualize line bloat, and protect your codebase from AI-generative degradation.
---

# ProjectGuard AI: Architectural Governance & AST Auditing Engine

`ProjectGuard AI` is an enterprise-grade architectural compliance validator and AST boundary guard designed specifically to prevent code degeneration (entropy) in scalable systems. This skill documents the core engine schema and RESTful hooks.

---

## 📐 1. Architecture Contract Specification (`ARCHITECTURE.json`)

Every project defines module scopes, line-count limits, and explicit dependencies using a robust JSON schema:

```json
{
  "projectName": "Clean Web Portal",
  "version": "1.0.0",
  "modules": [
    {
      "id": "api",
      "name": "API Service Layer",
      "description": "Handles HTTP requests, client-side fetches, and proxy agents.",
      "pathPattern": "src/api/**",
      "allowedDependencies": ["utils"],
      "maxLines": 200
    },
    {
      "id": "components",
      "name": "Reusable UI Widgets",
      "description": "Low-level, domain-agnostic styling blocks.",
      "pathPattern": "src/components/**",
      "allowedDependencies": ["utils"],
      "maxLines": 120
    }
  ],
  "globalRules": {
    "maxLinesPerFile": 250,
    "strictDependencyRules": true,
    "allowCycles": false,
    "forbiddenRegexPatterns": ["eval\\(", "debugger;", "localStorage\\."],
    "frameworkFingerprint": {
      "preset": "React-Vite (TSX 模式)",
      "extension": "tsx",
      "componentNamingConvention": "PascalCase"
    }
  }
}
```

---

## 🔎 2. AST Rules & Static Auditing Engines (Rigid + Elastic Core)

ProjectGuard AI parses JS/TS files to map modules and verify boundaries with dual strategies:

### A. Rigid Base Rules (刚性通用底物)
Regardless of the technological stack selected, pure contracts and utility logic are compiled into generic modules under hard-coded constraints:
- Type contracts are isolated strictly to `.types.ts`.
- Pure stateless services and math layers are isolated strictly to `.utils.ts`.

### B. Elastic Stack Sensing (弹性技术栈感知)
To prevent hot-reload failures or directory errors in specific frameworks (e.g., Next.js App Router, Vue SFC, Svelte 5), the system reads the technological stack fingerprint in real-time to align splitting conventions dynamically, matching custom prefixes and style rules:
- `PascalCase` components with `.tsx`, `.vue`, or `.svelte` view templates.

### C. Import Coupling Matrix Audit
Import lines are analyzed statically:
`import { x } from '../api/y';`
The target module is found, resolved, and verified against the current module's `allowedDependencies`. Non-conforming paths prompt a critical **Coupling Boundary Error**.

---

## 🛡️ 3. Anti-Entropy & Rollback Policy

In CI/CD modes, any regression (entropy increase such as a circular import or code bloat) can trigger **Anti-Entropy Rollbacks**. This restores the repository to the last 100% compliant state to prevent downstream architecture regression.

---

## 💎 4. 闭源商业化变现优势 (Commercial Monetization Hub)

- **Zero Serving Overhead (零服务器托管成本)**: Pure static parsing algorithms reside comfortably on the client-side sandbox. Serving cost is exactly $0.00. Profit margin stays 100%.
- **Anti-Conversation Slippage (防多态记忆退化机制)**: Strict [STRICT_BORDER] directives coerce downstream generation models (GPT, Claude) into deep structured compliance bounds. No more memory falloff over long chats.
- **Zero Invasiveness (零侵入性极速探针)**: Requires absolutely no alterations to existing server pipelines or complex Docker configurations. Simple plug-and-play validation. Can be published on platform marketplaces with ease.
