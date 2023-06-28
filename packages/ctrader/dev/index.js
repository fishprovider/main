import { config } from 'dotenv-flow';
const start = () => {
    config();
    import('./main').then((mod) => mod.start());
};
start();
