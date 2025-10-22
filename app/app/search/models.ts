export type ResultType = "glossary" | "rules";

export interface SearchParams {
    q: string;
    page: number;
    type: SearchType;
};

export type SearchType = "all" | ResultType;

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
    slug: string;
    nameHighlights: string[];
    textHighlights: string[];
}
