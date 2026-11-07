namespace MiauNitorado.Domain.Utilidades
{
    /// <summary>
    /// Vocabulário fechado das características do animal. Valores chegam da
    /// API em qualquer caixa e são gravados na forma canônica, para que os
    /// filtros da listagem casem de forma previsível.
    /// </summary>
    public static class ValoresAnimal
    {
        public static readonly string[] Especies = ["Cachorro", "Gato", "Pássaro", "Coelho", "Outro"];
        public static readonly string[] Sexos = ["Macho", "Fêmea", "Desconhecido"];
        public static readonly string[] Portes = ["Pequeno", "Médio", "Grande"];

        public static bool TentarNormalizarEspecie(string? valor, out string canonico) =>
            TentarNormalizar(Especies, valor, out canonico);

        public static bool TentarNormalizarSexo(string? valor, out string canonico) =>
            TentarNormalizar(Sexos, valor, out canonico);

        public static bool TentarNormalizarPorte(string? valor, out string canonico) =>
            TentarNormalizar(Portes, valor, out canonico);

        public static string OpcoesEspecie => string.Join(", ", Especies);
        public static string OpcoesSexo => string.Join(", ", Sexos);
        public static string OpcoesPorte => string.Join(", ", Portes);

        private static bool TentarNormalizar(string[] aceitos, string? valor, out string canonico)
        {
            canonico = string.Empty;

            if (string.IsNullOrWhiteSpace(valor))
                return false;

            var encontrado = aceitos.FirstOrDefault(
                a => string.Equals(a, valor.Trim(), StringComparison.OrdinalIgnoreCase));

            if (encontrado == null)
                return false;

            canonico = encontrado;
            return true;
        }
    }
}
