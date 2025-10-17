using System.Text.RegularExpressions;
using Edict.Domain.ValueObjects;

namespace Edict.Domain.Entities.Helpers;

public static partial class RuleReferenceParser
{
    public static IEnumerable<RuleNumber> ParseRuleReferences(string text)
    {
        HashSet<RuleNumber> references = [];

        // Index ranges first (e.g., "702.1b–d")
        MatchCollection matches = RuleNumberRangeRegex().Matches(text);
        foreach (Match? match in matches.Cast<Match>())
        {
            string[] parts = match.Value.Split(['-', '–', '—'], StringSplitOptions.RemoveEmptyEntries);

            RuleNumber number = RuleNumber.Fix(parts[0]);
            char start = char.ToLower(number.Number[^1]);
            char end = char.ToLower(parts[1][0]);
            while (start <= end)
            {
                if (start is 'l' or 'o') // Skip 'l' and 'o' to avoid confusion with '1' and '0'
                {
                    start++;
                    continue;
                }

                number = RuleNumber.Fix($"{number.Number[..^1]}{start++}");
                references.Add(number);
            }
        }

        // Index lists and singular rules (e.g., "rules 702.1, 702, and 702.2j" or "rule 540.3")
        matches = RuleNumberListRegex().Matches(text);
        foreach (Match? match in matches.Cast<Match>())
        {
            string value = match.Value.Replace("rules", "").Replace("rule", "").Trim();
            string[] parts = value.Split([", and ", " and ", ", "], StringSplitOptions.RemoveEmptyEntries);
            foreach (string part in parts) references.Add(RuleNumber.Fix(part));
        }

        return references;
    }

    /// <summary>
    ///     e.g., "rules 702.1, 702, and 702.2j" or "rule 540.3"
    /// </summary>
    [GeneratedRegex(@"rules? \d+(\.\d*)?([a-z])?\.?(,\s*\d+(\.\d+)?([a-z])?\.?)*(\,?\s+and\s+\d+(\.\d+)?([a-z])?\.?)?",
        RegexOptions.Compiled)]
    private static partial Regex RuleNumberListRegex();

    /// <summary>
    ///     e.g., "702.1a–b"
    /// </summary>
    [GeneratedRegex(@"\d+\.\d+[a-z][-–—][a-z]", RegexOptions.Compiled)]
    private static partial Regex RuleNumberRangeRegex();
}