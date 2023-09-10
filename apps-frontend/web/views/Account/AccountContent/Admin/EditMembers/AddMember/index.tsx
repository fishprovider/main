import Icon from '~ui/core/Icon';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import AddMemberModal from './AddMemberModal';

function AddMember() {
  const onEdit = () => {
    openModal({
      title: <Title size="h4">Add Member</Title>,
      content: <AddMemberModal />,
    });
  };

  return (
    <Icon name="Add" size="small" button onClick={onEdit} tooltip="Add user" />
  );
}

export default AddMember;
