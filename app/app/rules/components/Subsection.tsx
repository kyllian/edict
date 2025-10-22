"use server";
import Link from "next/link";
import {RuleResult} from "../models";
import React from "react";

const Subsection = async ({slug}: { slug: string }) => {
    const baseUrl = process.env['services__api__http__0'];
    const res = await fetch(`${baseUrl}/rules/sections/sub/${slug}`, {cache: "no-store"});
    const subsection: RuleResult = res.ok ? await res.json() : null;

    return (
        <>
            <section>
                <h2 className="text-sm">{subsection.section}</h2>
                <h3 className="text-lg">{subsection.number} {subsection.text}</h3>
            </section>
            {subsection.rules?.length > 0 ? (
                <ul className="list">
                    {subsection.rules.map((rule: RuleResult) => (
                        <li key={rule.id} className="list-row">
                            <Link href={`/rules/${rule.slug}`}
                                  className="opacity-85 font-bold tabular-nums">
                                {rule.number}
                            </Link>
                            <div className="list-col-grow">
                                <div className="opacity-60">{rule.text}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="prose mt-3">
                    <h4>Oops! No rules found. :(</h4>
                </div>
            )}
        </>
    );
};

export default Subsection;
