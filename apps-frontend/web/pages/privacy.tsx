import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Privacy = dynamic(() => import('~views/Privacy'), {
  loading: () => <Loading />,
});

function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
        <meta name="description" content="FishProvider Contact" />
      </Head>
      <Privacy />
    </>
  );
}

export default PrivacyPage;
