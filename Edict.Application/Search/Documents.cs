using Edict.Domain.Entities;

namespace Edict.Application.Search;

public record SearchDocument(Guid Id, string Keyword, string[] Title, string Name, string Text, string Slug)
{
    public const string Glossary = "glossary";
    public const string BaseRules = "base_rules";

    public static SearchDocument From(Definition definition) =>
        new(definition.Id,
            definition.Term,
            [],
            definition.Term,
            definition.Text,
            definition.Slug);

    public static SearchDocument From(BaseRule baseRule) =>
        new(baseRule.Id,
            baseRule.Number,
            baseRule.BuildTitle(),
            baseRule.Number,
            baseRule.Text,
            baseRule.Slug);
}