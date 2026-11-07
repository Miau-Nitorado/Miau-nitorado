using MiauNitorado.Application.AplicationInterfaces.Autenticacao;
using MiauNitorado.Application.AplicationInterfaces.Ocorrencias;
using MiauNitorado.Application.AplicationInterfaces.Repositorios.OcorrenciaRepositorios;
using MiauNitorado.Application.AplicationInterfaces.Repositorios.UsuarioRepositorios;
using MiauNitorado.Application.AplicationInterfaces.Usuarios;
using MiauNitorado.Application.Servicos.AutenticacaoServico;
using MiauNitorado.Application.Servicos.OcorrenciaServico;
using MiauNitorado.Application.Servicos.UsuarioServico;
using MiauNitorado.Infrastructure.AuthService;
using MiauNitorado.Infrastructure.Data.AppDBsContext;
using MiauNitorado.Infrastructure.Repositorios.OcorrenciaRepositorio;
using MiauNitorado.Infrastructure.Repositorios.UsuarioRepositorio;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MiauNitorado.Infrastructure.Data.DependencyInjections
{
    public static class InfrastructureExtension
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // DbContext
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            // Services
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAuthService, UsuarioAuthService>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IOcorrenciaService, OcorrenciaService>();

            // Repositories
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IOcorrenciaRepository, OcorrenciaRepository>();

            return services;
        }
    }
}


