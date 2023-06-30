import useTablet from '~ui/styles/useTablet';

import MenuFull from './MenuFull';
import MenuMini from './MenuMini';

function MenuLeft() {
  const isMiniMenu = useTablet();

  return isMiniMenu ? <MenuMini /> : <MenuFull />;
}

export default MenuLeft;
