import AccountHtmlEditor from '~components/account/AccountHtmlEditor';
import { updateAccountController } from '~controllers/account.controller';
import { getUserInfoController, watchUserInfoController } from '~controllers/user.controller';

function PublicNotes() {
  const notes = watchUserInfoController((state) => state.activeAccount?.notes);

  const onSave = async (content?: string) => {
    const accountId = getUserInfoController().activeAccount?._id || '';

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
