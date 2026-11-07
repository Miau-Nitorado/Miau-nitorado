namespace MiauNitorado.Domain.Entidades.Ocorrencias
{
    public class Foto
    {
        public Guid Id { get; set; }
        public Guid AnimalId { get; set; }
        public string Url { get; set; } = string.Empty;
        public string Alt { get; set; } = string.Empty;

        /// <summary>
        /// Posição da foto na galeria. Garante ordem estável na leitura,
        /// já que a ordem de insercão no banco não é garantida.
        /// </summary>
        public int Ordem { get; set; }
    }
}
