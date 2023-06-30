import storeUser from '@fishbot/cross/stores/user';

function HomePage() {
  const {
    providerId = '',
    name = '',
  } = storeUser.useStore((state: any) => ({
    providerId: state.activeProvider?._id,
    name: state.activeProvider?.name,
  }));

  return (
    <div>
      Home
      {providerId}
      {name}
    </div>
  );
}

export default HomePage;
