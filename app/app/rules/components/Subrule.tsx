"use server";

import Link from "next/link";
import {RuleResult} from "@/app/models";
import React from "react";
import Breadcrumbs from "@/app/rules/components/Breadcrumbs";

const Subrule: React.FC<{ rule: RuleResult }> = ({rule}) => {
    return (
        <>
            <section>
                <Breadcrumbs type="subrule" rule={rule}></Breadcrumbs>
                <h4 className="opacity-70">
                    <Link href={`/rules/${rule.ruleSlug}`}>
                        Rule {rule.ruleNumber}
                    </Link>
                </h4>
                <p>{rule.ruleText}</p>
                <div className="bg-base-200 p-4 rounded-lg">
                    <h4 className="opacity-50 mt-0"> Subrule {rule.number}</h4>
                    <p>{rule.text}</p>
                </div>
            </section>
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

export default Subrule;
