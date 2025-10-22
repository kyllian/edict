using Edict.Domain.Entities;

namespace Edict.Api.Models;

public record RuleResult(
    Guid Id,
    string Number,
    string Text,
    RuleResult[] Rules,
    RuleResult[] References,
    string? Slug = null,
    string? Section = null,
    string? Subsection = null,
    string? Rule = null)
{
    public static RuleResult From(BaseRule rule)
    {
        RuleResult[] references = rule.RuleReferences
            .Select(From)
            .ToArray();

        return new(rule.Id, rule.Number, rule.Text, [], references, rule.Slug);
    }

    public static RuleResult From(RuleSection section) =>
        new(section.Id,
            section.Number,
            section.Text,
            section.Subsections.Select(From).ToArray(),
            [],
            Slug: section.Slug,
            Section: $"{section.Number} {section.Text}");

    public static RuleResult From(RuleSubsection subsection) =>
        new(subsection.Id,
            subsection.Number,
            subsection.Text,
            subsection.Rules.Select(From).ToArray(),
            [],
            Slug: subsection.Slug,
            Section: $"{subsection.Section.Number} {subsection.Section.Text}",
            Subsection: $"{subsection.Number} {subsection.Text}");

    public static RuleResult From(Rule rule)
    {
        IEnumerable<RuleResult> subrules = rule.Subrules.Select(From);
        IEnumerable<RuleResult> references = rule.RuleReferences.Select(From);
        return new(rule.Id,
            rule.Number,
            rule.Text,
            subrules.ToArray(),
            references.ToArray(),
            Slug: rule.Slug,
            Section: $"{rule.Section.Number} {rule.Section.Text}",
            Subsection: $"{rule.Subsection.Number} {rule.Subsection.Text}",
            Rule: $"{rule.Number} {rule.Text}");
    }

    public static RuleResult From(Subrule subrule)
    {
        IEnumerable<RuleResult> references = subrule.RuleReferences.Select(From);
        return new(subrule.Id,
            subrule.Number,
            subrule.Text,
            [],
            references.ToArray(),
            Slug: subrule.Slug,
            Section: $"{subrule.Section?.Number} {subrule.Section?.Text}",
            Subsection: $"{subrule.Subsection?.Number} {subrule.Subsection?.Text}",
            Rule: $"{subrule.Rule?.Number} {subrule.Rule?.Text}");
    }
}