"use client";

import {FC, useState} from 'react';
import {Suspense} from 'react'
import SearchForm from "./SearchForm";
import Results from "./Results";
import SearchNavbar from "./SearchNavbar";
import {useAbortableFetch} from "@/app/hooks/useAbortableFetch";

// Moved from models.ts
export interface SearchParams {
    q: string;
    page: number;
    type: SearchType;
}

export type SearchType = "all" | "glossary" | "rules";

export interface SearchResults<T> {
    results: T[];
    page: number;
    size: number;
    totalPages: number;
}

export interface SearchResult {
    type: "glossary" | "rules";
    id: string;
    title: string[];
    name: string;
    text: string;
    nameHighlights: string[];
    textHighlights: string[];
}

const Search: FC<SearchParams> = ({q, page = 1, type = "all"}) => {
    const [totalPages, setTotalPages] = useState(1);
    const [results, setResults] = useState<SearchResults<SearchResult> | null>(null);

    useAbortableFetch(
        async (signal) => {
            const queryParams: string[] = [];
            if (q && q.length > 2) queryParams.push(`q=${encodeURIComponent(q)}`);
            queryParams.push(`page=${page}`);
            const paramString = queryParams.length ? "?" + queryParams.join("&") : "";
            let endpoint = "/api/search";
            if (type === "glossary") endpoint = "/api/search/glossary";
            else if (type === "rules") endpoint = "/api/search/rules";
            const res = await fetch(endpoint + paramString, {signal});
            return await res.json();
        },
        [q, page, type],
        (data) => {
            setResults(data);
            setTotalPages(data?.totalPages || 1);
        }
    );

    return (
        <>
            <SearchForm
                q={q}
                type={type}
                page={page}
                totalPages={totalPages}/>
            <Suspense fallback={<div>Loading...</div>}>
                {results?.results && (
                    <Results results={results.results}/>
                )}
            </Suspense>
            {(results?.results?.length ?? 0) > 0 && (
                <SearchNavbar type={type} page={page} totalPages={totalPages}></SearchNavbar>
            )}
        </>
    );
};

export default Search;