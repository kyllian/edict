"use server";

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import {Michroma} from 'next/font/google';

const michroma = Michroma({
    subsets: ['latin'],
    weight: '400'
});

const Footer: React.FC = () =>
    (
        <div className="relative bottom-0 mt-15 bg-base-200 text-base-content">
            <footer className={"footer footer-horizontal border-base-300 border-y items-center p-4 md:mb-0"}>
                <nav className="grid-flow-col gap-4 items-center">
                    <Link href="https://discord.gg/SPHuvhf8aW" aria-label="Discord">
                        <Image src="/Discord-Symbol-White.svg" alt="Discord (white)" width={22} height={22}
                               className="hidden dark:block"/>
                        <Image src="/Discord-Symbol-Black.svg" alt="Discord (black)" width={22} height={22}
                               className="block dark:hidden"/>
                    </Link>
                    <Link href="https://github.com/kyllian/edict">
                        <Image src="/github-mark-white.svg" alt="GitHub Discord (white)" width={22} height={22}
                               className="hidden dark:block"/>
                        <Image src="/github-mark.svg" alt="GitHub (black)" width={22} height={22}
                               className="block dark:hidden"/>
                    </Link>
                </nav>
                <aside className="grid-flow-col items-center justify-self-end">
                    <Image src="/edict.svg" alt="Edict" width={22} height={22}/>
                    <span className={`text-lg mb-1 ${michroma.className}`}>edict</span>
                </aside>
            </footer>
            <footer className="footer px-10 py-4 mb-16 lg:mb-0">
                <aside className="grid-flow-col gap-4 text-xs mx-6 text-gray-500">
                    Edict is unofficial Fan Content permitted under Wizards of the Coast’s Fan Content Policy. Not
                    approved or endorsed by Wizards. The Magic: The Gathering rules, terms, and definitions referenced
                    here are © Wizards of the Coast LLC.
                </aside>
            </footer>
        </div>
    );

export default Footer;
