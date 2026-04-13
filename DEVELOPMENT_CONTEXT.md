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
- ✅ `src/services/api.js` - Updated productService + env variable support
- ✅ `src/pages/ProductListPage.jsx` - Updated to use searchTerm
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

1. **Advanced Search Features**
   - Filter by price range
   - Filter by seller
   - Filter by rating/reviews
   - Multiple category selection

2. **UX Improvements**
   - Search history/favorites
   - "Did you mean" suggestions
   - Trending searches

3. **Performance**
   - Implement infinite scroll
   - Lazy load product images
   - Cache search results

4. **Other Features**
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

---

**Last Updated**: April 13, 2026  
**Status**: ✅ Search feature complete and functional
