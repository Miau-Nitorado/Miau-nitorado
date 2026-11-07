using MiauNitorado.Domain.Entidades.Ocorrencias;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MiauNitorado.Infrastructure.Data.Configurations
{
    public class FotoConfiguration : IEntityTypeConfiguration<Foto>
    {
        public void Configure(EntityTypeBuilder<Foto> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Url)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(x => x.Alt)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(x => x.Ordem)
                .IsRequired();

            builder.HasIndex(x => new { x.AnimalId, x.Ordem });

            builder.ToTable("Fotos");
        }
    }
}
