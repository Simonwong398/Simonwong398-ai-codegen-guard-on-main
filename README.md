# AI Codegen Guard (AST.Guard) 🛡️

A lightweight, high-performance static architecture contract boundary defender and refactoring helper designed for multi-turn AI code-generation workflows (GPT-4o, Claude 3.5, Gemini 2.5).

*Stop AI models from degrading your clean codebase. Enforce physical module boundaries, prevent file size bloating, and maintain architectural integrity automatically.*

---

## 🎯 The Pain Point: "The Longer You Chat, The Messier The Code"

In modern AI-assisted engineering workflows, autonomous agents or chat assistants excel at writing functions but suffer from **multi-turn context decay** and **architectural drift**. 

During long, complex chat threads, developers frequently encounter these bad LLM code-generation behaviors:
1. **Lazy Consolidation (Bloat)**: Instead of modularizing new views, helpers, or types, the AI takes the path of least resistance—shoveling hundreds of lines of code into a single, monolithic file (like `App.tsx` or an API controller).
2. **Boundary Violations (Coupling)**: The AI introduces forbidden dependencies across clean boundaries (e.g., an API network client importing a frontend button or modal component), leading to circular imports, fragile architectures, and build failures.

Traditional tooling (ESLint, Prettier) checks for structural syntax style but fails to guard **macro system topology, module boundaries, and dependency hierarchies**. 

**AI Codegen Guard (AST.Guard)** acts as an immediate defensive lock. It statically parses your codebase's AST (Abstract Syntax Tree) in real-time to intercept architectural degradation before code gets committed or compiled.

---

## 💎 Core Architecture & Capabilities

AST.Guard operates through an elegant, multi-tier protection suite:

### 1. File Line-Count Warden (Physical Volume Probe)
- Continuously audits the physical line count of every virtual file inside your sandbox container against specific modules-level limits.
- Highlights risk states (`warning` and `danger`) immediately.

### 2. AST Lossless Splitting (Instruction Generator)
- Dynamically analyzes heavy, monolithic files that have broken optimal guidelines.
- Autonomously recommends a **decoupled transition topology**:
  - **Rigid Substrate Type Contracts (`.types.ts`)**: Isolate abstract data interfaces and models cleanly.
  - **Stateless Pure Helpers (`.utils.ts`)**: Consolidate algorithmic logic.
  - **Elastic View Components (`View SFC`)**: Shape polymorphic presentational modules compliant with frameworks like React, Vue, or Svelte.
- Generates precise, granular execution steps and allows a live live-sandbox apply.

### 3. Anti-Entropy State Keeper (Rollback Engine)
- Actively listens to file events to detect architectural deviation.
- **Active Rollback Guard**: When activated, instantly reverts any non-compliant code adjustments or illegal imports back to the last 100% structural snapshot with zero effort lost.
- **Streaming System Logs**: Displays millisecond-accurate incremental checks, active violation counters, and safety passes.

### 4. AI Developer Input Injector (Prompt Mount)
- Transfuses your configured contract boundaries and rules directly into custom, highly targeted Markdown-formatted AI system prompt blocks.
- Pre-injecting these constraints locks your AI generator's attention window, forcing absolute adherence in downstream sessions.

---

## 💼 Capafy Passive Income Potential (Why Premium Developers Pay)

AST.Guard is engineered as a zero-friction, highly monetizable tool designed to be sold as a specialized workspace extension or Git helper skill on the Capafy marketplace:

* **Zero Infrastructure Overhead ($0.00 Running Cost)**: Built to run 100% on the client or within the local sandbox runtime. There are no backend servers, database pipelines, or subscription hosting costs to absorb. Your margins upon purchase or license renewal are a perfect **100% net profit**.
* **Essential Safeguard for AI Pipelines**: AI-driven software development is expanding exponentially. Individual developers, startup studios, and agency teams leveraging auto-coders require automated guardrails to prevent their systems from collapsing into unmaintainable spaghetti.
* **Portable and Integrable**: Easily packageable into custom Git pre-commit hooks, CI/CD checking agents, or IDE companion panels.

---

## 📁 Declarative Config Format (`ARCHITECTURE.json`)

Your system boundaries are described using a human-readable, declarative json format:

```json
{
  "projectName": "Clean Web Portal",
  "version": "1.0.0",
  "modules": [
    {
      "id": "api",
      "name": "API Service Layer",
      "description": "Handles client network HTTP requests. Allowed to reference pure utils only.",
      "pathPattern": "src/api/**",
      "allowedDependencies": ["utils"],
      "maxLines": 200
    },
    {
      "id": "components",
      "name": "Reusable UI Components",
      "description": "Stateless common presentational design system atoms.",
      "pathPattern": "src/components/**",
      "allowedDependencies": ["utils"],
      "maxLines": 150
    }
  ],
  "globalRules": {
    "maxLinesPerFile": 250,
    "strictDependencyRules": true,
    "allowCycles": false,
    "forbiddenRegexPatterns": ["eval\\(", "debugger;", "localStorage\\."]
  }
}
```

---

## 🛠️ Local Development & Quickstart

AST.Guard is built using React 18, Vite, and Tailwind CSS.

```bash
# 1. Install workspace dependencies
npm install

# 2. Boot up the local sandbox workspace
npm run dev
```

Open `http://localhost:3000` to interact with the responsive workspace, test AST splitting, or try the real-time AI code degeneration simulation environment.

---

## 📄 License & Terms

Commercial and distribution rights belong to the ProjectGuard AI team. Standard use-licenses apply. Unauthorized reproduction or redistribution without explicit contract verification is prohibited.
