using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Edict.Domain.Entities;

public class RuleSection : BaseRule
{
    public List<RuleSubsection> Subsections { get; set; } = [];

    public override string BuildContext(bool limit = true)
    {
        StringBuilder sb = new StringBuilder()
            .AppendLine(base.BuildContext(limit: true));
        
        if (limit) return sb.ToString();

        foreach (RuleSubsection subsection in Subsections.OrderBy(r => r.Number))
        {
            sb.Append(subsection.Number).Append(' ').AppendLine(subsection.Text);
        }

        return sb.ToString();
    }
}