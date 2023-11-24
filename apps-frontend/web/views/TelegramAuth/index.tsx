import { apiPost } from '@fishprovider/cross/dist/libs/api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import Routes from '~libs/routes';
import Loading from '~ui/core/Loading';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';
import { toastError, toastSuccess } from '~ui/toast';

function TelegramAuth() {
  const router = useRouter();
  const { query } = router;

  const isServerLoggedIn = watchUserInfoController((state) => state.isServerLoggedIn);

  useEffect(() => {
    if (isServerLoggedIn && query) {
      apiPost<boolean>('/accounts/telegram/auth', query).then(() => {
        toastSuccess('Linked successfully');
      }).catch((err) => {
        toastError(`Failed to link: ${err}`);
      }).finally(() => {
        router.push(Routes.user);
      });
    }
  }, [router, isServerLoggedIn, query]);

  return (
    <ContentSection>
      <Stack py="xl">
        <Title>Telegram Auth</Title>
        <Loading />
      </Stack>
    </ContentSection>
  );
}

export default TelegramAuth;
