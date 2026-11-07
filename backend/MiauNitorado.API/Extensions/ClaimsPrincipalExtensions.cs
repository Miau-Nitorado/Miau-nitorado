using System.Security.Claims;

namespace MiauNitorado.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        /// <summary>
        /// Lê o id do usuário da claim "UserId" gravada pelo TokenService.
        /// Retorna null quando o token não traz um id utilizável.
        /// </summary>
        public static int? ObterUsuarioId(this ClaimsPrincipal usuario)
        {
            var claim = usuario.FindFirst("UserId")?.Value
                        ?? usuario.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(claim, out var id) ? id : null;
        }
    }
}
