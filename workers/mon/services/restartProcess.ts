// import axios from 'axios';

// const env = {
//   herokuApiKey: process.env.HEROKU_API_KEY,
// };

// const restartHeroku = (name: string) => {
//   axios.delete(`https://api.heroku.com/apps/fp-${name}/dynos`, {
//     headers: {
//       Accept: 'application/vnd.heroku+json; version=3',
//       Authorization: `Bearer ${env.herokuApiKey}`,
//     },
//   }).catch((error) => {
//     console.error(`🔥 Failed to heroku restart, error: ${error}`);
//   });
// };

const restartProcess = (typeId: string) => {
  Logger.warn(`🔥 Restarting process ${typeId}...`);
  // restartHeroku(typeId);
  // TODO: vercel, render
};

export default restartProcess;
