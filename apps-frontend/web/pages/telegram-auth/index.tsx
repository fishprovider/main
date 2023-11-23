import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserProvider = dynamic(() => import('~providers/UserProvider'), {
  loading: () => <Loading />,
});
const TelegramAuth = dynamic(() => import('~views/TelegramAuth'), {
  loading: () => <Loading />,
});

function TelegramAuthPage() {
  return (
    <>
      <Head>
        <title>Telegram Auth</title>
        <meta name="description" content="FishProvider Telegram Auth" />
      </Head>
      <UserProvider title="Telegram Auth">
        <TelegramAuth />
      </UserProvider>
    </>
  );
}

export default TelegramAuthPage;
