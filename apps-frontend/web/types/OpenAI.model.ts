type ChatMessage = {
  input: string;
  completion: string
  tag?: string
};

type AskParams = {
  input: string;
  history?: ChatMessage[];
  tag?: string;
};

type AskResult = {
  message: ChatMessage
  history: ChatMessage[];
};

export type { AskParams, AskResult, ChatMessage };
