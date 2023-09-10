import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Plans = dynamic(() => import('~views/Plans'), {
  loading: () => <Loading />,
});

function PlansPage() {
  return (
    <>
      <Head>
        <title>Plans</title>
        <meta name="description" content="FishProvider Plans" />
      </Head>
      <Plans />
    </>
  );
}

export default PlansPage;
