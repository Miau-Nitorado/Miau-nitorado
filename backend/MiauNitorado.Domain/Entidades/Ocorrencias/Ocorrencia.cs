using MiauNitorado.Domain.Entidades.Usuarios;
using MiauNitorado.Domain.Enums;
using MiauNitorado.Domain.Excecoes;

namespace MiauNitorado.Domain.Entidades.Ocorrencias
{
    public class Ocorrencia
    {
        public Guid Id { get; set; }

        public Guid AnimalId { get; set; }
        public Animal Animal { get; set; } = null!;

        public TipoOcorrencia Tipo { get; set; }
        public StatusOcorrencia Status { get; set; }

        /// <summary>Data em que o animal foi perdido ou encontrado.</summary>
        public DateOnly Data { get; set; }

        /// <summary>Hora aproximada do ocorrido.</summary>
        public TimeOnly Hora { get; set; }

        public Localizacao Localizacao { get; set; } = new();

        public string Descricao { get; set; } = string.Empty;
        public string? InformacoesAdicionais { get; set; }

        public Contato Contato { get; set; } = new();

        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        public DateTime CriadoEm { get; set; }
        public DateTime AtualizadoEm { get; set; }

        /// <summary>
        /// Transições de status aceitas. Uma publicação nasce refletindo o tipo
        /// (perdido/encontrado) e só avança para desfecho: não há como voltar
        /// para o estado inicial, e "encerrado" é terminal.
        /// </summary>
        private static readonly Dictionary<StatusOcorrencia, StatusOcorrencia[]> TransicoesPermitidas = new()
        {
            [StatusOcorrencia.Perdido] = [StatusOcorrencia.Localizado, StatusOcorrencia.Encerrado],
            [StatusOcorrencia.Encontrado] = [StatusOcorrencia.Localizado, StatusOcorrencia.Encerrado],
            [StatusOcorrencia.Localizado] = [StatusOcorrencia.Encerrado],
            [StatusOcorrencia.Encerrado] = []
        };

        /// <summary>
        /// Status com que uma ocorrência é criada, derivado do tipo.
        /// </summary>
        public static StatusOcorrencia StatusInicialPara(TipoOcorrencia tipo) => tipo switch
        {
            TipoOcorrencia.Perdido => StatusOcorrencia.Perdido,
            TipoOcorrencia.Encontrado => StatusOcorrencia.Encontrado,
            _ => throw new RegraDeNegocioException("Tipo de ocorrência não suportado.")
        };

        public static IReadOnlyCollection<StatusOcorrencia> TransicoesPossiveisDe(StatusOcorrencia status) =>
            TransicoesPermitidas.TryGetValue(status, out var destinos) ? destinos : [];

        public bool PodeAlterarStatusPara(StatusOcorrencia novoStatus) =>
            TransicoesPossiveisDe(Status).Contains(novoStatus);

        /// <summary>
        /// Aplica o novo status, recusando transições fora das regras.
        /// </summary>
        public void AlterarStatus(StatusOcorrencia novoStatus)
        {
            if (novoStatus == Status)
                throw new RegraDeNegocioException($"A ocorrência já está com o status '{Formatar(Status)}'.");

            if (!PodeAlterarStatusPara(novoStatus))
            {
                var destinos = TransicoesPossiveisDe(Status);

                var permitidos = destinos.Count == 0
                    ? "nenhum — este status é final"
                    : string.Join(", ", destinos.Select(Formatar));

                throw new RegraDeNegocioException(
                    $"Não é possível mudar o status de '{Formatar(Status)}' para '{Formatar(novoStatus)}'. " +
                    $"Transições permitidas: {permitidos}.");
            }

            Status = novoStatus;
        }

        /// <summary>
        /// Recusa a operação quando quem está autenticado não é o autor.
        /// </summary>
        public void GarantirPropriedadeDe(int usuarioId)
        {
            if (UsuarioId != usuarioId)
                throw new AcessoNegadoException("Somente o autor da publicação pode alterá-la.");
        }

        private static string Formatar(StatusOcorrencia status) => status.ToString().ToLowerInvariant();
    }
}
