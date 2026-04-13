# ShuppeMarket Frontend - UI Design Specification

## 📐 Design System Overview

This document outlines the Shopee-inspired UI design for the ShuppeMarket e-commerce platform using Tailwind CSS and Lucide Icons.

---

## 🎨 Color Palette

### Primary Colors

- **Shopee Orange**: `#fb5d1f` (Main brand color)
- **Shopee Dark Orange**: `#f05c2c` (Hover state)
- **Shopee Light Orange**: `#fb7528` (Accent)

### Neutral Colors

- **White**: `#ffffff`
- **Light Gray**: `#f5f5f5` (Background)
- **Gray 200**: `#e5e4e7` (Borders)
- **Gray 600**: `#6b6375` (Text)
- **Gray 900**: `#08060d` (Dark text)

### Status Colors

- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Danger**: `#ef4444`
- **Info**: `#3b82f6`

---

## 📱 Layout Structure

### Desktop (1024px+)

- Header: Fixed height 120px
- Main container: Max-width 1280px
- Sidebar: 224px fixed width
- Product grid: 5 columns
- Footer: Full width

### Tablet (768px - 1023px)

- Header: Responsive
- Product grid: 3 columns
- Sidebar: Collapsible drawer

### Mobile (< 768px)

- Header: Compact
- Product grid: 2 columns
- Sidebar: Full-width drawer
- All buttons: Full width or compact

---

## 🧩 Component Library

### Buttons

#### Primary Button

```jsx
<button className="btn-shopee">Action Text</button>
```

- Background: Shopee Orange
- Color: White
- Padding: 8px 16px
- Hover: Darker orange
- Font: Medium weight

#### Outline Button

```jsx
<button className="btn-shopee-outline">Action Text</button>
```

- Background: Transparent
- Border: 1px Shopee Orange
- Color: Shopee Orange
- Hover: Light orange background

#### Small Button

```jsx
<button className="btn-shopee-sm">Small Action</button>
```

- Padding: 6px 12px
- Font size: 14px

### Cards

#### Product Card

- Width: Responsive grid
- Background: White
- Shadow: Light shadow
- Border-radius: 4px
- Content:
  - Product image (aspect-square)
  - Product name (2-line clamp)
  - Star rating with count
  - Price (bold, orange)
  - Seller info
  - Location
  - Add to cart button

#### Info Card

```jsx
<div className="card-shopee p-6">{/* Content */}</div>
```

### Input Fields

#### Text Input

```jsx
<input className="input-shopee" type="text" />
```

- Border: 1px gray-300
- Padding: 12px
- Border-radius: 4px
- Focus: Orange ring + border

#### Select Dropdown

```jsx
<select className="input-shopee">
  <option>Option</option>
</select>
```

### Form Validation

- Error color: `#ef4444`
- Success color: `#10b981`
- Helper text size: 12px
- Error display: Below input in red

---

## 📦 Page Layouts

### 1. Home Page

- **Hero Banner**
  - Gradient background (Shopee colors)
  - Call-to-action button
  - Featured text

- **Features Section**
  - 4 columns (desktop) | 2 columns (tablet) | 1 column (mobile)
  - Icon + title + description
  - Icons from Lucide

- **Categories Section**
  - 5 columns
  - Category cards with emoji/icon
  - Click navigates to product filter

- **Flash Sale Section**
  - Yellow/orange gradient background
  - 4 product cards
  - "Flash Sale" badge
  - Timer (hourly rotation)

- **Featured Products**
  - 5 columns grid
  - View all link
  - Lazy loading

- **Newsletter Section**
  - Email input + subscribe button
  - Centered layout

### 2. Product List Page

- **Sidebar Filters** (desktop) / Drawer (mobile)
  - Categories
  - Price range
  - Star ratings
  - Clear filters button

- **Toolbar**
  - Result count
  - Sort dropdown (Newest, Popular, Price ASC/DESC)
  - Toggle filters button (mobile)

- **Product Grid**
  - Responsive columns
  - Product cards
  - Hover effects

- **Pagination**
  - Previous/Next buttons
  - Page number buttons
  - Current page highlighted

