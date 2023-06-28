import path from 'path';
import url from 'url';
import ProtobufMessages from '.';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
test('protobuf', () => {
    const protocol = new ProtobufMessages([
        path.join(__dirname, '..', '..', 'protos', 'OpenApiCommonMessages.proto'),
        path.join(__dirname, '..', '..', 'protos', 'OpenApiMessages.proto'),
    ]);
    const clientId = 'clientId';
    const clientSecret = 'clientSecret';
    const encodedData = protocol.encode('ProtoOAApplicationAuthReq', { clientId, clientSecret }, 'ClientMsgId');
    const decodedData = protocol.decode(encodedData.toBuffer());
    expect(decodedData.payload.clientId).toEqual(clientId);
    expect(decodedData.payload.clientSecret).toEqual(clientSecret);
});
