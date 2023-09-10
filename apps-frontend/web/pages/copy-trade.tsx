import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const CopyTrade = dynamic(() => import('~views/CopyTrade'), {
  loading: () => <Loading />,
});

function CopyTradePage() {
  return (
    <>
      <Head>
        <title>CopyTrade</title>
        <meta name="description" content="FishProvider CopyTrade" />
      </Head>
      <CopyTrade />
    </>
  );
}

export default CopyTradePage;
