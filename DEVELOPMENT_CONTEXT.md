# Shuppe Market - Development Context & Progress

## 📋 Project Overview

- **Backend**: ShuppeMarket.API (C# .NET)
- **Frontend**: Shuppe_UI (React + Vite + Tailwind CSS)
- **API Base URL**: https://localhost:7187/api/v1

---

## ✅ Completed Features

### 1. Search Functionality (April 13, 2026)

- **Backend**: Implemented search with parameters:
  - `searchTerm` - Search keyword
  - `orderBy` - Sorting
  - `pageIndex`, `pageSize` - Pagination
- **API Endpoint**:

  ```
  GET /products?pageIndex=1&pageSize=20&searchTerm={keyword}&orderBy=Name asc
  ```

- **Frontend - Search Service**: `src/services/api.js`
  - Updated `productService.getAllProducts()` to accept `searchTerm` parameter

  ```javascript
  getAllProducts: (pageIndex = 1, pageSize = 20, searchTerm = "") =>
    apiClient.get("/products", { params: { pageIndex, pageSize, searchTerm } });
  ```

- **Frontend - Search UI** (Header Component):
  - ✅ Real-time autocomplete dropdown with top 5 products
  - ✅ Debounce 300ms to avoid excessive API calls
  - ✅ Product preview (image, name, price)
  - ✅ Click product to search
  - ✅ Works on desktop & mobile
  - ✅ Close on click outside
  - ✅ Removed "loading..." text

### 2. Product Listing Page: `src/pages/ProductListPage.jsx`

- ✅ Fetch products with `searchTerm` parameter (removed client-side filtering)
- ✅ Category filtering (sidebar)
- ✅ Sorting by price
- ✅ URL params: `?searchTerm={keyword}&category={id}`
- ✅ Pagination support

### 3. Product Reviews Feature (April 13, 2026)

**Backend Endpoints Available:**

- ✅ `GET /reviews` - Danh sách reviews (paginated)
- ✅ `GET /reviews/product/{productId}` - Reviews cho sản phẩm cụ thể (paginated) **NEW**
- ✅ `GET /reviews/{id}` - Chi tiết review
- ✅ `POST /reviews/product/{productId}` - Thêm review (body: {rating, comment})
- ✅ `PUT /reviews/{id}` - Cập nhật review (body: {rating, comment}) **NOW WORKING**
- ✅ `DELETE /reviews/{id}` - Xóa review

**Frontend Components Created:**

- ✅ `ReviewForm.jsx` - Form để thêm review (5-star rating + comment)
- ✅ `ReviewList.jsx` - Hiển thị danh sách reviews
- ✅ `ProductDetailPage.jsx` - Tích hợp reviews section

**Features:**

- ⭐ 5-star rating picker with hover effect
- 💬 Comment input minimum 10 characters
- 👤 Show reviewer name & date
- 🗑️ Delete own reviews
- ✨ Real-time feedback after submit
- 🔐 Auth check - require login to review

---

## 🔑 Environment Setup (April 13, 2026)

### Frontend Environment Variables

**File**: `.env` (for development)

```
VITE_API_BASE_URL=https://localhost:7187/api/v1
```

**Available files**:

- `.env` - Development settings
- `.env.example` - Template (copy to create new env files)
- `.env.production` - Production settings

### Backend Environment Variables

**File**: `appsettings.json` (checked in, generic config)
**File**: `appsettings.Development.json` (local only, not in git)

**Required fields in appsettings.Development.json**:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_DATABASE_CONNECTION_STRING"
  },
  "Jwt": {
    "SecretKey": "YOUR_SECRET_KEY_MIN_32_CHARS",
    "Issuer": "your-issuer",
    "Audience": "your-audience"
  },
  "AdminAccount": {
    "Email": "admin@example.com",
    "Password": "your-password"
  }
}
```

**Reference**: See `appsettings.example.json` for all available options

---

## 🏗️ Architecture

### Search Flow

```
User Types in Header
    ↓
Debounce 300ms
    ↓
API Call: /products?pageIndex=1&pageSize=5&searchTerm={keyword}
    ↓
Display top 5 suggestions in dropdown
    ↓
Click on product → Navigate to /products?searchTerm={productName}
    ↓
ProductListPage fetches with searchTerm parameter
```

### Key Components

1. **Header.jsx** - Main search bar + autocomplete suggestions
2. **ProductListPage.jsx** - Product listing with filters
3. **api.js** - API service with search support
4. **ProductCard.jsx** - Individual product display

---

## 🔧 Current State

### Files Modified/Created

- ✅ `src/components/Header.jsx` - Added autocomplete search
- ✅ `src/services/api.js` - Updated productService + env variable support + reviewService
- ✅ `src/pages/ProductListPage.jsx` - Updated to use searchTerm
- ✅ `src/pages/ProductDetailPage.jsx` - Integrated reviews display & form
- ✅ `src/components/ReviewForm.jsx` - Form to add product reviews
- ✅ `src/components/ReviewList.jsx` - Display reviews with ratings
- ✅ `.env` - Frontend environment variables (dev)
- ✅ `.env.example` - Environment template
- ✅ `.env.production` - Production environment config
- ✅ `appsettings.example.json` - Backend configuration template

### Database/Backend

- Backend search endpoint functional and tested
- Supports `searchTerm`, `orderBy`, pagination

---

## 📝 Future Development

### Recommended Next Steps

1. **Advanced Review Features**
   - ✅ Add/Delete reviews (done)
   - 🔜 Edit own reviews (PUT /reviews/{id} - backend not implemented yet)
   - 🔜 Review images/photos
   - 🔜 Sort reviews by date/helpful
   - 🔜 Filter reviews by rating

2. **Advanced Search Features**
   - Filter by price range
   - Filter by seller
   - Filter by rating/reviews
   - Multiple category selection

3. **UX Improvements**
   - Search history/favorites
   - "Did you mean" suggestions
   - Trending searches

4. **Performance**
   - Implement infinite scroll
   - Lazy load product images
   - Cache search results

5. **Other Features**
   - User authentication flow
   - Shopping cart
   - Checkout process
   - Order management
   - Seller dashboard
   - Admin dashboard

---

## 🚀 Build & Run

### Frontend Setup

```bash
cd Shuppe_FE/Shuppe_UI
npm install
# Create .env if not exists, copy from .env.example
npm run dev
```

### Backend Setup

```bash
cd ShuppeMarket
dotnet restore
# Create appsettings.Development.json with your local config
dotnet run --project ShuppeMarket.API
```

---

## 📌 Important Notes

- Search parameter changed from `q` to `searchTerm` (matches backend API)
- Debounce prevents excessive API calls during typing
- Top 5 suggestions shown in real-time
- Both desktop and mobile search implemented
- Category & sorting filters work alongside search
- **Reviews Feature**: Users can add/view product reviews
  - Create Review: `POST /api/v1/reviews/product/{productId}` with `{rating, comment}`
  - Get Reviews for Product: `GET /api/v1/reviews/product/{productId}` - dedicated endpoint for filtering
  - Update Review: `PUT /api/v1/reviews/{id}` with `{rating, comment}` (NOT YET IMPLEMENTED IN UI)
  - Delete Review: `DELETE /api/v1/reviews/{id}` (own reviews only)
  - Reviews require authentication
  - Uses dedicated `getReviewsByProductId()` endpoint for efficient product-specific queries

---

**Last Updated**: April 13, 2026 (Review API Restructured - Dedicated Product Reviews Endpoint)  
**Status**: ✅ Search + Reviews features complete and functional
