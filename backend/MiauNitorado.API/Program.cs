using MiauNitorado.API.Middlewares;
using MiauNitorado.Application.Validador.FluentValidatorExtensions;
using MiauNitorado.Infrastructure.Data.AppDBsContext;
using MiauNitorado.Infrastructure.Data.DependencyInjections;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {

        var securitySchemes = new Dictionary<string, IOpenApiSecurityScheme>
        {
            [JwtBearerDefaults.AuthenticationScheme] = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.ApiKey,
                Description = "Adicione Token de Autenticação aqui",
                Name = HeaderNames.Authorization,
                Scheme = JwtBearerDefaults.AuthenticationScheme,
                In = ParameterLocation.Header,
                BearerFormat = "JWT"
            }
        };
        document.Components ??= new();
        document.Components.SecuritySchemes = securitySchemes;

        foreach (var operation in document.Paths.Values.SelectMany(path => path.Operations ?? []))
        {
            operation.Value.Security ??= [];
            operation.Value.Security.Add(new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference(JwtBearerDefaults.AuthenticationScheme, document)] = []
            });
        }
        return Task.CompletedTask;
    });
});

builder.Services.AddFluentValidationConfig();

builder.Services.AddInfrastructure(builder.Configuration);

var jwtSecret = builder.Configuration["Jwt:Secret"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaCors", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("auth", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(15);
        opt.PermitLimit = 10;
        opt.QueueLimit = 0;
    });
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "MiauNitorado API");
        options.RoutePrefix = "swagger";
        options.DocumentTitle = "MiauNitorado API Documentation";
    });
}

app.UseCors("PoliticaCors");

// Em Development o Vite consome a API via proxy HTTP, por isso o redirect
// de HTTPS vale apenas fora de desenvolvimento.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Serve o front-end: o build do Vite é publicado em wwwroot.
app.UseDefaultFiles();

app.UseStaticFiles();

app.UseRateLimiter();

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    await next();
});

app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

// Fallback da SPA: rotas do React Router devolvem o index.html,
// enquanto rotas /api inexistentes continuam retornando 404 em JSON.
var webRoot = app.Environment.WebRootPath
              ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");

app.MapFallback(async context =>
{
    if (context.Request.Path.StartsWithSegments("/api"))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        await context.Response.WriteAsJsonAsync(new
        {
            statusCode = StatusCodes.Status404NotFound,
            message = "Endpoint não encontrado"
        });
        return;
    }

    var indexHtml = Path.Combine(webRoot, "index.html");

    if (!File.Exists(indexHtml))
    {
        context.Response.StatusCode = StatusCodes.Status404NotFound;
        await context.Response.WriteAsJsonAsync(new
        {
            statusCode = StatusCodes.Status404NotFound,
            message = "Front-end não publicado em wwwroot. Rode 'npm run build' na raiz do repositório."
        });
        return;
    }

    context.Response.ContentType = "text/html";
    await context.Response.SendFileAsync(indexHtml);
});

app.Run();
