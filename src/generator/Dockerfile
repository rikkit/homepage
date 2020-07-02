FROM mcr.microsoft.com/dotnet/core/sdk:3.1

COPY . usr/src/app/
WORKDIR usr/src/app/
# https://github.com/NuGet/Home/issues/9020
RUN dotnet restore --disable-parallel
RUN dotnet publish -c Release

FROM mcr.microsoft.com/dotnet/core/runtime:3.1
COPY --from=0 usr/src/app/bin/Release/netcoreapp3.1/publish/ /usr/src/app

WORKDIR /usr/src/app
ENTRYPOINT ["dotnet", "generator.dll"]
