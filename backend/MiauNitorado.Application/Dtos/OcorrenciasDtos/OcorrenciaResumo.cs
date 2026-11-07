namespace MiauNitorado.Application.Dtos.OcorrenciasDtos
{
    /// <summary>
    /// Item das listagens. Carrega só o necessário para montar o card e,
    /// por privacidade, não expõe os dados de contato.
    /// </summary>
    public class OcorrenciaResumo
    {
        public Guid Id { get; set; }
        public AnimalResumo Animal { get; set; } = new();
        public string Tipo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateOnly Data { get; set; }
        public LocalizacaoResumo Localizacao { get; set; } = new();
        public DateTime CriadoEm { get; set; }
    }

    public class AnimalResumo
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Especie { get; set; } = string.Empty;
        public string Raca { get; set; } = string.Empty;
        public IReadOnlyList<FotoDto> Fotos { get; set; } = [];
    }

    public class LocalizacaoResumo
    {
        public string Cidade { get; set; } = string.Empty;
        public string Bairro { get; set; } = string.Empty;
    }
}
