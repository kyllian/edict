using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Edict.Domain.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "glossary",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    term = table.Column<string>(type: "text", nullable: false),
                    text = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_glossary", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "rules",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    number = table.Column<string>(type: "text", nullable: false),
                    text = table.Column<string>(type: "text", nullable: false),
                    discriminator = table.Column<string>(type: "character varying(21)", maxLength: 21, nullable: false),
                    rule_section_id = table.Column<Guid>(type: "uuid", nullable: true),
                    rule_subsection_id = table.Column<Guid>(type: "uuid", nullable: true),
                    subsection_section_id = table.Column<Guid>(type: "uuid", nullable: true),
                    subrule_section_id = table.Column<Guid>(type: "uuid", nullable: true),
                    subrule_subsection_id = table.Column<Guid>(type: "uuid", nullable: true),
                    subrule_rule_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_rules", x => x.id);
                    table.ForeignKey(
                        name: "fk_rule_section",
                        column: x => x.rule_section_id,
                        principalTable: "rules",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_rule_subsection",
                        column: x => x.rule_subsection_id,
                        principalTable: "rules",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_subrule_rule",
                        column: x => x.subrule_rule_id,
                        principalTable: "rules",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_subrule_section",
                        column: x => x.subrule_section_id,
                        principalTable: "rules",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_subrule_subsection",
                        column: x => x.subrule_subsection_id,
                        principalTable: "rules",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_subsection_section",
                        column: x => x.subsection_section_id,
                        principalTable: "rules",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "base_rule_base_rule",
                columns: table => new
                {
                    base_rule_id = table.Column<Guid>(type: "uuid", nullable: false),
                    rule_references_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_base_rule_base_rule", x => new { x.base_rule_id, x.rule_references_id });
                    table.ForeignKey(
                        name: "fk_base_rule_base_rule_rules_base_rule_id",
                        column: x => x.base_rule_id,
                        principalTable: "rules",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_base_rule_base_rule_rules_rule_references_id",
                        column: x => x.rule_references_id,
                        principalTable: "rules",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "base_rule_definition",
                columns: table => new
                {
                    definition_id = table.Column<Guid>(type: "uuid", nullable: false),
                    rule_references_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_base_rule_definition", x => new { x.definition_id, x.rule_references_id });
                    table.ForeignKey(
                        name: "fk_base_rule_definition_glossary_definition_id",
                        column: x => x.definition_id,
                        principalTable: "glossary",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_base_rule_definition_rules_rule_references_id",
                        column: x => x.rule_references_id,
                        principalTable: "rules",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "rule_examples",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    text = table.Column<string>(type: "text", nullable: false),
                    rule_example_id = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_rule_examples", x => x.id);
                    table.ForeignKey(
                        name: "fk_rule_rule_examples",
                        column: x => x.rule_example_id,
                        principalTable: "rules",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "ix_base_rule_base_rule_rule_references_id",
                table: "base_rule_base_rule",
                column: "rule_references_id");

            migrationBuilder.CreateIndex(
                name: "ix_base_rule_definition_rule_references_id",
                table: "base_rule_definition",
                column: "rule_references_id");

            migrationBuilder.CreateIndex(
                name: "ix_rule_examples_rule_example_id",
                table: "rule_examples",
                column: "rule_example_id");

            migrationBuilder.CreateIndex(
                name: "ix_rules_rule_section_id",
                table: "rules",
                column: "rule_section_id");

            migrationBuilder.CreateIndex(
                name: "ix_rules_rule_subsection_id",
                table: "rules",
                column: "rule_subsection_id");

            migrationBuilder.CreateIndex(
                name: "ix_rules_subrule_rule_id",
                table: "rules",
                column: "subrule_rule_id");

            migrationBuilder.CreateIndex(
                name: "ix_rules_subrule_section_id",
                table: "rules",
                column: "subrule_section_id");

            migrationBuilder.CreateIndex(
                name: "ix_rules_subrule_subsection_id",
                table: "rules",
                column: "subrule_subsection_id");

            migrationBuilder.CreateIndex(
                name: "ix_rules_subsection_section_id",
                table: "rules",
                column: "subsection_section_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "base_rule_base_rule");

            migrationBuilder.DropTable(
                name: "base_rule_definition");

            migrationBuilder.DropTable(
                name: "rule_examples");

            migrationBuilder.DropTable(
                name: "glossary");

            migrationBuilder.DropTable(
                name: "rules");
        }
    }
}
