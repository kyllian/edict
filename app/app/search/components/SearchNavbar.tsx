import React, { FC } from "react";
import Pagination from "./Pagination";
import { SearchType } from "@/app/search/models";

interface SearchNavbarProps {
    type: SearchType;
    page: number;
    totalPages: number;
}

const SearchNavbar: FC<SearchNavbarProps> = ({ type, page, totalPages }) => (
    <div className="navbar gap-1">
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
            <Pagination page={page} totalPages={totalPages} />
        </div>
    </div>
);

export default SearchNavbar;

