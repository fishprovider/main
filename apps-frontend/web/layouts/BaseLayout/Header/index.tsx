import Group from '~ui/core/Group';

import MenuLeft from './MenuLeft';
import MenuRight from './MenuRight';
import NewVersionBanner from './NewVersionBanner';

function Header() {
  return (
    <>
      <NewVersionBanner />
      <Group position="apart" noWrap>
        <MenuLeft />
        <MenuRight />
      </Group>
    </>
  );
}

export default Header;
