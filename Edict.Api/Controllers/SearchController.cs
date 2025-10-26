using Edict.Application.Search;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Core.MSearch;
using Elastic.Clients.Elasticsearch.Core.Search;
using Microsoft.AspNetCore.Mvc;

namespace Edict.Api.Controllers;

[Route("search")]
public class SearchController(ILogger<SearchController> logger, ElasticsearchClient elastic) : BaseController
{
    [HttpGet]
    public async Task<SearchResults> Search(string q = "", int page = 1, int size = 20)
    {
        if (page < 1) page = 1;
        if (size < 1) size = 1;

        if (string.IsNullOrWhiteSpace(q))
        {
            return new([], page, size, 0);
        }

        await Task.Delay(2000);
        
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
                        Fields = SearchResults.CreateHighlightFields("name", "text")
                    },
                    TrackTotalHits = true
                })));

        long total = 0;
        List<SearchResult> results = [];
        foreach (MultiSearchResponseItem<SearchDocument> response in multisearchResponse.Responses)
        {
            response.Match(search =>
            {
                search?.HitsMetadata.Total?
                    .Match(t => total += t?.Value ?? 0, t => total += t);

                foreach (Hit<SearchDocument> hit in search?.Hits ?? [])
                {
                    if (hit.Source is not { } document) continue;

                    SearchResult result = SearchResult.CreateResult(hit.Index switch
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

        return SearchResults.Create(results, page, size, total);
    }

    [HttpGet("glossary")]
    public async Task<SearchResults> GetGlossary(string q = "", int page = 1, int size = 20)
    {
        if (page < 1) page = 1;
        if (size < 1) size = 1;

        if (string.IsNullOrWhiteSpace(q))
        {
            return new([], page, size, 0);
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
                .Fields(SearchResults.CreateHighlightFields("name", "text")))
            .TrackTotalHits(h => h.Enabled())
        );

        return SearchResults.Create(response, page, size);
    }

    [HttpGet("rules")]
    public async Task<SearchResults> GetRules(string q = "", int page = 1, int size = 20)
    {
        if (page < 1) page = 1;
        if (size < 1) size = 1;

        if (string.IsNullOrWhiteSpace(q))
        {
            return new([], page, size, 0);
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
                .Fields(SearchResults.CreateHighlightFields("name", "text")))
            .TrackTotalHits(h => h.Enabled())
        );

        return SearchResults.Create(response, page, size);
    }
}