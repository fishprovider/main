import dynamic from 'next/dynamic';
import Head from 'next/head';

import { NotionPageProps } from '~components/view/NotionPage';
import { notionPages } from '~constants/view';
import { getDefaultStaticProps } from '~libs/notion';
import Loading from '~ui/core/Loading';

export const getStaticProps = getDefaultStaticProps(notionPages.reports.rootId);

const Reports = dynamic(() => import('~views/Reports'), {
  loading: () => <Loading />,
});

function ReportsPage(props: NotionPageProps) {
  return (
    <>
      <Head>
        <title>Reports</title>
        <meta name="description" content="FishProvider Reports" />
      </Head>
      <Reports {...props} />
    </>
  );
}

export default ReportsPage;
