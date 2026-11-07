namespace MiauNitorado.Application.Dtos.OcorrenciasDtos
{
    /// <summary>
    /// Dados editáveis de uma ocorrência. O tipo não entra: ele define a
    /// natureza da publicação e é fixado na criação. O status tem endpoint
    /// próprio, com validação de transição.
    /// </summary>
    public class AtualizarOcorrencia
    {
        public AnimalRequest Animal { get; set; } = new();
        public DateOnly Data { get; set; }

        /// <summary>Hora no formato HH:mm.</summary>
        public string Hora { get; set; } = string.Empty;

        public LocalizacaoRequest Localizacao { get; set; } = new();
        public string Descricao { get; set; } = string.Empty;
        public string? InformacoesAdicionais { get; set; }
        public ContatoRequest Contato { get; set; } = new();
    }
}
