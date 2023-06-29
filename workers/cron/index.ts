import { config } from 'dotenv-flow';

const start = () => {
  config();
  import('./controllers/main').then((mod) => mod.start());
};
start();
