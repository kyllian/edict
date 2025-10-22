export interface RuleResult {
    id: string;
    number: string;
    text: string;
    rules: RuleResult[];
    references: RuleResult[];
    slug?: string | null;
    subsectionSlug?: string | null;
    ruleSlug?: string | null;
    section: string | null;
    subsection: string | null;
    ruleNumber: string | null;
    ruleText: string | null;
}

export type RuleType = 'section' | 'subsection' | 'rule' | 'subrule';