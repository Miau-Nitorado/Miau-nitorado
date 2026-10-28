using MiauNitorado.Domain.Entidades.Usuarios;

namespace MiauNitorado.Application.AplicationInterfaces.Repositorios.UsuarioRepositorios
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> ObterPorEmailAsync(string email);
        Task<Usuario?> ObterPorIdAsync(int id);
        Task<bool> UsuarioExisteAsync(string email);
        Task<Usuario> CriarAsync(Usuario usuario);
        Task<Usuario> AtualizarAsync(Usuario usuario);
        Task<bool> DeletarAsync(int id);
    }
}
