
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerName: string;
}

export interface PickingItem extends OrderItem {
  orderId: string;
}
