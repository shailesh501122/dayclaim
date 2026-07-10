#!/usr/bin/env bash
# Wrapper to run the .NET 8 SDK via Docker (no local SDK install needed).
# Routes NuGet traffic through the sandbox's outbound proxy + CA bundle.
set -e
docker run --rm \
  --network host \
  -v "$(cd "$(dirname "$0")" && pwd)":/src \
  -v /root/.ccr/ca-bundle.crt:/etc/ssl/certs/ccr-ca-bundle.crt:ro \
  -w /src \
  -e DOTNET_CLI_TELEMETRY_OPTOUT=1 \
  -e DOTNET_NOLOGO=1 \
  -e NUGET_PACKAGES=/src/.nuget \
  -e HTTP_PROXY=http://127.0.0.1:39453 \
  -e HTTPS_PROXY=http://127.0.0.1:39453 \
  -e NO_PROXY=localhost,127.0.0.1 \
  -e SSL_CERT_FILE=/etc/ssl/certs/ccr-ca-bundle.crt \
  -e SSL_CERT_DIR=/etc/ssl/certs \
  mcr.microsoft.com/dotnet/sdk:8.0-alpine \
  dotnet "$@"
