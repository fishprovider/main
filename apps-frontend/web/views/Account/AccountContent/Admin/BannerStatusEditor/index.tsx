import { useCallback, useState } from 'react';

import AccountHtmlEditor from '~components/account/AccountHtmlEditor';
import { updateAccountController } from '~controllers/account.controller';
import { getUserInfoController, watchUserInfoController } from '~controllers/user.controller';
import useToggle from '~hooks/useToggle';
import ColorInput from '~ui/core/ColorInput';
import Switch from '~ui/core/Switch';

function BannerStatusEditor() {
  const bannerStatus = watchUserInfoController((state) => state.activeAccount?.bannerStatus);

  const [enabled, toggleEnabled] = useToggle(undefined);
  const [bgColor, setBgColor] = useState<string>();

  const editor = {
    enabled: enabled ?? bannerStatus?.enabled ?? false,
    bgColor: bgColor ?? bannerStatus?.bgColor,
  };

  const onSave = async (content?: string) => {
    const accountId = getUserInfoController().activeAccount?._id || '';

    updateAccountController({
      accountId,
    }, {
      bannerStatus: {
        ...editor,
        notes: content ?? bannerStatus?.notes,
      },
    });
  };

  const topControl = useCallback((isEdit: boolean) => (
    <Switch
      disabled={!isEdit}
      checked={editor.enabled}
      onChange={() => toggleEnabled()}
      label="Enabled"
    />
  ), [editor.enabled, toggleEnabled]);

  const bottomControl = useCallback((isEdit: boolean) => (
    <ColorInput
      disabled={!isEdit}
      value={editor.bgColor}
      onChange={(value) => setBgColor(value)}
      label="🎨 Banner Color"
    />
  ), [editor.bgColor]);

  return (
    <AccountHtmlEditor
      title="📣 Banner Status"
      content={bannerStatus?.notes}
      topControl={topControl}
      bottomControl={bottomControl}
      onSave={onSave}
      bgColor={editor.bgColor}
    />
  );
}

export default BannerStatusEditor;
