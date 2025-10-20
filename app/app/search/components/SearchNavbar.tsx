import React, {FC} from "react";
import Pagination from "./Pagination";
import {SearchType} from "@/app/search/models";
import SearchTabLink from "@/app/search/components/SearchTabLink";

interface SearchNavbarProps {
    q: string;
    type: SearchType;
    page: number;
    totalPages: number;
}

const SearchNavbar: FC<SearchNavbarProps> = ({q, type, page, totalPages}) => {
    return (
        <div className="flex w-full items-center gap-1 my-1 sm:my-2">
            <div className="flex-shrink-0">
                <div role="tablist" className="tabs tabs-xs tabs-box">
                    <SearchTabLink q={q} page={page} current={type} destination={"all"}>All</SearchTabLink>
                    <SearchTabLink q={q} page={page} current={type} destination={"glossary"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth={1.5}
                             stroke="currentColor"
                             className="size-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
                        </svg>
                        Glossary
                    </SearchTabLink>
                    <SearchTabLink q={q} page={page} current={type} destination={"rules"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth={1.5}
                             stroke="currentColor"
                             className="size-4 mr-1 mb-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"/>
                        </svg>
                        Rules
                    </SearchTabLink>
                </div>
            </div>
            <div className="flex-shrink-0 ml-auto">
                <Pagination q={q} page={page} type={type} totalPages={totalPages}/>
            </div>
        </div>
    );
};

export default SearchNavbar;
