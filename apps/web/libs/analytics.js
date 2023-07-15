/* eslint-disable */

import { apiPost } from '@fishprovider/cross/dist/libs/api';
import ReactGA from 'react-ga4';

const gaKey = 'G-9GK5LHZ2VN';
const fsKey = '14067E';
const heapKey = '1356875370';

//
// init
//

const initGoogleAnalytics = () => {
  ReactGA.initialize(gaKey);
};

const initFullStory = () => {
  window['_fs_debug'] = false;
  window['_fs_host'] = 'fullstory.com';
  window['_fs_script'] = 'edge.fullstory.com/s/fs.js';
  window['_fs_org'] = fsKey;
  window['_fs_namespace'] = 'FS';
  (function (m, n, e, t, l, o, g, y) {
    if (e in m) {
      if (m.console && m.console.log) {
        m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
      }
      return;
    }
    g = m[e] = function (a, b, s) {
      g.q ? g.q.push([a, b, s]) : g._api(a, b, s);
    };
    g.q = [];
    o = n.createElement(t);
    o.async = 1;
    o.crossOrigin = 'anonymous';
    o.src = `https://${_fs_script}`;
    y = n.getElementsByTagName(t)[0];
    y.parentNode.insertBefore(o, y);
    g.identify = function (i, v, s) {
      g(l, { uid: i }, s);
      if (v) g(l, v, s);
    };
    g.setUserVars = function (v, s) {
      g(l, v, s);
    };
    g.event = function (i, v, s) {
      g('event', { n: i, p: v }, s);
    };
    g.anonymize = function () {
      g.identify(!!0);
    };
    g.shutdown = function () {
      g('rec', !1);
    };
    g.restart = function () {
      g('rec', !0);
    };
    g.log = function (a, b) {
      g('log', [a, b]);
    };
    g.consent = function (a) {
      g('consent', !arguments.length || a);
    };
    g.identifyAccount = function (i, v) {
      o = 'account';
      v = v || {};
      v.acctId = i;
      g(o, v);
    };
    g.clearUserCookie = function () {};
    g.setVars = function (n, p) {
      g('setVars', [n, p]);
    };
    g._w = {};
    y = 'XMLHttpRequest';
    g._w[y] = m[y];
    y = 'fetch';
    g._w[y] = m[y];
    if (m[y])
      m[y] = function () {
        return g._w[y].apply(this, arguments);
      };
    g._v = '1.3.0';
  })(window, document, window['_fs_namespace'], 'script', 'user');
};

const initHeap = () => {
  (window.heap = window.heap || []),
    (heap.load = function (e, t) {
      (window.heap.appid = e), (window.heap.config = t = t || {});
      const r = document.createElement('script');
      (r.type = 'text/javascript'),
        (r.async = !0),
        (r.src = `https://cdn.heapanalytics.com/js/heap-${e}.js`);
      const a = document.getElementsByTagName('script')[0];
      a.parentNode.insertBefore(r, a);
      for (
        let n = function (e) {
            return function () {
              heap.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
          },
          p = [
            'addEventProperties',
            'addUserProperties',
            'clearEventProperties',
            'identify',
            'resetIdentity',
            'removeEventProperty',
            'setEventProperties',
            'track',
            'unsetEventProperty',
          ],
          o = 0;
        o < p.length;
        o++
      )
        heap[p[o]] = n(p[o]);
    });
  heap.load(heapKey);
};

const initAnalytics = () => {
  [initGoogleAnalytics, initFullStory, initHeap].forEach((func) => {
    try {
      func();
    } catch (error) {
      Logger.error(error);
    }
  });
};

//
// identify user
//

const identifyGoogleAnalytics = (user) => {
  ReactGA.set({ userId: user.uid });
};

const identifyFullStory = (user) => {
  window.FS.identify(user.uid, {
    displayName: user.name,
    email: user.email,
  });
};

const identifyHeap = (user) => {
  window.heap.identify(user.uid);
  window.heap.addUserProperties({
    displayName: user.name,
    email: user.email,
  });
};

const identifyAnalytics = (user) => {
  [identifyGoogleAnalytics, identifyFullStory, identifyHeap].forEach((func) => {
    try {
      func(user);
    } catch (error) {
      Logger.warn('Failed to identifyAnalytics', error);
    }
  });
};

//
// send analytics
//

const pageView = async (url, user) => {
  try {
    ReactGA.send('pageview');
    await apiPost('/track', {
      identity: user?.email,
      event: 'pageviewApi',
      properties: {
        url,
      },
    });
  } catch (error) {
    Logger.warn('Failed to pageView', error);
  }
};

const sendEvent = (action, { category, label, value }) => {
  try {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  } catch (error) {
    Logger.warn('Failed to sendEvent', error);
  }
};

export {
  identifyAnalytics, initAnalytics, pageView, sendEvent,
};
