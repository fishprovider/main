import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const UserController = dynamic(() => import('~providers/UserController'), {
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
      <UserController title="Telegram Auth">
        <TelegramAuth />
      </UserController>
    </>
  );
}

export default TelegramAuthPage;
