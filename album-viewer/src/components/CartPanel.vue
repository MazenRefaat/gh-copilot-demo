<template>
  <Transition name="slide">
    <div v-if="isOpen" class="cart-panel-overlay" @click="handleOverlayClick">
      <div class="cart-panel" @click.stop>
        <div class="cart-header">
          <h2>🛒 Shopping Cart</h2>
          <button
            @click="handleClose"
            class="close-btn"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div v-if="cartItems.length === 0" class="empty-cart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="empty-icon"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path
              d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
            ></path>
          </svg>
          <p>Your cart is empty</p>
          <p class="empty-subtitle">Add some albums to get started!</p>
        </div>

        <div v-else class="cart-content">
          <div class="cart-items">
            <TransitionGroup name="cart-item">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <img
                  :src="item.image_url"
                  :alt="item.title"
                  class="item-image"
                />
                <div class="item-info">
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p class="item-artist">{{ item.artist }}</p>
                  <p class="item-price">${{ item.price.toFixed(2) }}</p>
                </div>
                <button
                  @click="handleRemove(item.id)"
                  class="remove-btn"
                  aria-label="Remove from cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path
                      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                    ></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </TransitionGroup>
          </div>

          <div class="cart-footer">
            <div class="cart-total">
              <span class="total-label">Total:</span>
              <span class="total-price">${{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="cart-actions">
              <button @click="handleClearCart" class="clear-btn">
                Clear Cart
              </button>
              <button class="checkout-btn">Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import type { Album } from "../types/album";

interface Props {
  isOpen: boolean;
  cartItems: Album[];
  totalPrice: number;
}

defineProps<Props>();

const emit = defineEmits<{
  close: [];
  "remove-item": [albumId: number];
  "clear-cart": [];
}>();

const handleClose = () => {
  emit("close");
};

const handleOverlayClick = () => {
  emit("close");
};

const handleRemove = (albumId: number) => {
  emit("remove-item", albumId);
};

const handleClearCart = () => {
  if (confirm("Are you sure you want to clear your cart?")) {
    emit("clear-cart");
  }
};

// Handle ESC key to close panel
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    emit("close");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
.cart-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.cart-panel {
  width: 100%;
  max-width: 450px;
  background: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.3);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #999;
  text-align: center;
}

.empty-icon {
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-cart p {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: #666;
}

.empty-subtitle {
  font-size: 0.95rem !important;
  color: #999 !important;
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: #f0f0f0;
  transform: translateX(-5px);
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.item-artist {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.item-price {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #667eea;
}

.remove-btn {
  background: #ff4757;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  align-self: center;
}

.remove-btn:hover {
  background: #ff3838;
  transform: scale(1.1);
}

.cart-footer {
  border-top: 2px solid #f0f0f0;
  padding: 1.5rem;
  background: white;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
}

.total-label {
  color: #333;
}

.total-price {
  color: #667eea;
}

.cart-actions {
  display: flex;
  gap: 1rem;
}

.clear-btn,
.checkout-btn {
  flex: 1;
  padding: 0.9rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn {
  background: #f0f0f0;
  color: #666;
}

.clear-btn:hover {
  background: #e0e0e0;
}

.checkout-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-active .cart-panel,
.slide-leave-active .cart-panel {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .cart-panel,
.slide-leave-to .cart-panel {
  transform: translateX(100%);
}

.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.cart-item-move {
  transition: transform 0.3s ease;
}

/* Scrollbar styling */
.cart-items::-webkit-scrollbar {
  width: 8px;
}

.cart-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.cart-items::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.cart-items::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .cart-panel {
    max-width: 100%;
  }
}
</style>
