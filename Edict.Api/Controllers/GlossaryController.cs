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
    public record DefinitionResult(Guid Id, string Term, string Text, string Slug, RuleResult[] Rules)
    {
        public static DefinitionResult From(Definition definition) =>
            new(definition.Id,
                definition.Term,
                definition.Text,
                definition.Slug,
                definition.RuleReferences.Select(RuleResult.From).ToArray());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DefinitionResult>> Get(Guid id)
    {
        Definition? definition = await db.Glossary
            .Include(d => d.RuleReferences)
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id);

        if (definition is null)
        {
            return NotFound();
        }

        return Ok(DefinitionResult.From(definition));
    }

    [HttpGet]
    public async Task<DefinitionResult[]> Get(char letter = 'a')
    {
        Definition[] glossary = await db.Glossary
            .Where(g => g.Term.ToUpper().StartsWith(letter.ToString().ToUpper()))
            .OrderBy(g => g.Term)
            .ToArrayAsync();
        
        return glossary.Select(DefinitionResult.From).ToArray();
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<DefinitionResult>> Get(string slug)
    {
        Definition? definition = await db.Glossary
            .Include(d => d.RuleReferences)
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Slug == slug);

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