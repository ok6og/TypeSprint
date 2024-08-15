using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TypeSprint.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSourceType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MovieName",
                table: "Quotes");

            migrationBuilder.AddColumn<int>(
                name: "SourceId",
                table: "Quotes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SourceTypes",
                columns: table => new
                {
                    SourceTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SourceTypes", x => x.SourceTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Sources",
                columns: table => new
                {
                    SourceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SourceName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SourceTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sources", x => x.SourceId);
                    table.ForeignKey(
                        name: "FK_Sources_SourceTypes_SourceTypeId",
                        column: x => x.SourceTypeId,
                        principalTable: "SourceTypes",
                        principalColumn: "SourceTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Quotes_SourceId",
                table: "Quotes",
                column: "SourceId");

            migrationBuilder.CreateIndex(
                name: "IX_Sources_SourceTypeId",
                table: "Sources",
                column: "SourceTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quotes_Sources_SourceId",
                table: "Quotes",
                column: "SourceId",
                principalTable: "Sources",
                principalColumn: "SourceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quotes_Sources_SourceId",
                table: "Quotes");

            migrationBuilder.DropTable(
                name: "Sources");

            migrationBuilder.DropTable(
                name: "SourceTypes");

            migrationBuilder.DropIndex(
                name: "IX_Quotes_SourceId",
                table: "Quotes");

            migrationBuilder.DropColumn(
                name: "SourceId",
                table: "Quotes");

            migrationBuilder.AddColumn<string>(
                name: "MovieName",
                table: "Quotes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
