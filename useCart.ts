import { useCallback, useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';
import type { CartItem, CartLine } from '../types';

const STORAGE_KEY = 'king-food-cart-v1';
const MAX_QUANTITY = 99;

function loadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const items: CartItem[] = [];
    for (const entry of parsed) {
      if (entry && typeof entry === 'object') {
        const { productId, quantity } = entry as Record<string, unknown>;
        if (
          typeof productId === 'string' &&
          typeof quantity === 'number' &&
          Number.isInteger(quantity) &&
          quantity > 0 &&
          products.some((p) => p.id === productId) &&
          !items.some((i) => i.productId === productId)
        ) {
          items.push({ productId, quantity: Math.min(quantity, MAX_QUANTITY) });
        }
      }
    }
    return items;
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode / quota): cart still works in memory */
    }
  }, [items]);

  const add = useCallback((productId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (!existing) return [...prev, { productId, quantity: 1 }];
      return prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) }
          : i,
      );
    });
  }, []);

  const decrease = useCallback((productId: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const lines: CartLine[] = useMemo(() => {
    const result: CartLine[] = [];
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        result.push({
          product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        });
      }
    }
    return result;
  }, [items]);

  const totalItems = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );
  const totalPrice = useMemo(
    () => lines.reduce((sum, l) => sum + l.subtotal, 0),
    [lines],
  );

  const getQuantity = useCallback(
    (productId: string) =>
      items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items],
  );

  return { lines, totalItems, totalPrice, add, decrease, remove, clear, getQuantity };
}

export type CartApi = ReturnType<typeof useCart>;
