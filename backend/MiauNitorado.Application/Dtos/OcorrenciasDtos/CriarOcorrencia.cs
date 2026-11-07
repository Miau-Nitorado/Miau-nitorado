namespace MiauNitorado.Application.Dtos.OcorrenciasDtos
{
    /// <summary>
    /// Corpo da criação de ocorrência. Id, status, usuarioId, criadoEm e
    /// atualizadoEm são definidos pelo back-end e por isso não entram aqui.
    /// </summary>
    public class CriarOcorrencia
    {
        public AnimalRequest Animal { get; set; } = new();
        public string Tipo { get; set; } = string.Empty;
        public DateOnly Data { get; set; }

        /// <summary>Hora no formato HH:mm.</summary>
        public string Hora { get; set; } = string.Empty;

        public LocalizacaoRequest Localizacao { get; set; } = new();
        public string Descricao { get; set; } = string.Empty;
        public string? InformacoesAdicionais { get; set; }
        public ContatoRequest Contato { get; set; } = new();
    }

    public class AnimalRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Especie { get; set; } = string.Empty;
        public string Raca { get; set; } = string.Empty;
        public string Sexo { get; set; } = string.Empty;
        public string Idade { get; set; } = string.Empty;
        public string Porte { get; set; } = string.Empty;
        public string Cor { get; set; } = string.Empty;
        public string Caracteristicas { get; set; } = string.Empty;
        public string CaracteristicasParticulares { get; set; } = string.Empty;
        public bool PossuiColeira { get; set; }
        public string? DescricaoColeira { get; set; }
        public bool PossuiMicrochip { get; set; }
        public List<FotoRequest> Fotos { get; set; } = [];
    }

    public class FotoRequest
    {
        public string Url { get; set; } = string.Empty;
        public string Alt { get; set; } = string.Empty;
    }

    public class LocalizacaoRequest
    {
        public string Cidade { get; set; } = string.Empty;
        public string Bairro { get; set; } = string.Empty;
        public string? Referencia { get; set; }
    }

    public class ContatoRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string MetodoPreferido { get; set; } = string.Empty;
    }
}
