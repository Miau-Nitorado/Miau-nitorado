namespace MiauNitorado.Application.Dtos.OcorrenciasDtos
{
    public class FotoDto
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public string Alt { get; set; } = string.Empty;
    }
}
