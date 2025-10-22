using Edict.Domain.Entities;

namespace Edict.Application.Search;

public class SearchDocument
{
    public const string Glossary = "glossary";
    public const string BaseRules = "base_rules";
    public Guid Id { get; init; }
    public string Keyword { get; init; }
    public string[] Title { get; init; }
    public string Name { get; init; }
    public string Text { get; init; }
    public string Slug { get; init; }

    public static SearchDocument From(Definition definition) =>
        new()
        {
            Id = definition.Id,
            Keyword = definition.Term,
            Title = [],
            Name = definition.Term,
            Text = definition.Text,
            Slug = definition.Slug
        };

    public static SearchDocument From(BaseRule baseRule) =>
        new()
        {
            Id = baseRule.Id,
            Keyword = baseRule.Number,
            Title = baseRule.BuildTitle(),
            Name = baseRule.Number,
            Text = baseRule.Text,
            Slug = baseRule.Slug
        };
}