using Edict.Domain;
using Edict.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Edict.Application.Import;

public class Importer(ILogger<Importer> logger, EdictDbContext db)
{
    public async Task Import(string content)
    {
        // Rule 110.10. does not exist in the current ruleset, but it is referenced in the glossary.
        // The actual intended rule is 111.10., so we replace it here.
        // Rule 606.5. is incorrectly formatted in one place.
        content = content
            .Replace("110.10.", "111.10.")
            .Replace("606.5 ", "606.5. ");

        await db.TruncateAllAsync();

        ImportRules(content);
        ImportGlossary(content);

        int savedCount = await db.SaveChangesAsync();
        logger.LogInformation("Saved {SavedCount} rules and definitions to the database", savedCount);

        await IndexRuleReferences();
        savedCount = await db.SaveChangesAsync();
        logger.LogInformation("Saved {SavedCount} rule references to the database", savedCount);
    }

    private void ImportRules(string file)
    {
        BaseRule[] baseRules = RulesetParser.Parse(file).ToArray();
        logger.LogInformation("Parsed {RuleCount} total rules from the uploaded file.", baseRules.Length);

        List<RuleSection> sections = [];
        List<RuleSubsection> subsections = [];
        List<Rule> rules = [];
        List<Subrule> subrules = [];

        foreach (BaseRule baseRule in baseRules)
        {
            switch (baseRule.CreateConcreteType())
            {
                case RuleSection section:
                    sections.Add(section);
                    break;
                case RuleSubsection subsection:
                    subsections.Add(subsection);
                    break;
                case Rule rule:
                    rules.Add(rule);
                    break;
                case Subrule subrule:
                    subrules.Add(subrule);
                    break;
            }
        }

        db.AddRange(sections);
        db.AddRange(subsections);
        db.AddRange(rules);
        db.AddRange(subrules);
    }

    private void ImportGlossary(string file)
    {
        Definition[] glossary = GlossaryParser.Parse(file);
        logger.LogInformation("Parsed {DefinitionCount} definitions from the uploaded file.", glossary.Length);
        db.Glossary.AddRange(glossary);
    }

    private async Task IndexRuleReferences()
    {
        Dictionary<string, BaseRule> baseRules = await db
            .Set<BaseRule>()
            .ToDictionaryAsync(r => r.Number.Replace(".", ""), r => r);
        Dictionary<string, Subrule> subrules = baseRules.Values
            .OfType<Subrule>()
            .ToDictionary(r => r.Number.Replace(".", ""), r => r);
        Dictionary<string, Rule> rules = baseRules.Values
            .OfType<Rule>()
            .ToDictionary(r => r.Number.Replace(".", ""), r => r);
        Dictionary<string, RuleSubsection> subsections = baseRules.Values
            .OfType<RuleSubsection>()
            .ToDictionary(r => r.Number.Replace(".", ""), r => r);
        Dictionary<string, RuleSection> sections = baseRules.Values
            .OfType<RuleSection>()
            .ToDictionary(r => r.Number.Replace(".", ""), r => r);

        foreach (KeyValuePair<string, BaseRule> kvp in baseRules) kvp.Value.IndexRuleReferences(baseRules);

        Definition[] definitions = await db.Glossary.ToArrayAsync();
        foreach (Definition definition in definitions) definition.IndexRuleReferences(baseRules);
        
        foreach (Subrule subrule in subrules.Values)
        {
            string? number = subrule.ExtractRuleNumber();
            if (number is null) throw new($"Could not extract rule number from subrule {subrule.Number}");
            subrule.Rule = rules[number.Replace(".", "")];
            number = subrule.ExtractSubsectionNumber();
            if (number is null) throw new($"Could not extract subsection number from subrule {subrule.Number}");
            subrule.Subsection = subsections[number.Replace(".", "")];
            number = subrule.ExtractSectionNumber();
            subrule.Section = sections[number.Replace(".", "")];
        }

        foreach (Rule rule in rules.Values)
        {
            string? number = rule.ExtractSubsectionNumber();
            if (number is null) throw new($"Could not extract subsection number from rule {rule.Number}");
            rule.Subsection = subsections[number.Replace(".", "")];
            number = rule.ExtractSectionNumber();
            rule.Section = sections[number.Replace(".", "")];
        }

        foreach (RuleSubsection subsection in subsections.Values)
        {
            string number = subsection.ExtractSectionNumber();
            subsection.Section = sections[number.Replace(".", "")];
        }
        
        db.UpdateRange(baseRules.Values);
    }
}