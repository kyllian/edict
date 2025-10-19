import React from "react";

export interface PaginationProps {
    page: number;
    totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({page, totalPages}) => (
    <div className="join">
        <button type="submit"
                className="join-item btn btn-sm"
                disabled={page === 1}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
            </svg>
        </button>
        <button className="join-item btn btn-sm btn-disabled text-(--foreground)">
            {page} of {totalPages}
        </button>
        <button type="submit"
                className="join-item btn btn-sm"
                disabled={page === totalPages}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                 stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
            </svg>
        </button>
    </div>
);

export default Pagination;
