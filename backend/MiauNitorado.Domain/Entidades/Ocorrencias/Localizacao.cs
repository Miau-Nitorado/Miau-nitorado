namespace MiauNitorado.Domain.Entidades.Ocorrencias
{
    /// <summary>
    /// Onde o animal foi visto por último. Por privacidade, guarda apenas
    /// cidade, bairro e um ponto de referência público — nunca endereço exato.
    /// </summary>
    public class Localizacao
    {
        public string Cidade { get; set; } = string.Empty;
        public string Bairro { get; set; } = string.Empty;
        public string? Referencia { get; set; }
    }
}
