"use server";
import Link from "next/link";
import {RuleResult} from "@/app/models";
import React from "react";

const Subrule = async ({slug}: { slug: string }) => {
    const baseUrl = process.env['services__api__http__0'];
    const res = await fetch(`${baseUrl}/rules/sub/${slug}`, {cache: "no-store"});
    const subrule: RuleResult = res.ok ? await res.json() : null;

    if (!subrule) {
        return (
            <div className="mt-3">
                <h4>Oops! Rule not found. :(</h4>
            </div>
        );
    }

    return (
        <>
            <section>
                <h2 className="text-sm">{subrule.section}</h2>
                <h3 className="text-lg">{subrule.subsection}</h3>
                <h4 className="opacity-70">{subrule.ruleNumber}</h4>
                <p>{subrule.ruleText}</p>
                <h4 className="opacity-50">{subrule.number}</h4>
                <p>{subrule.text}</p>
            </section>
            {subrule.references?.length > 0 && (
                <section className="mt-6">
                    <h4>References</h4>
                    <ul>
                        {subrule.references.map((ref: RuleResult) => (
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

export default Subrule;

