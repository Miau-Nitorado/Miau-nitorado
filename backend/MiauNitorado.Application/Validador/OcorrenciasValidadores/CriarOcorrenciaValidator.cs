using FluentValidation;
using MiauNitorado.Application.Dtos.OcorrenciasDtos;
using MiauNitorado.Domain.Enums;
using MiauNitorado.Domain.Utilidades;

namespace MiauNitorado.Application.Validador.OcorrenciasValidadores
{
    public class CriarOcorrenciaValidator : AbstractValidator<CriarOcorrencia>
    {
        public CriarOcorrenciaValidator()
        {
            RuleFor(x => x.Animal)
                .NotNull().WithMessage("Dados do animal são obrigatórios")
                .SetValidator(new AnimalRequestValidator());

            RuleFor(x => x.Tipo)
                .NotEmpty().WithMessage("Tipo é obrigatório")
                .Must(EnumTexto.EhValido<TipoOcorrencia>)
                .WithMessage($"Tipo inválido. Valores aceitos: {EnumTexto.Opcoes<TipoOcorrencia>()}");

            RuleFor(x => x.Data)
                .Must(RegrasOcorrencia.DataInformada).WithMessage("Data é obrigatória")
                .Must(RegrasOcorrencia.DataNaoFutura).WithMessage("A data não pode estar no futuro");

            RuleFor(x => x.Hora)
                .Must(Horario.EhValido).WithMessage("Hora deve estar no formato HH:mm")
                .When(x => !string.IsNullOrWhiteSpace(x.Hora));

            RuleFor(x => x.Localizacao)
                .NotNull().WithMessage("Localização é obrigatória")
                .SetValidator(new LocalizacaoRequestValidator());

            RuleFor(x => x.Descricao)
                .MaximumLength(2000).WithMessage("Descrição deve ter no máximo 2000 caracteres");

            RuleFor(x => x.InformacoesAdicionais)
                .MaximumLength(2000).WithMessage("Informações adicionais devem ter no máximo 2000 caracteres");

            RuleFor(x => x.Contato)
                .NotNull().WithMessage("Dados de contato são obrigatórios")
                .SetValidator(new ContatoRequestValidator());
        }
    }

    public class AtualizarOcorrenciaValidator : AbstractValidator<AtualizarOcorrencia>
    {
        public AtualizarOcorrenciaValidator()
        {
            RuleFor(x => x.Animal)
                .NotNull().WithMessage("Dados do animal são obrigatórios")
                .SetValidator(new AnimalRequestValidator());

            RuleFor(x => x.Data)
                .Must(RegrasOcorrencia.DataInformada).WithMessage("Data é obrigatória")
                .Must(RegrasOcorrencia.DataNaoFutura).WithMessage("A data não pode estar no futuro");

            RuleFor(x => x.Hora)
                .Must(Horario.EhValido).WithMessage("Hora deve estar no formato HH:mm")
                .When(x => !string.IsNullOrWhiteSpace(x.Hora));

            RuleFor(x => x.Localizacao)
                .NotNull().WithMessage("Localização é obrigatória")
                .SetValidator(new LocalizacaoRequestValidator());

            RuleFor(x => x.Descricao)
                .MaximumLength(2000).WithMessage("Descrição deve ter no máximo 2000 caracteres");

            RuleFor(x => x.InformacoesAdicionais)
                .MaximumLength(2000).WithMessage("Informações adicionais devem ter no máximo 2000 caracteres");

            RuleFor(x => x.Contato)
                .NotNull().WithMessage("Dados de contato são obrigatórios")
                .SetValidator(new ContatoRequestValidator());
        }
    }

    public class AlterarStatusOcorrenciaValidator : AbstractValidator<AlterarStatusOcorrencia>
    {
        public AlterarStatusOcorrenciaValidator()
        {
            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status é obrigatório")
                .Must(EnumTexto.EhValido<StatusOcorrencia>)
                .WithMessage($"Status inválido. Valores aceitos: {EnumTexto.Opcoes<StatusOcorrencia>()}");
        }
    }

    /// <summary>
    /// Regras de data compartilhadas entre criação e atualização.
    /// </summary>
    internal static class RegrasOcorrencia
    {
        /// <summary>
        /// DateOnly não informado chega como 0001-01-01, que passaria pelas
        /// outras checagens — daí a verificação explícita.
        /// </summary>
        internal static bool DataInformada(DateOnly data) => data != default;

        internal static bool DataNaoFutura(DateOnly data) =>
            data == default || data <= DateOnly.FromDateTime(DateTime.UtcNow);
    }
}
