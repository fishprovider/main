import { getRoleProvider } from '@fishprovider/core';

import Link from '~components/base/Link';
import { watchUserInfoController } from '~controllers/user.controller';
import { toAccount } from '~libs/routes';
import Button from '~ui/core/Button';

interface Props {
  providerId: string;
}

function TradeNow({ providerId }: Props) {
  const roles = watchUserInfoController((state) => state.activeUser?.roles);

  const { isViewerProvider } = getRoleProvider(roles, providerId);

  if (!isViewerProvider) return null;

  return (
    <Link href={toAccount(providerId)}>
      <Button size="md">Trade Now ➜ 📈</Button>
    </Link>
  );
}

export default TradeNow;
