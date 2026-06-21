import { VirtualFile } from '../types/architecture';

export const sampleCodebase: VirtualFile[] = [
  {
    path: "src/utils/math.ts",
    content: `/**
 * Pure math helper utilities
 */
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}
`
  },
  {
    path: "src/components/Card.tsx",
    content: `import React from 'react';
import { add } from '../utils/math';

interface CardProps {
  title: string;
  count: number;
}

export const Card: React.FC<CardProps> = ({ title, count }) => {
  const result = add(count, 10); // uses helper

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">Calculated value of state offset: {result}</p>
    </div>
  );
};
`
  },
  {
    path: "src/api/client.ts",
    content: `import { Card } from '../components/Card'; // ❌ ILLEGAL BOUNDARY: API cannot import UI
import { add } from '../utils/math';

export interface User {
  id: string;
  name: string;
  role: string;
}

// Intentional boilerplate to blow past line counts limit
export async function fetchUsers(): Promise<User[]> {
  console.log("fetching users..."); // ❌ FORBIDDEN PATTERN warning
  return [
    { id: "1", name: "Simon", role: "admin" },
    { id: "2", name: "Architect", role: "moderator" }
  ];
}

// Extra mock methods to artificially extend file lines
export const API_METADATA = {
  version: "1.0",
  endpoints: ["/users", "/posts", "/metrics"],
  secure: true
};

${Array.from({ length: 45 }).map((_, i) => `// Boilerplate line ${i + 1} to simulate long enterprise server modules that should be broken down.`).join('\n')}

export async function fetchHealth(): Promise<boolean> {
  eval("console.log('dangerous evaluation')"); // ❌ FORBIDDEN PATTERN matching
  return true;
}
`
  },
  {
    path: "src/stores/authStore.ts",
    content: `import { fetchUsers, User } from '../api/client';

export class AuthStore {
  private user: User | null = null;

  async login() {
    const list = await fetchUsers();
    this.user = list[0] || null;
  }

  isLoggedIn() {
    return this.user !== null;
  }
}
`
  },
  {
    path: "src/utils/security.ts",
    content: `// Simple stateless encryption mockup
export function hash(token: string): string {
  return btoa(token);
}
`
  }
];
