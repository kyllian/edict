import Form from 'next/form'
import SearchInput from './search/components/SearchInput'
import Link from "next/link";
import React from "react";
import {Michroma} from 'next/font/google';

const michroma = Michroma({
    subsets: ['latin'],
    weight: '400'
});

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
