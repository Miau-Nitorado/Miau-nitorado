using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiauNitorado.Application.AplicationInterfaces.Usuarios;
using MiauNitorado.Application.Dtos.UsuariosDtos;
using System.Security.Claims;

namespace MiauNitorado.API.Controllers.UsuarioController
{
    [ApiController]
    [Route("api/v1/usuarios")]
    [Authorize]
    [Tags("Usuários")]
    public class UsuarioControllers : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;
        private readonly ILogger<UsuarioControllers> _logger;

        public UsuarioControllers(IUsuarioService usuarioService, ILogger<UsuarioControllers> logger)
        {
            _usuarioService = usuarioService;
            _logger = logger;
        }

        /// <summary>
        /// Retorna o perfil do usuário autenticado
        /// </summary>
        [HttpGet("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ObterPerfil()
        {
            var usuarioId = ObterUsuarioIdDoToken();

            if (usuarioId == null)
                return Unauthorized(new { message = "Token inválido" });

            var perfil = await _usuarioService.ObterPerfilAsync(usuarioId.Value);

            if (perfil == null)
            {
                _logger.LogWarning("Perfil não encontrado para usuário: {UsuarioId}", usuarioId);
                return NotFound(new { message = "Usuário não encontrado" });
            }

            return Ok(perfil);
        }

        /// <summary>
        /// Atualiza nome e telefone do usuário autenticado
        /// </summary>
        [HttpPut("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AtualizarPerfil([FromBody] AtualizarPerfil request)
        {
            var usuarioId = ObterUsuarioIdDoToken();

            if (usuarioId == null)
                return Unauthorized(new { message = "Token inválido" });

            var perfil = await _usuarioService.AtualizarPerfilAsync(usuarioId.Value, request);

            if (perfil == null)
            {
                _logger.LogWarning("Tentativa de atualizar perfil inexistente: {UsuarioId}", usuarioId);
                return NotFound(new { message = "Usuário não encontrado" });
            }

            _logger.LogInformation("Perfil atualizado para usuário: {UsuarioId}", usuarioId);
            return Ok(perfil);
        }

        /// <summary>
        /// Lê a claim "UserId" gerada pelo TokenService.
        /// </summary>
        private int? ObterUsuarioIdDoToken()
        {
            var claim = User.FindFirst("UserId")?.Value
                        ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(claim, out var id) ? id : null;
        }
    }
}
