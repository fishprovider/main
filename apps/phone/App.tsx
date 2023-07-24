import BaseController from '~controllers/BaseController';
import RootNavigator from '~navigators/RootNavigator';

export default function App() {
  return (
    <BaseController>
      <RootNavigator />
    </BaseController>
  );
}
