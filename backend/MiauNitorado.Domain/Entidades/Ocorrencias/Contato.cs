using MiauNitorado.Domain.Enums;

namespace MiauNitorado.Domain.Entidades.Ocorrencias
{
    /// <summary>
    /// Contato divulgado na ocorrência. Pode ser diferente dos dados da conta,
    /// por isso é informado em cada publicação.
    /// </summary>
    public class Contato
    {
        public string Nome { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public MetodoContato MetodoPreferido { get; set; }
    }
}
