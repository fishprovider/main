import useMaxWidth from '~ui/styles/useMaxWidth';

import MenuFull from './MenuFull';
import MenuMini from './MenuMini';

function MenuLeft() {
  return useMaxWidth('1000px') ? <MenuMini /> : <MenuFull />;
}

export default MenuLeft;
