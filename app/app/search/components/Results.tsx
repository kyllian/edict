"use server";

import React from "react";
import SearchResultCard from "./SearchResultCard";
import {highlightText} from "../utils/highlightText";
import {SearchResult, SearchResults, SearchType} from "@/app/search/models";
import SearchNavbar from "@/app/search/components/SearchNavbar";

interface SearchResultsProps {
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

const Results = async ({q, page = 1, type = "all"}: SearchResultsProps) => {
    const data = await getResults(q, page, type);
    const results = data?.results ?? [];

    if (results.length === 0) {
        return (
            <div className="prose flex items-center justify-center min-h-[60vh]">
                <h3>No results found</h3>
            </div>
        );
    }

    return (
        <>
            <SearchNavbar
                q={q}
                type={type}
                page={page}
                totalPages={data?.totalPages || 1}
            />
            <div className="grid xs:grid-cols-2 sm:grid-cols-3 sm-gap-4 auto-rows-auto">
                {results.map(result =>
                    <SearchResultCard
                        key={result.id}
                        result={result}
                        highlightedName={highlightText(result.name, result.nameHighlights)}
                        highlightedText={highlightText(result.text, result.textHighlights)}
                    />
                )}
            </div>
            <SearchNavbar
                q={q}
                type={type}
                page={page}
                totalPages={data?.totalPages || 1}
            />
        </>
    );
};

export default Results;
