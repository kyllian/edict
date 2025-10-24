"use server";

import Link from "next/link";
import {RuleResult} from "@/app/models";
import React from "react";
import Breadcrumbs from "@/app/rules/components/Breadcrumbs";

const Subrule: React.FC<{ rule: RuleResult }> = ({rule}) => {
    const sectionQuery = new URLSearchParams({
        section: rule.sectionSlug ?? "",
    }).toString();
    return (
        <>
            <section>
                <Breadcrumbs type="subrule" rule={rule}></Breadcrumbs>
                <h4 className="opacity-70">
                    <Link href={`/rules/${rule.ruleSlug}`}>
                        {rule.ruleNumber}
                    </Link>
                </h4>
                <p>{rule.ruleText}</p>
                <h4 className="opacity-50">{rule.number}</h4>
                <p>{rule.text}</p>
            </section>
            {rule.references?.length > 0 && (
                <section className="mt-6">
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

export default Subrule;
