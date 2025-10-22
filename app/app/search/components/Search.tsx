"use server";

import React, {Suspense} from "react";
import SearchResultCard from "./SearchResultCard";
import {highlightText} from "../utils/highlightText";
import {SearchResult, SearchResults, SearchType} from "@/app/search/models";
import SearchNavbar from "@/app/search/components/SearchNavbar";
import SearchInput from "@/app/search/components/SearchInput";
import Form from "next/form";

export interface SearchResultsProps {
    q: string;
    page: number;
    type: SearchType;
}

async function getResults(q: string, page: number, type: SearchType): Promise<SearchResults<SearchResult>> {
    const baseUrl = process.env['services__api__http__0'];
    let endpoint = `${baseUrl}/search`;
    if (type === "glossary") endpoint = `${baseUrl}/search/glossary`;
    else if (type === "rules") endpoint = `${baseUrl}/search/rules`;

    const params = new URLSearchParams();
    if (q && q.length > 2) params.append("q", q);
    params.append("page", page.toString());

    const res = await fetch(`${endpoint}?${params.toString()}`, {cache: "no-store"});
    if (!res.ok) return {results: [], page: 1, size: 0, totalPages: 1};
    return await res.json();
}

const Search = async ({q, page = 1, type = "all"}: SearchResultsProps) => {
    const data = await getResults(q, page, type);
    const results = data?.results ?? [];

    return (
        <>
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 shadow-md xl:rounded-b-md">
                <SearchInput q={q}/>
                {results.length > 0 &&
                    <SearchNavbar
                        q={q}
                        type={type}
                        page={page}
                        totalPages={data?.totalPages || 1}
                    />}
            </Form>
            {results.length > 0 ? (
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
                        <div className="grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 sm-gap-4 auto-rows-auto">
                            {results.map(result =>
                                <SearchResultCard
                                    key={result.id}
                                    result={result}
                                    highlightedName={highlightText(result.name, result.nameHighlights)}
                                    highlightedText={highlightText(result.text, result.textHighlights)}
                                />
                            )}
                        </div>
                    </Suspense>
                    <div className="mt-3">
                        <SearchNavbar
                            q={q}
                            type={type}
                            page={page}
                            totalPages={data?.totalPages || 1}
                        />
                    </div>
                </div>
            ) : (
                <div className="prose flex items-center justify-center min-h-[60vh]">
                    <h3>No results found</h3>
                </div>
            )}
        </>
    );
};

export default Search;
