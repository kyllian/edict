"use server";

import React, {Suspense} from "react";
import {SearchType} from "@/app/search/models";
import Results from "@/app/search/components/Results";

export interface SearchResultsProps {
    q: string;
    page: number;
    type: SearchType;
}

const Search = async ({q, page = 1, type = "all"}: SearchResultsProps) => (
    <div className="px-2 my-2">
        <Suspense fallback={
            <>
                <div className="skeleton w-full h-8 my-3"></div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                    <div className="skeleton h-32"></div>
                </div>
                <div className="skeleton w-full h-8 my-3"></div>
            </>
        }>
            <Results q={q} page={page} type={type}></Results>
        </Suspense>
    </div>
);

export default Search;
