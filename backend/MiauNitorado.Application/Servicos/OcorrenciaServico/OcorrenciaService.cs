using MiauNitorado.Application.AplicationInterfaces.Ocorrencias;
using MiauNitorado.Application.AplicationInterfaces.Repositorios.OcorrenciaRepositorios;
using MiauNitorado.Application.Consultas;
using MiauNitorado.Application.Dtos.Comum;
using MiauNitorado.Application.Dtos.OcorrenciasDtos;
using MiauNitorado.Domain.Entidades.Ocorrencias;
using MiauNitorado.Domain.Enums;
using MiauNitorado.Domain.Excecoes;
using MiauNitorado.Domain.Utilidades;

namespace MiauNitorado.Application.Servicos.OcorrenciaServico
{
    public class OcorrenciaService : IOcorrenciaService
    {
        private const int LimiteRecentesPadrao = 8;
        private const int LimiteRecentesMaximo = 50;

        private readonly IOcorrenciaRepository _ocorrenciaRepository;

        public OcorrenciaService(IOcorrenciaRepository ocorrenciaRepository)
        {
            _ocorrenciaRepository = ocorrenciaRepository;
        }

        public async Task<ResultadoPaginado<OcorrenciaResumo>> ListarAsync(FiltroOcorrencias filtro)
        {
            var consulta = MontarConsulta(filtro);

            var (itens, total) = await _ocorrenciaRepository.ListarAsync(consulta);

            var resumos = itens.Select(OcorrenciaMapper.ParaResumo).ToList();

            return ResultadoPaginado<OcorrenciaResumo>.Criar(
                resumos,
                total,
                consulta.Pagina,
                consulta.TamanhoPagina);
        }

        public async Task<IReadOnlyList<OcorrenciaResumo>> ObterRecentesAsync(int limite)
        {
            var limiteEfetivo = limite <= 0
                ? LimiteRecentesPadrao
                : Math.Min(limite, LimiteRecentesMaximo);

            var itens = await _ocorrenciaRepository.ObterRecentesAsync(limiteEfetivo);

            return itens.Select(OcorrenciaMapper.ParaResumo).ToList();
        }

        public async Task<OcorrenciaDetalhe> ObterPorIdAsync(Guid id)
        {
            var ocorrencia = await ObterOuFalharAsync(id);

            return OcorrenciaMapper.ParaDetalhe(ocorrencia);
        }

        public async Task<OcorrenciaDetalhe> CriarAsync(CriarOcorrencia request, int usuarioId)
        {
            if (!EnumTexto.TentarConverter<TipoOcorrencia>(request.Tipo, out var tipo))
                throw new RegraDeNegocioException($"Tipo inválido. Valores aceitos: {EnumTexto.Opcoes<TipoOcorrencia>()}.");

            var animal = new Animal { Id = Guid.CreateVersion7() };
            OcorrenciaMapper.AplicarEm(animal, request.Animal);

            var agora = DateTime.UtcNow;

            var ocorrencia = new Ocorrencia
            {
                Id = Guid.CreateVersion7(),
                AnimalId = animal.Id,
                Animal = animal,
                Tipo = tipo,
                Status = Ocorrencia.StatusInicialPara(tipo),
                Data = request.Data,
                Hora = ConverterHora(request.Hora),
                Localizacao = OcorrenciaMapper.ParaLocalizacao(request.Localizacao),
                Descricao = request.Descricao?.Trim() ?? string.Empty,
                InformacoesAdicionais = TextoOuNulo(request.InformacoesAdicionais),
                Contato = OcorrenciaMapper.ParaContato(request.Contato),
                UsuarioId = usuarioId,
                CriadoEm = agora,
                AtualizadoEm = agora
            };

            await _ocorrenciaRepository.CriarAsync(ocorrencia);

            return OcorrenciaMapper.ParaDetalhe(ocorrencia);
        }

        public async Task<OcorrenciaDetalhe> AtualizarAsync(Guid id, AtualizarOcorrencia request, int usuarioId)
        {
            var ocorrencia = await ObterOuFalharAsync(id);
            ocorrencia.GarantirPropriedadeDe(usuarioId);

            OcorrenciaMapper.AplicarEm(ocorrencia.Animal, request.Animal);
            OcorrenciaMapper.AplicarEm(ocorrencia.Localizacao, request.Localizacao);
            OcorrenciaMapper.AplicarEm(ocorrencia.Contato, request.Contato);

            ocorrencia.Data = request.Data;
            ocorrencia.Hora = ConverterHora(request.Hora);
            ocorrencia.Descricao = request.Descricao?.Trim() ?? string.Empty;
            ocorrencia.InformacoesAdicionais = TextoOuNulo(request.InformacoesAdicionais);
            ocorrencia.AtualizadoEm = DateTime.UtcNow;

            await _ocorrenciaRepository.AtualizarAsync(ocorrencia);

            return OcorrenciaMapper.ParaDetalhe(ocorrencia);
        }

