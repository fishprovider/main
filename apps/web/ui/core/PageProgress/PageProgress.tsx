import storeUser from '@fishprovider/cross/stores/user';
import {
  completeNavigationProgress, NavigationProgress, startNavigationProgress,
} from '@mantine/nprogress';

import useRouteHandler from '~hooks/useRouteHandler';
import { pageView } from '~libs/analytics';

function PageProgress() {
  useRouteHandler({
    onStart: () => {
      startNavigationProgress();
    },
    onEnd: (url: string) => {
      const user = storeUser.getState().info;
      pageView(url, user);
      completeNavigationProgress();
    },
  });

  return <NavigationProgress autoReset />;
}

export default PageProgress;
