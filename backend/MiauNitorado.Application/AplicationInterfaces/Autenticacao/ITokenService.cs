using MiauNitorado.Domain.Entidades.Usuarios;

namespace MiauNitorado.Application.AplicationInterfaces.Autenticacao
{
    public interface ITokenService
    {
        string GerarToken(Usuario usuario);
    }
}
