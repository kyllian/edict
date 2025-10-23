import type {Metadata, Viewport} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Edict — MTG Rule Search",
    description: "Explore Magic: The Gathering’s rules and glossary with Edict, an unofficial fan-built search engine currently in Alpha.",
    icons: {
        icon: '/icon.svg',
    },
    robots : {
        index: true,
        follow: true,
        noarchive: true
    },
    openGraph: {
        type: 'website',
        url: process.env['NEXT_PUBLIC_BASE_URL'],
        title: 'Edict — MTG Rule Search',
        description: 'Explore Magic: The Gathering’s rules and glossary with Edict, an unofficial fan-built search engine currently in Alpha.'
    },
    twitter: {
        title: "Edict — MTG Rule Search",
        description:
            "Explore Magic: The Gathering’s rules and glossary with Edict, an unofficial fan-built search engine currently in Alpha.",
    }
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1.0
}

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    // Nav will handle desktop/mobile detection and render Drawer or Dock
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="bg-base-100 border-base-300">
            <Nav>
                <div className="flex-1">
                    {children}
                </div>
                <Footer/>
            </Nav>
        </div>
        </body>
        </html>
    );
}
