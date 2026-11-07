using MiauNitorado.Domain.Entidades.Ocorrencias;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MiauNitorado.Infrastructure.Data.Configurations
{
    public class OcorrenciaConfiguration : IEntityTypeConfiguration<Ocorrencia>
    {
        public void Configure(EntityTypeBuilder<Ocorrencia> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Tipo)
                .IsRequired();

            builder.Property(x => x.Status)
                .IsRequired();

            builder.Property(x => x.Data)
                .IsRequired();

            builder.Property(x => x.Hora)
                .IsRequired();

            builder.Property(x => x.Descricao)
                .IsRequired()
                .HasMaxLength(2000);

            builder.Property(x => x.InformacoesAdicionais)
                .HasMaxLength(2000);

            builder.Property(x => x.CriadoEm)
                .IsRequired();

            builder.Property(x => x.AtualizadoEm)
                .IsRequired();

            // Localização e contato moram na mesma tabela da ocorrência.
            builder.OwnsOne(x => x.Localizacao, localizacao =>
            {
                localizacao.Property(l => l.Cidade)
                    .HasColumnName("Cidade")
                    .IsRequired()
                    .HasMaxLength(100);

                localizacao.Property(l => l.Bairro)
                    .HasColumnName("Bairro")
                    .IsRequired()
                    .HasMaxLength(100);

                localizacao.Property(l => l.Referencia)
                    .HasColumnName("Referencia")
                    .HasMaxLength(200);

                localizacao.HasIndex(l => l.Cidade);
            });

            builder.OwnsOne(x => x.Contato, contato =>
            {
                contato.Property(c => c.Nome)
                    .HasColumnName("ContatoNome")
                    .IsRequired()
                    .HasMaxLength(150);

                contato.Property(c => c.Telefone)
                    .HasColumnName("ContatoTelefone")
                    .IsRequired()
                    .HasMaxLength(20);

                contato.Property(c => c.Email)
                    .HasColumnName("ContatoEmail")
                    .HasMaxLength(150);

                contato.Property(c => c.MetodoPreferido)
                    .HasColumnName("ContatoMetodoPreferido")
                    .IsRequired();
            });

            // Cada ocorrência tem seu próprio registro de animal.
            builder.HasOne(x => x.Animal)
                .WithOne()
                .HasForeignKey<Ocorrencia>(x => x.AnimalId)
                .OnDelete(DeleteBehavior.Cascade);

            // Publicações preservam o vínculo com o autor: a conta não pode
            // ser removida enquanto tiver ocorrências.
            builder.HasOne(x => x.Usuario)
                .WithMany()
                .HasForeignKey(x => x.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(x => x.Tipo);
            builder.HasIndex(x => x.Status);
            builder.HasIndex(x => x.Data);
            builder.HasIndex(x => x.CriadoEm);
            builder.HasIndex(x => x.UsuarioId);

            builder.ToTable("Ocorrencias");
        }
    }
}
