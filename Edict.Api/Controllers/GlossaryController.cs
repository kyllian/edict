using Edict.Api.Models;
using Edict.Application.Search;
using Edict.Domain;
using Edict.Domain.Entities;
using Elastic.Clients.Elasticsearch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edict.Api.Controllers;

[Route("glossary")]
public class GlossaryController(ILogger<SearchController> logger, EdictDbContext db, ElasticsearchClient elastic)
    : BaseController
{
    public record DefinitionResult(Guid Id, string Term, string Text, RuleResult[] Rules)
    {
        public static DefinitionResult From(Definition definition) =>
            new(definition.Id,
                definition.Term,
                definition.Text,
                definition.RuleReferences.Select(r => r switch
                {
                    RuleSection section => RuleResult.From(section),
                    RuleSubsection subsection => RuleResult.From(subsection),
                    Rule rule => RuleResult.From(rule),
                    _ => RuleResult.From(r)
                }).ToArray());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DefinitionResult>> Get(Guid id)
    {
        Definition? definition = await db.Glossary
            .Include(d => d.RuleReferences)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (definition is null)
        {
            return NotFound();
        }

        return Ok(DefinitionResult.From(definition));
    }

    [HttpGet]
    private async Task<SearchResults> Get(int page, int size)
    {
        SearchResponse<SearchDocument> response = await elastic.SearchAsync<SearchDocument>(search => search
            .Indices(SearchDocument.Glossary)
            .From((page - 1) * size)
            .Size(size)
            .Query(q => q.MatchAll())
            .Sort(s => s.Field("keyword", SortOrder.Asc))
            .TrackTotalHits(h => h.Enabled())
        );

        return SearchResults.Create(
            response,
            page,
            size);
    }
}