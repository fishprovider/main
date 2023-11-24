import _ from 'lodash';

import Link from '~components/base/Link';
import { watchAccountController } from '~controllers/account.controller';
import { toStrategy } from '~libs/routes';

interface Props {
  parentIds?: string[],
}

function ParentLinks({ parentIds = [] }: Props) {
  const accounts = watchAccountController((state) => _.pick(state, parentIds));

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
