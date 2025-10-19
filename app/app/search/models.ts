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