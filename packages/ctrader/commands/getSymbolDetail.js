import { PayloadType } from '~constants/openApi';
import validate from '~utils/validate';
const getSymbolDetail = async (connection, symbolIds) => {
    const res = await connection.sendGuaranteedCommand({
        name: 'ProtoOASymbolByIdReq',
        payload: {
            ctidTraderAccountId: connection.accountId,
            symbolId: symbolIds,
        },
    });
    validate({
        payloadType: PayloadType.PROTO_OA_SYMBOL_BY_ID_RES,
        required: ['ctidTraderAccountId'],
    }, res);
    const { symbol } = res;
    return {
        ...res,
        symbols: symbol.map((item) => {
            const { symbolId, schedule, holiday, pipPosition, lotSize, minVolume, maxVolume, } = item;
            return {
                ...item,
                symbolId: symbolId.toNumber().toString(),
                pipSize: 1 / 10 ** pipPosition,
                lotSize: (lotSize && lotSize.toNumber() / 100),
                minVolume: (minVolume && minVolume.toNumber() / 100),
                maxVolume: (maxVolume && maxVolume.toNumber() / 100),
                schedule: schedule.map((itemSchedule) => ({
                    ...itemSchedule,
                    startSecond: itemSchedule.startSecond,
                    endSecond: itemSchedule.endSecond,
                })),
                holiday: holiday?.map((itemHoliday) => ({
                    ...itemHoliday,
                    holidayId: itemHoliday.holidayId.toNumber().toString(),
                    holidayDate: itemHoliday.holidayDate.toNumber(),
                })),
            };
        }),
    };
};
export default getSymbolDetail;
