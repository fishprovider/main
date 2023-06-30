import { activateNewSW, bannerId, hideBanner } from '~libs/sw';
import Button from '~ui/core/Button';
import Notification from '~ui/core/Notification';

function NewVersionBanner() {
  return (
    <Notification
      id={bannerId}
      color="green"
      style={{
        position: 'fixed', bottom: 16, right: 16, display: 'none',
      }}
      onClose={hideBanner}
    >
      A new version of Fish is available
      {' '}
      <Button
        variant="subtle"
        onClick={() => {
          activateNewSW();
          hideBanner();
        }}
      >
        REFRESH
      </Button>
    </Notification>
  );
}

export default NewVersionBanner;
