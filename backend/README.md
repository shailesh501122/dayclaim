# Ascent AR Backend

.NET 8 backend for the **AR (Account Receivables)** module of the Ascent
ARMS suite — the modernization target described in the ARMS workflow
diagram and modernization KT deck (React SPA + .NET 8 microservices,
event-driven, HIPAA-aligned). See `docs/ARCHITECTURE.md` and
`docs/SECURITY.md` for the full design.

## Quick start (Docker Compose)

```bash
cd docker
cp .env.example .env
# edit .env: set real passwords/keys (see comments in the file for how)
docker compose up -d --build
```

- API + Swagger: http://localhost:8080/swagger
- Gateway (Ocelot): http://localhost:8000/gateway/...
- RabbitMQ management UI: http://localhost:15672

In `Development` (the Compose default), the API auto-applies EF Core
migrations and seeds demo data on startup — see
`src/Ascent.AR.Infrastructure/Persistence/Seed/DevSeeder.cs`. Demo accounts,
all with password `Ascent@12345`:

| Username | Role |
|---|---|
| `admin` | SuperAdmin |
| `vikram.rao` | Supervisor |
| `priya.s`, `rahul.m` | User |

## Try it

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Ascent@12345"}' | jq -r .accessToken)

curl -s http://localhost:8080/api/v1/rule-engine/rules \
  -H "Authorization: Bearer $TOKEN" | jq
```

## Solution layout

```
src/
  Ascent.AR.Domain          entities, enums, value objects
  Ascent.AR.Application     CQRS commands/queries, validation, interfaces
  Ascent.AR.Infrastructure  EF Core/Postgres, JWT, encryption, Redis, RabbitMQ
  Ascent.AR.Api             ASP.NET Core Web API
  Ascent.AR.Gateway         Ocelot API Gateway
tests/
  Ascent.AR.UnitTests
docker/
  Dockerfile.api, Dockerfile.gateway, docker-compose.yml, .env.example
docs/
  ARCHITECTURE.md, SECURITY.md
```

## Local development without Docker

Requires the .NET 8 SDK plus a local Postgres/Redis/RabbitMQ (or point the
connection strings in `appsettings.Development.json` at your own):

```bash
dotnet build Ascent.AR.sln
dotnet run --project src/Ascent.AR.Api
```

## Adding a database migration

```bash
dotnet tool restore
dotnet tool run dotnet-ef migrations add <Name> \
  --project src/Ascent.AR.Infrastructure \
  --startup-project src/Ascent.AR.Api \
  --output-dir Persistence/Migrations
```
