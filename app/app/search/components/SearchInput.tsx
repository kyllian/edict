import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface SearchInputProps {
    q: string;
}

const SearchInput: React.FC<SearchInputProps> = ({q}) => (
    <div className="navbar p-0">
        <Link href="/" className="btn btn-link btn-sm px-0 mr-2"><Image src="/icon.svg" alt="Edict" width={35} height={35}/></Link>
        <fieldset className="fieldset rounded-box w-full flex-1">
            <label className="input input-md w-full">
                <input type="search"
                       name="q"
                       placeholder="Search"
                       defaultValue={q}
                       className="ml-2"/>
            </label>
        </fieldset>
    </div>
);

export default SearchInput;
