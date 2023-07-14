import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import _ from 'lodash';

import Link from '~components/base/Link';
import { toStrategy } from '~libs/routes';

interface Props {
  parentIds?: string[],
}

function ParentLinks({ parentIds = [] }: Props) {
  const accounts = storeAccounts.useStore((state) => _.pick(state, parentIds));

  if (!parentIds?.length) return null;

  return (
    <>
      {parentIds.map((parentId) => (
        <Link key={parentId} href={toStrategy(parentId)} variant="hoverOnly">
          {`${accounts[parentId]?.icon || ''} ${accounts[parentId]?.name || parentId}`}
        </Link>
      ))}
    </>
  );
}

export default ParentLinks;
