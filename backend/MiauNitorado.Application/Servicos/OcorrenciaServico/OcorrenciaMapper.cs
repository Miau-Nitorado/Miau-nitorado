using MiauNitorado.Application.Dtos.OcorrenciasDtos;
using MiauNitorado.Domain.Entidades.Ocorrencias;
using MiauNitorado.Domain.Enums;
using MiauNitorado.Domain.Utilidades;

namespace MiauNitorado.Application.Servicos.OcorrenciaServico
{
    /// <summary>
    /// Conversão entre as entidades de ocorrência e os DTOs da API.
    /// Concentra também os valores padrão de campos opcionais, para que o
    /// serviço não precise repetir essas decisões.
    /// </summary>
    public static class OcorrenciaMapper
    {
        private const string NomeNaoInformado = "Sem identificação";
        private const string RacaNaoInformada = "Não informada";
        private const string IdadeNaoInformada = "Não informada";
        private const string SexoNaoInformado = "Desconhecido";

        // -------------------- Entidade -> DTO --------------------

        public static OcorrenciaResumo ParaResumo(Ocorrencia ocorrencia) => new()
        {
            Id = ocorrencia.Id,
            Animal = new AnimalResumo
            {
                Id = ocorrencia.Animal.Id,
                Nome = ocorrencia.Animal.Nome,
                Especie = ocorrencia.Animal.Especie,
                Raca = ocorrencia.Animal.Raca,
                Fotos = ParaFotos(ocorrencia.Animal.Fotos)
            },
            Tipo = EnumTexto.Formatar(ocorrencia.Tipo),
            Status = EnumTexto.Formatar(ocorrencia.Status),
            Data = ocorrencia.Data,
            Localizacao = new LocalizacaoResumo
            {
                Cidade = ocorrencia.Localizacao.Cidade,
                Bairro = ocorrencia.Localizacao.Bairro
            },
            CriadoEm = ocorrencia.CriadoEm
        };

        public static OcorrenciaDetalhe ParaDetalhe(Ocorrencia ocorrencia) => new()
        {
            Id = ocorrencia.Id,
            Animal = new AnimalDetalhe
            {
                Id = ocorrencia.Animal.Id,
                Nome = ocorrencia.Animal.Nome,
                Especie = ocorrencia.Animal.Especie,
                Raca = ocorrencia.Animal.Raca,
                Sexo = ocorrencia.Animal.Sexo,
                Idade = ocorrencia.Animal.Idade,
                Porte = ocorrencia.Animal.Porte,
                Cor = ocorrencia.Animal.Cor,
                Caracteristicas = ocorrencia.Animal.Caracteristicas,
                CaracteristicasParticulares = ocorrencia.Animal.CaracteristicasParticulares,
                PossuiColeira = ocorrencia.Animal.PossuiColeira,
                DescricaoColeira = ocorrencia.Animal.DescricaoColeira,
                PossuiMicrochip = ocorrencia.Animal.PossuiMicrochip,
                Fotos = ParaFotos(ocorrencia.Animal.Fotos)
            },
            Tipo = EnumTexto.Formatar(ocorrencia.Tipo),
            Status = EnumTexto.Formatar(ocorrencia.Status),
            Data = ocorrencia.Data,
            Hora = Horario.Formatar(ocorrencia.Hora),
            Localizacao = new LocalizacaoDto
            {
                Cidade = ocorrencia.Localizacao.Cidade,
                Bairro = ocorrencia.Localizacao.Bairro,
                Referencia = ocorrencia.Localizacao.Referencia
            },
            Descricao = ocorrencia.Descricao,
            InformacoesAdicionais = ocorrencia.InformacoesAdicionais,
            Contato = new ContatoDto
            {
                Nome = ocorrencia.Contato.Nome,
                Telefone = ocorrencia.Contato.Telefone,
                Email = ocorrencia.Contato.Email,
                MetodoPreferido = EnumTexto.Formatar(ocorrencia.Contato.MetodoPreferido)
            },
            UsuarioId = ocorrencia.UsuarioId,
            CriadoEm = ocorrencia.CriadoEm,
            AtualizadoEm = ocorrencia.AtualizadoEm
        };

        private static List<FotoDto> ParaFotos(IEnumerable<Foto> fotos) =>
            fotos.OrderBy(f => f.Ordem)
                 .Select(f => new FotoDto { Id = f.Id, Url = f.Url, Alt = f.Alt })
                 .ToList();

