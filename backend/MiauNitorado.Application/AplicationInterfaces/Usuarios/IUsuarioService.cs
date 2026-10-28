using MiauNitorado.Application.Dtos.UsuariosDtos;

namespace MiauNitorado.Application.AplicationInterfaces.Usuarios
{
    public interface IUsuarioService
    {
        Task<PerfilUsuario?> ObterPerfilAsync(int usuarioId);
        Task<PerfilUsuario?> AtualizarPerfilAsync(int usuarioId, AtualizarPerfil request);
    }
}
