import { CopyButton as MCopyButton } from '@mantine/core';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';

interface Props {
  href: string;
  children: React.ReactNode;
}

export default function CopyButton({ href, children }: Props) {
  return (
    <MCopyButton value={href} timeout={2000}>
      {({ copied, copy }) => (
        <Group spacing="xs">
          {children}
          {copied
            ? <Icon color="teal" size="small" name="Check" />
            : <Icon color="grey" size="small" name="ContentCopy" button onClick={copy} />}
        </Group>
      )}
    </MCopyButton>
  );
}
