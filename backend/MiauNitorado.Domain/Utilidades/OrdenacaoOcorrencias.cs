namespace MiauNitorado.Domain.Utilidades
{
    /// <summary>
    /// Ordenações aceitas pela listagem de ocorrências.
    /// </summary>
    public enum OrdenacaoOcorrencias
    {
        /// <summary>Cadastradas mais recentemente primeiro (padrão).</summary>
        Recentes = 1,

        /// <summary>Cadastradas há mais tempo primeiro.</summary>
        Antigas = 2,

        /// <summary>Data do ocorrido, da mais nova para a mais antiga.</summary>
        Data = 3,

        /// <summary>Data do ocorrido, da mais antiga para a mais nova.</summary>
        DataAntiga = 4
    }
}
