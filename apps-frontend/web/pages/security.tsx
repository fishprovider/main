import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Security = dynamic(() => import('~views/Security'), {
  loading: () => <Loading />,
});

function SecurityPage() {
  return (
    <>
      <Head>
        <title>Security</title>
        <meta name="description" content="FishProvider Security" />
      </Head>
      <Security />
    </>
  );
}

export default SecurityPage;
