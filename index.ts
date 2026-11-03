export interface Product {
  id: string;
  name: string;
  /** Price in whole Algerian dinars (integer). */
  price: number;
  image: string;
}

/** What is persisted in localStorage: only ids and quantities. */
export interface CartItem {
  productId: string;
  quantity: number;
}

/** A cart item joined with its product, with the subtotal computed. */
export interface CartLine {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface CheckoutForm {
  fullName: string;
  phone: string;
  address: string;
  notes: string;
}
