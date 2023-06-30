import Link from '~components/base/Link';
import Card from '~ui/core/Card';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import ThemeProvider from '~ui/themes/ThemeProvider';

function ReviewProductReview() {
  return (
    <Link
      href="https://www.productreview.com.au/listings/fishprovider"
      target="_blank"
      variant="clean"
    >
      <ThemeProvider colorScheme="light">
        <Card p={0} withBorder w={180} h={216}>
          <Stack align="center" py="sm" spacing={0}>
            <Text fw="bold">FishProvider</Text>
            <Image
              src="/icons/productreview.png"
              alt="productreview"
              radius="lg"
              fit="contain"
              width="100%"
              height={190}
            />
          </Stack>
        </Card>
      </ThemeProvider>
    </Link>
  );
}

export default ReviewProductReview;
