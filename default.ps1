properties {
    $src = "./"
    $min = "./min/"
    $out = "./out/"

    $paths = @{
        src = $src
        min = $min
        out = $out
        bootstrap = "./bower_components/bootstrap/dist/css/bootstrap.css"
        srcjs = Join-Path $src "res/js/"
        srcCss = Join-Path $src "res/css/"
        minJs = Join-Path $min "res/js/*.min.js"
        minCss = Join-Path $min "res/css/"
        concatJsDest = Join-Path $out "js.js"
        concatCssDest = Join-Path $out "style.css"
        less = Join-Path $src "res/css/*.less"
        sln = Join-Path $src "homepage.sln"   
    }
}

$global:last_watch_check = $null
function WatchFiles($path, $filter, $taskName) {
    if($action -eq $NULL) {
        $action = {
            $now =[datetime]::now
            Write-Host "$now $($eventArgs.ChangeType) file $($eventArgs.Name) [x]"
        }
    }

    if ($global:watchers -eq $null) {
      $global:watchers = @()
    }

    $w = New-Object System.IO.FileSystemWatcher
    $w.NotifyFilter =
        [System.IO.NotifyFilters]::LastWrite,
        [System.IO.NotifyFilters]::FileName
    
    $dir = pwd
    $path = Join-Path $dir $path
    $path = [System.IO.Path]::GetFullPath($path)
        
    Write-Host "Watching $path " -NoNewline -ForegroundColor Green
    if ((Get-Item $path) -is [System.IO.DirectoryInfo]) {            
        $w.Path = $path
        $w.IncludeSubdirectories = $true
        
        Write-Host "(directory)"
    }
    else {
        $w.Path = [System.IO.Path]::GetDirectoryName($path)
        $w.Filter = [System.IO.Path]::GetFileName($path)
        
        Write-Host "(file)"
    }
    
    $w.EnableRaisingEvents = $true
                
    Register-ObjectEvent -InputObject $w -EventName "Changed" -MessageData $taskName -Action ${function:WatcherCallbackAction}
    Register-ObjectEvent -InputObject $w -EventName "Created" -MessageData $taskName -Action ${function:WatcherCallbackAction}
    Register-ObjectEvent -InputObject $w -EventName "Deleted" -MessageData $taskName -Action ${function:WatcherCallbackAction}
    Register-ObjectEvent -InputObject $w -EventName "Renamed" -MessageData $taskName -Action ${function:WatcherCallbackAction}

    $global:watchers = $global:watchers + $w
}

function WatcherCallbackAction() {
    if ($global:last_watch_check -eq $null) {
        $global:last_watch_check = [datetime]::now
    }
    
    # File watcher generates multiple events depending on the editor
    # This number needs to be larger than the build time
    $watchResolutionSecs = 3
    if ([datetime]::now.subtract($global:last_watch_check) -lt [timespan]::FromSeconds($watchResolutionSecs)) {
        return
    }

    $global:last_watch_check = [datetime]::now
    Write-Host ""
    Write-Host "===="
    Write-Host "Watch triggered at " -NoNewline -ForegroundColor Cyan
    Write-Host "$($global:last_watch_check)" 
    Write-Host "$($eventArgs.ChangeType) on file $($eventArgs.Name): Executing task: $($event.MessageData)"

    Write-Host ""

    Invoke-Psake "$($event.MessageData)" 2>&1

    Write-Host "===="
}

task RemoveWatchers {
   if ($global:watchers -eq $NULL) {
      return
   }

   foreach($watcher in $global:watchers) {
      $watcher.EnableRaisingEvents = $false
  }

  $global:watchers = $NULL
}

function Create-Dir {
    param(
        [string] $dir
    )
      
    if (!(Test-Path $dir)) {
        New-Item $dir -Type Directory | Out-Null
    }
}

task Setup {
    Write-Host "Removing file watchers" -ForegroundColor Yellow
    
    Write-Host "Updating npm dependencies" -ForegroundColor Green
    npm update -g clean-css less bower
    npm update
    Write-Host "Updating bower dependencies" -ForegroundColor Green
    bower install
}

task Clean {
    Write-Host "Deleting $($paths.min)" -ForegroundColor Green
    rm -Recurse -Force $paths.min -ErrorAction Ignore
    Write-Host "Deleting $($paths.out)" -ForegroundColor Green
    rm -Recurse -Force $paths.out -ErrorAction Ignore
    Write-Host "Cleaning $($paths.sln)" -ForegroundColor Green
    msbuild /m:4 /t:clean $paths.sln
       
    Create-Dir $paths.min
    Create-Dir $paths.out
}

task Copy-Css {
    Create-Dir $paths.minCss

    Write-Host "Copying $($paths.bootstrap) to $($paths.minCss)" -ForegroundColor Green
    cp $paths.bootstrap $paths.minCss -Recurse -Force
}

task Compile-Less -depends Copy-Css {    
    foreach ($lessFile in gci $paths.less)
    {
        $outFile = $lessFile.Name.Replace(".less", ".css")
        $outPath = Join-Path $paths.minCss $outFile
        
        Write-Host "Compiling $($lessFile.FullName) into $outPath" -ForegroundColor Green
        lessc $lessFile.FullName $outPath | Write-Host
    }    
}

task Minify-Css -depends Compile-Less {
    Write-Host "Minifying $($cssFiles.Count) files to $($paths.concatCssDest)" -ForegroundColor Green
    
    $cssFiles = gci $paths.minCss | ? { $_.Extension -eq ".css" } | select -ExpandProperty FullName
    type $cssFiles | cleancss -o $paths.concatCssDest    
}

task Generate-Html {
    Write-Host "Restoring Nuget packages" -ForegroundColor Green
    nuget restore

    Write-Host "Building $($paths.sln)" -ForegroundColor Green
    msbuild /m:4 /v:m /p:Configuration=Release $paths.sln
    
    Write-Host "Generating html to $($paths.out)" -ForegroundColor Green
    .\src\homepage.Generator\bin\Release\homepage.Generator.exe
}

task Rebuild -depends Minify-Css, Generate-Html {
}

task Watch {
    WatchFiles $paths.srcCss "*.*" "Minify-Css"
    WatchFiles $paths.bootstrap "*.*" "Minify-Css"
}

task default -depends Setup, Clean, Rebuild

function Watch-Paths {
    param(
        [string[]] $watchPaths,
        [scriptblock] $command
    )
    
    foreach ($path in $watchPaths) {
        if (!(Test-Path $path)) {
            continue
        }
        
        $dir = pwd
        $path = Join-Path $dir $path
        $path = [System.IO.Path]::GetFullPath($path)
        
        $watcher = New-Object System.IO.FileSystemWatcher
        $watcher.NotifyFilter = [System.IO.NotifyFilters]::LastAccess, [System.IO.NotifyFilters]::LastWrite, [System.IO.NotifyFilters]::FileName, [System.IO.NotifyFilters]::DirectoryName
        
        
        if ((Get-Item $path) -is [System.IO.DirectoryInfo]) {            
            $watcher.Path = $path
            $watcher.IncludeSubdirectories = $true
            
            Write-Host "(directory)"
        }
        else {
            $watcher.Path = [System.IO.Path]::GetDirectoryName($path)
            $watcher.Filter = [System.IO.Path]::GetFileName($path)
            $watcher.IncludeSubdirectories = $true
            
            Write-Host "(file)"
        }
                
        Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action {Write-Host "yo"}
        
        $watcher.EnableRaisingEvents = $true
    }
}