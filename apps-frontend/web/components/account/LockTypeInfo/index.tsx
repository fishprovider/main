import { AccountLock, AccountLockType } from '@fishprovider/core';

import Title from '~ui/core/Title';

interface Props {
  lock: AccountLock;
}

function LockTypeInfo({ lock }: Props) {
  const { type, value } = lock;
  switch (type) {
    case AccountLockType.open: return <Title size="h4">❌ Open Order</Title>;
    case AccountLockType.update: return <Title size="h4">❌ Update Order</Title>;
    case AccountLockType.close: return <Title size="h4">❌ Close Order</Title>;
    case AccountLockType.pairs: {
      const pairs = (value as string[] | undefined)?.join(', ');
      return <Title size="h4">{`❌ Pairs ${pairs}`}</Title>;
    }
    default: return null;
  }
}

export default LockTypeInfo;
