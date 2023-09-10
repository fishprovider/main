import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Love = dynamic(() => import('~views/Love'), {
  loading: () => <Loading />,
});

function LovePage() {
  return (
    <>
      <Head>
        <title>Love</title>
        <meta name="description" content="FishProvider Love" />
      </Head>
      <Love />
    </>
  );
}

export default LovePage;
