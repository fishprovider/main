import dynamic from 'next/dynamic';

import { useGGTranslate } from '~components/view/GGTranslate';
import AppShell from '~ui/core/AppShell';
import Box from '~ui/core/Box';
import Divider from '~ui/core/Divider';
import Skeleton from '~ui/core/Skeleton';

const PageProgress = dynamic(() => import('~ui/core/PageProgress'), { loading: () => <Skeleton height={4} /> });
const Header = dynamic(() => import('./Header'), { loading: () => <Skeleton height={50} /> });
const Footer = dynamic(() => import('./Footer'), { loading: () => <Skeleton height={350} /> });

interface Props {
  children: React.ReactNode;
}

function BaseLayout({ children }: Props) {
  const isUsedGGTranslate = useGGTranslate();
  return (
    <>
      <PageProgress />
      <AppShell
        header={<Header />}
        headerProps={{
          mt: isUsedGGTranslate ? 40 : 0,
        }}
      >
        <Box
          sx={(theme) => ({
            minHeight: 'calc(100vh - 400px)',
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
              minHeight: 'calc(100vh - 600px)',
            },
          })}
        >
          {children}
        </Box>
        <Divider />
        <Footer />
      </AppShell>
    </>
  );
}

export default BaseLayout;
