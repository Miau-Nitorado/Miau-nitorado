using System.Net;
using FluentValidation;
using MiauNitorado.Domain.Excecoes;

namespace MiauNitorado.API.Middlewares
{
    public class GlobalExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

        public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (ValidationException ex)
            {
                _logger.LogWarning(ex, "Erro de validação");
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                context.Response.ContentType = "application/json";

                var errors = ex.Errors.Select(e => new
                {
                    property = e.PropertyName,
                    message = e.ErrorMessage
                });

                await context.Response.WriteAsJsonAsync(new
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    message = "Erro de validação",
                    errors = errors
                });
            }
            catch (NaoEncontradoException ex)
            {
                await ResponderAsync(context, StatusCodes.Status404NotFound, ex.Message);
            }
            catch (AcessoNegadoException ex)
            {
                _logger.LogWarning(ex, "Acesso negado a recurso de outro usuário");
                await ResponderAsync(context, StatusCodes.Status403Forbidden, ex.Message);
            }
            catch (RegraDeNegocioException ex)
            {
                _logger.LogInformation(ex, "Operação recusada por regra de negócio");
                await ResponderAsync(context, StatusCodes.Status400BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro não tratado");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                await context.Response.WriteAsJsonAsync(new
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    message = "Erro interno do servidor"
                });
            }
        }

        /// <summary>
        /// Resposta de erro no mesmo formato usado pelo restante da API.
        /// </summary>
        private static async Task ResponderAsync(HttpContext context, int statusCode, string message)
        {
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                statusCode,
                message
            });
        }
    }
}
