import { LockType } from '@fishbot/utils/constants/account';
import type { Lock } from '@fishbot/utils/types/Account.model';

import Title from '~ui/core/Title';

interface Props {
  lock: Lock;
}

function LockTypeInfo({ lock }: Props) {
  const { type, value } = lock;
  switch (type) {
    case LockType.open: return <Title size="h4">❌ Open Order</Title>;
    case LockType.update: return <Title size="h4">❌ Update Order</Title>;
    case LockType.close: return <Title size="h4">❌ Close Order</Title>;
    case LockType.pairs: {
      const pairs = (value as string[] | undefined)?.join(', ');
      return <Title size="h4">{`❌ Pairs ${pairs}`}</Title>;
    }
    default: return null;
  }
}

export default LockTypeInfo;
