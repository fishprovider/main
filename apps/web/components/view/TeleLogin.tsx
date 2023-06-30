import React, { useEffect, useRef } from 'react';

interface TelegramUser {
  auth_date: number;
  id: number;
  first_name: string;
  last_name: string;
  hash: string;
}

interface TelegramLoginButtonProps {
  botName: string;
  dataOnAuth?: (user: TelegramUser) => void;
  dataAuthUrl?: string;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  lang?: string;
}

/*
{
    "id": 123456,
    "first_name": "Marco",
    "last_name": "D",
    "username": "maidh91",
    "photo_url": "https://t.me/i/userpic/320/2-3McRhfjRLZT586AuDD6vI-OyS399U9jFMIWxb8ZdA.jpg",
    "auth_date": 1686533057,
    "hash": "bar"
}
*/

function TelegramLogin(props: TelegramLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const {
      botName,
      buttonSize = 'medium',
      cornerRadius,
      requestAccess = true,
      usePic = true,
      dataOnAuth,
      dataAuthUrl,
      lang = 'en',
    } = props;

    if (!!dataAuthUrl === !!dataOnAuth) {
      throw new Error(
        'One of this props should be defined: dataAuthUrl (Redirect URL), dataOnAuth (callback fn) should be defined.',
      );
    }

    if (dataOnAuth) {
      (window as any).telegramLoginWidgetCb = dataOnAuth;
    }

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;

    const attributes = {
      'data-telegram-login': botName,
      'data-size': buttonSize,
      'data-radius': cornerRadius,
      'data-request-access': requestAccess ? 'write' : undefined,
      'data-userpic': usePic,
      'data-lang': lang,
      'data-auth-url': dataAuthUrl,
      'data-onauth': 'telegramLoginWidgetCb(user)',
    };

    for (const [k, v] of Object.entries(attributes)) {
      if (v !== undefined) {
        script.setAttribute(k, `${v}`);
      }
    }

    containerRef.current?.appendChild(script);

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.innerHTML = '';
      }
      if ((window as any).telegramLoginWidgetCb) {
        delete (window as any).telegramLoginWidgetCb;
      }
    };
  });

  return <div ref={containerRef} />;
}

export default TelegramLogin;

export type {
  TelegramLoginButtonProps,
  TelegramUser,
};
