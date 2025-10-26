import React, {Suspense} from "react";
import {SearchParams} from "@/app/search/models";
import {Metadata} from "next";
import {APP_BASE_URL} from "@/app/utils/constants";
import Search from "@/app/search/components/Search";
import Form from "next/form";
import SearchInput from "@/app/search/components/SearchInput";

export async function generateMetadata({searchParams}: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
    const {q, page = 1, type = "all"} = await searchParams;

    const queryString = new URLSearchParams({
        ...(q && {q}),
        ...(page > 1 && {page: page.toString()}),
        ...(type !== "all" && {type}),
    }).toString();

    const url = `${APP_BASE_URL}/search${queryString ? `?${queryString}` : ''}`;

    const title = q
        ? `${q} — MTG Comprehensive Rule Search — Edict`
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
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 shadow-md sm:rounded-b-2xl">
                <SearchInput q={q} placeholder={""}/>
            </Form>
            <Search q={q} page={page} type={type}/>
        </>
    );
}