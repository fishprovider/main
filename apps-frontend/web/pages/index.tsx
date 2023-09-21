import dynamic from 'next/dynamic';
import Head from 'next/head';

import { NotionPageProps } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import { getDefaultStaticProps } from '~libs/notion';
import Loading from '~ui/core/Loading';

export const getStaticProps = getDefaultStaticProps(notionPages.hotNews.rootId);

const Home = dynamic(() => import('~views/Home'), {
  loading: () => <Loading />,
});

function HomePage(props: NotionPageProps) {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="FishProvider Home" />
      </Head>
      <Home {...props} />
    </>
  );
}

export default HomePage;
