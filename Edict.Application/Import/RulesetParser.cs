using Edict.Domain.Entities;

namespace Edict.Application.Import;

/// <summary>
///     Provides functionality to parse ruleset entries from a text file into <see cref="Rule" /> entities.
///     The parser identifies the section between the second occurrence of "1. Game Concepts"
///     and the second occurrence of "Glossary" (each on their own line).
///     Each rule line starts with a digit and is followed by its text.
///     Example lines start with "Example: " and are attached to the most recent rule.
/// </summary>
public static class RulesetParser
{
    /// <summary>
    ///     Parses the ruleset section of the provided file content into an array of <see cref="Rule" /> objects.
    ///     The section parsed is between the second "1. Game Concepts" and the second "Glossary" line.
    ///     Each rule must start with a digit, and example lines (starting with "Example: ") are attached to the preceding
    ///     rule.
    /// </summary>
    /// <param name="file">The full text content of the rules file.</param>
    /// <returns>An array of parsed <see cref="Rule" /> objects.</returns>
    /// <exception cref="FormatException">Thrown if the file format is not as expected.</exception>
    public static BaseRule[] Parse(string file)
    {
        // Normalize line endings
        file = file.Replace("\r\n", "\n");

        // split into lines
        string[] lines = file.Split('\n', StringSplitOptions.TrimEntries);

        // The opening boundary is the second line that is "1. Game Concepts"
        int start = Array.FindIndex(lines, line => line == "1. Game Concepts");
        start = Array.FindIndex(lines, start + 1, line => line == "1. Game Concepts");

        // The closing boundary is the second line that is "Glossary"
        int end = Array.FindIndex(lines, start + 1, line => line == "Glossary");

        List<BaseRule> rules = [];
        BaseRule? current = null;
        for (int i = start; i < end; i++)
        {
            string line = lines[i];
            if (TryParseRule(line, out BaseRule rule))
            {
                current = rule;
                continue;
            }

            if (TryParseExample(line, out RuleExample ruleExample))
            {
                current?.Examples.Add(ruleExample);
                continue;
            }

            if (current is null) continue;

            rules.Add(current);
            current = null;
        }

        return rules.ToArray();
    }

    /// <summary>
    ///     Attempts to parse a rule example from a line.
    ///     An example line starts with "Example: " (case-insensitive).
    /// </summary>
    /// <param name="line">The line to parse.</param>
    /// <param name="ruleExample">The resulting <see cref="RuleExample" /> if parsing succeeds; otherwise null.</param>
    /// <returns>True if the line is a rule example; otherwise, false.</returns>
    private static bool TryParseExample(string line, out RuleExample ruleExample)
    {
        if (!line.StartsWith("Example: ", StringComparison.OrdinalIgnoreCase))
        {
            ruleExample = null!;
            return false;
        }

        ruleExample = new()
        {
            Text = line["Example: ".Length..].Trim()
        };

        return true;
    }

    /// <summary>
    ///     Attempts to parse a rule from a line.
    ///     A rule line starts with a digit, followed by a space and the rule text.
    /// </summary>
    /// <param name="line">The line to parse.</param>
    /// <param name="rule">The resulting <see cref="Rule" /> if parsing succeeds; otherwise null.</param>
    /// <returns>True if the line is a rule; otherwise, false.</returns>
    private static bool TryParseRule(string line, out BaseRule rule)
    {
        if (string.IsNullOrWhiteSpace(line) || !char.IsDigit(line[0]))
        {
            rule = null!;
            return false;
        }

        // A rule number is everything before the first space
        string number = line.Split(' ')[0];

        // The rest is the rule text
        string text = line[number.Length..].Trim();

        rule = new()
        {
            Number = number, Text = text, Slug = ""
        };

        return true;
    }
}