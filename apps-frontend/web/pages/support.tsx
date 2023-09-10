import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Support = dynamic(() => import('~views/Support'), {
  loading: () => <Loading />,
});

function SupportPage() {
  return (
    <>
      <Head>
        <title>Support</title>
        <meta name="description" content="FishProvider Support" />
      </Head>
      <Support />
    </>
  );
}

export default SupportPage;
