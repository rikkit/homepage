msbuild /m:4 /v:m /p:Configuration=Release ./homepage.sln

$genRoot = "./src/generator/bin/Release/netcoreapp1.0/win10-x64"

$relGitRoot = "../../../../../../"
$configJson = "$($relGitRoot)config.json";
$pageDir = "$($relGitRoot)pages";
$outDir = "$($relGitRoot)public";
$templateDir = "$($relGitRoot)res/html";

pushd $genRoot
./generator.exe $configJson $pageDir $outDir $templateDir
popd

#brunch watch --server
