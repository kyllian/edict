using Edict.Api.Models;
using Edict.Domain;
using Edict.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edict.Api.Controllers;

[Route("rules")]
public class RulesController(EdictDbContext db) : BaseController
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RuleResult>> Get(Guid id)
    {
        RuleSection? section = await db.RuleSections
            .Include(s => s.Subsections)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (section is not null)
            return Ok(RuleResult.From(section));

        RuleSubsection? subsection = await db.RuleSubsections
            .Include(r => r.Section)
            .Include(sub => sub.Rules)
            .FirstOrDefaultAsync(sub => sub.Id == id);
        if (subsection is not null)
            return Ok(RuleResult.From(subsection));

        Rule? rule = await db.Rules
            .Include(r => r.Section)
            .Include(r => r.Subsection)
            .Include(r => r.Subrules)
            .Include(r => r.RuleReferences)
            .FirstOrDefaultAsync(r => r.Id == id);
        if (rule is not null)
            return Ok(RuleResult.From(rule));

        Subrule? subrule = await db.Subrules
            .Include(r => r.Section)
            .Include(r => r.Subsection)
            .Include(r => r.Rule)
            .Include(r => r.RuleReferences)
            .FirstOrDefaultAsync(sr => sr.Id == id);
        if (subrule is not null)
            return Ok(RuleResult.From(subrule));

        return NotFound();
    }

    [HttpGet("sections")]
    public async Task<RuleResult[]> GetSections()
    {
        RuleSection[] sections = await db.RuleSections
            .Include(s => s.Subsections.OrderBy(sub => sub.Number))
            .OrderBy(s => s.Number)
            .ToArrayAsync();

        return sections.Select(RuleResult.From).ToArray();
    }

    [HttpGet("subsections/{slug}")]
    public async Task<ActionResult<RuleResult>> GetSubsection(string slug)
    {
        string lowerSlug = slug.ToLower();
        RuleSubsection? subsection = await db.RuleSubsections
            .Include(s => s.Section)
            .Include(s => s.Rules.OrderBy(r => r.Number))
            .ThenInclude(r => r.Subrules)
            .FirstOrDefaultAsync(s => s.Slug == lowerSlug);

        if (subsection is null)
            return NotFound();

        return Ok(RuleResult.From(subsection));
    }

    [HttpGet("rule/{slug}")]
    public async Task<ActionResult<RuleResult>> GetRule(string slug)
    {
        string lowerSlug = slug.ToLower();

        Rule? rule = await db.Rules
            .Include(r => r.RuleReferences.OrderBy(s => s.Number))
            .Include(r => r.Subrules.OrderBy(s => s.Number))
            .FirstOrDefaultAsync(r => r.Slug == lowerSlug);

        if (rule is not null)
            return Ok(RuleResult.From(rule));

        return NotFound();
    }

    [HttpGet("subrule/{slug}")]
    public async Task<ActionResult<RuleResult>> GetSubRule(string slug)
    {
        string lowerSlug = slug.ToLower();

        Subrule? rule = await db.Subrules
            .Include(r => r.RuleReferences.OrderBy(s => s.Number))
            .FirstOrDefaultAsync(r => r.Slug == lowerSlug);

        if (rule is not null)
            return Ok(RuleResult.From(rule));

        return NotFound();
    }
}