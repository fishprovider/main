import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Home = dynamic(() => import('~views/Home'), {
  loading: () => <Loading />,
});

function HomePage() {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="FishProvider Home" />
      </Head>
      <Home />
    </>
  );
}

export default HomePage;
