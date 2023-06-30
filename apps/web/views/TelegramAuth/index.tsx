import { apiPost } from '@fishbot/cross/libs/api';
import storeUser from '@fishbot/cross/stores/user';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Routes from '~libs/routes';
import Loading from '~ui/core/Loading';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';
import { toastError, toastSuccess } from '~ui/toast';

function TelegramAuth() {
  const router = useRouter();
  const { query } = router;

  const isServerLoggedIn = storeUser.useStore((state) => state.isServerLoggedIn);

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
