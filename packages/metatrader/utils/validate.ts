const isMarketClosed = (errMsg?: string) => errMsg?.includes('ERR_OFF_QUOTES');

export { isMarketClosed };
