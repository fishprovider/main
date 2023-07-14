import type { Order } from '@fishprovider/utils/dist/types/Order.model';

interface OrderCopy extends Order {
  copyId: string;
}

export type {
  OrderCopy,
};
