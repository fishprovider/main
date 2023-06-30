import accountUpdate from '@fishbot/cross/api/accounts/update';
import storeUser from '@fishbot/cross/stores/user';
import { useCallback, useState } from 'react';

import AccountHtmlEditor from '~components/account/AccountHtmlEditor';
import useToggle from '~hooks/useToggle';
import ColorInput from '~ui/core/ColorInput';
import Switch from '~ui/core/Switch';

function BannerStatusEditor() {
  const bannerStatus = storeUser.useStore((state) => state.activeProvider?.bannerStatus);

  const [enabled, toggleEnabled] = useToggle(undefined);
  const [bgColor, setBgColor] = useState<string>();

  const editor = {
    enabled: enabled ?? bannerStatus?.enabled ?? false,
    bgColor: bgColor ?? bannerStatus?.bgColor,
  };

  const onSave = async (content?: string) => {
    const providerId = storeUser.getState().activeProvider?._id || '';

    accountUpdate({
      providerId,
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
