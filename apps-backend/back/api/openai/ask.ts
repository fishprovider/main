import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

import type { AskParams, AskResult, ChatMessage } from '~types/OpenAI.model';

const env = {
  openApiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI({
  apiKey: env.openApiKey,
});

async function ask({ input, tag, history }: AskParams): Promise<AskResult> {
  const chatMessages = (history ?? []).reduce<ChatCompletionMessageParam[]>((acc, item) => {
    const { input: itemInput, completion: itemCompletion } = item;

    acc.push({ role: 'user', content: itemInput });
    acc.push({ role: 'assistant', content: itemCompletion });

    return acc;
  }, []);

  chatMessages.push({ role: 'user', content: input });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-32k',
    messages: chatMessages,
  });

  const answer = completion.choices[0]?.message?.content ?? '';

  const message: ChatMessage = { input, completion: answer, tag };
  const newHistory = [...(history ?? []), message];

  return {
    message,
    history: newHistory,
  };
}

const openaiAsk = async ({ data, userInfo }: {
  data: {
    input: string,
    history?: ChatMessage[],
  }
  userInfo: User,
}) => {
  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const { input, history } = data;

  const answer = await ask({ input, history });

  return { result: answer };
};

export default openaiAsk;
