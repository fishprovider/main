import { PayloadType } from '~constants/openApi';
declare const isMarketClosed: (errMsg?: string) => boolean | undefined;
declare const validate: <T extends CommandResponse>(expected: {
    payloadType: PayloadType;
    required?: string[];
}, res: T) => void;
export default validate;
export { isMarketClosed };
