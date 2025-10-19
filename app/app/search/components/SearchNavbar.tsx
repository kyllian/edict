import React, {FC} from "react";
import Pagination from "./Pagination";

export type SearchType = "all" | "glossary" | "rules";

interface SearchNavbarProps {
    type: SearchType;
    page: number;
    totalPages: number;
}

const SearchNavbar: FC<SearchNavbarProps> = ({type, page, totalPages}) => (
    <div className="flex gap-1 sm:my-2">
        <div className="flex-1">
            <select
                name="type"
                defaultValue={type}
                className="select select-sm">
                <option value="all">All</option>
                <option value="glossary">Glossary</option>
                <option value="rules">Rules</option>
            </select>
        </div>
        <div className="flex">
            <Pagination page={page} totalPages={totalPages}/>
        </div>
    </div>
);

export default SearchNavbar;
