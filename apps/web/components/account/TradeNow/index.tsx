import storeUser from '@fishprovider/cross/dist/stores/user';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';

import Link from '~components/base/Link';
import { toAccount } from '~libs/routes';
import Button from '~ui/core/Button';

interface Props {
  providerId: string;
}

function TradeNow({ providerId }: Props) {
  const roles = storeUser.useStore((state) => state.info?.roles);

  const { isViewerProvider } = getRoleProvider(roles, providerId);

  if (!isViewerProvider) return null;

  return (
    <Link href={toAccount(providerId)}>
      <Button size="md">Trade Now ➜ 📈</Button>
    </Link>
  );
}

export default TradeNow;
