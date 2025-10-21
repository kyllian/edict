using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.RegularExpressions;
using Edict.Domain.Entities.Helpers;
using Edict.Domain.ValueObjects;

namespace Edict.Domain.Entities;

[Table("rules")]
public partial class BaseRule
{
    [Key, Column("id")] public Guid Id { get; set; } = Guid.NewGuid();
    [Column("number")] public required string Number { get; set; }
    [Column("text")] public required string Text { get; set; }
    [Column("slug")] public required string Slug { get; set; }

    public List<RuleExample> Examples { get; set; } = [];
    public List<BaseRule> RuleReferences { get; set; } = [];

    private static string BuildSlug(string text) => text
        .Replace(", ", "-")
        .Replace(". ", "-")
        .Replace('.', '-')
        .Replace(' ', '-')
        .Replace('/', '-')
        .ToLower();

    public virtual string BuildContext(bool limit = true)
    {
        StringBuilder sb = new StringBuilder(Number)
            .Append(' ').Append(Text);

        foreach (RuleExample example in Examples)
        {
            sb.Append("Example: ").AppendLine(example.Text);
        }

        return sb.ToString();
    }

    public virtual string[] BuildTitle() => [];

    public BaseRule CreateConcreteType()
    {
        if (ExtractSubruleNumber() is { } subrule)
        {
            return new Subrule
            {
                Number = subrule,
                Text = Text,
                Slug = Rule.BuildSlug(Number),
                Examples = Examples
            };
        }

        if (ExtractRuleNumber() is { } rule)
        {
            return new Rule
            {
                Number = rule,
                Text = Text,
                Slug = Rule.BuildSlug(Number),
                Examples = Examples
            };
        }

        if (ExtractSubsectionNumber() is { } subsection)
        {
            return new RuleSubsection
            {
                Number = subsection,
                Text = Text,
                Slug = BuildSlug(Number + Text),
                Examples = Examples
            };
        }

        return new RuleSection
        {
            Number = ExtractSectionNumber(),
            Text = Text,
            Slug = BuildSlug(Number + Text),
            Examples = Examples
        };
    }

    public string ExtractSectionNumber() => Number[0] + ".";
    public string? ExtractSubsectionNumber() => Number.Length > 2 ? Number[..4] : null;

    public string? ExtractRuleNumber()
    {
        if (Number.Length < 5) return null;
        Match match = RuleNumberRegex().Match(Number);
        return match.Success ? match.Value + '.' : null;
    }

    public string? ExtractSubruleNumber() => !AlphaRegex().IsMatch(Number) ? null : Number;

    public void IndexRuleReferences(Dictionary<string, BaseRule> references)
    {
        RuleReferences.Clear();
        IEnumerable<RuleNumber> numbers = RuleReferenceParser.ParseRuleReferences(Text);
        IEnumerable<BaseRule> matches = numbers.Select(n => references[n.Number.Replace(".", "")]);
        RuleReferences.AddRange(matches);
    }

    [GeneratedRegex(@"\d+\.\d+")]
    private static partial Regex RuleNumberRegex();

    [GeneratedRegex(@"[a-z]+", RegexOptions.Compiled)]
    private static partial Regex AlphaRegex();
}