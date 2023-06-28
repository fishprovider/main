interface RedisAsset {
  asset: string;
  assetId: string;
}

interface RedisSymbol {
  symbol: string;
  symbolId: string;
  baseAsset: string;
  quoteAsset: string;
  lotSize: number
  pipSize: number;
  digits: number;
  minVolume: number;
  maxVolume: number;
}

interface RedisPrice {
  _id: string;
  last: number;
  time?: number;
  bid?: number;
  ask?: number;
}

export type {
  RedisAsset,
  RedisPrice,
  RedisSymbol,
};
