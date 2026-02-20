"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Product, ProductListResponse } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout/Footer";
import { Spinner } from "@/components/ui";

const SORT_OPTIONS = [
    { value: "", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
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

            // Backend may return array (no filters) or paginated object (with filters)
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
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            {/* Hero Header */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Explore Products</h1>
                    <p className="text-primary-100 text-lg mb-6">Discover premium digital products from verified vendors</p>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-l-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3.5 bg-primary-900 hover:bg-primary-950 text-white rounded-r-xl transition-colors font-medium text-sm cursor-pointer"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-500">
                            {isLoading ? "Loading..." : `${total} products found`}
                        </p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer">
                                <X className="h-3 w-3" /> Clear filters
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${showFilters ? "bg-primary-50 border-primary-200 text-primary-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        >
                            <SlidersHorizontal className="h-4 w-4" /> Filters
                        </button>
                        <select
                            value={sortOption}
                            onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
                            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Filter Panel */}
                    {showFilters && (
                        <aside className="w-64 shrink-0 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 text-sm mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {CATEGORIES.map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            {cat}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 text-sm mb-3">Price Range</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                                    />
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
                                    />
                                </div>
                                <button
                                    onClick={() => { setPage(1); fetchProducts(); }}
                                    className="w-full mt-3 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors cursor-pointer"
                                >
                                    Apply Price
                                </button>
                            </div>
                        </aside>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-24">
                                <Spinner size="lg" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-24">
                                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                            if (pageNum > totalPages) return null;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${pageNum === page
                                                            ? "bg-primary-600 text-white"
                                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
