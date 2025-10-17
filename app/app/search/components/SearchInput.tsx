import React from "react";
import {SearchInputProps} from "@/app/search/models";
import Image from "next/image";

const SearchInput: React.FC<SearchInputProps> = ({q}) => (
    <div className="navbar gap-3">
        <fieldset className="fieldset rounded-box w-full flex-1">
            <label className="input input-md w-full pl-1">
                <Image src="/icon.svg" alt="Edict" width={35} height={35}/>
                <input type="search"
                       name="q"
                       placeholder="Search"
                       defaultValue={q}/>
            </label>
        </fieldset>
    </div>
);

export default SearchInput;
