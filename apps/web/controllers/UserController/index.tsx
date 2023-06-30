import storeUser from '@fishbot/cross/stores/user';

import RequiredLoginView from '~components/user/RequiredLoginView';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

interface Props {
  title: string;
  children: React.ReactNode;
}

function UserController({ title, children }: Props) {
  const isServerLoggedIn = storeUser.useStore((state) => state.isServerLoggedIn);

  Logger.debug('[render] UserController', isServerLoggedIn);

  if (!isServerLoggedIn) {
    return (
      <ContentSection>
        <Stack py="xl">
          {title && <Title>{title}</Title>}
          <RequiredLoginView title="> Login to view this section" useLoadingSteps />
        </Stack>
      </ContentSection>
    );
  }

  return (
    <div>
      {children}
    </div>
  );
}

export default UserController;
