# homepage

This is the source for [rikk.it](http://rikk.it). The site is built using JQuery/TypeScript and a static site generator written in C#.

# Setup (PowerShell/ Windows)

```
# first install npm and MSBuild for C# 6

Set-Alias msbuild "C:\Program Files (x86)\MSBuild\14.0\Bin\MSBuild.exe"

npm install -g brunch
npm install -g typings
npm install
typings install
nuget restore

./build.ps1
```

# Licence

Code is licensed under MIT.