export interface News {
  _id: string;
  type: string;
  week: string;
  datetime: Date;

  impact: string;
  currency: string;
  title: string;
  forecast: string;
  previous: string;
}
