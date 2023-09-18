import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Reports = dynamic(() => import('~views/Reports'), {
  loading: () => <Loading />,
});

function ReportsPage() {
  return (
    <>
      <Head>
        <title>Reports</title>
        <meta name="description" content="FishProvider Reports" />
      </Head>
      <Reports />
    </>
  );
}

export default ReportsPage;
