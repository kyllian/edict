"use server";

import Link from "next/link";
import {RuleResult} from "@/app/models";
import React from "react";
import Breadcrumbs from "@/app/rules/components/Breadcrumbs";

const Rule: React.FC<{ rule: RuleResult }> = ({rule}) => {
    return (
        <>
            <section>
                <Breadcrumbs type="rule" rule={rule}></Breadcrumbs>
                <h4 className="text-md opacity-70">{rule.number}</h4>
                <p>{rule.text}</p>
            </section>
            {rule.rules?.length > 0 && (
                <section>
                    <ul className="list p-0">
                        {rule.rules.map((subrule: RuleResult) => (
                            <li key={subrule.id} className="list-row rounded-lg bg-base-200 px-4">
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
                </section>
            )}
            {rule.references?.length > 0 && (
                <section className="mt-6">
                    <h4>References</h4>
                    <ul className="list p-0">
                        {rule.references.map((ref: RuleResult) => (
                            <li key={ref.id} className="list-row rounded-lg bg-base-200 px-4">
                                <Link href={`/rules/${ref.slug}`}
                                      className="font-bold opacity-85 tabular-nums">
                                    {ref.number}
                                </Link>
                                <div className="list-col-grow">
                                    <div className="opacity-60">{ref.text}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
};

export default Rule;
