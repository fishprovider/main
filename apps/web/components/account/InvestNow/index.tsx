import Box from '~ui/core/Box';
import Button from '~ui/core/Button';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import InvestModal from './InvestModal';

interface Props {
  providerId: string;
  size?: 'sm' | 'md';
}

function InvestNow({ providerId, size = 'md' }: Props) {
  const onInvest = (event: React.SyntheticEvent) => {
    event.preventDefault();
    openModal({
      title: <Title size="h4">How to Invest?</Title>,
      content: <InvestModal providerId={providerId} />,
    });
  };

  return (
    <Box>
      <Button color="green" size={size} onClick={onInvest}>Invest now ➜ 🏦</Button>
    </Box>
  );
}

export default InvestNow;
