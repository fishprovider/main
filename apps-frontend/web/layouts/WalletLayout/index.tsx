import dynamic from 'next/dynamic';

import Box from '~ui/core/Box';
import Flex from '~ui/core/Flex';
import Stack from '~ui/core/Stack';
import ContentSection from '~ui/layouts/ContentSection';
import useTablet from '~ui/styles/useTablet';

const WalletNavbar = dynamic(() => import('./WalletNavbar'));

interface Props {
  children: React.ReactNode;
}

function WalletLayout({ children }: Props) {
  const isMiniMenu = useTablet();

  if (isMiniMenu) {
    return (
      <ContentSection>
        <Stack>
          <WalletNavbar miniMenu />
          <Box>{children}</Box>
        </Stack>
      </ContentSection>
    );
  }

  return (
    <ContentSection>
      <Flex>
        <WalletNavbar />
        <Box sx={{ flex: 1 }}>{children}</Box>
      </Flex>
    </ContentSection>
  );
}

export default WalletLayout;
