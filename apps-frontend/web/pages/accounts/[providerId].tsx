import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Loading from '~ui/core/Loading';

const AccountController = dynamic(() => import('~providers/AccountController'), {
  loading: () => <Loading />,
});
const Account = dynamic(() => import('~views/Account'), {
  loading: () => <Loading />,
});

function AccountPage() {
  const router = useRouter();
  const { providerId } = router.query as {
    providerId?: string
  };

  if (!providerId) return null;

  return (
    <>
      <Head>
        <title>{`Account ${providerId}`}</title>
        <meta
          name="description"
          content={`FishProvider Account ${providerId}`}
        />
      </Head>
      <AccountController providerId={providerId}>
        <Account />
      </AccountController>
    </>
  );
}

export default AccountPage;
