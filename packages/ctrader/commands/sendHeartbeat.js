const sendHeartbeat = async (connection) => {
    await connection.sendGuaranteedCommand({
        name: 'ProtoHeartbeatEvent',
        payload: {},
    });
    return true;
};
export default sendHeartbeat;
