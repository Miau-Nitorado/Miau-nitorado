using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MiauNitorado.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaOcorrencias : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Animais",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Especie = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Raca = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Sexo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Idade = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Porte = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Cor = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Caracteristicas = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CaracteristicasParticulares = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    PossuiColeira = table.Column<bool>(type: "boolean", nullable: false),
                    DescricaoColeira = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    PossuiMicrochip = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Animais", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Fotos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnimalId = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Alt = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Ordem = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Fotos_Animais_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ocorrencias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnimalId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tipo = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Data = table.Column<DateOnly>(type: "date", nullable: false),
                    Hora = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    Cidade = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Bairro = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Referencia = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Descricao = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    InformacoesAdicionais = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ContatoNome = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ContatoTelefone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ContatoEmail = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    ContatoMetodoPreferido = table.Column<int>(type: "integer", nullable: false),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AtualizadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ocorrencias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ocorrencias_Animais_AnimalId",
                        column: x => x.AnimalId,
                        principalTable: "Animais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Ocorrencias_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Animais_Especie",
                table: "Animais",
                column: "Especie");

            migrationBuilder.CreateIndex(
                name: "IX_Animais_Porte",
                table: "Animais",
                column: "Porte");

            migrationBuilder.CreateIndex(
                name: "IX_Fotos_AnimalId_Ordem",
                table: "Fotos",
                columns: new[] { "AnimalId", "Ordem" });

            migrationBuilder.CreateIndex(
                name: "IX_Ocorrencias_AnimalId",
                table: "Ocorrencias",
                column: "AnimalId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ocorrencias_Cidade",
                table: "Ocorrencias",
                column: "Cidade");

            migrationBuilder.CreateIndex(
                name: "IX_Ocorrencias_CriadoEm",
                table: "Ocorrencias",
                column: "CriadoEm");

            migrationBuilder.CreateIndex(
                name: "IX_Ocorrencias_Data",
                table: "Ocorrencias",
                column: "Data");

            migrationBuilder.CreateIndex(
                name: "IX_Ocorrencias_Status",
                table: "Ocorrencias",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Ocorrencias_Tipo",
                table: "Ocorrencias",
                column: "Tipo");

            migrationBuilder.CreateIndex(
                name: "IX_Ocorrencias_UsuarioId",
                table: "Ocorrencias",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Fotos");

            migrationBuilder.DropTable(
                name: "Ocorrencias");

            migrationBuilder.DropTable(
                name: "Animais");
        }
    }
}
