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

    public List<BaseRule> RuleReferences { get; set; } = [];

    public void IndexRuleReferences(Dictionary<string, BaseRule> references)
    {
        RuleReferences.Clear();
        IEnumerable<RuleNumber> numbers = RuleReferenceParser.ParseRuleReferences(Text);
        IEnumerable<BaseRule> matches = numbers.Select(n => references[n.Number]);
        RuleReferences.AddRange(matches);
    }
}