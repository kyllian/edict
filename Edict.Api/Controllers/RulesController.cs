using Edict.Domain;
using Edict.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edict.Api.Controllers;

[Route("rules")]
public class RulesController(EdictDbContext db) : BaseController
{
    public record RuleResult(Guid Id, string Number, string Text, RuleResult[] Rules)
    {
        public static RuleResult From(BaseRule rule)
        {
            RuleResult[] references = rule.RuleReferences
                .Select(From)
                .ToArray();
            
            return new(rule.Id, rule.Number, rule.Text, references);
        }

        public static RuleResult From(RuleSection section) =>
            new(section.Id,
                section.Number,
                section.Text,
                section.Subsections.Select(From).ToArray());
        
        public static RuleResult From(RuleSubsection subsection) =>
            new(subsection.Id,
                subsection.Number,
                subsection.Text,
                subsection.Rules.Select(From).ToArray());
        
        public static RuleResult From(Rule rule)
        {
            IEnumerable<RuleResult> subrules = rule.Subrules.Select(From);
            IEnumerable<RuleResult> references = rule.RuleReferences.Select(From);
            return new(rule.Id,
                rule.Number,
                rule.Text,
                subrules.Concat(references).ToArray());
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RuleResult>> Get(Guid id)
    {
        RuleSection? section = await db.RuleSections
            .Include(s => s.Subsections)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (section is not null)
            return Ok(RuleResult.From(section));

        RuleSubsection? subsection = await db.RuleSubsections
            .Include(sub => sub.Rules)
            .FirstOrDefaultAsync(sub => sub.Id == id);
        if (subsection is not null)
            return Ok(RuleResult.From(subsection));

        Rule? rule = await db.Rules
            .Include(r => r.RuleReferences)
            .Include(r => r.Subrules)
            .FirstOrDefaultAsync(r => r.Id == id);
        if (rule is not null)
            return Ok(RuleResult.From(rule));

        Subrule? subrule = await db.Subrules
            .Include(r => r.RuleReferences)
            .FirstOrDefaultAsync(sr => sr.Id == id);
        if (subrule is not null)
            return Ok(RuleResult.From(subrule));

        return NotFound();
    }
}
