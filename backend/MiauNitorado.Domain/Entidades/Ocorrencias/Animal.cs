namespace MiauNitorado.Domain.Entidades.Ocorrencias
{
    public class Animal
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

        public List<Foto> Fotos { get; set; } = [];
    }
}
