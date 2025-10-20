import SearchInput from "@/app/search/components/SearchInput";
import React, {Suspense} from "react";
import Results from "@/app/search/components/Results";
import {SearchParams} from "@/app/search/models";

export default async function Page({searchParams}: { searchParams: SearchParams }) {
    const { q, page = 1, type = "all" } = searchParams;

    return (
        <div className="min-h-screen">
            <main className="mx-auto max-w-5xl flex flex-col pt-2 pb-25">
                <form action="/search">
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