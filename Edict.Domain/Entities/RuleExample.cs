using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Edict.Domain.Entities;

[Table("rule_examples")]
public class RuleExample
{
    [JsonPropertyName("id")] [Key] public Guid Id { get; set; } = Guid.NewGuid();
    [JsonPropertyName("text")] public required string Text { get; set; }
}