export interface RuleResult {
    id: string;
    number: string;
    text: string;
    rules: RuleResult[];
    references: RuleResult[];
    slug?: string | null;
    sectionSlug: string | null;
    subsectionSlug?: string | null;
    ruleSlug?: string | null;
    sectionNumber: string | null;
    sectionText: string | null;
    subsectionNumber: string | null;
    subsectionText: string | null;
    ruleNumber: string | null;
    ruleText: string | null;
}

export type RuleType = 'section' | 'subsection' | 'rule' | 'subrule';