        public async Task<OcorrenciaDetalhe> AlterarStatusAsync(Guid id, AlterarStatusOcorrencia request, int usuarioId)
        {
            if (!EnumTexto.TentarConverter<StatusOcorrencia>(request.Status, out var novoStatus))
                throw new RegraDeNegocioException($"Status inválido. Valores aceitos: {EnumTexto.Opcoes<StatusOcorrencia>()}.");

            var ocorrencia = await ObterOuFalharAsync(id);
            ocorrencia.GarantirPropriedadeDe(usuarioId);

            // A própria entidade recusa transições fora das regras.
            ocorrencia.AlterarStatus(novoStatus);
            ocorrencia.AtualizadoEm = DateTime.UtcNow;

            await _ocorrenciaRepository.AtualizarAsync(ocorrencia);

            return OcorrenciaMapper.ParaDetalhe(ocorrencia);
        }

        private async Task<Ocorrencia> ObterOuFalharAsync(Guid id)
        {
            var ocorrencia = await _ocorrenciaRepository.ObterPorIdAsync(id);

            return ocorrencia ?? throw new NaoEncontradoException("Ocorrência não encontrada.");
        }

        /// <summary>
        /// Traduz os filtros da requisição para a consulta tipada. Os valores já
        /// passaram pelo validator, então aqui só convertemos e aplicamos limites.
        /// </summary>
        private static ConsultaOcorrencias MontarConsulta(FiltroOcorrencias filtro)
        {
            var consulta = new ConsultaOcorrencias
            {
                Busca = TextoOuNulo(filtro.Busca),
                Raca = TextoOuNulo(filtro.Raca),
                Cidade = TextoOuNulo(filtro.Cidade),
                Bairro = TextoOuNulo(filtro.Bairro),
                DataInicio = filtro.DataInicio,
                DataFim = filtro.DataFim,
                Pagina = filtro.Pagina < 1 ? 1 : filtro.Pagina,
                TamanhoPagina = LimitarTamanhoPagina(filtro.TamanhoPagina)
            };

            if (EnumTexto.TentarConverter<TipoOcorrencia>(filtro.Tipo, out var tipo))
                consulta.Tipo = tipo;

            if (EnumTexto.TentarConverter<StatusOcorrencia>(filtro.Status, out var status))
                consulta.Status = status;

            if (EnumTexto.TentarConverter<OrdenacaoOcorrencias>(filtro.Ordenacao, out var ordenacao))
                consulta.Ordenacao = ordenacao;

            if (ValoresAnimal.TentarNormalizarEspecie(filtro.Especie, out var especie))
                consulta.Especie = especie;

            if (ValoresAnimal.TentarNormalizarSexo(filtro.Sexo, out var sexo))
                consulta.Sexo = sexo;

            if (ValoresAnimal.TentarNormalizarPorte(filtro.Porte, out var porte))
                consulta.Porte = porte;

            return consulta;
        }

        private static int LimitarTamanhoPagina(int tamanho)
        {
            if (tamanho < 1)
                return FiltroOcorrencias.TamanhoPaginaPadrao;

            return Math.Min(tamanho, FiltroOcorrencias.TamanhoPaginaMaximo);
        }

        /// <summary>
        /// Hora é opcional: quando não vem, a ocorrência fica registrada em 00:00.
        /// </summary>
        private static TimeOnly ConverterHora(string? hora) =>
            Horario.TentarConverter(hora, out var convertida) ? convertida : TimeOnly.MinValue;

        private static string? TextoOuNulo(string? valor) =>
            string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();



        public async Task ExcluirAsync(Guid id, int usuarioId)
        {
            var ocorrencia = await ObterOuFalharAsync(id);
            ocorrencia.GarantirPropriedadeDe(usuarioId);

            await _ocorrenciaRepository.ExcluirAsync(ocorrencia);
        }

        public async Task<IReadOnlyList<OcorrenciaResumo>> ObterMinhasAsync(int usuarioId)
        {
            var itens = await _ocorrenciaRepository.ObterPorUsuarioAsync(usuarioId);

            return itens.Select(OcorrenciaMapper.ParaResumo).ToList();
        }

        public async Task<IReadOnlyList<string>> ListarCidadesDisponiveisAsync()
        {
            return await _ocorrenciaRepository.ListarCidadesDisponiveisAsync();
        }
    }
}
