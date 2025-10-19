'use client';

import SearchInput from "@/app/search/components/SearchInput";
import React, {KeyboardEvent, Suspense, useCallback, useRef, useState} from "react";
import Results from "@/app/search/components/Results";
import {SearchParams} from "@/app/search/models";

export default function Page({searchParams}: { searchParams: Promise<SearchParams> }) {
    const {q, page = 1, type = "all"} = React.use(searchParams);
    const formRef = useRef<HTMLFormElement>(null);

    // submit when Enter key is hit anywhere inside the form
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            // prevent the browser's default submit to avoid double submits
            e.preventDefault();
            if (formRef.current) {
                formRef.current.submit();
            }
        }
    }, []);

    return (
        <div className="min-h-screen">
            <main className="mx-auto max-w-5xl flex flex-col pt-2 pb-25">
                <form ref={formRef}
                      action="/search"
                      onKeyDown={handleKeyDown}>
                    <SearchInput q={q}/>
                </form>
                <Suspense fallback={
                    <div className="mb-4 mt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-4 sm-gap-4 auto-rows-auto">
                            <div className="skeleton h-32"></div>
                            <div className="skeleton h-32"></div>
                            <div className="skeleton h-32"></div>
                            <div className="skeleton h-32"></div>
                        </div>
                    </div>
                }>
                    <Results q={q} type={type} page={page}/>
                </Suspense>
            </main>
        </div>
    );
}