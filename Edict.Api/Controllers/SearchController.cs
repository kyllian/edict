using System.Text.Json;
using System.Text.Json.Serialization;
using Edict.Application.Search;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Core.MSearch;
using Elastic.Clients.Elasticsearch.Core.Search;
using Microsoft.AspNetCore.Mvc;

namespace Edict.Api.Controllers;

[Route("search")]
public class SearchController(ILogger<SearchController> logger, ElasticsearchClient elastic) : BaseController
{
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

    public record SearchResults(IEnumerable<SearchResult> Results, int Page = 1, int Size = 100, int TotalPages = 1);

    public class SearchResult
    {
        public required ResultType Type { get; init; }
        public required Guid Id { get; init; }
        public required string[] Title { get; init; }
        public required string Name { get; init; }
        public required string Text { get; init; }
        public required string[] NameHighlights { get; init; }
        public required string[] TextHighlights { get; init; }
    }

    [HttpGet]
    public async Task<SearchResults> Search(string q = "", int page = 1, int size = 100)
    {
        if (page < 1) page = 1;
        if (size < 1) size = 1;

        if (string.IsNullOrWhiteSpace(q))
        {
            return new([], page, size, 0);
        }

        MultiSearchResponse<SearchDocument> multisearchResponse = await elastic
            .MultiSearchAsync<SearchDocument>(search => search
                .Indices($"{SearchDocument.Glossary},{SearchDocument.BaseRules}")
                .Searches(new SearchRequestItem(new()
                {
                    From = (page - 1) * size,
                    Size = size,
                    Query = new()
                    {
                        MultiMatch = new()
                        {
                            Fields = new[]
                            {
                                $"{nameof(SearchDocument.Name).ToLower()}^2",
                                nameof(SearchDocument.Text).ToLower()
                            },
                            Query = q,
                            Fuzziness = new("AUTO")
                        }
                    },
                    Highlight = new()
                    {
                        Fields = CreateHighlightFields("name", "text")
                    }
                })));

        List<SearchResult> results = [];
        foreach (MultiSearchResponseItem<SearchDocument> response in multisearchResponse.Responses)
        {
            response.Match(search =>
            {
                foreach (Hit<SearchDocument> hit in search?.Hits ?? [])
                {
                    if (hit.Source is not { } document) continue;
                    
                    SearchResult result = CreateResult(hit.Index switch
                    {
                        SearchDocument.Glossary => ResultType.Glossary,
                        SearchDocument.BaseRules => ResultType.Rules,
                        _ => throw new()
                    }, document, hit.Highlight);

                    results.Add(result);
                }
            }, error => logger.LogWarning(
                "Elasticsearch multisearch error: {Error} - {Reasom}",
                error?.Status,
                error?.Error.Reason));
        }

        return CreateResults(results, page, size, results.Count);
    }

    [HttpGet("glossary")]
    public async Task<SearchResults> GetGlossary(string q = "", int page = 1, int size = 100)
    {
        if (page < 1) page = 1;
        if (size < 1) size = 1;

        if (string.IsNullOrWhiteSpace(q))
        {
            return await GetAllDefinitions(page, size);
        }

        SearchResponse<SearchDocument> response = await elastic.SearchAsync<SearchDocument>(search => search
            .Indices(SearchDocument.Glossary)
            .From((page - 1) * size)
            .Size(size)
            .Query(query => query
                .MultiMatch(multi => multi
                        .Fields(new[] { "name^2", "text" }) // Boost 'term' field
                        .Query(q)
                        .Fuzziness("AUTO") // Enable fuzziness
                )
            ).Highlight(h => h
                .Fields(CreateHighlightFields("name", "text")))
            .TrackTotalHits(h => h.Enabled())
        );

        return CreateResults(response, page, size);
    }

    [HttpGet("rules")]
    public async Task<SearchResults> GetRules(string q = "", int page = 1, int size = 100)
    {
        if (page < 1) page = 1;
        if (size < 1) size = 1;

        if (string.IsNullOrWhiteSpace(q))
        {
            throw new NotImplementedException();
        }

        SearchResponse<SearchDocument> response = await elastic.SearchAsync<SearchDocument>(search => search
            .Indices(SearchDocument.BaseRules)
            .From((page - 1) * size)
            .Size(size)
            .Query(query => query
                .MultiMatch(multi => multi
                        .Fields(new[] { "name^2", "text" }) // Boost 'term' field
                        .Query(q)
                        .Fuzziness("AUTO") // Enable fuzziness
                )
            ).Highlight(h => h
                .Fields(CreateHighlightFields("name", "text")))
            .TrackTotalHits(h => h.Enabled())
        );

        return CreateResults(response, page, size);
    }

    private async Task<SearchResults> GetAllDefinitions(int page, int size)
    {
        SearchResponse<SearchDocument> response = await elastic.SearchAsync<SearchDocument>(search => search
            .Indices(SearchDocument.BaseRules)
            .From((page - 1) * size)
            .Size(size)
            .Query(q => q.MatchAll())
            .Sort(s => s.Field("keyword", SortOrder.Asc))
            .TrackTotalHits(h => h.Enabled())
        );

        return CreateResults(
            response,
            page,
            size);
    }

    private static SearchResults CreateResults(IEnumerable<SearchResult> results, int page, int size, long total)
    {
        double totalPages = Math.Ceiling(total / (double)size);
        return new(results.Distinct(), page, size, (int)totalPages);
    }

    private static SearchResults CreateResults(
        SearchResponse<SearchDocument> response,
        int page,
        int size)
    {
        IEnumerable<SearchResult?> documents = response.Hits.Select(h =>
        {
            if (h.Source is not { } document) return null;
            return CreateResult(h.Index switch
            {
                SearchDocument.Glossary => ResultType.Glossary,
                SearchDocument.BaseRules => ResultType.Rules,
                _ => throw new()
            }, document, h.Highlight);
        });

        return CreateResults(
            documents.Where(d => d is not null)!,
            page,
            size,
            response.Total);
    }

    private static SearchResult CreateResult(
        ResultType resultType,
        SearchDocument document,
        IReadOnlyDictionary<string,IReadOnlyCollection<string>>? highlight)
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
            NameHighlights = nameHighlights ?? [],
            TextHighlights = textHighlights ?? []
        };
    }
    
    private static Dictionary<Field, HighlightField> CreateHighlightFields(params Field[] fieldNames)
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