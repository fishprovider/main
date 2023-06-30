import { Menu as MMenu, MenuProps } from '@mantine/core';
import { Fragment } from 'react';

interface MenuItem {
  key: string;
  content?: React.ReactNode;
  label?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onClick?: () => void;
}

interface Props extends MenuProps {
  children: React.ReactNode;
  items: MenuItem[];
}

function Menu({ children, items, ...rest }: Props) {
  return (
    <MMenu {...rest}>
      <MMenu.Target>
        {children}
      </MMenu.Target>
      <MMenu.Dropdown>
        {items.map((item, index) => (item.label ? (
          <MMenu.Label key={item.key}>
            {item.label}
          </MMenu.Label>
        ) : (
          <Fragment key={item.key}>
            <MMenu.Item
              onClick={() => {
                if (item.onClick) item.onClick();
              }}
              icon={item.left}
              rightSection={item.right}
            >
              {item.content}
            </MMenu.Item>
            {index < items.length - 1 && <MMenu.Divider key={`${item.key}-divider`} />}
          </Fragment>
        )))}
      </MMenu.Dropdown>
    </MMenu>
  );
}

export default Menu;

export type {
  MenuItem,
};
