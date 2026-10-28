using MiauNitorado.Application.AplicationInterfaces.Repositorios.UsuarioRepositorios;
using MiauNitorado.Domain.Entidades.Usuarios;
using MiauNitorado.Infrastructure.Data.AppDBsContext;
using Microsoft.EntityFrameworkCore;

namespace MiauNitorado.Infrastructure.Repositorios.UsuarioRepositorio
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDbContext _context;

        public UsuarioRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> ObterPorEmailAsync(string email)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<Usuario?> ObterPorIdAsync(int id)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<bool> UsuarioExisteAsync(string email)
        {
            return await _context.Usuarios
                .AnyAsync(u => u.Email == email);
        }

        public async Task<Usuario> CriarAsync(Usuario usuario)
        {
            usuario.DataCriacao = DateTime.UtcNow;
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario> AtualizarAsync(Usuario usuario)
        {
            _context.Usuarios.Update(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<bool> DeletarAsync(int id)
        {
            var usuario = await ObterPorIdAsync(id);
            if (usuario == null)
                return false;

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
