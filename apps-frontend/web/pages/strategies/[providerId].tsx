import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Loading from '~ui/core/Loading';

const StrategyProvider = dynamic(() => import('~providers/StrategyProvider'), {
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
      <StrategyProvider providerId={providerId}>
        <Strategy />
      </StrategyProvider>
    </>
  );
}

export default StrategyPage;
