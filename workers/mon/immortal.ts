import { config } from 'dotenv-flow';

const start = () => {
  config();
  import('./controllers/immortal');
};
start();
