import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Donate = dynamic(() => import('~views/Donate'), {
  loading: () => <Loading />,
});

function DonatePage() {
  return (
    <>
      <Head>
        <title>Donate</title>
        <meta name="description" content="FishProvider Donate" />
      </Head>
      <Donate />
    </>
  );
}

export default DonatePage;
