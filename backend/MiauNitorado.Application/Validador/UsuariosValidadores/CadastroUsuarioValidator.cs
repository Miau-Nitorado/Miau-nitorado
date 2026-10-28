using MiauNitorado.Application.Dtos.UsuariosDtos;
using FluentValidation;

namespace MiauNitorado.Application.Validador.UsuariosValidadores
{
    public class CadastroUsuarioValidator : AbstractValidator<CadastroUsuario>
    {
        public CadastroUsuarioValidator()
        {
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório")
                .MinimumLength(3).WithMessage("Nome deve ter no mínimo 3 caracteres")
                .MaximumLength(150).WithMessage("Nome deve ter no máximo 150 caracteres");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email é obrigatório")
                .EmailAddress().WithMessage("Email inválido")
                .MaximumLength(150).WithMessage("Email deve ter no máximo 150 caracteres");

            RuleFor(x => x.Telefone)
                .NotEmpty().WithMessage("Telefone é obrigatório")
                .MaximumLength(20).WithMessage("Telefone deve ter no máximo 20 caracteres")
                .Must(TelefoneTemDddENumero).WithMessage("Telefone deve conter DDD e número (10 ou 11 dígitos)");

            RuleFor(x => x.Senha)
                .NotEmpty().WithMessage("Senha é obrigatória")
                .MinimumLength(8).WithMessage("Senha deve ter no mínimo 8 caracteres")
                .MaximumLength(128).WithMessage("Senha deve ter no máximo 128 caracteres")
                .Matches(@"[A-Z]").WithMessage("Senha deve conter ao menos uma letra maiúscula")
                .Matches(@"[a-z]").WithMessage("Senha deve conter ao menos uma letra minúscula")
                .Matches(@"[0-9]").WithMessage("Senha deve conter ao menos um número")
                .Matches(@"[!@#$%^&*]").WithMessage("Senha deve conter ao menos um caractere especial (!@#$%^&*)");
        }

        /// <summary>
        /// Aceita telefone com ou sem máscara — valida apenas a quantidade de dígitos.
        /// </summary>
        internal static bool TelefoneTemDddENumero(string? telefone)
        {
            var digitos = telefone?.Count(char.IsDigit) ?? 0;
            return digitos is 10 or 11;
        }
    }
}
