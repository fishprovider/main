import type { Order } from '@fishbot/utils/types/Order.model';

interface OrderCopy extends Order {
  copyId: string;
}

export type {
  OrderCopy,
};
