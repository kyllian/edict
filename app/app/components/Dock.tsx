import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Dock: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    const linkClassName = (path: string) =>
        isActive(path) ? "dock-active" : "";

    return (
        <>
            {children}
            <div className="dock">
                <Link href="/" className={linkClassName("/")}>
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
                    <span className="dock-label">Search</span>
                </Link>
                <Link href="/glossary" className={linkClassName("/glossary")}>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         fill="none"
                         viewBox="0 0 24 24"
                         strokeWidth={1.5}
                         stroke="currentColor"
                         className="size-[1.2em]">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
                    </svg>
                    <span className="dock-label">Glossary</span>
                </Link>
                <Link href="/rules" className={linkClassName("/rules")}>
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
                    <span className="dock-label">Rules</span>
                </Link>
            </div>
        </>
    );
};

export default Dock;
