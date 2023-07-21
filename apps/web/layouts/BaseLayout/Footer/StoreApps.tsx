import Link from '~components/base/Link';
import Image from '~ui/core/Image';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

function StoreApps() {
  return (
    <Stack>
      <Title size="h2">Apps & Extensions</Title>

      <Link href="https://play.google.com/store/apps/details?id=com.fishprovider.app" target="_blank" variant="clean">
        <Image
          src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
          alt="Get it on Google Play"
          radius="lg"
          fit="contain"
          width="100%"
          height={80}
        />
      </Link>
    </Stack>
  );
}

export default StoreApps;
