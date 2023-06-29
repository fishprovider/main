import fs from 'fs';

const env = {
  typeId: process.env.TYPE_ID,
  heartbeatFile: process.env.HEARTBEAT_FILE,
};

const heartbeatFile = env.heartbeatFile || `./immortal-${env.typeId}.js`;

const writeHeartbeatFile = () => {
  fs.writeFileSync(heartbeatFile, `// heartbeat ${Date.now()}`);
};

export default writeHeartbeatFile;
