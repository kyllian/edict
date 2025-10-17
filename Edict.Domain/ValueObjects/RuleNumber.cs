namespace Edict.Domain.ValueObjects;

public record RuleNumber
{
    public enum Type
    {
        Section,
        Subsection,
        Rule,
        Subrule
    }

    private RuleNumber()
    {
    }

    public string Number { get; private init; }

    public static RuleNumber Fix(string raw)
    {
        string n = raw.Replace("rule", "").Replace(".", "").Trim();
        return GetType(n) switch
        {
            Type.Section or Type.Subsection => new()
            {
                Number = $"{n}."
            },
            Type.Rule => new()
            {
                Number = $"{n[..3]}.{n[3..]}."
            },
            Type.Subrule => new()
            {
                Number = $"{n[..3]}.{n[3..]}"
            },
            _ => throw new InvalidOperationException("The rule n is not recognized as a valid type.")
        };
    }

    public static Type GetType(string number)
    {
        return number.Count(char.IsDigit) switch
        {
            1 => Type.Section,
            3 => Type.Subsection,
            _ => char.IsLetter(number[^1]) ? Type.Subrule : Type.Rule
        };
    }
}