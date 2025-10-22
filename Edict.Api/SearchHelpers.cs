using System.Text.Json;
using System.Text.Json.Serialization;
using Edict.Application.Search;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Core.Search;

namespace Edict.Api;

public class ResultTypeJsonConverter : JsonConverter<ResultType>
{
    public override ResultType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.GetString() is not { } value)
            throw new JsonException();
        return value.ToLower() switch
        {
            "glossary" => ResultType.Glossary,
            "rules" => ResultType.Rules,
            _ => throw new JsonException($"Unknown ResultType: {value}")
        };
    }

    public override void Write(Utf8JsonWriter writer, ResultType value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString().ToLower());
    }
}

[JsonConverter(typeof(ResultTypeJsonConverter))]
public enum ResultType
{
    Glossary,
    Rules
}

public record SearchResults(IEnumerable<SearchResult> Results, int Page = 1, int Size = 20, int TotalPages = 1)
{
    public static SearchResults Create(IEnumerable<SearchResult> results, int page, int size, long total)
    {
        double totalPages = Math.Ceiling(total / (double)size);
        return new(results.Distinct(), page, size, (int)totalPages);
    }

    public static SearchResults Create(
        SearchResponse<SearchDocument> response,
        int page,
        int size)
    {
        IEnumerable<SearchResult?> documents = response.Hits.Select(h =>
        {
            if (h.Source is not { } document) return null;
            return SearchResult.CreateResult(h.Index switch
            {
                SearchDocument.Glossary => ResultType.Glossary,
                SearchDocument.BaseRules => ResultType.Rules,
                _ => throw new()
            }, document, h.Highlight);
        });

        long total = 0;
        response.HitsMetadata.Total?
            .Match(t => total = t?.Value ?? 0, t => total = t);

        return Create(
            documents.Where(d => d is not null)!,
            page,
            size,
            total);
    }

    public static Dictionary<Field, HighlightField> CreateHighlightFields(params Field[] fieldNames)
    {
        Dictionary<Field, HighlightField> highlightFields = new();
        foreach (Field fieldName in fieldNames)
        {
            highlightFields[fieldName] = new()
            {
                FragmentSize = 25,
                NumberOfFragments = 3,
                PreTags = [""],
                PostTags = [""]
            };
        }

        return highlightFields;
    }
}

public class SearchResult
{
    public required ResultType Type { get; init; }
    public required Guid Id { get; init; }
    public required string[] Title { get; init; }
    public required string Name { get; init; }
    public required string Text { get; init; }
    public required string Slug { get; init; }
    public required string[] NameHighlights { get; init; }
    public required string[] TextHighlights { get; init; }

    public static SearchResult CreateResult(
        ResultType resultType,
        SearchDocument document,
        IReadOnlyDictionary<string, IReadOnlyCollection<string>>? highlight)
    {
        string[]? nameHighlights = highlight?
            .Where(kvp => kvp.Key.Equals(
                nameof(SearchDocument.Name),
                StringComparison.CurrentCultureIgnoreCase))
            .SelectMany(kvp => kvp.Value)
            .ToArray();

        string[]? textHighlights = highlight?
            .Where(kvp => kvp.Key.Equals(
                nameof(SearchDocument.Text),
                StringComparison.CurrentCultureIgnoreCase))
            .SelectMany(kvp => kvp.Value)
            .ToArray();

        return new()
        {
            Type = resultType,
            Id = document.Id,
            Title = document.Title,
            Name = document.Name,
            Text = document.Text,
            Slug = document.Slug,
            NameHighlights = nameHighlights ?? [],
            TextHighlights = textHighlights ?? []
        };
    }
}
