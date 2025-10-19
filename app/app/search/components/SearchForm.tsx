import React, {FC, useRef, useCallback, useEffect, KeyboardEvent} from "react";
import SearchInput from "./SearchInput";
import SearchNavbar from "./SearchNavbar";
import Image from "next/image";
import Link from "next/link";

export interface SearchFormProps {
    q: string;
    type: "all" | "glossary" | "rules";
    page: number;
    totalPages: number;
}

const SearchForm: FC<SearchFormProps> = ({q, type, page, totalPages}) => {
    const formRef = useRef<HTMLFormElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // submit when Enter key is hit anywhere inside the form
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            // prevent the browser's default submit to avoid double submits
            e.preventDefault();
            if (formRef.current) {
                formRef.current.submit();
            }
        }
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <form ref={formRef}
              action="/search"
              onKeyDown={handleKeyDown}>
            <SearchInput q={q}/>
            <SearchNavbar type={type} page={page} totalPages={totalPages} />
        </form>
    );
};

export default SearchForm;
