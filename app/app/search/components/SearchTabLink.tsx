"use server";

import React, {FC} from "react";
import {SearchType} from "@/app/search/models";

interface SearchTabLinkProps {
    q: string;
    page: number;
    current: SearchType;
    destination: SearchType;
    children: React.ReactNode;
}

const SearchTabLink: FC<SearchTabLinkProps> = ({q, page, current, destination, children}) => {
    function buildHref() {
        let href = `/search?q=${encodeURIComponent(q)}`;

        if (destination !== "all") {
            href += `&type=${destination}`;
        }

        if (destination === current && page > 1) {
            href += `&page=${page}`;
        }

        return href;
    }

    function buildActiveClass() {
        return current === destination ? " tab-active" : "";
    }

    return (
        <a role="tab" href={buildHref()} className={`tab${buildActiveClass()}`}>{children}</a>
    );
};

export default SearchTabLink;