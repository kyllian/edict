import React, {ReactNode} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface DrawerProps {
    children?: ReactNode;
}

const Drawer = ({children}: DrawerProps) => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    const linkClassName = (path: string) =>
        isActive(path) ? "is-drawer-close:tooltip is-drawer-close:tooltip-right bg-secondary text-secondary-content"
            : "is-drawer-close:tooltip is-drawer-close:tooltip-right";

    return (
        <div className="drawer drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" defaultChecked/>
            <div className="drawer-content">
                {children}
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div
                    className="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-200 flex flex-col items-start min-h-full">
                    <div className="navbar">

                    </div>
                    <ul className="menu w-full grow">
                        <li>
                            <Link href="/" className={linkClassName("/")}
                                  data-tip="Search Rules">
                                <svg className="size-[1.2em]"
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="none"
                                     viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor">
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                                </svg>
                                <span className="is-drawer-close:hidden">Search Rules</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/rules" className={linkClassName("/rules")}
                                  data-tip="Rules">
                                <svg className="size-[1.2em]"
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="none"
                                     viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor">
                                    <path strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"/>
                                </svg>
                                <span className="is-drawer-close:hidden">Rules</span>
                            </Link>
                        </li>
                    </ul>

                    <div className="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open">
                        <label htmlFor="my-drawer-4"
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
            </div>
        </div>
    );
};

export default Drawer;
