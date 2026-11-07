using FluentValidation;
using MiauNitorado.Application.Dtos.OcorrenciasDtos;
using MiauNitorado.Application.Validador.UsuariosValidadores;
using MiauNitorado.Domain.Enums;
using MiauNitorado.Domain.Utilidades;

namespace MiauNitorado.Application.Validador.OcorrenciasValidadores
{
    /// <summary>
    /// Validação do animal. Obrigatórios aqui são os mesmos campos que o
    /// formulário de cadastro exige; o resto é opcional e recebe valor padrão.
    /// </summary>
    public class AnimalRequestValidator : AbstractValidator<AnimalRequest>
    {
        public const int MaximoFotos = 10;

        public AnimalRequestValidator()
        {
            RuleFor(x => x.Nome)
                .MaximumLength(100).WithMessage("Nome do animal deve ter no máximo 100 caracteres");

            RuleFor(x => x.Especie)
                .NotEmpty().WithMessage("Espécie é obrigatória")
                .Must(e => ValoresAnimal.TentarNormalizarEspecie(e, out _))
                .WithMessage($"Espécie inválida. Valores aceitos: {ValoresAnimal.OpcoesEspecie}");

            RuleFor(x => x.Raca)
                .MaximumLength(100).WithMessage("Raça deve ter no máximo 100 caracteres");

            RuleFor(x => x.Sexo)
                .Must(s => string.IsNullOrWhiteSpace(s) || ValoresAnimal.TentarNormalizarSexo(s, out _))
                .WithMessage($"Sexo inválido. Valores aceitos: {ValoresAnimal.OpcoesSexo}");

            RuleFor(x => x.Idade)
                .MaximumLength(50).WithMessage("Idade deve ter no máximo 50 caracteres");

            RuleFor(x => x.Porte)
                .NotEmpty().WithMessage("Porte é obrigatório")
                .Must(p => ValoresAnimal.TentarNormalizarPorte(p, out _))
                .WithMessage($"Porte inválido. Valores aceitos: {ValoresAnimal.OpcoesPorte}");

            RuleFor(x => x.Cor)
                .NotEmpty().WithMessage("Cor é obrigatória")
                .MaximumLength(100).WithMessage("Cor deve ter no máximo 100 caracteres");

            RuleFor(x => x.Caracteristicas)
                .NotEmpty().WithMessage("Características físicas são obrigatórias")
                .MaximumLength(1000).WithMessage("Características devem ter no máximo 1000 caracteres");

            RuleFor(x => x.CaracteristicasParticulares)
                .MaximumLength(1000).WithMessage("Características particulares devem ter no máximo 1000 caracteres");

            RuleFor(x => x.DescricaoColeira)
                .MaximumLength(200).WithMessage("Descrição da coleira deve ter no máximo 200 caracteres");

            RuleFor(x => x.Fotos)
                .NotNull().WithMessage("Fotos deve ser uma lista, mesmo que vazia")
                .Must(f => f == null || f.Count <= MaximoFotos)
                .WithMessage($"Envie no máximo {MaximoFotos} fotos");

            RuleForEach(x => x.Fotos).SetValidator(new FotoRequestValidator());
        }
    }

    public class FotoRequestValidator : AbstractValidator<FotoRequest>
    {
        public FotoRequestValidator()
        {
            RuleFor(x => x.Url)
                .NotEmpty().WithMessage("URL da foto é obrigatória")
                .MaximumLength(2000).WithMessage("URL da foto deve ter no máximo 2000 caracteres")
                .Must(SerUrlHttpValida).WithMessage("URL da foto deve ser um endereço http ou https válido");

            RuleFor(x => x.Alt)
                .MaximumLength(200).WithMessage("Texto alternativo da foto deve ter no máximo 200 caracteres");
        }

        private static bool SerUrlHttpValida(string? url)
        {
            if (string.IsNullOrWhiteSpace(url))
                return false;

            if (!Uri.TryCreate(url.Trim(), UriKind.Absolute, out var uri))
                return false;

            return uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps;
        }
    }

    public class LocalizacaoRequestValidator : AbstractValidator<LocalizacaoRequest>
    {
        public LocalizacaoRequestValidator()
        {
            RuleFor(x => x.Cidade)
                .NotEmpty().WithMessage("Cidade é obrigatória")
                .MaximumLength(100).WithMessage("Cidade deve ter no máximo 100 caracteres");

            RuleFor(x => x.Bairro)
                .NotEmpty().WithMessage("Bairro é obrigatório")
                .MaximumLength(100).WithMessage("Bairro deve ter no máximo 100 caracteres");

            RuleFor(x => x.Referencia)
                .MaximumLength(200).WithMessage("Ponto de referência deve ter no máximo 200 caracteres");
        }
    }

    public class ContatoRequestValidator : AbstractValidator<ContatoRequest>
    {
        public ContatoRequestValidator()
        {
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome de contato é obrigatório")
                .MaximumLength(150).WithMessage("Nome de contato deve ter no máximo 150 caracteres");

            RuleFor(x => x.Telefone)
                .NotEmpty().WithMessage("Telefone de contato é obrigatório")
                .MaximumLength(20).WithMessage("Telefone deve ter no máximo 20 caracteres")
                .Must(CadastroUsuarioValidator.TelefoneTemDddENumero)
                .WithMessage("Telefone deve conter DDD e número (10 ou 11 dígitos)");

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("E-mail de contato inválido")
                .MaximumLength(150).WithMessage("E-mail deve ter no máximo 150 caracteres")
                .When(x => !string.IsNullOrWhiteSpace(x.Email));

            RuleFor(x => x.MetodoPreferido)
                .NotEmpty().WithMessage("Método de contato preferido é obrigatório")
                .Must(EnumTexto.EhValido<MetodoContato>)
                .WithMessage($"Método de contato inválido. Valores aceitos: {EnumTexto.Opcoes<MetodoContato>()}");

            // Escolher e-mail como forma preferida sem informar o e-mail
            // deixaria quem encontrou o animal sem como responder.
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Informe o e-mail para usá-lo como forma de contato preferida")
                .When(x => string.Equals(x.MetodoPreferido?.Trim(), "email", StringComparison.OrdinalIgnoreCase));
        }
    }
}
