import accountUpdate from '@fishprovider/cross/api/accounts/update';
import storeUser from '@fishprovider/cross/stores/user';

import AccountHtmlEditor from '~components/account/AccountHtmlEditor';

function PublicNotes() {
  const notes = storeUser.useStore((state) => state.activeProvider?.notes);

  const onSave = async (content?: string) => {
    const providerId = storeUser.getState().activeProvider?._id || '';

    accountUpdate({
      providerId,
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
