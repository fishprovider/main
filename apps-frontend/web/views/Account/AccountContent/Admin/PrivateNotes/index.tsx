import storeUser from '@fishprovider/cross/dist/stores/user';

import AccountHtmlEditor from '~components/account/AccountHtmlEditor';
import { updateAccountController } from '~controllers/account.controller';

function PrivateNotes() {
  const privateNotes = storeUser.useStore((state) => state.activeProvider?.privateNotes);

  const onSave = async (content?: string) => {
    const accountId = storeUser.getState().activeProvider?._id || '';

    updateAccountController({
      accountId,
    }, {
      privateNotes: content,
    });
  };

  return (
    <AccountHtmlEditor
      title="📝 Private Notes"
      content={privateNotes}
      onSave={onSave}
    />
  );
}

export default PrivateNotes;
