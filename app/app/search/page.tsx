import SearchInput from "@/app/search/components/SearchInput";
import React, {Suspense} from "react";
import Search from "@/app/search/components/Search";
import {SearchParams} from "@/app/search/models";

export default async function Page({searchParams}: { searchParams: Promise<SearchParams> }) {
    const {q, page = 1, type = "all"} = await searchParams;

    return (
        <main className="mx-auto max-w-5xl flex flex-col">
            <Search q={q} type={type} page={page}/>
        </main>
    );
}