using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using MiauNitorado.Application.Dtos.UsuariosDtos;
using MiauNitorado.Application.AplicationInterfaces.Autenticacao;

namespace MiauNitorado.API.Controllers.LoginController
{
    [ApiController]
    [Route("api/v1")]
    [Tags("Autenticação / Login")]
    public class LoginControllers : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<LoginControllers> _logger;

        public LoginControllers(IAuthService authService, ILogger<LoginControllers> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Realiza login de um usuário
        /// </summary>
        /// <param name="request">Email e senha do usuário</param>
        /// <returns>Token JWT e dados do usuário</returns>
        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Tentativa de login para email: {Email}", request.Email);

                var result = await _authService.LoginAsync(request);

                if (result == null)
                {
                    _logger.LogWarning("Falha no login - credenciais inválidas para email: {Email}", request.Email);
                    return Unauthorized(new 
                    { 
                        message = "Email ou senha inválidos"
                    });
                }

                _logger.LogInformation("Login bem-sucedido para usuário: {UsuarioId}", result.UsuarioId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar login");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Erro ao processar login"
                });
            }
        }

        /// <summary>
        /// Realiza cadastro de um novo usuário
        /// </summary>
        /// <param name="request">Dados do novo usuário</param>
        /// <returns>Token JWT e dados do usuário criado</returns>
        [HttpPost("cadastro")]
        [EnableRateLimiting("auth")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Cadastro([FromBody] CadastroUsuario request)
        {
            try
            {
                _logger.LogInformation("Tentativa de cadastro para email: {Email}", request.Email);

                var result = await _authService.CadastroAsync(request);

                if (result == null)
                {
                    _logger.LogWarning("Falha no cadastro - email já existe: {Email}", request.Email);
                    return BadRequest(new 
                    { 
                        message = "Email já cadastrado"
                    });
                }

                _logger.LogInformation("Cadastro bem-sucedido - novo usuário: {UsuarioId}", result.UsuarioId);
                return Created(nameof(Cadastro), result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar cadastro");
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Erro ao processar cadastro"
                });
            }
        }
    }
}