### 3. Product Detail Page

- **Left Column (Desktop)**
  - Large product image
  - Thumbnail carousel
  - Image zoom on hover

- **Right Column (Desktop)**
  - Product title
  - 5-star rating with review count
  - Price section (current + original + savings)
  - Seller info card
  - Shipping information
  - Quantity selector
  - Add to cart / Wishlist buttons
  - Share button

- **Tabs Section**
  - Product description
  - Reviews & ratings
  - Q&A

- **Related Products**
  - 5 product cards
  - Same category items

### 4. Authentication Pages

#### Login Page

- Centered card layout
- Logo/brand header
- Email input
- Password input
- Remember me + Forgot password
- Login button
- Social login (Google)
- Register link

#### Register Page

- Centered card layout
- Email input
- Full name input
- Phone input
- Password input
- Confirm password input
- Terms checkbox
- Register button
- Login link

---

## 🎯 Interactive Elements

### Hover Effects

- Product cards: Scale up slightly (1.05)
- Buttons: Color change + cursor pointer
- Links: Color change to shopee-500

### Loading States

- Spinner animation
- Skeleton placeholders
- Disabled buttons: opacity-50

### Form States

- Empty: Default styling
- Filled: Normal state
- Error: Red border + error message
- Success: Green checkmark
- Disabled: Gray background, cursor-not-allowed

### Toast Notifications

- Success: Green background
- Error: Red background
- Warning: Yellow background
- Duration: 3-5 seconds auto-dismiss
- Position: Bottom right

---

## 📐 Spacing System

- **4px**: xs
- **8px**: sm
- **12px**: md
- **16px**: lg
- **24px**: xl
- **32px**: 2xl
- **48px**: 3xl
- **64px**: 4xl

---

## 🔤 Typography

### Font Family

- Primary: Roboto, 'Segoe UI', sans-serif

### Sizes

- **H1**: 28px (desktop) | 24px (mobile)
- **H2**: 24px (desktop) | 20px (mobile)
- **H3**: 18px
- **Body**: 16px
- **Small**: 14px
- **Tiny**: 12px

### Weights

- Regular: 400
- Medium: 500
- Bold: 700

---

## 🎬 Animations

### Transitions

- Default: 200ms ease-in-out
- Fast: 150ms
- Slow: 300ms

### Common Animations

- Hover scale: 1.05
- Fade in: opacity 0 → 1
- Slide in: translateX/Y
- Rotate: transform rotate

---

## 📋 Component Checklist

- [ ] Header component
- [ ] Footer component
- [ ] Product card
- [ ] Product list with filters
- [ ] Product detail page
- [ ] Login form
- [ ] Register form
- [ ] Shopping cart
- [ ] User profile
- [ ] Order history
- [ ] Wishlist
- [ ] Seller dashboard

---

## 🚀 Development Guidelines

### File Structure

```
src/
├── components/        # Reusable components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── ...
├── pages/            # Page components
│   ├── HomePage.jsx
│   ├── ProductListPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── ...
├── layouts/          # Layout wrappers
│   └── MainLayout.jsx
├── services/         # API calls
│   └── api.js
├── context/          # Global state
│   └── AuthContext.jsx
├── hooks/            # Custom hooks
│   └── ...
├── App.jsx          # Main app
└── index.css        # Tailwind styles
```

### Tailwind CSS Classes

- Use `@apply` in CSS for reusable styles
- Define custom components as layers
- Keep markup clean with utility classes

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Use responsive prefixes: `md:hidden`, `lg:block`

### Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast (WCAG AA)
- Focus indicators

---

## 🔗 API Integration

All API calls are made through the `/src/services/api.js` service:

- **Auth**: `authService.login()`, `authService.register()`
- **Products**: `productService.getAllProducts()`, `productService.getProductById()`
- **Categories**: `categoryService.getAllCategories()`
- **Sellers**: `sellerService.registerSeller()`

---

## 📝 Notes

- Color codes use Shopee's official brand colors
- All icons are from Lucide React
- Ensure mobile responsiveness with media queries
- Test on different screen sizes
- Follow the component structure carefully
- Keep performance in mind (lazy loading images)
