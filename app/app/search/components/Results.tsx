import React, {FC, KeyboardEvent, useCallback, useEffect, useRef, useState} from "react";
import SearchResultCard from "./SearchResultCard";
import {highlightText} from "../utils/highlightText";
import {useAbortableFetch} from "@/app/hooks/useAbortableFetch";
import {SearchResult, SearchResults} from "@/app/search/models";
import SearchNavbar from "@/app/search/components/SearchNavbar";

export interface SearchResultsProps {
    q: string;
    page?: number;
    type?: "all" | "glossary" | "rules";
}

const Results: FC<SearchResultsProps> = ({q, page = 1, type = "all"}) => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

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
        (data: SearchResults<SearchResult>) => {
            setResults(data?.results ?? []);
            setTotalPages(data?.totalPages || 1);
        }
    );

    return results && (results.length ?? 0) > 0 ? (
        <>
            <SearchNavbar type={type} page={page} totalPages={totalPages}/>
            <div className="grid grid-cols-1 sm:grid-cols-4 sm-gap-4 auto-rows-auto">
                {results.map(result =>
                    <SearchResultCard key={result.id}
                                      result={result}
                                      highlightedName={highlightText(result.name, result.nameHighlights)}
                                      highlightedText={highlightText(result.text, result.textHighlights)}/>
                )}
            </div>
            <SearchNavbar type={type} page={page} totalPages={totalPages}></SearchNavbar>
        </>
    ) : (
        <div className="prose mt-3"><h3>No results found</h3></div>
    );
};

export default Results;
