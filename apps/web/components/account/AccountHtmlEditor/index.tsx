import storeUser from '@fishprovider/cross/stores/user';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import Box from '~ui/core/Box';
import Group from '~ui/core/Group';
import HtmlEditor from '~ui/core/HtmlEditor';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';

interface Props {
  title?: string;
  content?: string;
  topControl?: (isEdit: boolean) => ReactNode;
  bottomControl?: (isEdit: boolean) => ReactNode;
  onSave?: (content: string) => Promise<void>;
  bgColor?: string;
}

function AccountHtmlEditor({
  title = '',
  content = '',
  topControl = () => undefined,
  bottomControl = () => undefined,
  onSave = async () => undefined,
  bgColor,
}: Props) {
  const providerId = storeUser.useStore((state) => state.activeProvider?._id);

  const [isEdit, setIsEdit] = useState(false);
  const [inputContent, setInputContent] = useState('');

  useEffect(() => {
    setIsEdit(false);
    setInputContent('');
  }, [providerId]);

  const onSubmit = async () => {
    if (!(await openConfirmModal())) return;

    onSave(inputContent).then(() => setIsEdit(false));
  };

  const renderToolbar = () => {
    if (isEdit) {
      return (
        <>
          <Icon name="Close" button onClick={() => setIsEdit(false)} tooltip="Cancel" />
          <Icon name="Save" button onClick={onSubmit} tooltip="Save" />
        </>
      );
    }
    return <Icon name="Edit" button onClick={() => setIsEdit(true)} tooltip="Edit" />;
  };

  return (
    <Stack>
      <Group>
        <Title size="h4">{title}</Title>
        {renderToolbar()}
      </Group>
      {topControl(isEdit)}
      <Box bg={bgColor}>
        {isEdit ? (
          <HtmlEditor initialValue={content} onChange={setInputContent} />
        ) : (
          <HtmlEditor readOnly readOnlyValue={content} />
        )}
      </Box>
      {bottomControl(isEdit)}
    </Stack>
  );
}

export default AccountHtmlEditor;
