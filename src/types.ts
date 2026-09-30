export interface ToolInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'color' | 'range';
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ToolOutput {
  id: string;
  label: string;
  type: 'text' | 'code' | 'json' | 'markdown' | 'color' | 'alert';
  language?: string;
}

export interface CustomTool {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  category: string;
  tags: string[];
  inputs: ToolInput[];
  outputs: ToolOutput[];
  jsLogic: string;
  usageInstructions?: string;
  examplePrompt?: string;
  isAiGenerated?: boolean;
  isFavorite?: boolean;
  createdAt?: string;
}

export interface GithubRepoStatus {
  ok: boolean;
  owner?: string;
  repo?: string;
  fullName?: string;
  description?: string;
  isPrivate?: boolean;
  stars?: number;
  forks?: number;
  defaultBranch?: string;
  commitsCount?: number;
  isEmpty?: boolean;
  updatedAt?: string;
  htmlUrl?: string;
  error?: string;
}
