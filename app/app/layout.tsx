import type {Metadata, Viewport} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import {NEXT_PUBLIC_BASE_URL} from "@/app/utils/constants";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(NEXT_PUBLIC_BASE_URL),
    icons: {
        icon: '/favicon.ico',
    },
    robots: {
        index: true,
        follow: true,
        noarchive: true
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1.0
}

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="bg-base-100 border-base-300">
            <Nav>
                <div className="flex-1 sm:mx-12">
                    {children}
                </div>
                <Footer/>
            </Nav>
        </div>
        </body>
        </html>
    );
}
