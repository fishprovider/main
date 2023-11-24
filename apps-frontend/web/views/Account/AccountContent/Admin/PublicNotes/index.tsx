import storeUser from '@fishprovider/cross/dist/stores/user';

import AccountHtmlEditor from '~components/account/AccountHtmlEditor';
import { updateAccountController } from '~controllers/account.controller';

function PublicNotes() {
  const notes = storeUser.useStore((state) => state.activeProvider?.notes);

  const onSave = async (content?: string) => {
    const accountId = storeUser.getState().activeProvider?._id || '';

    updateAccountController({
      accountId,
    }, {
      notes: content,
    });
  };

  return (
    <AccountHtmlEditor
      title="📝 Public Notes"
      content={notes}
      onSave={onSave}
    />
  );
}

export default PublicNotes;
