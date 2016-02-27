$paths = @{
    src = "./"
	min = "./min/"
	out = "./out/"
	bootstrap = "./bower_components/bootstrap/dist/css/bootstrap.css"
}

$paths.js = Join-Path $paths.src "res/js/*.js"
$paths.css = Join-Path $paths.src "res/css/*.css"
$paths.minJs = Join-Path $paths.min "res/js/*.min.js"
$paths.cssDir = Join-Path $paths.min "res/css/"
$paths.concatJsDest = Join-Path $paths.out "js.js"
$paths.concatCssDest = Join-Path $paths.out "style.css"
$paths.less = Join-Path $paths.src "res/css/*.less"
$paths.lestDest = $paths.cssDir
$paths.sln = Join-Path $paths.src "homepage.sln"

function Create-Dir {
    param(
        [string] $dir
    )
      
    if (!(Test-Path $dir)) {
        New-Item $dir -Type Directory | Out-Null
    }
}

function Setup {
    npm update -g clean-css less bower
    npm update
    bower install
}

function Clean {
    Write-Host "Deleting $($paths.min)" -ForegroundColor Green
    rm -Recurse -Force $paths.min -ErrorAction Ignore
    Write-Host "Deleting $($paths.out)" -ForegroundColor Green
    rm -Recurse -Force $paths.out -ErrorAction Ignore
    Write-Host "Cleaning $($paths.sln)" -ForegroundColor Green
    msbuild /m:4 /t:clean $paths.sln
       
    Create-Dir $paths.min
    Create-Dir $paths.out
}

function Copy-Css {
    Create-Dir $paths.cssDir

    Write-Host "Copying $($paths.bootstrap) to $($paths.cssDir)" -ForegroundColor Green
    cp $paths.bootstrap $paths.cssDir -Recurse -Force
}

function Compile-Less {    
    foreach ($lessFile in gci $paths.less)
    {
        $outFile = $lessFile.Name.Replace(".less", ".css")
        $outPath = Join-Path $paths.cssDir $outFile
        
        Write-Host "Compiling $($lessFile.FullName) into $outPath" -ForegroundColor Green
        lessc $lessFile.FullName $outPath
    }    
}

function Minify-Css {
    Write-Host "Minifying $($cssFiles.Count) files to $($paths.concatCssDest)" -ForegroundColor Green
    
    $cssFiles = gci $paths.cssDir | ? { $_.Extension -eq ".css" } | select -ExpandProperty FullName
    type $cssFiles | cleancss -o $paths.concatCssDest    
}

function Generate-Html {
    Write-Host "Restoring Nuget packages" -ForegroundColor Green
    nuget restore

    Write-Host "Building $($paths.sln)" -ForegroundColor Green
    msbuild /m:4 /v:m /p:Configuration=Release $paths.sln
    
    Write-Host "Generating html to $($paths.out)" -ForegroundColor Green
    .\src\homepage.Generator\bin\Release\homepage.Generator.exe
}

# MAIN

$ErrorActionPreference = "Stop"

Setup
Clean
Copy-Css
Compile-Less
Minify-Css
Generate-Html