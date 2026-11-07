namespace MiauNitorado.Domain.Excecoes
{
    /// <summary>
    /// Operação válida na forma, mas proibida pelas regras de domínio
    /// (por exemplo uma transição de status não permitida). Resulta em 400.
    /// </summary>
    public class RegraDeNegocioException : Exception
    {
        public RegraDeNegocioException(string message) : base(message)
        {
        }
    }
}
