import appRootPath from 'app-root-path';
import path from 'path';

import ProtobufMessages from '.';

const rootPath = appRootPath.toString();

test('protobuf', () => {
  const protocol = new ProtobufMessages([
    path.join(rootPath, 'packages', 'ctrader', 'protos', 'OpenApiCommonMessages.proto'),
    path.join(rootPath, 'packages', 'ctrader', 'protos', 'OpenApiMessages.proto'),
  ]);

  const clientId = 'clientId';
  const clientSecret = 'clientSecret';

  const encodedData = protocol.encode(
    'ProtoOAApplicationAuthReq',
    { clientId, clientSecret },
    'ClientMsgId',
  );
  const decodedData = protocol.decode(encodedData.toBuffer());

  expect(decodedData.payload.clientId).toEqual(clientId);
  expect(decodedData.payload.clientSecret).toEqual(clientSecret);
});
