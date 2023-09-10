import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Strategies = dynamic(() => import('~views/Strategies'), {
  loading: () => <Loading />,
});

function StrategiesPage() {
  return (
    <>
      <Head>
        <title>Strategies</title>
        <meta name="description" content="FishProvider Strategies" />
      </Head>
      <Strategies />
    </>
  );
}

export default StrategiesPage;
