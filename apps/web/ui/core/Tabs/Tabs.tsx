import { Tabs as MTabs, TabsProps } from '@mantine/core';

interface Props extends TabsProps {
  keepMounted?: boolean,
}

function Tabs({
  keepMounted = false,
  ...rest
}: Props) {
  return (
    <MTabs
      keepMounted={keepMounted}
      {...rest}
    />
  );
}

Tabs.List = MTabs.List;
Tabs.Tab = MTabs.Tab;
Tabs.Panel = MTabs.Panel;

export default Tabs;
