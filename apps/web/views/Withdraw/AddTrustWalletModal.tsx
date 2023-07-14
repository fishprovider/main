import walletAdd from '@fishprovider/cross/dist/api/wallet/add';
import { useState } from 'react';

import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';
import TextInput from '~ui/core/TextInput';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastSuccess } from '~ui/toast';

interface Props {
  onClose?: () => void;
}

function AddTrustWalletModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USDT');
  const [address, setAddress] = useState('');

  const onSave = async () => {
    if (!(await openConfirmModal())) return;

    walletAdd({ name, currency, address }).then(() => {
      toastSuccess('Done');
      if (onClose) onClose();
    });
  };

  const renderContent = () => (
    <>
      <TextInput
        value={name}
        onChange={(event) => setName(event.target.value)}
        label="Name"
        placeholder="USDT MetaMask"
      />
      <Select
        data={[
          {
            label: 'USDT (ERC20)',
            value: 'USDT',
          },
          {
            label: 'USDC (ERC20)',
            value: 'USDC',
          },
        ]}
        value={currency}
        onChange={(value) => {
          if (value) setCurrency(value);
        }}
        label="Currency"
      />
      <TextInput
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        label="Address"
        placeholder="0x21d63aee4623cb6d242d9997b84eb95b5eee5404"
      />
    </>
  );

  return (
    <Stack>
      {renderContent()}
      <Group position="right">
        <Button onClick={onSave}>Save</Button>
        <Button onClick={onClose} variant="subtle">Close</Button>
      </Group>
    </Stack>
  );
}

export default AddTrustWalletModal;
