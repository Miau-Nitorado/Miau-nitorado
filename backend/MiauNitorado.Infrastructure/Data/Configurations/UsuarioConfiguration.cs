using MiauNitorado.Domain.Entidades.Usuarios;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MiauNitorado.Infrastructure.Data.Configurations
{
    public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Nome)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(150);

            builder.HasIndex(x => x.Email)
                .IsUnique();

            builder.Property(x => x.Telefone)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(x => x.SenhaHash)
                .IsRequired();

            builder.Property(x => x.DataCriacao)
                .IsRequired()
                .HasDefaultValueSql("NOW()");

            builder.ToTable("Usuarios");
        }
    }
}
