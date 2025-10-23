"use server";

import React from "react";

export interface SearchInputProps {
    q: string;
    placeholder: string;
}

const SearchInput: React.FC<SearchInputProps> = ({q, placeholder}) => {
    return (
        <div className="navbar p-0">
            <fieldset className="fieldset rounded-box w-full flex-1 join">
                <label className="input input-md w-full join-item">
                    <input type="search"
                           name="q"
                           defaultValue={q}
                           placeholder={placeholder}
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
    );
};

export default SearchInput;
