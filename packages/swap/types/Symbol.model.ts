interface SymbolCTrader {
  symbol: string;
  symbolId: string;
  baseAssetId: string;
  quoteAssetId: string;
}

type SymbolMetaTrader = string;

export type {
  SymbolCTrader,
  SymbolMetaTrader,
};
