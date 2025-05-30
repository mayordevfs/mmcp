"use client"
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define proper types for our store and menu items
export interface MenuItem {
  id?: number;
  name?: string;
  salePrice: number;
  picture?: any; // This could be more specific based on your image import type
  category?: string;
  description?:string;
  unit?:string;
  code?:string
//   bg?: string;
//   color?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  subTotal: number;
}

interface CartStore {
  cartVisibility: boolean;
  cart: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  increment: (payload: CartItem) => void;
  decrement: (payload: CartItem) => void;
  addToCart: (payload: MenuItem) => void;
  removeItem: (id: number|undefined) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Create store with proper typing and persistence
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cartVisibility: false,
      cart: [],
      
      // Cart visibility controls
      openCart: () => set({ cartVisibility: true }),
      closeCart: () => set({ cartVisibility: false }),
      
      // Quantity management
      increment: (payload) =>
        set((state) => {
          const updatedCart = state.cart.map((item) => {
            if (item.id === payload.id) {
              return {
                ...item,
                quantity: item.quantity + 1,
                subTotal: (item.quantity + 1) * item.salePrice
              };
            }
            return item;
          });
          
          return { cart: updatedCart };
        }),
        
      decrement: (payload) =>
        set((state) => {
          const updatedCart = state.cart.map((item) => {
            if (item.id === payload.id) {
              const newQuantity = Math.max(1, item.quantity - 1);
              return {
                ...item,
                quantity: newQuantity,
                subTotal: newQuantity * item.salePrice
              };
            }
            return item;
          });
          
          return { cart: updatedCart };
        }),
      
      // Cart modifications
      addToCart: (payload) =>
        set((state) => {
          // Check if product already exists in cart
          const existingItemIndex = state.cart.findIndex(item => item.id === payload.id);
          
          if (existingItemIndex === -1) {
            // Add new item to cart with quantity and subtotal
            const newItem: CartItem = {
              ...payload,
              quantity: 1,
              subTotal: payload.salePrice
            };
            
            return { cart: [...state.cart, newItem] };
          }
          
          // If product already exists, return unchanged cart
          return { cart: [...state.cart] };
        }),
        
      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter(item => item.id !== id)
        })),
        
      clearCart: () => set({ cart: [] }),
      
      // Calculate total cart value
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.subTotal, 0);
      }
    }),
    {
      name: 'cart-storage-mmcp', // Unique name for localStorage
      partialize: (state) => ({ cart: state.cart }), // Only persist the cart items
    }
  )
);
