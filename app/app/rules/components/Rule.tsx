"use server";
import Link from "next/link";
import {RuleResult} from "../models";
import React from "react";

const Rule = async ({slug}: { slug: string }) => {
    const baseUrl = process.env['services__api__http__0'];
    const res = await fetch(`${baseUrl}/rules/${slug}`, {cache: "no-store"});
    const rule: RuleResult = res.ok ? await res.json() : null;

    if (!rule) {
        return (
            <div className="prose mt-3">
                <h4>Oops! Rule not found. :(</h4>
            </div>
        );
    }

    return (
        <>
            <section className="prose">
                <h2 className="text-sm">{rule.section}</h2>
                <h3 className="text-lg">{rule.subsection}</h3>
                <h4 className="text-md opacity-70">{rule.number}</h4>
                <p>{rule.text}</p>
            </section>
            {rule.rules?.length > 0 && (
                <ul className="list">
                    {rule.rules.map((subrule: RuleResult) => (
                        <li key={subrule.id} className="list-row">
                            <Link href={`/rules/${subrule.slug}`}
                                  className="font-bold opacity-85 tabular-nums">
                                {subrule.number}
                            </Link>
                            <div className="list-col-grow">
                                <div className="opacity-60">{subrule.text}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {rule.references?.length > 0 && (
                <section className="prose mt-6">
                    <h4>References</h4>
                    <ul>
                        {rule.references.map((ref: RuleResult) => (
                            <li key={ref.id}>
                                <Link href={`/rules/${ref.slug}`}>{ref.number} {ref.text}</Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
};

export default Rule;

