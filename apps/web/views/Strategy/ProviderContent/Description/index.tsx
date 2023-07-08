import storeUser from '@fishprovider/cross/stores/user';

import HtmlEditor from '~ui/core/HtmlEditor';

function Description() {
  const notes = storeUser.useStore((state) => state.activeProvider?.notes);
  return <HtmlEditor readOnly readOnlyValue={notes} />;
}

export default Description;
