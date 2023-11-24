import RequiredLoginView from '~components/user/RequiredLoginView';
import { watchUserInfoController } from '~controllers/user.controller';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

interface Props {
  title: string;
  children: React.ReactNode;
}

function UserProvider({ title, children }: Props) {
  const isServerLoggedIn = watchUserInfoController((state) => state.isServerLoggedIn);

  Logger.debug('[render] UserProvider', isServerLoggedIn);

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

export default UserProvider;
