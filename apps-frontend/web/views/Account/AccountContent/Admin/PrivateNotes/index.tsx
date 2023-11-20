import storeUser from '@fishprovider/cross/dist/stores/user';

import AccountHtmlEditor from '~components/account/AccountHtmlEditor';
import { updateAccountService } from '~services/account/updateAccount.service';

function PrivateNotes() {
  const privateNotes = storeUser.useStore((state) => state.activeProvider?.privateNotes);

  const onSave = async (content?: string) => {
    const accountId = storeUser.getState().activeProvider?._id || '';

    updateAccountService({
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
