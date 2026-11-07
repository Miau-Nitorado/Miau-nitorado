using FluentValidation;
using MiauNitorado.Application.Dtos.OcorrenciasDtos;
using MiauNitorado.Domain.Enums;
using MiauNitorado.Domain.Utilidades;

namespace MiauNitorado.Application.Validador.OcorrenciasValidadores
{
    /// <summary>
    /// Validação dos filtros da listagem. Todos são opcionais, mas quando
    /// informados precisam estar dentro do vocabulário aceito — assim um
    /// filtro escrito errado não passa em branco devolvendo lista vazia.
    /// </summary>
    public class FiltroOcorrenciasValidator : AbstractValidator<FiltroOcorrencias>
    {
        public FiltroOcorrenciasValidator()
        {
            RuleFor(x => x.Tipo)
                .Must(EnumTexto.EhValido<TipoOcorrencia>)
                .WithMessage($"Tipo inválido. Valores aceitos: {EnumTexto.Opcoes<TipoOcorrencia>()}")
                .When(x => !string.IsNullOrWhiteSpace(x.Tipo));

            RuleFor(x => x.Status)
                .Must(EnumTexto.EhValido<StatusOcorrencia>)
                .WithMessage($"Status inválido. Valores aceitos: {EnumTexto.Opcoes<StatusOcorrencia>()}")
                .When(x => !string.IsNullOrWhiteSpace(x.Status));

            RuleFor(x => x.Especie)
                .Must(e => ValoresAnimal.TentarNormalizarEspecie(e, out _))
                .WithMessage($"Espécie inválida. Valores aceitos: {ValoresAnimal.OpcoesEspecie}")
                .When(x => !string.IsNullOrWhiteSpace(x.Especie));

            RuleFor(x => x.Sexo)
                .Must(s => ValoresAnimal.TentarNormalizarSexo(s, out _))
                .WithMessage($"Sexo inválido. Valores aceitos: {ValoresAnimal.OpcoesSexo}")
                .When(x => !string.IsNullOrWhiteSpace(x.Sexo));

            RuleFor(x => x.Porte)
                .Must(p => ValoresAnimal.TentarNormalizarPorte(p, out _))
                .WithMessage($"Porte inválido. Valores aceitos: {ValoresAnimal.OpcoesPorte}")
                .When(x => !string.IsNullOrWhiteSpace(x.Porte));

            RuleFor(x => x.Ordenacao)
                .Must(EnumTexto.EhValido<OrdenacaoOcorrencias>)
                .WithMessage($"Ordenação inválida. Valores aceitos: {EnumTexto.Opcoes<OrdenacaoOcorrencias>()}")
                .When(x => !string.IsNullOrWhiteSpace(x.Ordenacao));

            RuleFor(x => x.Raca)
                .MaximumLength(100).WithMessage("Raça deve ter no máximo 100 caracteres");

            RuleFor(x => x.Busca)
                .MaximumLength(200).WithMessage("Busca deve ter no máximo 200 caracteres");

            RuleFor(x => x.Cidade)
                .MaximumLength(100).WithMessage("Cidade deve ter no máximo 100 caracteres");

            RuleFor(x => x.Bairro)
                .MaximumLength(100).WithMessage("Bairro deve ter no máximo 100 caracteres");

            RuleFor(x => x.Pagina)
                .GreaterThanOrEqualTo(1).WithMessage("Página deve ser maior ou igual a 1");

            RuleFor(x => x.TamanhoPagina)
                .InclusiveBetween(1, FiltroOcorrencias.TamanhoPaginaMaximo)
                .WithMessage($"Tamanho da página deve estar entre 1 e {FiltroOcorrencias.TamanhoPaginaMaximo}");

            RuleFor(x => x.DataFim)
                .GreaterThanOrEqualTo(x => x.DataInicio)
                .WithMessage("Data final não pode ser anterior à data inicial")
                .When(x => x.DataInicio.HasValue && x.DataFim.HasValue);
        }
    }
}
