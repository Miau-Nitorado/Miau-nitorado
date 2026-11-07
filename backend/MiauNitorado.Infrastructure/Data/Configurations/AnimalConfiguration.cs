using MiauNitorado.Domain.Entidades.Ocorrencias;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MiauNitorado.Infrastructure.Data.Configurations
{
    public class AnimalConfiguration : IEntityTypeConfiguration<Animal>
    {
        public void Configure(EntityTypeBuilder<Animal> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Nome)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Especie)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(x => x.Raca)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Sexo)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(x => x.Idade)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(x => x.Porte)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(x => x.Cor)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Caracteristicas)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(x => x.CaracteristicasParticulares)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(x => x.PossuiColeira)
                .IsRequired();

            builder.Property(x => x.DescricaoColeira)
                .HasMaxLength(200);

            builder.Property(x => x.PossuiMicrochip)
                .IsRequired();

            // A galeria pertence ao animal: apagar o animal apaga as fotos.
            builder.HasMany(x => x.Fotos)
                .WithOne()
                .HasForeignKey(f => f.AnimalId)
                .OnDelete(DeleteBehavior.Cascade);

            // Campos usados como filtro na listagem.
            builder.HasIndex(x => x.Especie);
            builder.HasIndex(x => x.Porte);

            builder.ToTable("Animais");
        }
    }
}
