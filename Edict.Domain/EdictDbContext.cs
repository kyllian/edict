using Edict.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Edict.Domain;

public class EdictDbContext(DbContextOptions<EdictDbContext> options) : DbContext(options)
{
    public DbSet<RuleSection> RuleSections => Set<RuleSection>();
    public DbSet<RuleSubsection> RuleSubsections => Set<RuleSubsection>();
    public DbSet<Rule> Rules => Set<Rule>();
    public DbSet<Subrule> Subrules => Set<Subrule>();
    public DbSet<Definition> Glossary => Set<Definition>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<Definition> definition = modelBuilder.Entity<Definition>();
        EntityTypeBuilder<BaseRule> baseRule = modelBuilder.Entity<BaseRule>();
        EntityTypeBuilder<RuleSection> ruleSection = modelBuilder.Entity<RuleSection>();
        EntityTypeBuilder<RuleSubsection> ruleSubsection = modelBuilder.Entity<RuleSubsection>();
        EntityTypeBuilder<Rule> rule = modelBuilder.Entity<Rule>();
        EntityTypeBuilder<Subrule> subrule = modelBuilder.Entity<Subrule>();

        definition.HasMany(r => r.RuleReferences)
            .WithMany();

        baseRule.UseTphMappingStrategy()
            .HasDiscriminator<string>("discriminator")
            .IsComplete(false)
            .HasValue<RuleSection>("rule_section")
            .HasValue<RuleSubsection>("rule_subsection")
            .HasValue<Rule>("rule")
            .HasValue<Subrule>("subrule");
        baseRule.HasMany(b => b.Examples)
            .WithOne()
            .HasForeignKey("rule_example_id")
            .HasConstraintName("fk_rule_rule_examples");
        baseRule.HasMany(b => b.RuleReferences)
            .WithMany();

        ruleSection.Property(b => b.Id)
            .HasColumnName("id");
        ruleSection.Property(b => b.Number)
            .HasColumnName("number");
        ruleSection.Property(b => b.Text)
            .HasColumnName("text");

        ruleSubsection.Property(b => b.Id)
            .HasColumnName("id");
        ruleSubsection.Property(b => b.Number)
            .HasColumnName("number");
        ruleSubsection.Property(b => b.Text)
            .HasColumnName("text");
        ruleSubsection.HasOne(b => b.Section)
            .WithMany(b => b.Subsections)
            .IsRequired(false)
            .HasForeignKey("subsection_section_id")
            .HasConstraintName("fk_subsection_section");

        rule.Property(b => b.Id)
            .HasColumnName("id");
        rule.Property(b => b.Number)
            .HasColumnName("number");
        rule.Property(b => b.Text)
            .HasColumnName("text");
        rule.HasOne(b => b.Section)
            .WithMany()
            .IsRequired(false)
            .HasForeignKey("rule_section_id")
            .HasConstraintName("fk_rule_section");
        rule.HasOne(b => b.Subsection)
            .WithMany(b => b.Rules)
            .IsRequired(false)
            .HasForeignKey("rule_subsection_id")
            .HasConstraintName("fk_rule_subsection");

        subrule
            .Property(b => b.Id)
            .HasColumnName("id");
        subrule
            .Property(b => b.Number)
            .HasColumnName("number");
        subrule
            .Property(b => b.Text)
            .HasColumnName("text");
        subrule.HasOne(b => b.Section)
            .WithMany()
            .IsRequired(false)
            .HasForeignKey("subrule_section_id")
            .HasConstraintName("fk_subrule_section");
        subrule.HasOne(b => b.Subsection)
            .WithMany()
            .IsRequired(false)
            .HasForeignKey("subrule_subsection_id")
            .HasConstraintName("fk_subrule_subsection");
        subrule.HasOne(b => b.Rule)
            .WithMany(b => b.Subrules)
            .IsRequired(false)
            .HasForeignKey("subrule_rule_id")
            .HasConstraintName("fk_subrule_rule");
    }

    public async Task TruncateAllAsync()
    {
        await Database
            .ExecuteSqlRawAsync(
                """
                delete from base_rule_base_rule;
                delete from base_rule_definition;
                delete from rule_examples;
                delete from glossary;
                delete from rules
                """);
    }
}