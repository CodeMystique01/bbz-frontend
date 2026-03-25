"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Product, ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Navbar, PageContainer } from "@/components/layout";
import { Footer } from "@/components/layout/Footer";
import { Spinner } from "@/components/ui";

const SORT_OPTIONS = [
    { value: "", label: "Relevance" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
    { value: "newest", label: "Newest" },
    { value: "rating", label: "Top Rated" },
];

const CATEGORIES = [
    "Software", "Templates", "Graphics", "Audio", "Video",
    "E-books", "Courses", "Plugins", "Fonts", "Other",
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const limit = 12;

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sortOption, selectedCategories]);

    async function fetchProducts() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.set("searchQuery", searchQuery);
            if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);
            if (sortOption) params.set("sortOption", sortOption);
            params.set("page", String(page));
            params.set("limit", String(limit));

            const res = await apiClient.get<ProductListResponse | Product[]>(
                `/api/products?${params.toString()}`
            );

            if (Array.isArray(res)) {
                setProducts(res);
                setTotal(res.length);
                setTotalPages(1);
            } else {
                setProducts(res.products);
                setTotal(res.total);
                setTotalPages(res.totalPages);
            }
        } catch {
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    }

    function toggleCategory(cat: string) {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
        setPage(1);
    }

    function clearFilters() {
        setSearchQuery("");
        setSelectedCategories([]);
        setMinPrice("");
        setMaxPrice("");
        setSortOption("");
        setPage(1);
    }

    const hasActiveFilters = searchQuery || selectedCategories.length > 0 || minPrice || maxPrice;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            {/* Search Header */}
            <div style={{ borderBottom: "1px solid #f3f4f6" }}>
                <PageContainer style={{ paddingTop: 40, paddingBottom: 40 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 4 }}>Products</h1>
                    <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Discover premium digital products from verified vendors</p>

                    <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: 520 }}>
                        <div style={{ position: "relative", flex: 1 }}>
                            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", height: 16, width: 16, color: "#d1d5db" }} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                style={{
                                    width: "100%",
                                    paddingLeft: 40,
                                    paddingRight: 16,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    borderRadius: "10px 0 0 10px",
                                    border: "1px solid #e5e7eb",
                                    borderRight: "none",
                                    fontSize: 14,
                                    color: "#111827",
                                    outline: "none",
                                    background: "#fff",
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                padding: "10px 24px",
                                background: "#111827",
                                color: "#fff",
                                borderRadius: "0 10px 10px 0",
                                border: "none",
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Search
                        </button>
                    </form>
                </PageContainer>
            </div>

            {/* Main Content */}
            <PageContainer className="flex-1 py-6 pb-12">
                {/* Toolbar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <p style={{ fontSize: 12, color: "#9ca3af" }}>
                            {isLoading ? "Loading..." : `${total} products`}
                        </p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} style={{ fontSize: 12, color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, background: "none", border: "none" }}>
                                <X style={{ height: 12, width: 12 }} /> Clear
                            </button>
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 12px",
                                borderRadius: 8,
                                border: showFilters ? "1px solid #dbeafe" : "1px solid #e5e7eb",
                                background: showFilters ? "#eff6ff" : "#fff",
                                color: showFilters ? "#2563eb" : "#6b7280",
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                        >
                            <SlidersHorizontal style={{ height: 14, width: 14 }} /> Filters
                        </button>
                        <select
                            value={sortOption}
                            onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
                            style={{
                                padding: "6px 12px",
                                borderRadius: 8,
                                border: "1px solid #e5e7eb",
                                background: "#fff",
                                fontSize: 12,
                                color: "#6b7280",
                                outline: "none",
                            }}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 32 }}>
                    {/* Filter Panel */}
                    {showFilters && (
                        <aside style={{ width: 200, flexShrink: 0 }}>
                            <div style={{ borderRadius: 12, border: "1px solid #f3f4f6", padding: 16, marginBottom: 12 }}>
                                <h3 style={{ fontSize: 11, fontWeight: 600, color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Categories</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {CATEGORIES.map((cat) => (
                                        <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280", cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                                style={{ borderRadius: 4 }}
                                            />
                                            {cat}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ borderRadius: 12, border: "1px solid #f3f4f6", padding: 16 }}>
                                <h3 style={{ fontSize: 11, fontWeight: 600, color: "#111827", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Price Range</h3>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min" style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: 12, outline: "none" }} />
                                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max" style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", fontSize: 12, outline: "none" }} />
                                </div>
                                <button onClick={() => { setPage(1); fetchProducts(); }}
                                    style={{ width: "100%", marginTop: 10, padding: "6px 12px", background: "#f9fafb", color: "#4b5563", borderRadius: 6, fontSize: 12, fontWeight: 500, border: "1px solid #f3f4f6", cursor: "pointer" }}>
                                    Apply
                                </button>
                            </div>
                        </aside>
                    )}

                    {/* Product Grid */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {isLoading ? (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "96px 0" }}>
                                <Spinner size="lg" />
                            </div>
                        ) : products.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "96px 0" }}>
                                <Search style={{ height: 32, width: 32, color: "#e5e7eb", margin: "0 auto 12px" }} />
                                <h3 style={{ fontSize: 15, fontWeight: 500, color: "#111827", marginBottom: 4 }}>No products found</h3>
                                <p style={{ fontSize: 13, color: "#9ca3af" }}>Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            description={product.description}
                                            price={product.price}
                                            imageUrl={product.imageUrl}
                                            category={product.category || undefined}
                                            averageRating={product.averageRating}
                                            vendorName={product.vendor?.name || product.vendor?.email}
                                        />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 40 }}>
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            style={{ padding: 8, borderRadius: 8, border: "1px solid #f3f4f6", color: "#9ca3af", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.3 : 1, background: "transparent" }}
                                        >
                                            <ChevronLeft style={{ height: 16, width: 16 }} />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                            if (pageNum > totalPages) return null;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: 8,
                                                        fontSize: 12,
                                                        fontWeight: 500,
                                                        cursor: "pointer",
                                                        background: pageNum === page ? "#111827" : "transparent",
                                                        color: pageNum === page ? "#fff" : "#9ca3af",
                                                        border: "none",
                                                    }}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            style={{ padding: 8, borderRadius: 8, border: "1px solid #f3f4f6", color: "#9ca3af", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.3 : 1, background: "transparent" }}
                                        >
                                            <ChevronRight style={{ height: 16, width: 16 }} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </PageContainer>

            <Footer />
        </div>
    );
}
