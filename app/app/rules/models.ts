export interface RuleResult {
    id: string;
    number: string;
    text: string;
    rules: RuleResult[];
    references: RuleResult[];
    slug?: string | null;
    section: string | null;
    subsection: string | null;
    rule: string | null;
}