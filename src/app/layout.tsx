import type { Metadata } from "next";
import Link from "next/link";
import { BasketProvider } from "@/context/basket";
import { BasketNavigation } from "@/components/BasketNavigation";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "Product Catalogue",
        template: "%s Product Catalogue",
    },
    description: "A Next.js product catalogue with search, filtering and detail pages.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <BasketProvider>
                    <header className="site-header">
                        <div className="container site-header_inner">
                            <Link href="/" className="site-header_brand">TFS Catalogue</Link>
                            <nav className="site-header_nav">
                                <Link href="/products">Products</Link>
                                <BasketNavigation />
                            </nav>
                        </div>
                    </header>
                    <main className="container">{children}</main>
                </BasketProvider>
            </body>
        </html>
    );
}