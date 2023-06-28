declare const transformLong: (value: Long, moneyDigits?: number) => number;
declare const transformOrder: (order: Order) => any;
declare const transformPosition: (position: Position) => any;
declare const transformDeal: (deal: Deal) => any;
declare const transformAccountInfo: (accountInfo: AccountInfo) => any;
declare const transformBar: (bar: Bar) => any;
export { transformAccountInfo, transformBar, transformDeal, transformLong, transformOrder, transformPosition, };
