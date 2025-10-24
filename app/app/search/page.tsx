import React from "react";
import Search from "@/app/search/components/Search";
import {SearchParams} from "@/app/search/models";
import {Metadata} from "next";

export async function generateMetadata({searchParams}: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
    const {q, page = 1, type = "all"} = await searchParams;
    const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'];

    const queryString = new URLSearchParams({
        ...(q && {q}),
        ...(page > 1 && {page: page.toString()}),
        ...(type !== "all" && {type}),
    }).toString();

    const url = `${baseUrl}/search${queryString ? `?${queryString}` : ''}`;

    const typeLabel = type === "all" ? "rules and glossary" : type;
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
}

export default async function Page({searchParams}: { searchParams: Promise<SearchParams> }) {
    const {q, page = 1, type = "all"} = await searchParams;

    return (
        <main className="mx-auto max-w-5xl flex flex-col">
            <Search q={q} type={type} page={page}/>
        </main>
    );
}