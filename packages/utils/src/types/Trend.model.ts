interface Trend {
  _id: string;
  symbol: string;
  symbolId: string;

  h1?: string;
  h4?: string;
  d1?: string;

  updatedAt?: Date;
}

export type {
  Trend,
};
