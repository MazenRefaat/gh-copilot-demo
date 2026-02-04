import { ref, computed, watch } from "vue";
import type { Album } from "../types/album";

const CART_STORAGE_KEY = "album-cart";

// Shared state across all instances
const items = ref<Album[]>([]);

// Load cart from localStorage on initialization
const loadCart = (): void => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      items.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
  }
};

// Save cart to localStorage
const saveCart = (): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

// Initialize cart on first load
loadCart();

// Watch for changes and save to localStorage
watch(items, saveCart, { deep: true });

export function useCart() {
  const itemCount = computed(() => items.value.length);

  const totalPrice = computed(() =>
    items.value.reduce((sum, album) => sum + album.price, 0),
  );

  const addToCart = (album: Album): void => {
    // Prevent duplicates
    if (!isInCart(album.id)) {
      items.value.push(album);
    }
  };

  const removeFromCart = (albumId: number): void => {
    const index = items.value.findIndex((item) => item.id === albumId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const clearCart = (): void => {
    items.value = [];
  };

  const isInCart = (albumId: number): boolean => {
    return items.value.some((item) => item.id === albumId);
  };

  return {
    items,
    itemCount,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
  };
}
