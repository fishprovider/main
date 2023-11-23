import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const AdminProvider = dynamic(() => import('~providers/AdminProvider'), {
  loading: () => <Loading />,
});
const Admin = dynamic(() => import('~views/Admin'), {
  loading: () => <Loading />,
});

function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="FishProvider Admin" />
      </Head>
      <AdminProvider>
        <Admin />
      </AdminProvider>
    </>
  );
}

export default AdminPage;
