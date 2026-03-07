import Link from "next/link";
import { Store } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div style={{ maxWidth: 1100, marginLeft: "auto", marginRight: "auto", paddingLeft: 24, paddingRight: 24, paddingTop: 56, paddingBottom: 56 }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                <Store className="h-4.5 w-4.5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-white tracking-tight">
                                Buy<span className="text-primary-400">Bizz</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            India&apos;s trusted digital marketplace. Buy and sell software, templates, and creative assets.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Marketplace</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/products" className="text-sm text-gray-500 hover:text-white transition-colors">Browse Products</Link></li>
                            <li><Link href="/products?category=Software" className="text-sm text-gray-500 hover:text-white transition-colors">Software</Link></li>
                            <li><Link href="/products?category=Templates" className="text-sm text-gray-500 hover:text-white transition-colors">Templates</Link></li>
                            <li><Link href="/signup" className="text-sm text-gray-500 hover:text-white transition-colors">Become a Vendor</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-4">Legal</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm text-gray-500 hover:text-white transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} BuyBizz. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Made in India 🇮🇳</span>
                        <span>•</span>
                        <span>Powered by Razorpay</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
