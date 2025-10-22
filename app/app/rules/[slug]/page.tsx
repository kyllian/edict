import React from "react";
import Form from "next/form";
import SearchInput from "@/app/search/components/SearchInput";
import {RuleType} from "@/app/rules/models";
import Subsection from "@/app/rules/components/Subsection";
import Rule from "@/app/rules/components/Rule";
import Subrule from "@/app/rules/components/Subrule";
import Link from "next/link";

export default async function Page({params}: {
    params: Promise<{ slug: string }>
}) {
    const {slug} = await params;
    const baseUrl = process.env['services__api__http__0'];
    const response = await fetch(`${baseUrl}/rules/type/${slug}`, {cache: "no-store"});
    const result: RuleType = response.ok ? await response.json() : [];

    return (
        <main className="mx-auto max-w-5xl flex flex-col">
            <Form action="/search"
                  className="sticky top-0 mx-auto w-full max-w-5xl z-1 bg-base-200 px-4 pb-2 mb-3 shadow-md md:rounded-b-md">
                <SearchInput q={""}/>
            </Form>

            <article className="mx-auto mt-10 px-4 prose">
                <Link href="/rules"><h1>Rules</h1></Link>
                {result == 'subsection' && (
                    <Subsection slug={slug}></Subsection>
                )}
                {result == 'rule' && (
                    <Rule slug={slug}></Rule>
                )}
                {result == 'subrule' && (
                    <Subrule slug={slug}></Subrule>
                )}
            </article>
        </main>
    );
}
