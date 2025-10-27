import React, {Suspense} from "react";
import {SearchParams} from "@/app/search/models";
import {Metadata} from "next";
import {APP_BASE_URL} from "@/app/utils/constants";
import SearchForm from "@/app/search/components/SearchForm";
import Results from "@/app/search/components/Results";
import Loading from "@/app/search/Loading";

export async function generateMetadata({searchParams}: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
    const {q, page = 1, type = "all"} = await searchParams;

    const queryString = new URLSearchParams({
        ...(q && {q}),
        ...(page > 1 && {page: page.toString()}),
        ...(type !== "all" && {type}),
    }).toString();

    const url = `${APP_BASE_URL}/search${queryString ? `?${queryString}` : ''}`;

    const title = q
        ? `${q} — Search Magic: The Gathering Rules — Edict`
        : `Search Magic: The Gathering Rules — Edict`;
    const description = q
        ? `Find Magic: The Gathering rules related to "${q}".`
        : `Search Magic: The Gathering's comprehensive rules and glossary.`;

    return {
        title,
        description,
        openGraph: {
            url,
            title,
            description,
        },
        twitter: {
            title,
            description,
        },
    };
};

export default async function Page({searchParams}: { searchParams: Promise<SearchParams> }) {
    const {q, page = 1, type = "all"} = await searchParams;
    return (
        <>
            <SearchForm q={q} placeholder='' type={type}/>
            <div className="px-2 my-2">
                <Suspense fallback={<Loading/>}>
                    <Results q={q} page={page} type={type}></Results>
                </Suspense>
            </div>
        </>
    );
}