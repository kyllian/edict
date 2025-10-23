import type {Metadata} from "next";
import Form from 'next/form'
import SearchInput from './search/components/SearchInput'
import React from "react";
import {Michroma} from 'next/font/google';

const michroma = Michroma({
    subsets: ['latin'],
    weight: '400'
});

export const metadata: Metadata = {
    title: "Edict — MTG Rule Search",
    description: "Explore Magic: The Gathering’s rules and glossary with Edict, an unofficial fan-built search engine currently in Alpha.",
    openGraph: {
        type: 'website',
        url: process.env['NEXT_PUBLIC_BASE_URL'],
        title: 'Edict — MTG Rule Search',
        description: 'Explore Magic: The Gathering’s rules and glossary with Edict, an unofficial fan-built search engine currently in Alpha.'
    },
    twitter: {
        title: "Edict — MTG Rule Search",
        description:
            "Explore Magic: The Gathering’s rules and glossary with Edict, an unofficial fan-built search engine currently in Alpha.",
    }
};

export default async function Home() {
    return (
        <main className="mx-auto max-w-2xl py-[15vh] prose px-4">
            <article className="text-right">
                <h1 className={`${michroma.className}`}>edict</h1>
                <p>Magic: the Gathering <br/>Rule Search</p>
            </article>
            <Form action="/search">
                <SearchInput q={""} placeholder={""}/>
            </Form>
        </main>
    );
}
