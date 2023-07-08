import { ErrorType } from '@fishprovider/utils/constants/error';
import type { User } from '@fishprovider/utils/types/User.model';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

import type { AskParams, AskResult, ChatMessage } from '~types/OpenAI.model';

const env = {
  openApiKey: process.env.OPENAI_API_KEY,
};

const configuration = new Configuration({
  apiKey: env.openApiKey,
});

const openai = new OpenAIApi(configuration);

async function ask({ input, tag, history }: AskParams): Promise<AskResult> {
  const chatMessages = (history ?? []).reduce<ChatCompletionRequestMessage[]>((acc, item) => {
    const { input: itemInput, completion: itemCompletion } = item;

    acc.push({ role: 'user', content: itemInput });
    acc.push({ role: 'assistant', content: itemCompletion });

    return acc;
  }, []);

  chatMessages.push({ role: 'user', content: input });

  const completion = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: chatMessages,
  });

  const answer = completion.data.choices[0]?.message?.content ?? '';

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
