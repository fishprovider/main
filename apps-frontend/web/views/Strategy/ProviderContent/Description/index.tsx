import { watchUserInfoController } from '~controllers/user.controller';
import HtmlEditor from '~ui/core/HtmlEditor';

function Description() {
  const notes = watchUserInfoController((state) => state.activeAccount?.notes);
  return <HtmlEditor readOnly readOnlyValue={notes} />;
}

export default Description;
