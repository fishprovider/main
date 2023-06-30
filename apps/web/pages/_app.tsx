import { initStore } from '@fishbot/cross/libs/store';
import type { AppProps } from 'next/app';
import Head from 'next/head';

initStore({
  logDebug: console.debug,
  logError: console.info,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>FishProvider</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no,viewport-fit=cover"
        />
        <link rel="canonical" href="https://www.fishprovider.com" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
