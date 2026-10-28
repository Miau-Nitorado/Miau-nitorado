using MiauNitorado.Application.AplicationInterfaces.Repositorios.UsuarioRepositorios;
using MiauNitorado.Application.AplicationInterfaces.Usuarios;
using MiauNitorado.Application.Dtos.UsuariosDtos;
using MiauNitorado.Domain.Entidades.Usuarios;

namespace MiauNitorado.Application.Servicos.UsuarioServico
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<PerfilUsuario?> ObterPerfilAsync(int usuarioId)
        {
            var usuario = await _usuarioRepository.ObterPorIdAsync(usuarioId);

            if (usuario == null)
                return null;

            return MapearPerfil(usuario);
        }

        public async Task<PerfilUsuario?> AtualizarPerfilAsync(int usuarioId, AtualizarPerfil request)
        {
            var usuario = await _usuarioRepository.ObterPorIdAsync(usuarioId);

            if (usuario == null)
                return null;

            usuario.Nome = request.Nome;
            usuario.Telefone = request.Telefone;

            var usuarioAtualizado = await _usuarioRepository.AtualizarAsync(usuario);

            return MapearPerfil(usuarioAtualizado);
        }

        private static PerfilUsuario MapearPerfil(Usuario usuario) => new()
        {
            UsuarioId = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Telefone = usuario.Telefone,
            DataCriacao = usuario.DataCriacao
        };
    }
}
