import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (product, variant = null, qty = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.id && item.variantId === (variant?.id || null)
          );
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].qty += qty;
            return { items: newItems };
          }
          return {
            items: [...state.items, {
              productId: product.id,
              name: product.name,
              price: product.discountPrice || product.price,
              originalPrice: product.price,
              image: product.images[0],
              variant: variant?.name || null,
              variantId: variant?.id || null,
              qty,
              stock: variant?.stock || product.stock,
            }],
          };
        });
      },

      removeItem: (productId, variantId = null) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },

      updateQty: (productId, variantId, qty) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, qty: Math.max(1, Math.min(qty, item.stock)) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      get subtotal() { return get().items.reduce((sum, item) => sum + item.price * item.qty, 0); },
      get totalItems() { return get().items.reduce((sum, item) => sum + item.qty, 0); },
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.qty, 0),
      getTotalDiscount: () => get().items.reduce((sum, item) => {
        if (item.originalPrice > item.price) {
          return sum + (item.originalPrice - item.price) * item.qty;
        }
        return sum;
      }, 0),
    }),
    { name: 'vaporex-cart' }
  )
);

export default useCartStore;
