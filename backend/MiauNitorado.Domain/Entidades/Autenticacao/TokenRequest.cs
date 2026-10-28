using System;
using System.Collections.Generic;
using System.Text;

namespace MiauNitorado.Domain.Entidades.Autenticacao
{
    public class TokenRequest
    {
        public int UsuarioId { get; set; }
        public string Nome { get; set; } = string.Empty;
    }
}
