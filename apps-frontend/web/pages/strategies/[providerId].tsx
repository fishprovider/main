import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Loading from '~ui/core/Loading';

const StrategyController = dynamic(() => import('~controllers/StrategyController'), {
  loading: () => <Loading />,
});
const Strategy = dynamic(() => import('~views/Strategy'), {
  loading: () => <Loading />,
});

function StrategyPage() {
  const router = useRouter();
  const { providerId } = router.query as {
    providerId?: string
  };

  if (!providerId) return null;

  return (
    <>
      <Head>
        <title>{`Strategy ${providerId}`}</title>
        <meta
          name="description"
          content={`FishProvider Strategy ${providerId}`}
        />
      </Head>
      <StrategyController providerId={providerId}>
        <Strategy />
      </StrategyController>
    </>
  );
}

export default StrategyPage;
