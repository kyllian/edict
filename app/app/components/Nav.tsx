"use client";

import React, {useEffect, useState} from "react";
import Drawer from "@/app/components/Drawer";
import Dock from "@/app/components/Dock";
import {useIsDesktop} from "@/app/utils/useIsDesktop";

const Nav: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // Delegate desktop/mobile detection to the hook inside this component
    const isDesktop = useIsDesktop();

    // Do not render any nav until the component has hydrated on the client
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) return null;

    return isDesktop
        ? <Drawer>
            <div className="flex flex-col min-h-screen">
                {children}
            </div>
        </Drawer>
        : <Dock>
            <div className="flex flex-col min-h-screen">
                {children}
            </div>
        </Dock>;
};

export default Nav;
