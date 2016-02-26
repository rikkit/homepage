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


function Copy-Css {
    Create-Dir $paths.cssDir

    cp $paths.bootstrap $paths.cssDir -Recurse -Force
    Write-Host "Copied $($paths.bootstrap) to $($paths.cssDir)" -ForegroundColor Green
}

function Setup {
    npm install -g less
    npm install -g clean-css
    npm install -g bower
    npm install
    bower install
}

function Clean {
    rm -Recurse -Force $paths.min -ErrorAction Ignore
    Write-Host "Deleted $($paths.min)" -ForegroundColor Green
    rm -Recurse -Force $paths.out -ErrorAction Ignore
    Write-Host "Deleted $($paths.out)" -ForegroundColor Green
    msbuild /m:4 /t:clean $paths.sln
    Write-Host "Cleaned $($paths.sln)" -ForegroundColor Green
       
    Create-Dir $paths.min
    Create-Dir $paths.out
}

function Compile-Less {    
    foreach ($lessFile in gci $paths.less)
    {
        $outFile = $lessFile.Name.Replace(".less", ".css")
        $outPath = Join-Path $paths.cssDir $outFile
        
        lessc $lessFile.FullName $outPath
        Write-Host "Compiled $($lessFile.FullName) into $outPath" -ForegroundColor Green
    }    
}

function Minify-Css {
    $cssFiles = gci $paths.cssDir | ? { $_.Extension -eq ".css" } | select -ExpandProperty FullName
    type $cssFiles | cleancss -o $paths.concatCssDest
    
    Write-Host "Minified $($cssFiles.Count) files to $($paths.concatCssDest)" -ForegroundColor Green
}

function Generate-Html {
    msbuild /m:4 /v:m /p:Configuration=Release $paths.sln
    Write-Host "Built $($paths.sln)" -ForegroundColor Green
    
    .\src\homepage.Generator\bin\Release\homepage.Generator.exe
    Write-Host "Generated html to $($paths.out)" -ForegroundColor Green
}
    

# MAIN

$ErrorActionPreference = "Stop"
Clean
Copy-External
Compile-Less
Minify-Css
Generate-Html

Write-Host "All done." -ForegroundColor Green