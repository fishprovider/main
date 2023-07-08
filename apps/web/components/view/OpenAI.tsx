import { apiPost } from '@fishprovider/cross/libs/api';
import storeUser from '@fishprovider/cross/stores/user';
import parse from 'html-react-parser';
import { useState } from 'react';

import type { AskResult, ChatMessage } from '~types/OpenAI.model';
import Avatar from '~ui/core/Avatar';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Textarea from '~ui/core/Textarea';
import { toastWarn } from '~ui/toast';

const jsonToHtml = (data: any = '') => JSON.stringify(data, (_key, value) => {
  if (typeof value === 'string') {
    return value.replaceAll('\n', '<br />');
  }
  return value;
}, 2);

function JsonViewer({ data }: { data: any }) {
  return (
    <Text style={{ whiteSpace: 'pre-wrap' }}>
      {parse(jsonToHtml(data))}
    </Text>
  );
}

function OpenAI() {
  const {
    userPicture,
    isServerLoggedIn,
  } = storeUser.useStore((state) => ({
    userPicture: state.info?.picture,
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const onAsk = () => {
    if (!isServerLoggedIn) {
      toastWarn('Please login first');
      return;
    }

    setLoading(true);
    apiPost<AskResult>('/openai/ask', { input, history }).then((answer) => {
      setHistory(answer.history);
      setInput('');
    }).finally(() => setLoading(false));
  };

  const renderChatMessage = (message: ChatMessage, index: number) => (
    <Stack key={index}>
      <Group position="right">
        <Avatar src={userPicture} />
        <Text span size="sm">
          <JsonViewer data={message.input} />
        </Text>
      </Group>
      <Group>
        <Avatar src="/icons/bot.png" />
        <Text span size="sm">
          <JsonViewer data={message.completion} />
        </Text>
      </Group>
    </Stack>
  );

  return (
    <>
      <Stack>
        {history.map(renderChatMessage)}
      </Stack>
      <Textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        autosize
      />
      <Button onClick={onAsk} loading={loading}>Ask</Button>
    </>
  );
}

export default OpenAI;
