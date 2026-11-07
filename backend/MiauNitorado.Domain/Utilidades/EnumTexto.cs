using System.Globalization;

namespace MiauNitorado.Domain.Utilidades
{
    /// <summary>
    /// Conversão entre enums e os textos em minúsculas usados na API
    /// ("perdido", "whatsapp"), mantendo um só lugar para parse e formatação.
    /// </summary>
    public static class EnumTexto
    {
        public static bool TentarConverter<T>(string? valor, out T resultado) where T : struct, Enum
        {
            resultado = default;

            if (string.IsNullOrWhiteSpace(valor))
                return false;

            // Recusa valores numéricos ("1"), que o Enum.TryParse aceitaria.
            if (int.TryParse(valor, NumberStyles.Integer, CultureInfo.InvariantCulture, out _))
                return false;

            return Enum.TryParse(valor.Trim(), ignoreCase: true, out resultado)
                   && Enum.IsDefined(resultado);
        }

        public static string Formatar<T>(T valor) where T : struct, Enum =>
            valor.ToString()!.ToLowerInvariant();

        /// <summary>
        /// Lista as opções aceitas, para compor mensagens de erro. Usa
        /// camelCase para que nomes compostos fiquem legíveis ("dataAntiga");
        /// a leitura do valor é indiferente à caixa.
        /// </summary>
        public static string Opcoes<T>() where T : struct, Enum =>
            string.Join(", ", Enum.GetNames<T>().Select(CamelCase));

        private static string CamelCase(string nome) =>
            nome.Length == 0 ? nome : char.ToLowerInvariant(nome[0]) + nome[1..];

        public static bool EhValido<T>(string? valor) where T : struct, Enum =>
            TentarConverter<T>(valor, out _);
    }
}
