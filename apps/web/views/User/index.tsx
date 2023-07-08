import userGetInfo from '@fishprovider/cross/api/users/getInfo';
import { useQuery } from '@fishprovider/cross/libs/query';
import storeUser from '@fishprovider/cross/stores/user';
import { useState } from 'react';

import VerifyPhone from '~components/user/VerifyPhone';
import { queryKeys } from '~constants/query';
import { changePassword, changeProfile, resetPassword } from '~libs/auth';
import Avatar from '~ui/core/Avatar';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import PasswordInput from '~ui/core/PasswordInput';
import Stack from '~ui/core/Stack';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';
import openConfirmModal from '~ui/modals/openConfirmModal';
import { toastError } from '~ui/toast';
import { refreshMS } from '~utils';

function User() {
  const {
    userId,
    email,
    name,
    picture,
  } = storeUser.useStore((state) => ({
    userId: state.info?._id,
    email: state.info?.email,
    name: state.info?.name,
    picture: state.info?.picture,
  }));

  const [nameInput, setNameInput] = useState('');
  const [pictureInput, setPictureInput] = useState('');
  const [pass, setPass] = useState('');
  const [passConfirm, setPassConfirm] = useState('');

  useQuery({
    queryFn: () => userGetInfo({}),
    queryKey: queryKeys.user(userId),
    enabled: !!userId,
    refetchInterval: refreshMS,
  });

  const renderProfile = () => (
    <Stack>
      <Title size="h2">Profile</Title>
      <Group>
        <Avatar src={pictureInput || picture} alt="avatar" />
        {`Email: ${email}`}
      </Group>
      <TextInput
        label="Name"
        defaultValue={name}
        onChange={(event) => setNameInput(event.target.value)}
      />
      <TextInput
        label="Avatar URL"
        defaultValue={picture}
        onChange={(event) => setPictureInput(event.target.value)}
      />
      <span>
        <Button
          onClick={() => {
            if (!nameInput && !pictureInput) {
              toastError('Nothing changes');
              return;
            }
            changeProfile({
              name: nameInput,
              picture: pictureInput,
            });
          }}
        >
          Update profile
        </Button>
      </span>
    </Stack>
  );

  const renderPassword = () => (
    <Stack>
      <Title size="h2">Password</Title>
      <PasswordInput
        label="Password"
        required
        onChange={(event) => setPass(event.target.value)}
      />
      <PasswordInput
        label="Confirm Password"
        required
        onChange={(event) => setPassConfirm(event.target.value)}
      />
      <Group>
        <Button
          onClick={() => {
            if (!pass) {
              toastError('Password is required, but empty');
              return;
            }
            if (pass !== passConfirm) {
              toastError('Password and Confirm Password are not match');
              return;
            }
            changePassword(pass);
          }}
        >
          Update password
        </Button>
        <Button
          onClick={async () => {
            if (!(await openConfirmModal())) return;

            resetPassword();
          }}
          color="orange"
        >
          Reset password
        </Button>
      </Group>
    </Stack>
  );

  return (
    <ContentSection>
      <Stack py="xl" spacing="xl">
        <Title>User Settings</Title>
        <VerifyPhone />
        {renderProfile()}
        {renderPassword()}
      </Stack>
    </ContentSection>
  );
}

export default User;
