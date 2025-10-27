"use client";

import React, {useEffect, useState} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export interface SearchFormParams {
    q: string;
    placeholder: string;
    type: string | null;
}

const SearchForm: React.FC<SearchFormParams> = ({q, placeholder, type}) => {
    const [query, setQuery] = useState(q);
    const [searchType, setSearchType] = useState(type);
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathname = usePathname()
    const searchParams = useSearchParams()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        const params = new URLSearchParams();
        params.set("q", query.trim());
        if (searchType) {
            params.set("type", searchType);
        }

        router.push(`/search?${params.toString()}`);
    }

    useEffect(() => {
        setIsSubmitting(false);
    }, [pathname, searchParams]);

    return (
        <form onSubmit={handleSubmit}
              className="sticky top-0 mx-auto w-full z-1 bg-base-200 px-4 pb-2 shadow-md sm:rounded-b-2xl">
            <div className="navbar p-0">
                <fieldset className="fieldset w-full flex-1 join">
                    <label className="input input-md w-full join-item">
                        <span
                            className={`loading loading-spinner loading-xs${!isSubmitting && " text-transparent"}`}></span>
                        <input type="search"
                               name="q"
                               defaultValue={q}
                               placeholder={placeholder}
                               onChange={e => setQuery(e.target.value)}
                               className="ml-2"/>
                    </label>
                    <button type="submit" className="btn btn-neutral join-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                        </svg>
                    </button>
                </fieldset>
            </div>
        </form>
    );
};

export default SearchForm;
