# 🏗️ Frontend Architecture - HPC Project

## 📁 Cấu Trúc Thư Mục

```
fe-portal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   ├── authorized/        # Protected routes
│   │   │   └── dashboard/     # Dashboard page
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   │   ├── LoginForm.tsx # Login form component
│   │   │   └── ProtectedRoute.tsx # Route protection
│   │   └── dashboard/        # Dashboard components
│   │       └── DashboardHeader.tsx # Dashboard header
│   ├── contexts/             # React Context providers
│   │   └── AuthContext.tsx   # Authentication context
│   ├── hooks/                # Custom React hooks
│   │   └── useLogin.ts       # Login logic hook
│   ├── lib/                  # Utility libraries
│   │   ├── api.ts            # API client & types
│   │   ├── config.ts         # App configuration
│   │   ├── constants.ts      # Constants
│   │   └── utils.ts          # Utility functions
│   ├── styles/               # Global styles
│   └── themes/               # Theme configurations
```

## 🔧 Kiến Trúc Tách Biệt Logic và UI

### 1. **API Layer** (`/lib/api.ts`)

- **HTTP Client**: Xử lý tất cả API calls
- **Type Definitions**: Interface cho request/response
- **Token Management**: Quản lý JWT tokens
- **Error Handling**: Xử lý lỗi API một cách nhất quán

### 2. **Context Layer** (`/contexts/AuthContext.tsx`)

- **State Management**: Quản lý authentication state
- **Provider Pattern**: Cung cấp auth data cho toàn bộ app
- **Business Logic**: Xử lý login, logout, profile management

### 3. **Custom Hooks** (`/hooks/useLogin.ts`)

- **Logic Extraction**: Tách business logic ra khỏi components
- **Reusability**: Có thể tái sử dụng cho nhiều components
- **State Management**: Quản lý local state của form

### 4. **UI Components** (`/components/`)

- **Pure Components**: Chỉ chứa UI logic, không có business logic
- **Props Interface**: Nhận data và callbacks từ parent
- **Reusable**: Có thể sử dụng ở nhiều nơi

### 5. **Pages** (`/app/`)

- **Composition**: Kết hợp các components lại với nhau
- **Layout Management**: Quản lý layout và routing
- **Minimal Logic**: Chỉ chứa logic cần thiết cho page

## 🔐 Authentication Flow

```
User Input → LoginForm → useLogin Hook → AuthContext → API Client → Backend
    ↓
UI Update ← State Change ← Token Storage ← Response Processing
```

### 1. **User Input**: User nhập credentials

### 2. **Form Validation**: Kiểm tra input hợp lệ

### 3. **API Call**: Gọi backend API qua apiClient

### 4. **Token Storage**: Lưu JWT token vào localStorage

### 5. **State Update**: Cập nhật auth state trong context

### 6. **Navigation**: Redirect đến dashboard tương ứng

## 🎯 Design Patterns

### 1. **Provider Pattern**

- `AuthProvider` wrap toàn bộ app
- Cung cấp authentication state cho tất cả components

### 2. **Custom Hook Pattern**

- `useLogin` tách logic ra khỏi UI
- Dễ dàng test và maintain

### 3. **Component Composition**

- Components nhỏ, focused vào một nhiệm vụ
- Dễ dàng combine và reuse

### 4. **Type Safety**

- TypeScript interfaces cho tất cả data structures
- Compile-time error checking

## 🚀 Benefits của Architecture

### ✅ **Separation of Concerns**

- Logic và UI tách biệt rõ ràng
- Dễ dàng maintain và debug

### ✅ **Reusability**

- Components có thể sử dụng ở nhiều nơi
- Hooks có thể share giữa các components

### ✅ **Testability**

- Logic có thể test độc lập
- UI components dễ dàng mock và test

### ✅ **Scalability**

- Dễ dàng thêm features mới
- Structure rõ ràng cho team development

### ✅ **Maintainability**

- Code organized và structured
- Dễ dàng find và fix bugs

## 🔄 State Management Flow

```
AuthContext (Global State)
    ↓
useLogin Hook (Local State)
    ↓
LoginForm Component (UI)
    ↓
API Client (HTTP Requests)
    ↓
Backend API
```

## 📱 Responsive Design

- **Mobile First**: CSS modules với responsive breakpoints
- **Flexible Layout**: Grid và Flexbox cho adaptive design
- **Touch Friendly**: Button sizes và spacing phù hợp mobile

## 🎨 Styling Strategy

- **CSS Modules**: Scoped styling, no conflicts
- **Design System**: Consistent colors, spacing, typography
- **Theme Support**: Dark/light mode với next-themes
- **Component Styling**: Mỗi component có CSS module riêng
