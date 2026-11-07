namespace MiauNitorado.Domain.Excecoes
{
    /// <summary>
    /// Recurso inexistente. Resulta em 404.
    /// </summary>
    public class NaoEncontradoException : Exception
    {
        public NaoEncontradoException(string message) : base(message)
        {
        }
    }
}
