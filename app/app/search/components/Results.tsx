import React, {FC, KeyboardEvent, useCallback, useEffect, useRef, useState} from "react";
import SearchResultCard from "./SearchResultCard";
import {highlightText} from "../utils/highlightText";
import {useAbortableFetch} from "@/app/hooks/useAbortableFetch";
import {SearchResults} from "@/app/search/models";
import SearchNavbar from "@/app/search/components/SearchNavbar";

export interface SearchResultsProps {
    q: string;
    totalPages: number;
    page?: number;
    type?: "all" | "glossary" | "rules";
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

const Results: FC<SearchResultsProps> = ({q, totalPages, page = 1, type = "all"}) => {
    const [results, setResults] = useState<SearchResult[]>([]);
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
            totalPages = 2;
        }
    );

    return results && (results.length ?? 0) > 0 ? (
        <>
            <SearchNavbar type={type} page={page} totalPages={totalPages}/>
            <div className="grid grid-cols-1 sm:grid-cols-4 sm-gap-4 auto-rows-auto">
                {(results.map(result => {
                    const highlightedName = highlightText(result.name, result.nameHighlights);
                    const highlightedText = highlightText(result.text, result.textHighlights);
                    return (
                        <div key={result.id}>
                            <SearchResultCard result={result} highlightedName={highlightedName}
                                              highlightedText={highlightedText}/>
                        </div>
                    );
                }))}
            </div>
            <SearchNavbar type={type} page={page} totalPages={totalPages}></SearchNavbar>
        </>
    ) : (
        <div className="prose mt-3"><h3>No results found</h3></div>
    );
};

export default Results;
