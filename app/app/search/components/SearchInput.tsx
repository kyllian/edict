import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface SearchInputProps {
    q: string;
}

const SearchInput: React.FC<SearchInputProps> = ({q}) => (
    <div className="navbar p-0">
        <Link href="/" className="btn btn-link btn-sm px-0 mr-2"><Image src="/icon.svg" priority={true} alt="Edict" width={35} height={35}/></Link>
        <fieldset className="fieldset rounded-box w-full flex-1">
            <label className="input input-md w-full">
                <input type="search"
                       name="q"
                       defaultValue={q}
                       className="ml-2"/>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                </svg>
            </label>
        </fieldset>
    </div>
);

export default SearchInput;
