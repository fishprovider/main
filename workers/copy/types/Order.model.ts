import type { Order } from '@fishprovider/utils/types/Order.model';

interface OrderCopy extends Order {
  copyId: string;
}

export type {
  OrderCopy,
};
