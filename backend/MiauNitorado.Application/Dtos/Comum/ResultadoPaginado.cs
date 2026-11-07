namespace MiauNitorado.Application.Dtos.Comum
{
    /// <summary>
    /// Envelope padrão das listagens paginadas.
    /// </summary>
    public class ResultadoPaginado<T>
    {
        public IReadOnlyList<T> Items { get; set; } = [];
        public int Total { get; set; }
        public int Pagina { get; set; }
        public int TamanhoPagina { get; set; }
        public int TotalPaginas { get; set; }

        public static ResultadoPaginado<T> Criar(IReadOnlyList<T> items, int total, int pagina, int tamanhoPagina)
        {
            return new ResultadoPaginado<T>
            {
                Items = items,
                Total = total,
                Pagina = pagina,
                TamanhoPagina = tamanhoPagina,
                TotalPaginas = tamanhoPagina <= 0 ? 0 : (int)Math.Ceiling(total / (double)tamanhoPagina)
            };
        }
    }
}
