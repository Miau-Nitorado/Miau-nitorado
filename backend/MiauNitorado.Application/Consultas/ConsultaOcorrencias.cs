using MiauNitorado.Domain.Enums;
using MiauNitorado.Domain.Utilidades;

namespace MiauNitorado.Application.Consultas
{
    /// <summary>
    /// Filtros já validados e normalizados, prontos para virar query no banco.
    /// Diferente do DTO que chega da requisição, aqui tipo, status e ordenação
    /// são enums e os textos estão na forma canônica.
    /// </summary>
    public class ConsultaOcorrencias
    {
        public TipoOcorrencia? Tipo { get; set; }
        public StatusOcorrencia? Status { get; set; }
        public string? Busca { get; set; }
        public string? Especie { get; set; }
        public string? Raca { get; set; }
        public string? Sexo { get; set; }
        public string? Porte { get; set; }
        public string? Cidade { get; set; }
        public string? Bairro { get; set; }
        public DateOnly? DataInicio { get; set; }
        public DateOnly? DataFim { get; set; }
        public OrdenacaoOcorrencias Ordenacao { get; set; } = OrdenacaoOcorrencias.Recentes;
        public int Pagina { get; set; } = 1;
        public int TamanhoPagina { get; set; } = 12;
    }
}
