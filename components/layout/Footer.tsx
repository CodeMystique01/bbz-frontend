import Link from "next/link";
import { Store } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                <Store className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Buy<span className="text-primary-400">Bizz</span></span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed">Your trusted marketplace for digital products. Buy and sell with confidence.</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Marketplace</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/products" className="text-sm hover:text-white transition-colors">Browse Products</Link></li>
                            <li><Link href="/signup?role=VENDOR" className="text-sm hover:text-white transition-colors">Become a Seller</Link></li>
                            <li><Link href="/products" className="text-sm hover:text-white transition-colors">Categories</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="#" className="text-sm hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="text-sm hover:text-white transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} BuyBizz. All rights reserved.</p>
                    <span className="text-xs text-gray-500">Made in India 🇮🇳</span>
                </div>
            </div>
        </footer>
    );
}
