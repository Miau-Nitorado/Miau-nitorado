namespace MiauNitorado.Application.Dtos.OcorrenciasDtos
{
    /// <summary>
    /// Filtros da listagem de ocorrências, vindos da query string.
    /// Todos opcionais; os de paginação têm padrão.
    /// </summary>
    public class FiltroOcorrencias
    {
        public const int TamanhoPaginaPadrao = 12;
        public const int TamanhoPaginaMaximo = 50;

        public string? Tipo { get; set; }

        /// <summary>Termo livre: casa com nome, raça, espécie, cor, características, cidade e bairro.</summary>
        public string? Busca { get; set; }

        public string? Especie { get; set; }
        public string? Raca { get; set; }
        public string? Sexo { get; set; }
        public string? Porte { get; set; }
        public string? Cidade { get; set; }
        public string? Bairro { get; set; }
        public string? Status { get; set; }

        public DateOnly? DataInicio { get; set; }
        public DateOnly? DataFim { get; set; }

        /// <summary>recentes (padrão), antigas, data ou dataAntiga.</summary>
        public string? Ordenacao { get; set; }

        public int Pagina { get; set; } = 1;
        public int TamanhoPagina { get; set; } = TamanhoPaginaPadrao;
    }
}
