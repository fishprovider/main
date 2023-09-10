import Link from '~components/base/Link';
import useScript from '~hooks/useScript';
import Card from '~ui/core/Card';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import ThemeProvider from '~ui/themes/ThemeProvider';

const scriptId = 'trustpilot';
const scriptUrl = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';

function ReviewTrustPilot() {
  useScript(scriptId, scriptUrl);

  return (
    <Link
      href="https://www.trustpilot.com/review/fishprovider.com"
      target="_blank"
      variant="clean"
    >
      <ThemeProvider colorScheme="light">
        <Card p={0} withBorder w={180} h={216}>
          <Stack align="center" py="sm">
            <Text fw="bold">FishProvider</Text>
            <Image
              src="/icons/trustpilot.png"
              alt="trustpilot"
              radius="lg"
              fit="contain"
              width="100%"
              height={80}
            />
            <div
              className="trustpilot-widget"
              data-locale="en-US"
              data-template-id="5419b6a8b0d04a076446a9ad"
              data-businessunit-id="647363e1ce3cb7e54801cf9f"
              data-style-height="60px"
              data-style-width="130px"
              data-theme="light"
              data-min-review-count="0"
              data-without-reviews-preferred-string-id="2"
              data-style-alignment="center"
            >
              Trustpilot
            </div>
          </Stack>
        </Card>
      </ThemeProvider>
    </Link>
  );
}

export default ReviewTrustPilot;
