using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Edict.Domain.Entities;

[Table("message")]
public class Message
{
    [Key, Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Column("timestamp_utc")]
    public DateTime UtcTimestamp { get; set; } = DateTime.UtcNow;
    [Column("content")]
    public required string Content { get; set; }
}
