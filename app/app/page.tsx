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
        <main className="mx-auto max-w-2xl pt-[25vh] prose px-4">
            <article className="text-right">
                <h1 className={`${michroma.className}`}>edict</h1>
                <p>Magic: the Gathering <br/>Rule Search</p>
            </article>
            <Form action="/search">
                <SearchInput q={""} placeholder={""}/>
                <div className="navbar p-0">
                    <div className="flex-1"></div>
                    <Link href="https://forms.gle/GWu7heW1jaGKg1WG8"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm">
                        Feedback
                    </Link>
                </div>
            </Form>
        </main>
    );
}
