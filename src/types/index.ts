export type OrderType = "DINE_IN" | "TAKE_AWAY";

export type PaymentMethod = "QRIS" | "CASH";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number | null;
  orderType: OrderType;
  items: CartItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
}