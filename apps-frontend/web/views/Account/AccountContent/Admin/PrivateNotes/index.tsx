import AccountHtmlEditor from '~components/account/AccountHtmlEditor';
import { updateAccountController } from '~controllers/account.controller';
import { getUserInfoController, watchUserInfoController } from '~controllers/user.controller';

function PrivateNotes() {
  const privateNotes = watchUserInfoController((state) => state.activeAccount?.privateNotes);

  const onSave = async (content?: string) => {
    const accountId = getUserInfoController().activeAccount?._id || '';

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
