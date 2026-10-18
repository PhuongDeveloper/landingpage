'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductCapacity } from '@/types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, capacity: ProductCapacity, quantity?: number) => void;
  removeFromCart: (productId: string, capacity: ProductCapacity) => void;
  updateQuantity: (productId: string, capacity: ProductCapacity, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'nam_moc_huong_cart_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Khởi tạo giỏ hàng từ localStorage một cách an toàn
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Lưu vào localStorage khi items thay đổi
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to persist cart', e);
      }
    }
  }, [items, isInitialized]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (product: Product, capacity: ProductCapacity, quantity = 1) => {
    const variant = product.variants.find((v) => v.capacity === capacity) || product.variants[0];
    const price = variant?.salePrice || variant?.price || 0;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product.id && item.capacity === capacity
      );

      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          capacity,
          price,
          quantity,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeFromCart = (productId: string, capacity: ProductCapacity) => {
    setItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.capacity === capacity))
    );
  };

  const updateQuantity = (productId: string, capacity: ProductCapacity, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, capacity);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.capacity === capacity) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
