import {
  Head, Html, Main, NextScript,
} from 'next/document';

import { getInitialProps } from '~ui/utils/next';

function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Follow Our Leaders, Amplify Your Profits - Everlasting and Stable Success with FishProvider Copy Trading Strategies" />
        <meta name="keywords" content="Follow Our Leaders, Amplify Your Profits - Everlasting and Stable Success with FishProvider Copy Trading Strategies" />

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="application-name" content="FishProvider" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FishProvider" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" type="image/png" sizes="180x180" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
        <link rel="mask-icon" href="/mask-logo.svg" color="#5bbad5" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="FishProvider" />
        <meta property="og:description" content="Follow Our Leaders, Amplify Your Profits - Everlasting and Stable Success with FishProvider Copy Trading Strategies" />
        <meta property="og:site_name" content="FishProvider" />
        <meta property="og:url" content="https://www.fishprovider.com" />
        <meta property="og:image" content="/banner-with-text.png" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://www.fishprovider.com" />
        <meta name="twitter:title" content="FishProvider" />
        <meta name="twitter:description" content="Follow Our Leaders, Amplify Your Profits - Everlasting and Stable Success with FishProvider Copy Trading Strategies" />
        <meta name="twitter:image" content="/banner-with-text.png" />
        <meta name="twitter:creator" content="@FishProvider" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = getInitialProps();

export default MyDocument;

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
// Resolution order
//
// On the server:
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. document.getInitialProps
// 4. app.render
// 5. page.render
// 6. document.render
//
// On the server with error:
// 1. document.getInitialProps
// 2. app.render
// 3. page.render
// 4. document.render
//
// On the client
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. app.render
// 4. page.render
