msbuild /m:4 /v:m /p:Configuration=Release ./homepage.sln

$genRoot = "./src/homepage.Generator/bin/Release"
rmdir -force -recurse "$($genRoot)/pages"
cp -force -recurse "./pages/" "$($genRoot)/"
pushd $genRoot
./homepage.Generator.exe
popd
cp -r "$($genRoot)/out/*" "./public/"

brunch watch --server
