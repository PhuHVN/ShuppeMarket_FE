# ShuppeMarket Frontend Development Guide

## 🚀 Getting Started

### Installation

```bash
cd Shuppe_FE/Shuppe_UI
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Header.jsx          # Top navigation bar
│   ├── Footer.jsx          # Bottom footer
│   └── ProductCard.jsx     # Product grid card
│
├── pages/                  # Page components
│   ├── HomePage.jsx        # Landing page
│   ├── ProductListPage.jsx # Products with filters
│   ├── ProductDetailPage.jsx # Single product view
│   ├── LoginPage.jsx       # User login
│   └── RegisterPage.jsx    # User registration
│
├── layouts/                # Layout wrappers
│   └── MainLayout.jsx      # Default layout (Header + Footer)
│
├── context/                # Global state management
│   └── AuthContext.jsx     # Authentication state
│
├── services/               # API communication
│   └── api.js             # Axios instance + endpoints
│
├── hooks/                  # Custom React hooks
│   └── (to be extended)
│
├── App.jsx                # Main app component + routing
├── index.css              # Tailwind CSS + custom styles
└── main.jsx              # React DOM entry point
```

---

## 🎯 Key Features Implementation

### 1. Authentication Flow

**Context-based state management:**

```jsx
import { useAuth } from "./context/AuthContext";

function Component() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // Use auth state
}
```

**Protected Routes (to implement):**

```jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

### 2. API Integration

**Service layer pattern:**

```jsx
// services/api.js
export const productService = {
  getAllProducts: (pageIndex, pageSize) =>
    apiClient.get("/products", { params: { pageIndex, pageSize } }),
  getProductById: (id) => apiClient.get(`/products/${id}`),
};

// Usage in components
const { data } = await productService.getAllProducts(1, 20);
```

### 3. Product Filtering & Search

**Combining URL params with API calls:**

```jsx
const [searchParams, setSearchParams] = useSearchParams();

// Filter by category
const selectedCategory = searchParams.get("category");

// Change filter
const handleFilter = (categoryId) => {
  searchParams.set("category", categoryId);
  setSearchParams(searchParams);
};
```

### 4. Form Validation

**Client-side validation pattern:**

```jsx
const validateForm = () => {
  const errors = {};

  if (!email) errors.email = "Email is required";
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    errors.email = "Invalid email";

  return errors;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const errors = validateForm();

  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }

  // Submit form
};
```

---

## 🎨 Component Creation Pattern

### Component Template

```jsx
import React, { useState } from "react";
import { IconName } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState("");
  const navigate = useNavigate();

  const handleAction = () => {
    // Action logic
  };

  return (
    <div className="component-class">
      <h2 className="text-2xl font-bold">Title</h2>
      {/* Content */}
    </div>
  );
};

export default ComponentName;
```

### Style Best Practices

- Use Tailwind utility classes for layouts
- Use `@apply` for component-specific styles in `index.css`
- Avoid inline styles
- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Follow mobile-first approach

---

## 📱 Responsive Design Breakpoints

```
Mobile:     < 640px  (default)
Tablet:     640px+   (sm)
Desktop:    768px+   (md)
Large:      1024px+  (lg)
XL:         1280px+  (xl)
```

### Example

```jsx
{
  /* 1 column on mobile, 2 on tablet, 4 on desktop */
}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Items */}
</div>;
```

---

## 🔄 State Management Patterns

### Local Component State

```jsx
const [count, setCount] = useState(0);
```

### Global Auth State

```jsx
const { user, isAuthenticated } = useAuth();
```

### URL State (Filters/Search)

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const query = searchParams.get("q");
setSearchParams(new URLSearchParams({ q: "search" }));
```

---

## 🚨 Error Handling

### API Error Pattern

```jsx
try {
  const response = await apiService.call();
  setData(response.data);
} catch (error) {
  const errorMsg = error.response?.data?.message || "An error occurred";
  setError(errorMsg);
} finally {
  setLoading(false);
}
```

### Form Error Display

```jsx
{
  errors.fieldName && (
    <p className="text-red-500 text-xs mt-1">{errors.fieldName}</p>
  );
}
```

---

## 🔐 Security Best Practices

1. **Token Storage**
   - Store JWT in localStorage
   - Clear on logout
   - Send in Authorization header

2. **API Requests**
   - Use interceptors for token injection
   - Validate responses
   - Handle unauthorized (401) responses

3. **Form Security**
   - Validate client-side
   - Don't expose passwords in logs
   - Use HTTPS in production

---

## ⚡ Performance Optimization

### Code Splitting

```jsx
import { lazy, Suspense } from "react";

const ProductDetail = lazy(() => import("./pages/ProductDetailPage"));

<Suspense fallback={<LoadingSpinner />}>
  <ProductDetail />
</Suspense>;
```

### Image Optimization

```jsx
<img
  src={product.imageUrl}
  alt={product.name}
  className="product-image-placeholder"
  loading="lazy"
/>
```

### Memoization

```jsx
import { memo } from "react";

const ProductCard = memo(({ product }) => {
  return {
    /* ... */
  };
});

export default ProductCard;
```

---

## 📚 Common Utilities

### Price Formatting

```jsx
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};
```

### Date Formatting

```jsx
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
```

---

## 🧪 Testing (To Implement)

### Component Testing

```jsx
import { render, screen } from "@testing-library/react";
import ProductCard from "./ProductCard";

test("renders product card", () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
});
```

---

## 📝 Naming Conventions

- **Components**: PascalCase (ProductCard.jsx)
- **Functions**: camelCase (handleClick, fetchProducts)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Classes**: kebab-case (btn-shopee, card-shopee)
- **Variables**: camelCase (userName, isLoading)

---

## 🔗 API Endpoints Reference

### Auth

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/auth/me` - Get current user

### Products

- `GET /api/v1/products` - Get all products (paginated)
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/products` - Create product (seller)
- `DELETE /api/v1/products/{id}` - Delete product

### Categories

- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/{id}` - Get category details
- `POST /api/v1/categories/{name}` - Create category
- `PUT /api/v1/categories/{id}/{name}` - Update category

### Sellers

- `POST /api/v1/sellers/register/{accountId}` - Register as seller
- `GET /api/v1/sellers/{id}` - Get seller info
- `GET /api/v1/sellers` - Get all sellers

---

## 🆘 Troubleshooting

### Common Issues

**CORS Error**

- Add proxy in vite.config.js if API is on different domain
- Check backend CORS headers

**404 Not Found**

- Verify API endpoint paths
- Check network tab in DevTools
- Ensure backend is running

**State Not Updating**

- Check React DevTools
- Verify state setter is called
- Look for dependency array issues in useEffect

---

## 📖 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios Docs](https://axios-http.com)

---

## 👥 Team Guidelines

- Code review before merging
- Follow component naming conventions
- Write meaningful commit messages
- Test on multiple screen sizes
- Keep components small and focused
- Document complex logic with comments
