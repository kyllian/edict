using Edict.Api.Models;
using Edict.Domain;
using Edict.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Edict.Api.Controllers;

[Route("rules")]
public class RulesController(EdictDbContext db) : BaseController
{
    [HttpGet("type/{slug}")]
    public async Task<ActionResult<RuleResult.RuleType>> GetType(string slug)
    {
        BaseRule? rule = await db.Set<BaseRule>()
            .SingleOrDefaultAsync(r => r.Slug == slug);

        if (rule is null)
        {
            return NotFound();
        }

        return RuleResult.GetRuleType(rule);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RuleResult>> Get(Guid id)
    {
        RuleSection? section = await db.RuleSections
            .Include(s => s.Subsections.OrderBy(ss => ss.Number))
            .AsSplitQuery()
            .SingleOrDefaultAsync(s => s.Id == id);
        
        if (section is not null)
        {
            return Ok(RuleResult.From(section));
        }

        RuleSubsection? subsection = await db.RuleSubsections
            .Include(s => s.Section)
            .Include(s => s.Rules.OrderBy(r => r.Number))
            .AsSplitQuery()
            .SingleOrDefaultAsync(s => s.Id == id);
        
        if (subsection is not null)
        {
            return Ok(RuleResult.From(subsection));
        }

        Rule? rule = await db.Rules
            .Include(r => r.Section)
            .Include(r => r.Subsection)
            .Include(r => r.Subrules.OrderBy(s => s.Number))
            .Include(r => r.RuleReferences.OrderBy(rr => rr.Number))
            .AsSplitQuery()
            .SingleOrDefaultAsync(r => r.Id == id);

        if (rule is not null)
        {
            return Ok(RuleResult.From(rule));
        }

        Subrule? subrule = await db.Subrules
            .Include(r => r.Section)
            .Include(r => r.Subsection)
            .Include(r => r.Rule)
            .Include(r => r.RuleReferences.OrderBy(rr => rr.Number))
            .AsSplitQuery()
            .SingleOrDefaultAsync(s => s.Id == id);

        if (subrule is null)
        {
            return NotFound();
        }

        return Ok(RuleResult.From(subrule));
    }

    [HttpGet("sections")]
    public async Task<RuleResult[]> GetSections()
    {
        RuleSection[] sections = await db.RuleSections
            .Include(s => s.Subsections.OrderBy(ss => ss.Number))
            .OrderBy(s => s.Number)
            .AsSplitQuery()
            .ToArrayAsync();

        return sections.Select(RuleResult.From).ToArray();
    }

    [HttpGet("sections/sub/{slug}")]
    public async Task<ActionResult<RuleResult>> GetSubsection(string slug)
    {
        string lowerSlug = slug.ToLower();
        RuleSubsection? subsection = await db.RuleSubsections
            .Include(s => s.Section)
            .Include(s => s.Rules.OrderBy(r => r.Number))
            .AsSplitQuery()
            .SingleOrDefaultAsync(s => s.Slug == lowerSlug);

        if (subsection is null)
        {
            return NotFound();
        }

        return Ok(RuleResult.From(subsection));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<RuleResult>> GetRule(string slug)
    {
        string lowerSlug = slug.ToLower();

        Rule? rule = await db.Rules
            .Include(r => r.Section)
            .Include(r => r.Subsection)
            .Include(r => r.RuleReferences.OrderBy(rr => rr.Number))
            .Include(r => r.Subrules.OrderBy(s => s.Number))
            .AsSplitQuery()
            .FirstOrDefaultAsync(r => r.Slug == lowerSlug);

        if (rule is null)
        {
            return NotFound();
        }
        
        return Ok(RuleResult.From(rule));
    }

    [HttpGet("sub/{slug}")]
    public async Task<ActionResult<RuleResult>> GetSubRule(string slug)
    {
        string lowerSlug = slug.ToLower();

        Subrule? rule = await db.Subrules
            .Include(r => r.Section)
            .Include(r => r.Subsection)
            .Include(r => r.Rule)
            .Include(r => r.RuleReferences.OrderBy(rr => rr.Number))
            .AsSplitQuery()
            .FirstOrDefaultAsync(r => r.Slug == lowerSlug);

        if (rule is null)
        {
            return NotFound();
        }
        
        return Ok(RuleResult.From(rule));
    }
}