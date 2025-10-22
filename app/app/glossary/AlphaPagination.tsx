"use server";

import React from "react";

const alphabet = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));

const AlphaPagination = ({letter}: { letter: string }) => {
    const currentIndex = alphabet.indexOf(letter.toUpperCase());
    const getHref = (ltr: string) => `/glossary?letter=${ltr}`;

    // Calculate the 5 center items (2 before, current, 2 after)
    const getPaginationItems = () => {
        const items = [];
        
        // Position 1: Always A
        items.push(
            <a key="first" href={getHref("a")}
               className={currentIndex === 0 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                A
            </a>
        );
        
        // Position 2: Ellipsis or B (if we're near the start)
        if (currentIndex <= 3) {
            items.push(
                <a key="b" href={getHref("b")}
                   className={currentIndex === 1 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    B
                </a>
            );
        } else {
            items.push(
                <button key="ellipsis-start" className="join-item btn btn-sm border-0 bg-transparent" disabled>
                    ...
                </button>
            );
        }
        
        // Position 3: Letter at currentIndex - 2
        if (currentIndex <= 3) {
            // Near start: show C
            items.push(
                <a key="c" href={getHref("c")}
                   className={currentIndex === 2 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    C
                </a>
            );
        } else if (currentIndex >= 23) {
            // Near end: show V
            items.push(
                <a key="v" href={getHref("v")}
                   className={currentIndex === 21 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    V
                </a>
            );
        } else {
            // Middle: show current - 2
            const ltr = alphabet[currentIndex - 2];
            items.push(
                <a key={`before-2-${ltr}`} href={getHref(ltr)}
                   className="join-item btn btn-sm border-0 bg-transparent">
                    {ltr}
                </a>
            );
        }
        
        // Position 4: Letter at currentIndex - 1
        if (currentIndex <= 3) {
            // Near start: show D
            items.push(
                <a key="d" href={getHref("d")}
                   className={currentIndex === 3 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    D
                </a>
            );
        } else if (currentIndex >= 23) {
            // Near end: show W
            items.push(
                <a key="w" href={getHref("w")}
                   className={currentIndex === 22 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    W
                </a>
            );
        } else {
            // Middle: show current - 1
            const ltr = alphabet[currentIndex - 1];
            items.push(
                <a key={`before-1-${ltr}`} href={getHref(ltr)}
                   className="join-item btn btn-sm border-0 bg-transparent">
                    {ltr}
                </a>
            );
        }
        
        // Position 5 (CENTER): Current letter
        if (currentIndex >= 4 && currentIndex <= 22) {
            items.push(
                <a key={`current-${letter}`} href={getHref(letter)}
                   className="join-item btn btn-sm border-0 font-bold">
                    {letter.toUpperCase()}
                </a>
            );
        } else if (currentIndex <= 3) {
            // Near start: show E
            items.push(
                <a key="e" href={getHref("e")}
                   className={currentIndex === 4 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    E
                </a>
            );
        } else {
            // Near end (23-25): show X
            items.push(
                <a key="x" href={getHref("x")}
                   className={currentIndex === 23 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    X
                </a>
            );
        }
        
        // Position 6: Letter at currentIndex + 1
        if (currentIndex <= 3) {
            // Near start: show F
            items.push(
                <a key="f" href={getHref("f")}
                   className="join-item btn btn-sm border-0 bg-transparent">
                    F
                </a>
            );
        } else if (currentIndex >= 23) {
            // Near end: show Y
            items.push(
                <a key="y" href={getHref("y")}
                   className={currentIndex === 24 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    Y
                </a>
            );
        } else {
            // Middle: show current + 1
            const ltr = alphabet[currentIndex + 1];
            items.push(
                <a key={`after-1-${ltr}`} href={getHref(ltr)}
                   className="join-item btn btn-sm border-0 bg-transparent">
                    {ltr}
                </a>
            );
        }
        
        // Position 7: Letter at currentIndex + 2
        if (currentIndex <= 3) {
            // Near start: show G
            items.push(
                <a key="g" href={getHref("g")}
                   className="join-item btn btn-sm border-0 bg-transparent">
                    G
                </a>
            );
        } else if (currentIndex >= 23) {
            // Near end (X, Y, Z at indices 23, 24, 25)
            items.push(
                <a key="z-before-ellipsis" href={getHref("z")}
                   className={currentIndex === 25 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    Z
                </a>
            );
        } else {
            // Middle: show current + 2
            const ltr = alphabet[currentIndex + 2];
            items.push(
                <a key={`after-2-${ltr}`} href={getHref(ltr)}
                   className="join-item btn btn-sm border-0 bg-transparent">
                    {ltr}
                </a>
            );
        }
        
        // Position 8: Ellipsis or Y (if we're near the end)
        if (currentIndex >= 22) {
            // Don't add anything - Z is already added in position 7
        } else {
            items.push(
                <button key="ellipsis-end" className="join-item btn btn-sm border-0 bg-transparent" disabled>
                    ...
                </button>
            );
        }
        
        // Position 9: Always Z (if not already added)
        if (currentIndex < 23) {
            items.push(
                <a key="last" href={getHref("z")}
                   className={currentIndex === 25 ? "join-item btn btn-sm border-0 font-bold" : "join-item btn btn-sm border-0 bg-transparent"}>
                    Z
                </a>
            );
        }
        
        return items;
    };

    return (
        <nav aria-label="Alphabet Pagination" className="join mx-auto hidden md:inline-flex 2xl:space-x-1">
            {getPaginationItems()}
        </nav>
    );
};

export default AlphaPagination;
