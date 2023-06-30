import Link from '~components/base/Link';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

function Security() {
  return (
    <ContentSection>
      <Stack py={50}>
        <Title>Security</Title>
        <Title size="h3">Find Vulnerability and Get Rewards</Title>
        <Text size="lg">
          Please send your security report to
          {' '}
          <Link href="mailto:admin@fishprovider.com" target="_blank">admin@fishprovider.com</Link>
        </Text>
        <Text size="lg">
          We will review asap and reward you. Thank you!
        </Text>
      </Stack>
    </ContentSection>
  );
}

export default Security;
