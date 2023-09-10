import Head from 'next/head';

import Routes from '~libs/routes';

function Custom404() {
  return (
    <>
      <Head>
        <title>404</title>
        <meta name="description" content="FishProvider 404" />
      </Head>
      <h1>404 - Page Not Found</h1>
      <a href={Routes.home}>
        <u>← Back to home</u>
      </a>
    </>
  );
}

export default Custom404;
