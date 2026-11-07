using MiauNitorado.Application.Consultas;
using MiauNitorado.Domain.Entidades.Ocorrencias;

namespace MiauNitorado.Application.AplicationInterfaces.Repositorios.OcorrenciaRepositorios
{
    public interface IOcorrenciaRepository
    {
        /// <summary>
        /// Página de ocorrências que atendem aos filtros, com o total de
        /// registros encontrados antes da paginação.
        /// </summary>
        Task<(IReadOnlyList<Ocorrencia> Itens, int Total)> ListarAsync(ConsultaOcorrencias consulta);

        Task<IReadOnlyList<Ocorrencia>> ObterRecentesAsync(int limite);

        Task<Ocorrencia?> ObterPorIdAsync(Guid id);

        Task<Ocorrencia> CriarAsync(Ocorrencia ocorrencia);

        Task<Ocorrencia> AtualizarAsync(Ocorrencia ocorrencia);
    }
}
