"use client";

import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import {Michroma} from 'next/font/google';
import {useIsDesktop} from "@/app/utils/useIsDesktop";

const michroma = Michroma({
    subsets: ['latin'],
    weight: '400'
});

const Footer: React.FC = () => {
    const isDesktop = useIsDesktop();

    // Do not render any nav until the component has hydrated on the client
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) return null;

    const footerMarginBottomClassName = isDesktop ? "mb-0" : "";

    return (
        <>
            <footer className="footer bg-base-200 bg-base-200 text-base-content border-base-300 border-y px-10 py-4">
                <aside className="grid-flow-col gap-4">
                    Edict is unofficial Fan Content permitted under Wizards of the Coast’s Fan Content Policy. Not
                    approved or endorsed by Wizards. The Magic: The Gathering rules, terms, and definitions referenced
                    here are © Wizards of the Coast LLC.
                </aside>
            </footer>
            <footer className="footer footer-horizontal bg-base-200 text-base-content items-center p-4 mb-16 lg:mb-0">
                <aside className="grid-flow-col items-center">
                    <Image src="/icon.svg" priority={true} alt="Edict" width={24} height={24}/>
                    <span className={`text-lg mb-1 ${michroma.className}`}>edict</span>
                </aside>
                <nav className="grid-flow-col gap-4 place-self-center justify-self-end">
                    <Link href="https://github.com/kyllian/edict">
                        <Image src="/github-mark-white.svg" alt="GitHub" width={22} height={22}/>
                    </Link>
                </nav>
            </footer>
        </>
    );
};

export default Footer;
