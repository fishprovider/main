import Link from '~components/base/Link';
import Image from '~ui/core/Image';

function ReviewProvenExpert() {
  return (
    <Link
      href="https://www.provenexpert.com/fishprovider"
      target="_blank"
      variant="clean"
    >
      <Image
        src="https://images.provenexpert.com/05/4f/4fd9b93854c40a600a6909e5bf8c/widget_portrait_180_us_0.png"
        alt="Ratings &amp; reviews for FishProvider"
        width={180}
        height={216}
        style={{ border: 0 }}
      />
    </Link>
  );
}

export default ReviewProvenExpert;
