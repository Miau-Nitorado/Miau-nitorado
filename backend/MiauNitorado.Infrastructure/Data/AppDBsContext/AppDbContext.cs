using MiauNitorado.Domain.Entidades.Ocorrencias;
using MiauNitorado.Domain.Entidades.Usuarios;
using Microsoft.EntityFrameworkCore;

namespace MiauNitorado.Infrastructure.Data.AppDBsContext
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Ocorrencia> Ocorrencias { get; set; }
        public DbSet<Animal> Animais { get; set; }
        public DbSet<Foto> Fotos { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
