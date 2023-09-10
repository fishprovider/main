import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const Login = dynamic(() => import('~views/Login'), {
  loading: () => <Loading />,
});

function LoginPage() {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="FishProvider Login" />
      </Head>
      <Login />
    </>
  );
}

export default LoginPage;
