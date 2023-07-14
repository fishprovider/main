import accountUpdate from '@fishprovider/cross/dist/api/accounts/update';
import storeUser from '@fishprovider/cross/dist/stores/user';

import AccountHtmlEditor from '~components/account/AccountHtmlEditor';

function PrivateNotes() {
  const privateNotes = storeUser.useStore((state) => state.activeProvider?.privateNotes);

  const onSave = async (content?: string) => {
    const providerId = storeUser.getState().activeProvider?._id || '';

    accountUpdate({
      providerId,
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