        // -------------------- DTO -> Entidade --------------------

        /// <summary>
        /// Aplica os dados do animal na entidade, preenchendo os opcionais que
        /// vieram em branco e normalizando espécie, sexo e porte.
        /// </summary>
        public static void AplicarEm(Animal destino, AnimalRequest origem)
        {
            destino.Nome = TextoOuPadrao(origem.Nome, NomeNaoInformado);
            destino.Especie = NormalizarEspecie(origem.Especie);
            destino.Raca = TextoOuPadrao(origem.Raca, RacaNaoInformada);
            destino.Sexo = NormalizarSexo(origem.Sexo);
            destino.Idade = TextoOuPadrao(origem.Idade, IdadeNaoInformada);
            destino.Porte = NormalizarPorte(origem.Porte);
            destino.Cor = origem.Cor.Trim();
            destino.Caracteristicas = origem.Caracteristicas.Trim();
            destino.CaracteristicasParticulares = origem.CaracteristicasParticulares?.Trim() ?? string.Empty;
            destino.PossuiMicrochip = origem.PossuiMicrochip;
            destino.PossuiColeira = origem.PossuiColeira;

            // Sem coleira não faz sentido guardar a descrição dela.
            destino.DescricaoColeira = origem.PossuiColeira
                ? TextoOuNulo(origem.DescricaoColeira)
                : null;

            AplicarFotos(destino, origem.Fotos);
        }

        /// <summary>
        /// Substitui a galeria pela lista recebida, preservando a ordem enviada.
        /// Numa atualização as fotos antigas são removidas e as novas entram
        /// com ids próprios.
        /// </summary>
        /// <remarks>
        /// O id e o AnimalId são deixados em branco de propósito: quem gera a
        /// chave é o banco. Preencher a chave aqui faria o rastreador do EF
        /// tratar a foto nova como registro existente e emitir UPDATE no lugar
        /// de INSERT.
        /// </remarks>
        private static void AplicarFotos(Animal destino, List<FotoRequest> fotos)
        {
            destino.Fotos.Clear();

            for (var i = 0; i < fotos.Count; i++)
            {
                var foto = fotos[i];

                destino.Fotos.Add(new Foto
                {
                    Url = foto.Url.Trim(),
                    Alt = TextoOuPadrao(foto.Alt, $"Foto de {destino.Nome}"),
                    Ordem = i
                });
            }
        }

        public static Localizacao ParaLocalizacao(LocalizacaoRequest origem)
        {
            var localizacao = new Localizacao();
            AplicarEm(localizacao, origem);
            return localizacao;
        }

        public static Contato ParaContato(ContatoRequest origem)
        {
            var contato = new Contato();
            AplicarEm(contato, origem);
            return contato;
        }

        /// <summary>
        /// Localização e contato são tipos owned do EF. Numa atualização, mexer
        /// na instância já rastreada é mais seguro do que substituí-la.
        /// </summary>
        public static void AplicarEm(Localizacao destino, LocalizacaoRequest origem)
        {
            destino.Cidade = origem.Cidade.Trim();
            destino.Bairro = origem.Bairro.Trim();
            destino.Referencia = TextoOuNulo(origem.Referencia);
        }

        public static void AplicarEm(Contato destino, ContatoRequest origem)
        {
            EnumTexto.TentarConverter<MetodoContato>(origem.MetodoPreferido, out var metodo);

            destino.Nome = origem.Nome.Trim();
            destino.Telefone = origem.Telefone.Trim();
            destino.Email = TextoOuNulo(origem.Email);
            destino.MetodoPreferido = metodo;
        }

        private static string NormalizarEspecie(string valor) =>
            ValoresAnimal.TentarNormalizarEspecie(valor, out var canonico) ? canonico : valor.Trim();

        private static string NormalizarSexo(string? valor) =>
            ValoresAnimal.TentarNormalizarSexo(valor, out var canonico) ? canonico : SexoNaoInformado;

        private static string NormalizarPorte(string valor) =>
            ValoresAnimal.TentarNormalizarPorte(valor, out var canonico) ? canonico : valor.Trim();

        private static string TextoOuPadrao(string? valor, string padrao) =>
            string.IsNullOrWhiteSpace(valor) ? padrao : valor.Trim();

        private static string? TextoOuNulo(string? valor) =>
            string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();
    }
}
