import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const About = dynamic(() => import('~views/About'), {
  loading: () => <Loading />,
});

function AboutUsPage() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="FishProvider About Us" />
      </Head>
      <About />
    </>
  );
}

export default AboutUsPage;
