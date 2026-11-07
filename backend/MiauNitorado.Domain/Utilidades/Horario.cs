using System.Globalization;

namespace MiauNitorado.Domain.Utilidades
{
    /// <summary>
    /// A API troca horas como texto "HH:mm" — o mesmo formato que o
    /// input de hora do front produz.
    /// </summary>
    public static class Horario
    {
        private const string FormatoPadrao = "HH:mm";

        private static readonly string[] FormatosAceitos = [FormatoPadrao, "HH:mm:ss"];

        public static bool TentarConverter(string? valor, out TimeOnly hora)
        {
            hora = default;

            if (string.IsNullOrWhiteSpace(valor))
                return false;

            return TimeOnly.TryParseExact(
                valor.Trim(),
                FormatosAceitos,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out hora);
        }

        public static string Formatar(TimeOnly hora) =>
            hora.ToString(FormatoPadrao, CultureInfo.InvariantCulture);

        public static bool EhValido(string? valor) => TentarConverter(valor, out _);
    }
}
