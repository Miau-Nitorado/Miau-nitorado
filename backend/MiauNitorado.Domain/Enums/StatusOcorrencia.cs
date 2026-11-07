namespace MiauNitorado.Domain.Enums
{
    /// <summary>
    /// Situação atual da publicação. Começa espelhando o tipo e avança
    /// conforme o desfecho do caso.
    /// </summary>
    public enum StatusOcorrencia
    {
        Perdido = 1,
        Encontrado = 2,
        Localizado = 3,
        Encerrado = 4
    }
}
