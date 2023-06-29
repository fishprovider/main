import storeUser from '@fishbot/cross/stores/user';
import { useRouter } from 'next/router';

import Link from '~components/base/Link';
import LoadingSteps from '~components/base/LoadingSteps';
import Routes from '~libs/routes';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Loading from '~ui/core/Loading';
import Title from '~ui/core/Title';

interface Props {
  title?: string;
  useLoadingSteps?: boolean;
}

function RequiredLoginView({ title, useLoadingSteps }: Props) {
  const router = useRouter();

  const isClientLoggedIn = storeUser.useStore((state) => state.isClientLoggedIn);

  if (isClientLoggedIn === undefined) {
    return useLoadingSteps ? <LoadingSteps /> : <Loading inline />;
  }

  return (
    <Group>
      {title && <Title size="h6">{title}</Title>}
      <Link href={`${Routes.login}?redirectUrl=${router.asPath}`} variant="clean">
        <Button>Login Now ➜ 👤</Button>
      </Link>
    </Group>
  );
}

export default RequiredLoginView;
