using MiauNitorado.Application.Dtos.UsuariosDtos;
using FluentValidation;

namespace MiauNitorado.Application.Validador.UsuariosValidadores
{
    public class AtualizarPerfilValidator : AbstractValidator<AtualizarPerfil>
    {
        public AtualizarPerfilValidator()
        {
            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório")
                .MinimumLength(3).WithMessage("Nome deve ter no mínimo 3 caracteres")
                .MaximumLength(150).WithMessage("Nome deve ter no máximo 150 caracteres");

            RuleFor(x => x.Telefone)
                .NotEmpty().WithMessage("Telefone é obrigatório")
                .MaximumLength(20).WithMessage("Telefone deve ter no máximo 20 caracteres")
                .Must(CadastroUsuarioValidator.TelefoneTemDddENumero)
                .WithMessage("Telefone deve conter DDD e número (10 ou 11 dígitos)");
        }
    }
}
