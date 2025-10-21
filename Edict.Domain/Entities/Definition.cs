using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Edict.Domain.Entities.Helpers;
using Edict.Domain.ValueObjects;

namespace Edict.Domain.Entities;

[Table("glossary")]
public class Definition
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();

    public string Term { get; set; } = string.Empty;
    public required string Text { get; set; }
    public required string Slug { get; set; }

    public static string BuildSlug(string term)
    {
        term = term.Replace(",", "-")
            .Replace(".", "-")
            .Replace(' ', '-')
            .Replace('/', '-')
            .Replace('(', '-')
            .Replace(')', '-')
            .Replace('“', '-')
            .Replace('”', '-')
            .Replace('[', '-')
            .Replace(']', '-')
            .Replace('!', '-');
        
        while (term.Contains("--"))
        {
            term = term.Replace("--", "-");
        }
        
        if (term.StartsWith('-'))
        {
            term = term[1..];
        }
        
        if (term.EndsWith('-'))
        {
            term = term[..^1];
        }
        
        return term.ToLower();
    }

    public List<BaseRule> RuleReferences { get; set; } = [];

    public void IndexRuleReferences(Dictionary<string, BaseRule> references)
    {
        RuleReferences.Clear();
        IEnumerable<RuleNumber> numbers = RuleReferenceParser.ParseRuleReferences(Text);
        IEnumerable<BaseRule> matches = numbers.Select(n => references[n.Number.Replace(".", "")]);
        RuleReferences.AddRange(matches);
    }
}