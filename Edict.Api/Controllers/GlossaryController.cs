using Edict.Domain;
using Edict.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Edict.Api.Controllers.RulesController;

namespace Edict.Api.Controllers;

[Route("glossary")]
public class GlossaryController(EdictDbContext db) : BaseController
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
}