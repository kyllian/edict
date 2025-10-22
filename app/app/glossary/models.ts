import {RuleResult} from "@/app/models";

export interface DefinitionResult {
    id: string;
    term: string;
    text: string;
    slug: string;
    rules: RuleResult[];
}