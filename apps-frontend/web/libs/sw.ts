// ref: https://web.dev/service-worker-lifecycle
// ref: https://github.com/shadowwalker/next-pwa/blob/master/examples/lifecycle/pages/index.js
// ref: https://developer.chrome.com/docs/workbox/migration/migrate-from-v5/#cleaner-offer-a-page-reload-for-users-recipe
// ref: https://terminaladdict.com/development/2021/05/12/Making-a-Service-Worker-refresh-properly.html

const bannerId = 'NewVersionBanner';

const showBanner = () => {
  const banner = document.getElementById(bannerId);
  if (banner) {
    banner.style.display = 'flex';
  }
};

const hideBanner = () => {
  const banner = document.getElementById(bannerId);
  if (banner) {
    banner.style.display = 'none';
  }
};

const activateNewSW = () => {
  const wb = window.workbox;
  wb.addEventListener('controlling', (event) => {
    console.log(`Event ${event.type} 2 is triggered.`);
    window.location.reload();
  });
  // Send a message to the waiting service worker, instructing it to activate.
  wb.messageSkipWaiting();
  wb.messageSW({ type: 'SKIP_WAITING', payload: 'SKIP_WAITING' });
};

const initSW = () => {
  if (window.workbox) {
    const wb = window.workbox;
    // add event listeners to handle any of PWA lifecycle event
    // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
    wb.addEventListener('installed', (event) => {
      console.log(`Event ${event.type} is triggered.`);
      console.log(event);
    });

    wb.addEventListener('controlling', (event) => {
      console.log(`Event ${event.type} is triggered.`);
      console.log(event);
    });

    wb.addEventListener('activated', (event) => {
      console.log(`Event ${event.type} is triggered.`);
      console.log(event);
    });

    // A common UX pattern for progressive web apps is to show a banner
    // when a service worker has updated and waiting to install.
    // NOTE: MUST set skipWaiting to false in next.config.js pwa object
    // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
    wb.addEventListener('waiting', (event) => {
      console.log(`Event ${event.type} is triggered.`);
      // `event.wasWaitingBeforeRegister` will be false if this is the first time
      // the updated service worker is waiting.
      // When `event.wasWaitingBeforeRegister` is true,
      // a previously updated service worker is still waiting.

      //
      // Found new version => execute optional actions as below
      //

      const swUpdateMode: string = 'lazy';
      switch (swUpdateMode) {
        case 'lazy':
          // Do nothing, keep using old version for this session,
          // new version will be automatically load when user open the app next time
          break;
        case 'manual':
          showBanner();
          break;
        default:
          activateNewSW();
      }
    });

    // ISSUE - this is not working as expected, why?
    // I could only make message event listener work when
    // I manually add this listener into sw.js file
    wb.addEventListener('message', (event) => {
      console.log(`Event ${event.type} is triggered.`);
      console.log(event);
    });

    /* unused?
    wb.addEventListener('redundant', event => {
      console.log(`Event ${event.type} is triggered.`)
      console.log(event)
    })
    wb.addEventListener('externalinstalled', event => {
      console.log(`Event ${event.type} is triggered.`)
      console.log(event)
    })
    wb.addEventListener('externalactivated', event => {
      console.log(`Event ${event.type} is triggered.`)
      console.log(event)
    })
    */

    // never forget to call register as auto register is turned off in next.config.js
    wb.register();
  }
};

export {
  activateNewSW, bannerId, hideBanner, initSW,
};
