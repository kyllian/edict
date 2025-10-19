import React from "react";
import Image from "next/image";

export interface SearchInputProps {
    q: string;
}

const SearchInput: React.FC<SearchInputProps> = ({q}) => (
    <fieldset className="fieldset rounded-box w-full flex-1">
        <label className="input input-md w-full pl-1">
            <Image src="/icon.svg" alt="Edict" width={35} height={35}/>
            <input type="search"
                   name="q"
                   placeholder="Search"
                   defaultValue={q}
                   className="ml-2"/>
        </label>
    </fieldset>
);

export default SearchInput;
