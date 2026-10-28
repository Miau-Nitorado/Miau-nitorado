using MiauNitorado.Application.Dtos.UsuariosDtos;

namespace MiauNitorado.Application.AplicationInterfaces.Autenticacao
{
    public interface IAuthService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest request);
        Task<LoginResponse?> CadastroAsync(CadastroUsuario request);
    }
}
