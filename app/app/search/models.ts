export interface SearchResultCardProps {
    result: SearchResult;
    highlightedName: React.ReactNode;
    highlightedText: React.ReactNode;
}

export interface ResultModalProps {
    result: SearchResult;
    modalId?: string;
    highlightedName: React.ReactNode;
    highlightedText: React.ReactNode;
}

export interface SearchResultsProps {
    results: SearchResult[];
}

export interface SearchResult {
    type: ResultType;
    id: string;
    title: string[],
    name: string;
    text: string;
    nameHighlights: string[];
    textHighlights: string[];
}

export type ResultType = "glossary" | "rules";

export interface SearchParams {
    q: string;
    page: number;
    type: SearchType;
};

export type SearchType = "all" | ResultType;

export interface SearchFormProps {
    q: string;
    type: SearchType;
    page: number;
    totalPages: number;
};

export interface PaginationProps {
    page: number;
    totalPages: number;
}

export interface SearchInputProps {
    q: string
};

export interface SearchResults<T> {
    results: T[];
    page: number;
    size: number;
    totalPages: number;
}

export interface DefinitionResult {
    id: string;
    term: string;
    text: string;
    rules: RuleResult[];
}

export interface RuleResult {
    id: string;
    number: string;
    text: string;
    rules: RuleResult[];
}