namespace MiauNitorado.Application.Dtos.OcorrenciasDtos
{
    /// <summary>
    /// Dados completos de uma ocorrência. Formato usado pelo endpoint de
    /// detalhes e também nas respostas de criação e atualização.
    /// </summary>
    public class OcorrenciaDetalhe
    {
        public Guid Id { get; set; }
        public AnimalDetalhe Animal { get; set; } = new();
        public string Tipo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateOnly Data { get; set; }

        /// <summary>Hora no formato HH:mm.</summary>
        public string Hora { get; set; } = string.Empty;

        public LocalizacaoDto Localizacao { get; set; } = new();
        public string Descricao { get; set; } = string.Empty;
        public string? InformacoesAdicionais { get; set; }
        public ContatoDto Contato { get; set; } = new();
        public int UsuarioId { get; set; }
        public DateTime CriadoEm { get; set; }
        public DateTime AtualizadoEm { get; set; }
    }

    public class AnimalDetalhe
    {
        public Guid Id { get; set; }
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
        public IReadOnlyList<FotoDto> Fotos { get; set; } = [];
    }

    public class LocalizacaoDto
    {
        public string Cidade { get; set; } = string.Empty;
        public string Bairro { get; set; } = string.Empty;
        public string? Referencia { get; set; }
    }

    public class ContatoDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string MetodoPreferido { get; set; } = string.Empty;
    }
}
