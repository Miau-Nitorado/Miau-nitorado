namespace MiauNitorado.Domain.Excecoes
{
    /// <summary>
    /// Usuário autenticado tentando agir sobre um recurso que não é dele.
    /// Resulta em 403.
    /// </summary>
    public class AcessoNegadoException : Exception
    {
        public AcessoNegadoException(string message) : base(message)
        {
        }
    }
}
