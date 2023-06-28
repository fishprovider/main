interface Signal {
  _id: string;

  symbolName: string;
  timeFr: string;
  openTime: Date;
  currentPrice: number;

  direction: string;
  pattern: string;

  createdAt?: Date;
}
export type { Signal };
