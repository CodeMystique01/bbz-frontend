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
            <div className="border-b border-gray-100 bg-gray-50/50">
                <div style={{ maxWidth: 1100, marginLeft: "auto", marginRight: "auto", paddingLeft: 24, paddingRight: 24, paddingTop: 32, paddingBottom: 32 }}>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
                    <p className="text-sm text-gray-400 mb-5">Discover premium digital products from verified vendors</p>

                    <form onSubmit={handleSearch} className="flex max-w-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-l-lg bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-r-lg transition-colors text-sm font-medium cursor-pointer"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full" style={{ maxWidth: 1100, marginLeft: "auto", marginRight: "auto", paddingLeft: 24, paddingRight: 24, paddingTop: 24, paddingBottom: 24 }}>
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-400">
                            {isLoading ? "Loading..." : `${total} products`}
                        </p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer">
                                <X className="h-3 w-3" /> Clear
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${showFilters ? "bg-primary-50 border-primary-100 text-primary-600" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                        </button>
                        <select
                            value={sortOption}
                            onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-500 focus:outline-none"
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
                        <aside className="w-52 shrink-0 space-y-5">
                            <div className="bg-white rounded-lg border border-gray-100 p-4">
                                <h3 className="text-xs font-semibold text-gray-900 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {CATEGORIES.map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                                className="rounded border-gray-200 text-primary-600 focus:ring-primary-500"
                                            />
                                            {cat}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-100 p-4">
                                <h3 className="text-xs font-semibold text-gray-900 mb-3">Price Range</h3>
                                <div className="flex gap-2">
                                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Min" className="w-full px-2.5 py-1.5 rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary-200" />
                                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Max" className="w-full px-2.5 py-1.5 rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary-200" />
                                </div>
                                <button onClick={() => { setPage(1); fetchProducts(); }}
                                    className="w-full mt-2.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                                    Apply
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
                                <Search className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                                <h3 className="text-base font-medium text-gray-900 mb-1">No products found</h3>
                                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
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
                                    <div className="flex items-center justify-center gap-1.5 mt-10">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                            if (pageNum > totalPages) return null;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${pageNum === page
                                                        ? "bg-gray-900 text-white"
                                                        : "text-gray-400 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="h-4 w-4" />
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
