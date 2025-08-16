export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  game: string;
  mode: string;
  message: string;
  chatHistory: Array<{role: 'user' | 'assistant', content: string}>;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
}