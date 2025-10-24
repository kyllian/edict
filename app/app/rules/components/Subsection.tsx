"use server";

import Link from "next/link";
import {RuleResult} from "@/app/models";
import React from "react";
import Breadcrumbs from "@/app/rules/components/Breadcrumbs";

const Subsection: React.FC<{ rule: RuleResult }> = ({rule}) => {
    const sectionQuery = new URLSearchParams({
        section: rule.sectionSlug ?? "",
    }).toString();
    return (
        <>
            <Breadcrumbs type="subsection" rule={rule}></Breadcrumbs>
            {rule.rules?.length > 0 ? (
                <section>
                    <ul className="list">
                        {rule.rules.map((r: RuleResult) => (
                            <li key={r.id} className="list-row">
                                <Link href={`/rules/${r.slug}`}
                                      className="opacity-85 font-bold tabular-nums">
                                    {r.number}
                                </Link>
                                <div className="list-col-grow">
                                    <div className="opacity-60">{r.text}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : (
                <div className="prose mt-3">
                    <h4>Oops! No rules found. :(</h4>
                </div>
            )}
        </>
    );
};

export default Subsection;
