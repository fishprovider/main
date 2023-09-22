import useMaxWidth from '~ui/styles/useMaxWidth';

import MenuItems from './MenuItems';

function MenuLeft() {
  const isDropdownOnly = useMaxWidth('450px');
  const isTiny = useMaxWidth('550px');
  const isMini = useMaxWidth('650px');
  const isSmall = useMaxWidth('750px');
  const isMedium = useMaxWidth('850px');
  const isLarge = useMaxWidth('1050px');

  if (isDropdownOnly) return <MenuItems numMenuItems={0} offset={1} />;
  if (isTiny) return <MenuItems numMenuItems={1} offset={1} />;
  if (isMini) return <MenuItems numMenuItems={2} offset={1} />;
  if (isSmall) return <MenuItems numMenuItems={3} offset={1} />;
  if (isMedium) return <MenuItems numMenuItems={4} offset={1} />;
  if (isLarge) return <MenuItems numMenuItems={5} />;
  return <MenuItems numMenuItems={100} />;
}

export default MenuLeft;
