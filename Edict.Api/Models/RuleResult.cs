using Edict.Domain.Entities;

namespace Edict.Api.Models;

public record RuleResult(Guid Id, string Number, string Text, RuleResult[] Rules, RuleResult[] References, string? Slug = null)
{
    public static RuleResult From(BaseRule rule)
    {
        RuleResult[] references = rule.RuleReferences
            .Select(From)
            .ToArray();

        return new(rule.Id, rule.Number, rule.Text,[], references, rule.Slug);
    }

    public static RuleResult From(RuleSection section) =>
        new(section.Id,
            section.Number,
            section.Text,
            section.Subsections.Select(From).ToArray(),
            [],
            section.Slug);

    public static RuleResult From(RuleSubsection subsection) =>
        new(subsection.Id,
            subsection.Number,
            subsection.Text,
            subsection.Rules.Select(From).ToArray(),
            [],
            subsection.Slug);

    public static RuleResult From(Rule rule)
    {
        IEnumerable<RuleResult> subrules = rule.Subrules.Select(From);
        IEnumerable<RuleResult> references = rule.RuleReferences.Select(From);
        return new(rule.Id,
            rule.Number,
            rule.Text,
            subrules.ToArray(),
            references.ToArray(),
            rule.Slug);
    }
}
