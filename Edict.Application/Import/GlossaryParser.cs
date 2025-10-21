using Edict.Domain.Entities;

namespace Edict.Application.Import;

/// <summary>
///     Provides functionality to parse glossary entries from a text file into <see cref="Definition" /> entities.
///     The parser processes the section between the second occurrence of "Glossary" and the first occurrence of "Credits"
///     (each on their own line).
///     Each glossary entry is separated by an empty line, with the term on the first line and definitions on subsequent
///     lines.
/// </summary>
public static class GlossaryParser
{
    /// <summary>
    ///     Parses the glossary section of the provided file content into an array of <see cref="Definition" /> objects.
    ///     The section parsed is between the second "Glossary" and the first "Credits" line.
    ///     Each entry starts with a term line, followed by one or more definition lines, and entries are separated by empty
    ///     lines.
    /// </summary>
    /// <param name="file">The full text content of the glossary file.</param>
    /// <returns>An array of parsed <see cref="Definition" /> objects.</returns>
    public static Definition[] Parse(string file)
    {
        // Normalize line endings
        file = file.Replace("\r\n", "\n");

        // split into lines
        string[] lines = file.Split('\n', StringSplitOptions.TrimEntries);

        // The opening boundary is the second line that is "Glossary"
        int start = Array.FindIndex(lines, line => line == "Glossary");
        start = Array.FindIndex(lines, start + 1, line => line == "Glossary");

        // The closing boundary is the second line that is "Credits"
        int end = Array.FindIndex(lines, start++ + 1, line => line == "Credits");

        List<Definition> definitions = [];
        string? current = null;
        for (int i = start; i < end; i++)
        {
            string line = lines[i];
            if (string.IsNullOrWhiteSpace(line))
            {
                // Empty line indicates a new entry
                if (current is not null) current = null;

                continue;
            }

            if (current is null)
            {
                // Start a new entry
                current = line;
                continue;
            }

            // Multiple definitions for the same term
            if (char.IsDigit(line[0]))
            {
                // Everything before the first space
                string number = line.Split(' ')[0];

                // The rest is the definition text
                string text = line[number.Length..].Trim();
                definitions.Add(new()
                {
                    Term = current,
                    Text = text,
                    Slug = Definition.BuildSlug(current)
                });
            }
            else if (CountDefinitions(current) == 0)
            {
                definitions.Add(new()
                {
                    Term = current,
                    Text = line,
                    Slug = Definition.BuildSlug(current)
                });
            }
        }

        return definitions.ToArray();

        int CountDefinitions(string term)
        {
            return definitions.Count(d => d.Term == term);
        }
    }
}