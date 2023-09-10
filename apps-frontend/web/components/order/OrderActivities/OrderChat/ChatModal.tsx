import orderGetManyInfo from '@fishprovider/cross/dist/api/orders/getManyInfo';
import orderUpdateSettings from '@fishprovider/cross/dist/api/orders/updateSettings';
import { useMutate } from '@fishprovider/cross/dist/libs/query';
import storeOrders from '@fishprovider/cross/dist/stores/orders';
import storeUser from '@fishprovider/cross/dist/stores/user';
import type { Chat } from '@fishprovider/utils/dist/types/Order.model';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';

import Avatar from '~ui/core/Avatar';
import Box from '~ui/core/Box';
import Button from '~ui/core/Button';
import Flex from '~ui/core/Flex';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import TextInput from '~ui/core/TextInput';
import Tooltip from '~ui/core/Tooltip';
import { toastError } from '~ui/toast';

interface Props {
  orderId: string,
  onClose?: () => void;
}

function ChatModal({ orderId, onClose }: Props) {
  const userId = storeUser.useStore((state) => state.info?._id);
  const order = storeOrders.useStore((state) => state[orderId]);

  const [chatInput, setChatInput] = useState('');

  const {
    providerId = '',
    chats = [],
  } = order || {};

  const { mutate: reload, isLoading: isLoadingReload } = useMutate({
    mutationFn: orderGetManyInfo,
  });

  const { mutate: send, isLoading: isLoadingSave } = useMutate({
    mutationFn: orderUpdateSettings,
  });

  const onReload = () => reload({ providerId, orderIds: [orderId], fields: ['chats'] });

  const onSend = () => {
    if (!chatInput) {
      toastError('Please enter your message');
      return;
    }
    send({
      providerId,
      orderId,
      chat: chatInput,
    }, {
      onSuccess: () => setChatInput(''),
      onError: (err) => toastError(`${err}`),
    });
  };

  const getMessage = (chat: Chat) => {
    if (chat.chatType === 'confidence') return `Set confidence to ${chat.message}`;
    if (chat.chatType === 'alarm') return chat.message === 'true' ? 'Turn on alarm' : 'Turn off alarm';
    if (chat.chatType === 'reborn') return chat.message === 'true' ? 'Enable reborn bot' : 'Disable reborn bot';
    return chat.message;
  };

  const renderChat = (chat: Chat, index: number) => {
    const label = chat.createdAt ? `${chat.userName}: ${moment(chat.createdAt).fromNow()}, ${moment(chat.createdAt)}` : 'Sending...';
    return chat.userId === userId ? (
      <Flex key={index} gap="sm" wrap="nowrap" justify="right" align="center" pl={30}>
        <Text ta="right">{getMessage(chat)}</Text>
        <Tooltip label={label} position="top-end"><Avatar size="sm" src={chat.userPicture} alt={chat.userId} /></Tooltip>
      </Flex>
    ) : (
      <Flex key={index} gap="sm" wrap="nowrap" justify="left" align="center" pr={30}>
        <Tooltip label={label} position="top-start"><Avatar size="sm" src={chat.userPicture} alt={chat.userId} /></Tooltip>
        <Text>{getMessage(chat)}</Text>
      </Flex>
    );
  };

  const renderEditor = () => (
    <Group>
      <TextInput
        value={chatInput}
        onChange={(event) => setChatInput(event.target.value)}
        placeholder="Add a chat"
        sx={{ flex: 1 }}
      />
      <Icon name="Send" button onClick={onSend} loading={isLoadingSave} />
    </Group>
  );

  return (
    <Stack>
      <Stack>
        <Box>{_.sortBy(chats, 'createdAt').map(renderChat)}</Box>
        {renderEditor()}
      </Stack>
      <Group position="right">
        <Icon name="Sync" button onClick={onReload} loading={isLoadingReload} tooltip="Refresh" />
        <Button variant="subtle" onClick={onClose}>Close</Button>
      </Group>
    </Stack>
  );
}

export default ChatModal;
