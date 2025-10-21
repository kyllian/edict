using System.Text;
using System.Text.RegularExpressions;
using Edict.Domain.Entities.Helpers;
using Edict.Domain.ValueObjects;

namespace Edict.Domain.Entities;

public partial class Rule : BaseRule
{
    public RuleSection Section { get; set; }
    public RuleSubsection Subsection { get; set; }
    public List<Subrule> Subrules { get; set; } = [];

    public static string BuildSlug(string number) => number
        .Replace(".", "")
        .ToLower();

    public override string BuildContext(bool limit = true)
    {
        StringBuilder sb = new StringBuilder()
            .Append(Subsection.BuildContext())
            .AppendLine(base.BuildContext(limit: true));

        if (limit) return sb.ToString();

        foreach (Subrule subrule in Subrules.OrderBy(r => r.Number))
        {
            sb.Append(subrule.Number).Append(' ').AppendLine(subrule.Text);
        }

        return sb.ToString();
    }

    public override string[] BuildTitle() =>
    [
        .. Subsection.BuildTitle(),
        $"{Subsection.Number} {Subsection.Text}",
    ];
}