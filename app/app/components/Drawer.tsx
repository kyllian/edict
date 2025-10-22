import React, {ReactNode} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Image from "next/image";
import {Michroma} from 'next/font/google';

interface DrawerProps {
    children?: ReactNode;
}

const michroma = Michroma({
    subsets: ['latin'],
    weight: '400'
});

const Drawer = ({children}: DrawerProps) => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    const linkClassName = (path: string) =>
        isActive(path) ? "tooltip tooltip-right bg-secondary text-secondary-content"
            : "tooltip tooltip-right";

    return (
        <div className="drawer drawer-open">
            <input id="app-drawer" type="checkbox" className="drawer-toggle" defaultChecked/>
            <div className="drawer-content">
                {children}
            </div>
            <div className="drawer-side is-drawer-close:overflow-visible border-base-300 border-r">
                <label htmlFor="app-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="is-drawer-close:w-14 is-drawer-open:w-64 
                    bg-base-200 flex flex-col items-start min-h-full">
                    <div className="navbar">
                        <Link href="/" className="btn btn-ghost p-2">
                            <Image src="/icon.svg" priority={true} alt="Edict" width={24} height={24}/>
                            <span className={`is-drawer-close:hidden text-lg mb-1 ${michroma.className}`}>edict</span>
                        </Link>

                        <div className="is-drawer-close:tooltip is-drawer-close:tooltip-right
                            absolute right-0 is-drawer-close:text-transparent hover:text-base-content hover:z-1 mx-2"
                             data-tip="Open">
                            <label htmlFor="app-drawer"
                                   className="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round"
                                     strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"
                                     className="inline-block size-4 my-1.5">
                                    <path
                                        d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                    <path d="M9 4v16"></path>
                                    <path d="M14 10l2 2l-2 2"></path>
                                </svg>
                            </label>
                        </div>
                    </div>
                    <ul className="menu w-full grow">
                        <li className="is-drawer-close:mt-0.5">
                            <Link href="/" className="tooltip tooltip-right"
                                  data-tip="Search Rules">
                                <svg className="size-6"
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="none"
                                     viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor">
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                                </svg>
                                <div className="is-drawer-close:hidden whitespace-nowrap">
                                    Search Rules
                                </div>
                            </Link>
                        </li>
                        <div className="divider"></div>
                        <li className="is-drawer-close:mt-0.5">
                            <Link href="/rules" className={linkClassName("/glossary")}
                                  data-tip="Browse Rules">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     fill="none"
                                     viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
                                </svg>
                                <span className="is-drawer-close:hidden whitespace-nowrap">Browse Glossary</span>
                            </Link>
                        </li>
                        <li className="is-drawer-close:mt-0.5">
                            <Link href="/rules" className={linkClassName("/rules")}
                                  data-tip="Browse Rules">
                                <svg className="size-6"
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="none"
                                     viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor">
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"/>
                                </svg>
                                <span className="is-drawer-close:hidden whitespace-nowrap">Browse Rules</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Drawer;
