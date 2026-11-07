using MiauNitorado.Application.AplicationInterfaces.Repositorios.OcorrenciaRepositorios;
using MiauNitorado.Application.Consultas;
using MiauNitorado.Domain.Entidades.Ocorrencias;
using MiauNitorado.Domain.Utilidades;
using MiauNitorado.Infrastructure.Data.AppDBsContext;
using Microsoft.EntityFrameworkCore;

namespace MiauNitorado.Infrastructure.Repositorios.OcorrenciaRepositorio
{
    public class OcorrenciaRepository : IOcorrenciaRepository
    {
        private readonly AppDbContext _context;

        public OcorrenciaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(IReadOnlyList<Ocorrencia> Itens, int Total)> ListarAsync(ConsultaOcorrencias consulta)
        {
            var query = ComAnimalEFotos(_context.Ocorrencias.AsNoTracking());

            query = AplicarFiltros(query, consulta);

            // Conta antes de paginar, para montar o total de páginas.
            var total = await query.CountAsync();

            var itens = await AplicarOrdenacao(query, consulta.Ordenacao)
                .Skip((consulta.Pagina - 1) * consulta.TamanhoPagina)
                .Take(consulta.TamanhoPagina)
                .ToListAsync();

            return (itens, total);
        }

        public async Task<IReadOnlyList<Ocorrencia>> ObterRecentesAsync(int limite)
        {
            return await ComAnimalEFotos(_context.Ocorrencias.AsNoTracking())
                .OrderByDescending(o => o.CriadoEm)
                .ThenByDescending(o => o.Id)
                .Take(limite)
                .ToListAsync();
        }

        /// <summary>
        /// Retorna a ocorrência rastreada pelo contexto, para que o serviço
        /// possa alterá-la e persistir com AtualizarAsync.
        /// </summary>
        public async Task<Ocorrencia?> ObterPorIdAsync(Guid id)
        {
            return await ComAnimalEFotos(_context.Ocorrencias)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Ocorrencia> CriarAsync(Ocorrencia ocorrencia)
        {
            _context.Ocorrencias.Add(ocorrencia);
            await _context.SaveChangesAsync();
            return ocorrencia;
        }

        public async Task<Ocorrencia> AtualizarAsync(Ocorrencia ocorrencia)
        {
            await _context.SaveChangesAsync();
            return ocorrencia;
        }

        private static IQueryable<Ocorrencia> ComAnimalEFotos(IQueryable<Ocorrencia> query) =>
            query.Include(o => o.Animal)
                 .ThenInclude(a => a.Fotos);

        private static IQueryable<Ocorrencia> AplicarFiltros(
            IQueryable<Ocorrencia> query,
            ConsultaOcorrencias consulta)
        {
            if (consulta.Tipo.HasValue)
                query = query.Where(o => o.Tipo == consulta.Tipo.Value);

            if (consulta.Status.HasValue)
                query = query.Where(o => o.Status == consulta.Status.Value);

            // Espécie, sexo e porte chegam na forma canônica: comparação exata.
            if (!string.IsNullOrWhiteSpace(consulta.Especie))
                query = query.Where(o => o.Animal.Especie == consulta.Especie);

            if (!string.IsNullOrWhiteSpace(consulta.Sexo))
                query = query.Where(o => o.Animal.Sexo == consulta.Sexo);

            if (!string.IsNullOrWhiteSpace(consulta.Porte))
                query = query.Where(o => o.Animal.Porte == consulta.Porte);

            // Campos de texto livre: contém, ignorando caixa e acentuação de caixa.
            if (!string.IsNullOrWhiteSpace(consulta.Raca))
            {
                var raca = Contendo(consulta.Raca);
                query = query.Where(o => EF.Functions.ILike(o.Animal.Raca, raca));
            }

            if (!string.IsNullOrWhiteSpace(consulta.Cidade))
            {
                var cidade = Contendo(consulta.Cidade);
                query = query.Where(o => EF.Functions.ILike(o.Localizacao.Cidade, cidade));
            }

            if (!string.IsNullOrWhiteSpace(consulta.Bairro))
            {
                var bairro = Contendo(consulta.Bairro);
                query = query.Where(o => EF.Functions.ILike(o.Localizacao.Bairro, bairro));
            }

            if (!string.IsNullOrWhiteSpace(consulta.Busca))
            {
                var busca = Contendo(consulta.Busca);

                query = query.Where(o =>
                    EF.Functions.ILike(o.Animal.Nome, busca) ||
                    EF.Functions.ILike(o.Animal.Raca, busca) ||
                    EF.Functions.ILike(o.Animal.Especie, busca) ||
                    EF.Functions.ILike(o.Animal.Cor, busca) ||
                    EF.Functions.ILike(o.Animal.Caracteristicas, busca) ||
                    EF.Functions.ILike(o.Animal.CaracteristicasParticulares, busca) ||
                    EF.Functions.ILike(o.Localizacao.Cidade, busca) ||
                    EF.Functions.ILike(o.Localizacao.Bairro, busca) ||
                    EF.Functions.ILike(o.Descricao, busca));
            }

            if (consulta.DataInicio.HasValue)
                query = query.Where(o => o.Data >= consulta.DataInicio.Value);

            if (consulta.DataFim.HasValue)
                query = query.Where(o => o.Data <= consulta.DataFim.Value);

            return query;
        }

        /// <summary>
        /// O desempate por Id mantém a paginação estável quando duas
        /// ocorrências têm a mesma data.
        /// </summary>
        private static IQueryable<Ocorrencia> AplicarOrdenacao(
            IQueryable<Ocorrencia> query,
            OrdenacaoOcorrencias ordenacao) => ordenacao switch
            {
                OrdenacaoOcorrencias.Antigas =>
                    query.OrderBy(o => o.CriadoEm).ThenBy(o => o.Id),

                OrdenacaoOcorrencias.Data =>
                    query.OrderByDescending(o => o.Data)
                         .ThenByDescending(o => o.Hora)
                         .ThenByDescending(o => o.Id),

                OrdenacaoOcorrencias.DataAntiga =>
                    query.OrderBy(o => o.Data)
                         .ThenBy(o => o.Hora)
                         .ThenBy(o => o.Id),

                _ => query.OrderByDescending(o => o.CriadoEm).ThenByDescending(o => o.Id)
            };

        /// <summary>
        /// Monta o padrão do ILIKE neutralizando os curingas do próprio LIKE,
        /// para que um termo com % ou _ seja buscado literalmente.
        /// </summary>
        private static string Contendo(string termo)
        {
            var escapado = termo.Trim()
                .Replace("\\", "\\\\")
                .Replace("%", "\\%")
                .Replace("_", "\\_");

            return $"%{escapado}%";
        }
    }
}
