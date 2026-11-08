# Build do frontend React/Vite
FROM node:22-alpine AS frontend-build
WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Publicação do backend ASP.NET Core com os arquivos do frontend em wwwroot
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS publish
WORKDIR /src

COPY . .
COPY --from=frontend-build /src/backend/MiauNitorado.API/wwwroot ./backend/MiauNitorado.API/wwwroot

RUN dotnet publish backend/MiauNitorado.API/MiauNitorado.API.csproj \
    --configuration Release \
    --output /app/publish \
    /p:UseAppHost=false

# Imagem final: somente runtime do ASP.NET Core
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

# O Railway injeta PORT. O fallback 8080 permite executar localmente.
ENTRYPOINT ["sh", "-c", "dotnet MiauNitorado.API.dll --urls http://0.0.0.0:${PORT:-8080}"]
