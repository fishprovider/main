import Link from '~components/base/Link';
import Routes from '~libs/routes';
import Button from '~ui/core/Button';

function DonateButton() {
  return (
    <Link href={Routes.donate} variant="clean">
      <Button size="sm" color="yellow">
        Donate
      </Button>
    </Link>
  );
}

export default DonateButton;
