import Stack from '~ui/core/Stack';

import AccountEdit from './AccountEdit';
import AccountRemove from './AccountRemove';
import BannerStatusEditor from './BannerStatusEditor';
import EditMembers from './EditMembers';
import PrivateNotes from './PrivateNotes';
import PublicNotes from './PublicNotes';

function Admin() {
  return (
    <Stack pt="md">
      <AccountEdit />
      <PrivateNotes />
      <PublicNotes />
      <BannerStatusEditor />
      <EditMembers />
      <AccountRemove />
    </Stack>
  );
}

export default Admin;
