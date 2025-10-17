using Edict.Domain;
using Edict.Domain.Entities;
using Elastic.Clients.Elasticsearch;
using Microsoft.EntityFrameworkCore;

namespace Edict.Application.Search;

public class Indexer(EdictDbContext db, ElasticsearchClient elastic)
{
    public async Task Index()
    {
        await elastic.Indices.DeleteAsync(SearchDocument.Glossary);
        await elastic.Indices.DeleteAsync(SearchDocument.BaseRules);
        
        await elastic.Indices.CreateAsync(SearchDocument.Glossary, c => c
            .Mappings(m => m
                .Properties<SearchDocument>(ps => ps
                    .Keyword(k => k.Keyword)//sortable
                    .Text(t => t.Name)
                )
            )
        );
        
        await elastic.Indices.CreateAsync(SearchDocument.BaseRules, c => c
            .Mappings(m => m
                .Properties<SearchDocument>(ps => ps
                    .Keyword(k => k.Keyword)//sortable
                    .Text(t => t.Title)
                    .Text(t => t.Name)
                )
            )
        );
        
        Definition[] glossary = await db.Glossary.ToArrayAsync();
        BaseRule[] baseRules = await db.Set<BaseRule>().ToArrayAsync();
        
        SearchDocument[] glossaryIndex = glossary
            .Select(SearchDocument.From)
            .ToArray();
        SearchDocument[] baseRulesIndex = baseRules
            .Select(SearchDocument.From)
            .ToArray();
        
        await elastic.IndexManyAsync(glossaryIndex, SearchDocument.Glossary);
        await elastic.IndexManyAsync(baseRulesIndex, SearchDocument.BaseRules);
    }
}