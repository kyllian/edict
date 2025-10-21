import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Image from "next/image";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Edict",
    description: "",
    icons: {
        icon: '/icon.svg',
    },
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-base-100">
            {children}
            <div className="fab fab-flower">
                <div tabIndex={0} role="button" className="btn btn-circle btn-lg">
                    <Image src="/icon.svg" alt="Edict" width={35} height={35}/>
                </div>

                <button className="fab-main-action btn btn-circle btn-lg btn-primary">
                    {/*<Image src="/icon.svg" alt="Edict" width={35} height={35}/>*/}
                </button>

                {/*<div className="tooltip tooltip-left" data-tip="Label A">*/}
                {/*    <a className="btn btn-circle btn-lg">*/}
                {/*        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}*/}
                {/*             stroke="currentColor" className="size-6">*/}
                {/*            <path strokeLinecap="round" strokeLinejoin="round"*/}
                {/*                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/>*/}
                {/*        </svg>*/}
                {/*    </a>*/}
                {/*</div>*/}
                <div className="tooltip tooltip-top">
                    <a href="/api/scalar" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-lg" data-tip="Scalar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                        </svg>
                    </a>
                </div>
                <div className="tooltip tooltip-top" data-tip="GitHub">
                    <a href="https://github.com/kyllian/edict" className="btn btn-circle btn-lg">
                        <Image src="/github-mark-white.svg" alt="GitHub" width={22} height={22}/>
                    </a>
                </div>
            </div>
        </div>
        </body>
        </html>
    );
}
