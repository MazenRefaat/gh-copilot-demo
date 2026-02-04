# 🛒 Feature: Cart Management for Album Viewer

## Description

Add shopping cart functionality to the album viewer application, allowing users to manage a collection of albums they wish to purchase. This feature will enhance the user experience by providing a familiar e-commerce pattern for album selection and review before purchase.

## User Story

As a music enthusiast browsing the album collection, I want to add albums to a shopping cart so that I can review my selections and manage my intended purchases before checking out.

## Functional Requirements

### Cart Display

- **Cart Icon in Header**: Display a cart icon in the application header with a badge showing the total number of albums in the cart
- **Cart Badge Counter**: Update the counter dynamically as items are added/removed
- **Cart Panel/Modal**: Clicking the cart icon opens a panel or modal showing cart contents

### Adding Albums

- **Add to Cart Button**: Each album card in the list view should have an "Add to Cart" button
- **Visual Feedback**: Show confirmation when an album is added (toast notification or button state change)
- **Prevent Duplicates**: Prevent adding the same album multiple times (optional: or allow quantity increment)

### Removing Albums

- **Remove Button**: Each item in the cart view should have a remove/delete button
- **Confirmation**: Optionally show confirmation before removing
- **Empty State**: Display appropriate message when cart is empty

## Implementation Details

### Frontend Components to Create/Modify

**1. New Components**

- `CartIcon.vue` - Header cart icon with badge counter
  - Props: `itemCount: number`
  - Emits: `click` event to toggle cart panel
- `CartPanel.vue` - Sliding panel or modal to display cart contents
  - Props: `isOpen: boolean`, `cartItems: Album[]`
  - Emits: `close`, `remove-item`
- `CartItem.vue` - Individual cart item display (optional)
  - Props: `album: Album`
  - Emits: `remove`

**2. Modify Existing Components**

- `App.vue` - Add CartIcon and CartPanel to header/layout
- `AlbumCard.vue` - Add "Add to Cart" button with click handler

### State Management

**Option A: Composable (Recommended)**
Create `src/composables/useCart.ts`:

```typescript
interface CartState {
  items: Album[];
  itemCount: number;
}

export function useCart() {
  const items = ref<Album[]>([]);
  const itemCount = computed(() => items.value.length);

  const addToCart = (album: Album) => {
    /* ... */
  };
  const removeFromCart = (albumId: number) => {
    /* ... */
  };
  const clearCart = () => {
    /* ... */
  };
  const isInCart = (albumId: number) => {
    /* ... */
  };

  return { items, itemCount, addToCart, removeFromCart, clearCart, isInCart };
}
```

**Option B: Pinia Store** (if using Pinia)
Create `src/stores/cart.ts`

### Persistence

- Store cart data in `localStorage` to persist between sessions
- Load cart state on app initialization
- Auto-save on cart modifications

### Styling

- Use existing design system colors and patterns
- Ensure cart panel/modal is responsive
- Add smooth transitions for cart open/close
- Badge should be visually prominent but not intrusive

## Acceptance Criteria

### Must Have

- [ ] Cart icon with item count badge is visible in the application header
- [ ] Badge displays "0" when cart is empty, or hidden when empty
- [ ] Badge displays correct count (1-99, or "99+" for counts over 99)
- [ ] Clicking cart icon opens cart panel/modal
- [ ] Cart panel displays all added albums with their details (image, title, artist, price)
- [ ] Each album card has an "Add to Cart" button
- [ ] Clicking "Add to Cart" adds the album to the cart
- [ ] Cart count updates immediately when album is added
- [ ] Each cart item has a "Remove" button
- [ ] Clicking "Remove" removes the album from cart
- [ ] Cart count updates immediately when album is removed
- [ ] Cart data persists in localStorage across browser sessions
- [ ] Empty cart shows appropriate message (e.g., "Your cart is empty")
- [ ] Cart panel can be closed by clicking outside, close button, or ESC key

### Visual/UX

- [ ] Add to cart button shows visual feedback on click (e.g., button state change, animation)
- [ ] Duplicate albums cannot be added (button shows "In Cart" or is disabled)
- [ ] Cart panel has smooth open/close transition
- [ ] Layout is responsive on mobile, tablet, and desktop
- [ ] Total price is calculated and displayed in cart
- [ ] Cart panel includes "Clear Cart" option

### Technical

- [ ] Cart state uses reactive Vue composition pattern
- [ ] No console errors when adding/removing items
- [ ] Cart operations are properly typed with TypeScript
- [ ] Unit tests added for cart composable/store functions
- [ ] Component tests added for CartIcon, CartPanel, and modified AlbumCard

## Out of Scope (Future Enhancements)

- Checkout functionality
- Payment processing
- Quantity adjustment per album
- Cart item sorting/filtering
- Save cart for later / wish list
- Share cart functionality

## Technical Notes

- Follow existing Vue 3 Composition API patterns used in the project
- Use TypeScript for type safety
- Maintain consistency with existing `Album` interface from `src/types/album.ts`
- Ensure WCAG 2.1 AA accessibility compliance (keyboard navigation, screen reader support)

## Design Mockups

_Optional: Add wireframes or mockups here if available_

## Related Issues

_Link to related issues or PRs_

---

**Labels**: `enhancement`, `feature`, `frontend`, `vue`  
**Priority**: Medium  
**Estimated Effort**: 3-5 hours
