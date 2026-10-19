<#
.SYNOPSIS
  把可分发的汉化包打成 zip（供 Release 使用）

.DESCRIPTION
  只打包运行所需的文件：脚本、词典、运行时补丁、文档。
  不含 backup/、scan-*.txt、out/renderer.js 等本地产物。

.EXAMPLE
  pwsh -File .\tools\pack-release.ps1
#>
param(
  [string]$Version,
  [string]$OutDir
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
if (-not $OutDir) { $OutDir = Join-Path $root 'dist' }
if (-not $Version) {
  if ($env:GITHUB_REF_NAME) { $Version = $env:GITHUB_REF_NAME.TrimStart('v') } else { $Version = 'dev' }
}

$stage = Join-Path ([System.IO.Path]::GetTempPath()) ('ghd-zh-' + [guid]::NewGuid().ToString('N'))
$payload = Join-Path $stage 'github-desktop-zh'
New-Item -ItemType Directory -Force -Path $payload | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $payload 'out') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $payload 'docs') | Out-Null

$files = @(
  '一键汉化.ps1',
  'README.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'LICENSE',
  'main-dict.tsv',
  'dict-regex.tsv'
)
foreach ($f in $files) {
  $p = Join-Path $root $f
  if (Test-Path $p) { Copy-Item $p $payload -Force }
}
Get-ChildItem $root -Filter 'dict*.tsv' -File | ForEach-Object { Copy-Item $_.FullName $payload -Force }

Copy-Item (Join-Path $root 'out\zh-cn.js') (Join-Path $payload 'out') -Force
Copy-Item (Join-Path $root 'out\zh-menu-hook.js') (Join-Path $payload 'out') -Force

$doc = Join-Path $root 'docs\教程.md'
if (Test-Path $doc) { Copy-Item $doc (Join-Path $payload 'docs') -Force }

Write-Host ('打包内容: ' + ((Get-ChildItem $payload -Recurse -File).Count) + ' 个文件')
Get-ChildItem $payload -File | ForEach-Object { Write-Host ('  - ' + $_.Name) }

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$zip = Join-Path $OutDir ('github-desktop-zh-' + $Version + '.zip')
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path $payload -DestinationPath $zip -CompressionLevel Optimal
Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ('输出: ' + $zip + '  (' + [math]::Round((Get-Item $zip).Length / 1KB, 1) + ' KB)')
