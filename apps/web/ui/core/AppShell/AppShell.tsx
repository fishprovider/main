import {
  AppShell as MAppShell, AppShellProps, Footer, FooterProps,
  Header, HeaderProps, Navbar, NavbarProps,
} from '@mantine/core';

interface Props extends AppShellProps {
  header?: React.ReactElement;
  headerHeight?: number;
  headerProps?: Partial<HeaderProps>;

  footer?: React.ReactElement;
  footerHeight?: number;
  footerProps?: Partial<FooterProps>;

  navbar?: React.ReactElement;
  navbarHeight?: number;
  navbarProps?: Partial<NavbarProps>;

  padding?: number | string;
  children: React.ReactNode;
}

function AppShell({
  header,
  headerHeight = 50,
  headerProps,

  footer,
  footerHeight = 50,
  footerProps,

  navbar,
  navbarHeight = 50,
  navbarProps,

  padding = 0,
  children,
}: Props) {
  return (
    <MAppShell
      padding={padding}
      {...header && {
        header: (
          <Header
            height={headerHeight}
            zIndex={101}
            {...headerProps}
          >
            {header}
          </Header>
        ),
      }}
      {...footer && {
        footer: (
          <Footer
            height={footerHeight}
            {...footerProps}
          >
            {footer}
          </Footer>
        ),
      }}
      {...navbar && {
        navbar: (
          <Navbar
            height={navbarHeight}
            {...navbarProps}
          >
            {navbar}
          </Navbar>
        ),
      }}
    >
      {children}
    </MAppShell>
  );
}

export default AppShell;
