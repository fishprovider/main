/* Code Splitting notes
What is in the first bundle?
- logger: loglevel, axios
- style: css
- translation: i18n
*/

import '~libs/logger';
import 'animate.css';
import '~styles/Loading.css';
// import '~styles/Chat.css';
// import 'react-chat-elements/dist/main.css';
import 'react-notion-x/src/styles.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'prismjs/themes/prism-tomorrow.css'; // used for code syntax highlighting (optional)
// eslint-disable-next-line import/no-extraneous-dependencies
import 'katex/dist/katex.min.css'; // used for rendering equations (optional)

import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// import { appWithTranslation } from 'next-i18next';
import { isBrowser } from '~utils';

// import nextI18nConfig from '../../next-i18next.config';

const BaseController = dynamic(() => import('~controllers/BaseController'));

function MyApp({ Component, pageProps }: AppProps) {
  const pathName = isBrowser ? window.location.pathname : '/';
  return (
    <>
      <Head>
        <title>FishProvider</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no,viewport-fit=cover"
        />
        <link rel="canonical" href={`https://www.fishprovider.com${pathName}`} />
      </Head>
      <BaseController>
        <Component {...pageProps} />
      </BaseController>
    </>
  );
}

// export default appWithTranslation(MyApp, nextI18nConfig);
export default MyApp;
