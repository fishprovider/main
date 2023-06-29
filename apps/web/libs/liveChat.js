/* eslint-disable */

const chatKey = 'ea79386f-4c28-4750-bc92-c4f8e5b0e3c1';

const initLiveChat = () => {
  function initFreshChat() {
    window.fcWidget.init({
      token: chatKey,
      host: 'https://wchat.freshchat.com',
      config: {
        headerProperty: {
          hideChatButton: true
        }
      }
    });
  }
  function initialize(i, t) {
    let e;
    i.getElementById(t)
      ? initFreshChat()
      : (((e = i.createElement('script')).id = t),
        (e.async = !0),
        (e.src = 'https://wchat.freshchat.com/js/widget.js'),
        (e.onload = initFreshChat),
        i.head.appendChild(e));
  }
  function initiateCall() {
    initialize(document, 'Freshdesk Messaging-js-sdk');
  }
  // window.addEventListener
  //   ? window.addEventListener('load', initiateCall, !1)
  //   : window.attachEvent('load', initiateCall, !1);
  initiateCall();
};

const identifyLiveChat = (user) => {
  try {
    window.fcWidget.setExternalId(user.uid);
    window.fcWidget.user.setFirstName(user.name);
    window.fcWidget.user.setEmail(user.email);
  } catch (error) {
    Logger.warn('Failed to identifyLiveChat', error);
  }
};

export { initLiveChat, identifyLiveChat };
