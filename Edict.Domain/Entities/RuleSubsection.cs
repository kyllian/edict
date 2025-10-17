using System.Text;

namespace Edict.Domain.Entities;

public class RuleSubsection : BaseRule
{
    public RuleSection Section { get; set; }
    public List<Rule> Rules { get; set; } = [];

    public override string BuildContext(bool limit = true)
    {
        StringBuilder sb = new StringBuilder()
            .Append(Section.BuildContext())
            .AppendLine(base.BuildContext(limit: true));

        if (limit) return sb.ToString();
        
        foreach (Rule rule in Rules.OrderBy(r => r.Number))
        {
            sb.Append(rule.Number).Append(' ').AppendLine(rule.Text);
        }
        
        return sb.ToString();
    }

    public override string[] BuildTitle() =>
    [
        .. Section.BuildTitle(),
        $"{Section.Number} {Section.Text}"
    ];
}