import BaseController from '~controllers/BaseController';
import Home from '~views/Home';

export default function App() {
  return (
    <BaseController>
      <Home />
    </BaseController>
  );
}
