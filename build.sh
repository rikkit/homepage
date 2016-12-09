#!/bin/bash

dotnet restore --configfile "NuGet.config"
dotnet build **/project.json -c Release

genRoot="./src/generator/bin/Release/netcoreapp1.0/ubuntu.14.04-x64"

relGitRoot="../../../../../../"
configJson="${relGitRoot}config.json";
pageDir="${relGitRoot}pages";
outDir="${relGitRoot}public";
templateDir="${relGitRoot}res/html";

pushd "$genRoot"
./generator "$configJson" "$pageDir" "$outDir" "$templateDir"
popd