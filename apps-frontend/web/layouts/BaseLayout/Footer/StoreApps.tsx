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
          src="/icons/android.png"
          alt="Get it on Google Play"
          radius="lg"
          fit="contain"
          height={60}
        />
      </Link>
      <Link href="https://testflight.apple.com/join/ILsIFDr8" target="_blank" variant="clean">
        <Image
          src="/icons/apple.svg"
          alt="Get it on Google Play"
          radius="lg"
          fit="contain"
          height={60}
        />
      </Link>
    </Stack>
  );
}

export default StoreApps;
