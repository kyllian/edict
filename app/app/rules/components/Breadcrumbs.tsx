"use server";

import Link from "next/link";
import {RuleResult, RuleType} from "@/app/models";
import React from "react";

const Breadcrumbs: React.FC<{ type: RuleType, rule: RuleResult }> = ({type, rule}) => {
    // Build crumbs
    const crumbs: { href?: string; label: string }[] = [];

    // Section crumb
    if (rule.sectionNumber && rule.sectionText) {
        const queryString = new URLSearchParams({
            section: rule.sectionSlug ?? "",
        }).toString();
        
        crumbs.push({
            href: `/rules?${queryString}#${rule.sectionSlug}`,
            label: `${rule.sectionNumber} ${rule.sectionText}`,
        });
    }

    // Subsection crumb
    if (rule.subsectionNumber && rule.subsectionText) {
        crumbs.push({
            href: `/rules/${rule.subsectionSlug}`,
            label: `${rule.subsectionNumber} ${rule.subsectionText}`,
        });
    }

    // Rule crumb
    if (type === "rule" || type === "subrule") {
        if (rule.ruleNumber && rule.ruleText) {
            crumbs.push({
                href: (type === "rule") ? "" : `/rules/${rule.ruleSlug}`,
                label: rule.ruleNumber,
            });
        }
    }

    // Subrule crumb
    if (type === "subrule") {
        if (rule.ruleNumber && rule.ruleText) {
            crumbs.push({
                href: "",
                label: rule.number,
            });
        }
    }

    return (
        <div className="breadcrumbs text-sm max-w-full sm:max-w-md">
            <ul>
                {crumbs.map((crumb, idx) => (
                    <li key={idx}>
                        {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Breadcrumbs;
