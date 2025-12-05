export enum ViewMode {
  Split = 'SPLIT',
  Tab = 'TAB'
}

export enum ProcessStatus {
  Idle = 'IDLE',
  Success = 'SUCCESS',
  Error = 'ERROR',
  Processing = 'PROCESSING'
}

export interface ProcessingResult {
  text: string;
  error?: string;
}

export type AIProvider = 'OPENAI';

export interface OpenAIConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface ThemeConfig {
  name: string;
  classPrefix: string;
}

export interface AIConfig {
  provider: AIProvider;
  openAi: OpenAIConfig;
  theme: ThemeConfig;
}