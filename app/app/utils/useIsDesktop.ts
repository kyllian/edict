"use client";

import { useEffect, useState } from "react";

// Returns true if the viewport is desktop size (>=1024px)
export function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));

    useEffect(() => {
        // Function to check window width
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener("resize", checkDesktop);
        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    return isDesktop;
}

