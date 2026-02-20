// ── Shared TypeScript types matching backend Prisma models ──

// ── Auth ──
export interface AuthUser {
    id: string;
    email: string;
    role: "BUYER" | "VENDOR" | "ADMIN";
    name?: string;
}

// ── Products ──
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    fileUrl?: string | null;
    category?: string | null;
    vendorId: string;
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
    isActive: boolean;
    averageRating?: number | null;
    totalReviews?: number;
    vendor?: { id: string; email: string; name?: string | null };
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface ProductFilters {
    searchQuery?: string;
    categories?: string;
    minPrice?: string;
    maxPrice?: string;
    sortOption?: string;
    page?: number;
    limit?: number;
}

export interface ProductListResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ── Cart ──
export interface CartItem {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    product: Product;
    createdAt: string;
    updatedAt: string;
}

// ── Orders ──
export type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "CONFIRMED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product;
}

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    status: string;
    method: string;
    transactionId?: string | null;
    createdAt: string;
}

export interface Order {
    id: string;
    buyerId: string;
    totalAmount: number;
    status: OrderStatus;
    items: OrderItem[];
    payment?: Payment | null;
    buyer?: { id: string; email: string };
    createdAt: string;
    updatedAt: string;
}

export interface OrderListResponse {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ── Dashboard ──
export interface BuyerDashboard {
    totalOrders: number;
    totalSpent: number;
    completedOrders: number;
    pendingOrders: number;
    recentPurchases: {
        id: string;
        date: string;
        totalAmount: number;
        status: OrderStatus;
        items: { productName: string; quantity: number; price: number }[];
    }[];
}

export interface VendorDashboard {
    totalProducts: number;
    totalSales: number;
    totalOrders: number;
    totalLicenses: number;
    assignedLicenses: number;
    recentOrders: {
        id: string;
        date: string;
        buyerEmail: string;
        status: OrderStatus;
        totalAmount: number;
        items: { productName: string; quantity: number; price: number }[];
    }[];
    topProducts: {
        id: string;
        name: string;
        totalSold: number;
        revenue: number;
        totalLicenses: number;
        assignedLicenses: number;
    }[];
}

export interface AdminDashboard {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    userGrowthRate: number;
    orderGrowthRate: number;
    revenueGrowthRate: number;
    revenueTrend: { date: string; revenue: number }[];
    userTrend: { date: string; users: number }[];
    topVendors: {
        id: string;
        email: string;
        totalProducts: number;
        totalRevenue: number;
        totalOrders: number;
    }[];
}

// ── Wishlist ──
export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    product: Product;
    createdAt: string;
}

// ── Reviews ──
export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    comment: string;
    helpfulCount: number;
    user?: { id: string; email: string; name?: string | null };
    createdAt: string;
    updatedAt: string;
}

// ── Admin ──
export interface AdminUser {
    id: string;
    email: string;
    name?: string | null;
    role: "BUYER" | "VENDOR" | "ADMIN";
    status: "ACTIVE" | "SUSPENDED" | "BANNED";
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: { orders: number; products: number };
}

// ── Pagination ──
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
