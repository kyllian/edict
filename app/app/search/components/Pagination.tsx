"use server";

import React from "react";
import {SearchType} from "@/app/search/models";

export interface PaginationProps {
    q: string;
    page: number | string;
    type: SearchType;
    totalPages: number | string;
}

const Pagination: React.FC<PaginationProps> = ({q, page, type, totalPages}) => {
    // Ensure page and totalPages are numbers
    const currentPage = typeof page === "string" ? Number(page) : page;
    const maxPages = typeof totalPages === "string" ? Number(totalPages) : totalPages;

    function buildHref(newPage: number) {
        let href = `/search?q=${encodeURIComponent(q)}`;

        if (type !== "all") {
            href += `&type=${type}`;
        }

        if (newPage > 1) {
            href += `&page=${newPage}`;
        }

        return href;
    }

    return (
        <div className="join mt-0.5">
            {currentPage > 1 ?
                <a href={buildHref(currentPage - 1)} className="join-item btn btn-xs bg-base-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
                    </svg>
                </a> :
                <button
                    type="button"
                    role="button"
                    aria-disabled="true"
                    className="join-item btn btn-xs bg-base-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
                    </svg>
                </button>
            }

            <div className="join-item btn btn-xs">
                {currentPage} of {totalPages}
            </div>

            {currentPage < maxPages ?
                <a href={buildHref(currentPage + 1)} className="join-item btn btn-xs bg-base-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                    </svg>
                </a> :
                <button
                    type="button"
                    role="button"
                    aria-disabled="true"
                    className="join-item btn btn-xs btn-disabled bg-base-100"
                    disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                    </svg>
                </button>
            }
        </div>
    );
};

export default Pagination;
