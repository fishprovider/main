import { MantineProvider } from '@mantine/core';

interface Props {
  children: React.ReactNode;
  colorScheme: 'light' | 'dark';
}

function ThemeProvider({ children, colorScheme }: Props) {
  return (
    <MantineProvider
      theme={{
        colorScheme,
      }}
    >
      {children}
    </MantineProvider>
  );
}

export default ThemeProvider;
