import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loading from '~ui/core/Loading';

const AdminController = dynamic(() => import('~controllers/AdminController'), {
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
      <AdminController>
        <Admin />
      </AdminController>
    </>
  );
}

export default AdminPage;
