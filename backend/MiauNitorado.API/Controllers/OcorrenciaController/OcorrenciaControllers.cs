using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiauNitorado.API.Extensions;
using MiauNitorado.Application.AplicationInterfaces.Ocorrencias;
using MiauNitorado.Application.Dtos.OcorrenciasDtos;

namespace MiauNitorado.API.Controllers.OcorrenciaController
{
    [ApiController]
    [Route("api/v1/ocorrencias")]
    [Tags("Ocorrências")]
    public class OcorrenciaControllers : ControllerBase
    {
        private readonly IOcorrenciaService _ocorrenciaService;
        private readonly ILogger<OcorrenciaControllers> _logger;

        public OcorrenciaControllers(IOcorrenciaService ocorrenciaService, ILogger<OcorrenciaControllers> logger)
        {
            _ocorrenciaService = ocorrenciaService;
            _logger = logger;
        }

        /// <summary>
        /// Lista ocorrências com filtros e paginação
        /// </summary>
        /// <param name="filtro">Filtros opcionais de busca, características, local, status e período</param>
        /// <returns>Página de ocorrências e o total encontrado</returns>
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Listar([FromQuery] FiltroOcorrencias filtro)
        {
            var resultado = await _ocorrenciaService.ListarAsync(filtro);

            return Ok(resultado);
        }

        /// <summary>
        /// Lista as ocorrências cadastradas mais recentemente
        /// </summary>
        /// <param name="limite">Quantidade de itens (padrão 8, máximo 50)</param>
        [HttpGet("recentes")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ObterRecentes([FromQuery] int limite = 8)
        {
            var resultado = await _ocorrenciaService.ObterRecentesAsync(limite);

            return Ok(resultado);
        }

        /// <summary>
        /// Retorna os dados completos de uma ocorrência
        /// </summary>
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ObterPorId(Guid id)
        {
            var ocorrencia = await _ocorrenciaService.ObterPorIdAsync(id);

            return Ok(ocorrencia);
        }

        /// <summary>
        /// Publica uma nova ocorrência
        /// </summary>
        /// <remarks>
        /// Id, status, usuarioId, criadoEm e atualizadoEm são definidos pelo
        /// back-end — o status inicial espelha o tipo informado.
        /// </remarks>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Criar([FromBody] CriarOcorrencia request)
        {
            var usuarioId = User.ObterUsuarioId();

            if (usuarioId == null)
                return Unauthorized(new { message = "Token inválido" });

            var ocorrencia = await _ocorrenciaService.CriarAsync(request, usuarioId.Value);

            _logger.LogInformation(
                "Ocorrência {OcorrenciaId} criada pelo usuário {UsuarioId}",
                ocorrencia.Id,
                usuarioId);

            return CreatedAtAction(nameof(ObterPorId), new { id = ocorrencia.Id }, ocorrencia);
        }

        /// <summary>
        /// Atualiza os dados editáveis de uma ocorrência
        /// </summary>
        /// <remarks>Somente o autor da publicação pode atualizá-la.</remarks>
        [HttpPut("{id:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Atualizar(Guid id, [FromBody] AtualizarOcorrencia request)
        {
            var usuarioId = User.ObterUsuarioId();

            if (usuarioId == null)
                return Unauthorized(new { message = "Token inválido" });

            var ocorrencia = await _ocorrenciaService.AtualizarAsync(id, request, usuarioId.Value);

            _logger.LogInformation(
                "Ocorrência {OcorrenciaId} atualizada pelo usuário {UsuarioId}",
                id,
                usuarioId);

            return Ok(ocorrencia);
        }

        /// <summary>
        /// Altera o status de uma ocorrência
        /// </summary>
        /// <remarks>
        /// Somente o autor pode alterar, e apenas para um status alcançável
        /// a partir do atual.
        /// </remarks>
        [HttpPatch("{id:guid}/status")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AlterarStatus(Guid id, [FromBody] AlterarStatusOcorrencia request)
        {
            var usuarioId = User.ObterUsuarioId();

            if (usuarioId == null)
                return Unauthorized(new { message = "Token inválido" });

            var ocorrencia = await _ocorrenciaService.AlterarStatusAsync(id, request, usuarioId.Value);

            _logger.LogInformation(
                "Status da ocorrência {OcorrenciaId} alterado para {Status} pelo usuário {UsuarioId}",
                id,
                ocorrencia.Status,
                usuarioId);

            return Ok(ocorrencia);
        }
    }
}
