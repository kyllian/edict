import React, {FC, KeyboardEvent, useCallback, useEffect, useRef, useState} from "react";
import SearchResultCard from "./SearchResultCard";
import {highlightText} from "../utils/highlightText";
import {useAbortableFetch} from "@/app/hooks/useAbortableFetch";
import {SearchResult, SearchResults, SearchType} from "@/app/search/models";
import SearchNavbar from "@/app/search/components/SearchNavbar";

export interface SearchResultsProps {
    q: string;
    page: number;
    type: SearchType;
}

const Results: FC<SearchResultsProps> = ({q, page = 1, type = "all"}) => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentType, setCurrentType] = useState<SearchType>(type);
    const [currentPage, setCurrentPage] = useState<number>(page);
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
            queryParams.push(`page=${currentPage}`);
            const paramString = queryParams.length ? "?" + queryParams.join("&") : "";
            let endpoint = "/api/search";
            if (currentType === "glossary") endpoint = "/api/search/glossary";
            else if (currentType === "rules") endpoint = "/api/search/rules";
            const res = await fetch(endpoint + paramString, {signal});
            return await res.json();
        },
        [q, currentPage, currentType],
        (data: SearchResults<SearchResult>) => {
            setResults(data?.results ?? []);
            setTotalPages(data?.totalPages || 1);
        }
    );

    return results && (results.length ?? 0) > 0 ? (
        <>
            <SearchNavbar
                q={q}
                type={currentType}
                page={currentPage}
                totalPages={totalPages}/>
            <div className="grid grid-cols-1 sm:grid-cols-4 sm-gap-4 auto-rows-auto">
                {results.map(result =>
                    <SearchResultCard
                        key={result.id}
                        result={result}
                        highlightedName={highlightText(result.name, result.nameHighlights)}
                        highlightedText={highlightText(result.text, result.textHighlights)}/>
                )}
            </div>
            <SearchNavbar
                q={q}
                type={currentType}
                page={currentPage}
                totalPages={totalPages}/>
        </>
    ) : (
        <div className="prose mt-3"><h3>No results found</h3></div>
    );
};

export default Results;
