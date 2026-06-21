import { ModuleDefinition, ModuleNode } from '../types/architecture';

/**
 * Resolves a topological order and layer depth level for each module in the project.
 * Implements cycle identification (DFS back-edge detection) to flag circular dependencies.
 */
export function resolveTopology(modules: ModuleDefinition[]): {
  nodes: ModuleNode[];
  cycles: string[][]; // paths of circular dependencies e.g. [['A', 'B', 'A']]
  order: string[]; // topological sort sequence
} {
  const nodesMap = new Map<string, ModuleNode>();
  
  // Initialize module node representations
  modules.forEach((mod) => {
    nodesMap.set(mod.id, {
      id: mod.id,
      label: mod.name,
      level: 0,
      dependencies: [...mod.allowedDependencies],
      fileCount: 0,
      totalLines: 0,
    });
  });

  const cycles: string[][] = [];
  const visited = new Map<string, 'unvisited' | 'visiting' | 'visited'>();
  modules.forEach((mod) => visited.set(mod.id, 'unvisited'));

  // Simple cycle-finding via DFS path tracking
  const path: string[] = [];
  
  function dfs(u: string) {
    visited.set(u, 'visiting');
    path.push(u);

    const node = nodesMap.get(u);
    if (node) {
      for (const v of node.dependencies) {
        if (!nodesMap.has(v)) continue; // ignore non-existent dependencies
        
        const state = visited.get(v);
        if (state === 'visiting') {
          // Cycle found! Extract the cycle path
          const cycleStartIndex = path.indexOf(v);
          if (cycleStartIndex !== -1) {
            const cyclePath = [...path.slice(cycleStartIndex), v];
            cycles.push(cyclePath);
          }
        } else if (state === 'unvisited') {
          dfs(v);
        }
      }
    }

    path.pop();
    visited.set(u, 'visited');
  }

  // Run DFS on all components to catch cycles
  modules.forEach((mod) => {
    if (visited.get(mod.id) === 'unvisited') {
      dfs(mod.id);
    }
  });

  // Level computation using dynamic programming or relaxation
  // Lower modules have no dependencies (level 0). High modules depend on low ones.
  const levels = new Map<string, number>();
  modules.forEach((m) => levels.set(m.id, 0));

  let relaxed = true;
  const maxIterations = modules.length * 2; // Safeguard limit
  let iter = 0;

  while (relaxed && iter < maxIterations) {
    relaxed = false;
    for (const mod of modules) {
      const currentLevel = levels.get(mod.id) || 0;
      for (const depId of mod.allowedDependencies) {
        if (!levels.has(depId)) continue;
        const depLevel = levels.get(depId) || 0;
        // The depending module level should be at least (depLevel + 1)
        if (currentLevel <= depLevel) {
          levels.set(mod.id, depLevel + 1);
          relaxed = true;
        }
      }
    }
    iter++;
  }

  // Apply computed levels to nodes and flag circular participants
  const cycleParticipants = new Set(cycles.flat());
  const resolvedNodes = modules.map((mod) => {
    const node = nodesMap.get(mod.id)!;
    node.level = levels.get(mod.id) || 0;
    node.isCycleParticipant = cycleParticipants.has(mod.id);
    return node;
  });

  // Topological sorting using indegrees (Kahn's or post-order DFS retrieval)
  const order: string[] = [];
  const topologicalVisited = new Set<string>();
  
  function visitTopological(id: string) {
    if (topologicalVisited.has(id)) return;
    topologicalVisited.add(id);
    const node = nodesMap.get(id);
    if (node) {
      node.dependencies.forEach((depId) => {
        if (nodesMap.has(depId)) {
          visitTopological(depId);
        }
      });
    }
    order.push(id);
  }

  modules.forEach((m) => visitTopological(m.id));

  return {
    nodes: resolvedNodes,
    cycles,
    order,
  };
}
