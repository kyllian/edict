using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Edict.Domain.Entities;

[Table("chat")]
public class Chat
{
    [Key, Column("id")] public Guid Id { get; set; } = Guid.NewGuid();
    public List<Message> Messages { get; set; } = [];
}