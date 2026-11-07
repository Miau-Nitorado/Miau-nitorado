using MiauNitorado.Application.Dtos.Comum;
using MiauNitorado.Application.Dtos.OcorrenciasDtos;

namespace MiauNitorado.Application.AplicationInterfaces.Ocorrencias
{
    public interface IOcorrenciaService
    {
        Task<ResultadoPaginado<OcorrenciaResumo>> ListarAsync(FiltroOcorrencias filtro);

        Task<IReadOnlyList<OcorrenciaResumo>> ObterRecentesAsync(int limite);

        /// <summary>Lança NaoEncontradoException quando o id não existe.</summary>
        Task<OcorrenciaDetalhe> ObterPorIdAsync(Guid id);

        Task<OcorrenciaDetalhe> CriarAsync(CriarOcorrencia request, int usuarioId);

        /// <summary>
        /// Lança NaoEncontradoException se não existir e AcessoNegadoException
        /// se o usuário não for o autor.
        /// </summary>
        Task<OcorrenciaDetalhe> AtualizarAsync(Guid id, AtualizarOcorrencia request, int usuarioId);

        /// <summary>
        /// Além de inexistência e propriedade, lança RegraDeNegocioException
        /// quando a transição de status não é permitida.
        /// </summary>
        Task<OcorrenciaDetalhe> AlterarStatusAsync(Guid id, AlterarStatusOcorrencia request, int usuarioId);
    }
}
