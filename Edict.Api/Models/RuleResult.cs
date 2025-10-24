using Edict.Domain.Entities;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Edict.Api.Models;

public record RuleResult
{
    [JsonConverter(typeof(LowercaseEnumConverter))]
    public enum RuleType
    {
        Section,
        Subsection,
        Rule,
        Subrule
    }

    private class LowercaseEnumNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name) => name.ToLowerInvariant();
    }

    private class LowercaseEnumConverter() : JsonStringEnumConverter(new LowercaseEnumNamingPolicy());

    public Guid Id { get; init; }
    public RuleType Type { get; init; }
    public string Number { get; init; }
    public string Text { get; init; }
    public RuleResult[] Rules { get; init; }
    public RuleResult[] References { get; init; }
    public string? Slug { get; init; }
    public string? SectionSlug { get; init; }
    public string? SubsectionSlug { get; init; }
    public string? RuleSlug { get; init; }
    public string? SectionNumber { get; init; }
    public string? SectionText { get; init; }
    public string? SubsectionNumber { get; init; }
    public string? SubsectionText { get; init; }
    public string? RuleNumber { get; init; }
    public string? RuleText { get; init; }

    public static RuleType GetRuleType(BaseRule rule) => rule switch
    {
        RuleSection => RuleType.Section,
        RuleSubsection => RuleType.Subsection,
        Rule => RuleType.Rule,
        Subrule => RuleType.Subrule,
        _ => throw new ArgumentOutOfRangeException(nameof(rule), rule, null)
    };

    public static RuleResult From(BaseRule rule)
    {
        RuleResult[] references = rule.RuleReferences
            .Select(From)
            .ToArray();

        return new()
        {
            Id = rule.Id,
            Type = GetRuleType(rule),
            Number = rule.Number,
            Text = rule.Text,
            Rules = [],
            References = references,
            Slug = rule.Slug
        };
    }

    public static RuleResult From(RuleSection section) =>
        new()
        {
            Id = section.Id,
            Type = RuleType.Section,
            Number = section.Number,
            Text = section.Text,
            Rules = section.Subsections.Select(From).ToArray(),
            References = [],
            Slug = section.Slug,
            SectionNumber = section.Number,
            SectionText = section.Text,
        };

    public static RuleResult From(RuleSubsection subsection) =>
        new()
        {
            Id = subsection.Id,
            Type = RuleType.Subsection,
            Number = subsection.Number,
            Text = subsection.Text,
            Rules = subsection.Rules.Select(From).ToArray(),
            References = [],
            Slug = subsection.Slug,
            SectionSlug = subsection.Section.Slug,
            SubsectionSlug = subsection.Slug,
            SectionNumber = subsection.Section.Number,
            SectionText = subsection.Section.Text,
            SubsectionNumber = subsection.Number,
            SubsectionText = subsection.Text
        };

    public static RuleResult From(Rule rule)
    {
        IEnumerable<RuleResult> subrules = rule.Subrules.Select(From);
        IEnumerable<RuleResult> references = rule.RuleReferences.Select(From);
        return new()
        {
            Id = rule.Id,
            Type = RuleType.Rule,
            Number = rule.Number,
            Text = rule.Text,
            Rules = subrules.ToArray(),
            References = references.ToArray(),
            Slug = rule.Slug,
            SectionSlug = rule.Section.Slug,
            SubsectionSlug = rule.Subsection.Slug,
            SectionNumber = rule.Section.Number,
            SectionText = rule.Section.Text,
            SubsectionNumber = rule.Subsection.Number,
            SubsectionText = rule.Subsection.Text,
            RuleNumber = rule.Number,
            RuleText = rule.Text
        };
    }

    public static RuleResult From(Subrule subrule)
    {
        IEnumerable<RuleResult> references = subrule.RuleReferences.Select(From);
        return new()
        {
            Id = subrule.Id,
            Type = RuleType.Subrule,
            Number = subrule.Number,
            Text = subrule.Text,
            Rules = [],
            References = references.ToArray(),
            Slug = subrule.Slug,
            SectionSlug = subrule.Section.Slug,
            SubsectionSlug = subrule.Subsection.Slug,
            RuleSlug = subrule.Rule.Slug,
            SectionNumber = subrule.Section.Number,
            SectionText = subrule.Section.Text,
            SubsectionNumber = subrule.Subsection.Number,
            SubsectionText = subrule.Subsection.Text,
            RuleNumber = subrule.Rule.Number,
            RuleText = subrule.Rule.Text
        };
    }
}