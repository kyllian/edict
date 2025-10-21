using System.Text;

namespace Edict.Domain.Entities;

public class Subrule : BaseRule
{
    public RuleSection Section { get; set; }
    public RuleSubsection Subsection { get; set; }
    public Rule Rule { get; set; }

    public override string BuildContext(bool limit = true) =>
        new StringBuilder()
            .Append(Rule.BuildContext())
            .AppendLine(base.BuildContext(limit: true))
            .ToString();

    public override string[] BuildTitle() =>
    [
        .. Subsection.BuildTitle(),
        $"{Rule.Number} {Rule.Text}"
    ];
}