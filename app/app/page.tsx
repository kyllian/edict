import type {Metadata} from "next";
import Form from 'next/form'
import SearchInput from './search/components/SearchInput'
import React from "react";
import {Michroma} from 'next/font/google';
import {APP_BASE_URL} from "@/app/utils/constants";

const michroma = Michroma({
    subsets: ['latin'],
    weight: '400'
});

export const metadata: Metadata = {
    title: "edict — MTG Rule Search",
    description: "Explore Magic: The Gathering’s rules and glossary with Edict, an unofficial fan-built search engine currently in Alpha.",
    openGraph: {
        type: 'website',
        url: APP_BASE_URL,
        title: 'edict — MTG Rule Search',
        description: 'Explore Magic: The Gathering’s rules and glossary with Edict, an unofficial fan-built search engine currently in Alpha.'
    },
    twitter: {
        title: "edict — MTG Rule Search",
        description:
            "Explore Magic: The Gathering’s rules and glossary with Edict, an unofficial fan-built search engine currently in Alpha.",
    }
};

export default async function Home() {
    return (
        <div className="mx-auto max-w-5xl flex flex-col w-full px-4 mt-[20vh] mb-[10vh]">
            <article className="text-right prose min-w-full text-2xl mb-5">
                <h1 className={`${michroma.className}`}>edict</h1>
                <p>Magic: the Gathering <br/>Rule Search</p>
            </article>
            <Form action="/search">
                <SearchInput q={""} placeholder={""}/>
            </Form>
        </div>
    );
}
