import { ArchitectureContract, AuditIssue, AuditResults, ModuleDefinition, VirtualFile } from '../types/architecture';
import { resolveTopology } from './topology';

/**
 * Resolves a match between a file path and module patterns (e.g., glob-like matching).
 */
export function findModuleForPath(filePath: string, modules: ModuleDefinition[]): ModuleDefinition | null {
  for (const mod of modules) {
    // Basic glob comparison (simple conversion of '*' and '**' to regex)
    const pattern = mod.pathPattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(filePath)) {
      return mod;
    }
  }
  return null;
}

/**
 * Resolves a relative import path to a clean project-relative path.
 */
export function resolveImportPath(importingFile: string, relativeImport: string): string {
  if (relativeImport.startsWith('@/')) {
    return relativeImport.replace('@/', 'src/');
  }
  if (!relativeImport.startsWith('.')) {
    return relativeImport; // third-party or alias we don't resolve
  }

  const parts = importingFile.split('/');
  parts.pop(); // remove file name to get directory

  const relativeParts = relativeImport.split('/');
  for (const part of relativeParts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      parts.pop();
    } else {
      parts.push(part);
    }
  }

  // Remove trailing extensions if any, or normalize
  let resolved = parts.join('/');
  resolved = resolved.replace(/\.(ts|tsx|js|jsx)$/, '');
  return resolved;
}

/**
 * Parses and audits imported lines using regex scans.
 */
export function auditCodebase(
  contract: ArchitectureContract,
  files: VirtualFile[]
): AuditResults {
  const issues: AuditIssue[] = [];
  const fileMap = new Map<string, VirtualFile>();
  files.forEach((f) => fileMap.set(f.path, f));

  let totalLines = 0;

  // Track module statistics
  const moduleFileStats = new Map<string, { count: number; lines: number }>();
  contract.modules.forEach((m) => moduleFileStats.set(m.id, { count: 0, lines: 0 }));

  files.forEach((file) => {
    const lines = file.content.split('\n');
    totalLines += lines.length;

    // 1. Identify which module this file belongs to
    const matchedModule = findModuleForPath(file.path, contract.modules);
    if (matchedModule) {
      const stats = moduleFileStats.get(matchedModule.id) || { count: 0, lines: 0 };
      stats.count += 1;
      stats.lines += lines.length;
      moduleFileStats.set(matchedModule.id, stats);
    }

    // 2. Check Line Counts Rule (Module Custom Max OR Global contract Max)
    const allowedMaxLines = matchedModule?.maxLines ?? contract.globalRules.maxLinesPerFile;
    if (lines.length > allowedMaxLines) {
      issues.push({
        id: `lc-${file.path.replace(/\//g, '-')}`,
        filePath: file.path,
        moduleName: matchedModule?.name,
        severity: lines.length > allowedMaxLines + 50 ? 'error' : 'warning',
        ruleId: 'line-count',
        message: `File has ${lines.length} lines, exceeding the allowed limit of ${allowedMaxLines} lines.`,
      });
    }

    // 3. Scan line by line for imports and forbidden regex patterns
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Forbidden patterns (e.g. eval, console.log)
      contract.globalRules.forbiddenRegexPatterns.forEach((pat) => {
        try {
          const regex = new RegExp(pat);
          if (regex.test(line)) {
            issues.push({
              id: `fp-${file.path}-${lineNum}`,
              filePath: file.path,
              moduleName: matchedModule?.name,
              lineNumber: lineNum,
              severity: 'warning',
              ruleId: 'forbidden-pattern',
              message: `Forbidden pattern matched: "${pat}"`,
              offendingText: line.trim(),
            });
          }
        } catch {
          // ignore invalid patterns
        }
      });

      // Import statements pattern matching
      // e.g. import { x } from '../api/y'; or import '../styles.css';
      const importRegex = /(?:import|export)\s+.*\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(line)) !== null) {
        const importTarget = match[1] || match[2];
        if (!importTarget) continue;

        // Only audit internal path imports (skip external node_modules)
        if (importTarget.startsWith('.') || importTarget.startsWith('@/')) {
          const resolvedPath = resolveImportPath(file.path, importTarget);
          
          // Find target's module
          const targetModule = findModuleForPath(resolvedPath, contract.modules);
          
          if (matchedModule && targetModule && matchedModule.id !== targetModule.id) {
            // Out-of-module import! Check contract
            const isAllowed = matchedModule.allowedDependencies.includes(targetModule.id);
            if (!isAllowed) {
              issues.push({
                id: `ib-${file.path}-${lineNum}-${targetModule.id}`,
                filePath: file.path,
                moduleName: matchedModule.name,
                lineNumber: lineNum,
                severity: 'error',
                ruleId: 'import-boundary',
                message: `Illegal cross-module coupling: Module "${matchedModule.name}" is forbidden from importing from "${targetModule.name}".`,
                offendingText: line.trim(),
              });
            }
          }
        }
      }
    });

    // 4. Test coverage verification checks (if required)
    if (matchedModule?.requiredTestCoverage && !file.path.includes('.test.') && !file.path.includes('.spec.')) {
      const baseName = file.path.split('/').pop()?.split('.')[0] || '';
      const hasTest = files.some((f) => {
        const isTest = f.path.includes(`${baseName}.test`) || f.path.includes(`${baseName}.spec`);
        return isTest && f.path.includes(file.path.substring(0, file.path.lastIndexOf('/')));
      });
      if (!hasTest) {
        issues.push({
          id: `tc-${file.path}`,
          filePath: file.path,
          moduleName: matchedModule.name,
          severity: 'warning',
          ruleId: 'missing-test',
          message: `Module requires test files. No test configuration discovered for "${file.path.split('/').pop()}".`,
        });
      }
    }
  });

  // Calculate metrics
  const topology = resolveTopology(contract.modules);
  const totalActualDependencies = contract.modules.reduce((acc, m) => acc + m.allowedDependencies.length, 0);
  const potentialConnections = contract.modules.length * (contract.modules.length - 1) || 1;
  const couplingIndex = Math.round((totalActualDependencies / potentialConnections) * 100);

  // Hydrate module nodes with computed file counts & line metrics
  const finalNodes = topology.nodes.map((node) => {
    const stat = moduleFileStats.get(node.id) || { count: 0, lines: 0 };
    return {
      ...node,
      fileCount: stat.count,
      totalLines: stat.lines,
    };
  });

  return {
    timestamp: new Date().toISOString(),
    passed: !issues.some((issue) => issue.severity === 'error'),
    issues,
    metrics: {
      totalFiles: files.length,
      totalLines,
      couplingIndex,
      cycleCount: topology.cycles.length,
    },
    moduleNodes: finalNodes,
  };
}
