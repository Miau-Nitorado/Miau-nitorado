namespace MiauNitorado.Application.Dtos.UsuariosDtos
{
    public class PerfilUsuario
    {
        public int UsuarioId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
    }
}
