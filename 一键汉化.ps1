<#
.SYNOPSIS
  GitHub Desktop 简体中文汉化工具（通用版）

.DESCRIPTION
  纯 PowerShell 实现，无需 Node.js / 无需联网，适用于任意 app-* 版本的 GitHub Desktop。
  三层汉化：打包层整串替换 -> 模板层正则替换 -> 运行时兜底（DOM + 原生菜单钩子）。
  全程可逆：原始文件按版本备份在 backup\app-x.y.z\。

.PARAMETER All
  处理所有已安装版本（默认只处理版本号最高的一个）

.PARAMETER AppDir
  手动指定 resources\app 目录

.PARAMETER Restore
  还原英文原版

.PARAMETER DryRun
  只统计命中情况，不写入文件

.PARAMETER Scan
  扫描仍未被词典覆盖的英文界面文案，输出 scan-<版本>.txt

.PARAMETER Help
  显示帮助
#>
param(
  [switch]$All,
  [string]$AppDir,
  [switch]$Restore,
  [switch]$DryRun,
  [switch]$Scan,
  [switch]$Help
)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Join-Path $env:LOCALAPPDATA 'GitHubDesktop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$utf8bom = New-Object System.Text.UTF8Encoding($true)

function Say([string]$t) { Write-Host $t }
function Step([string]$t) { Write-Host "  $t" }
function Title([string]$t) { Write-Host ""; Write-Host "== $t ==" }

if ($Help) {
  Get-Help $PSCommandPath -Detailed
  return
}

function Get-VersionDirs {
  $dirs = Get-ChildItem $root -Directory -Filter 'app-*' -ErrorAction SilentlyContinue
  if (-not $dirs) { throw "未找到版本目录: $root" }
  return $dirs | Sort-Object {
    $v = $_.Name -replace '^app-', ''
    try { [version]$v } catch { [version]'0.0.0' }
  } -Descending
}

function Resolve-TargetApp {
  param([string]$explicit)
  if ($explicit) {
    if (-not (Test-Path $explicit)) { throw "目录不存在: $explicit" }
    return @((Resolve-Path $explicit).Path)
  }
  $dirs = Get-VersionDirs
  if ($All) { return @($dirs | ForEach-Object { Join-Path $_.FullName 'resources\app' }) }
  return @((Join-Path $dirs[0].FullName 'resources\app'))
}

function Get-VersionName([string]$app) {
  return (Split-Path (Split-Path (Split-Path $app -Parent) -Parent) -Leaf)
}

function Stop-App {
  $p = Get-Process -Name GitHubDesktop -ErrorAction SilentlyContinue
  if ($p) {
    $p | ForEach-Object { try { $_.Kill() } catch {} }
    Start-Sleep -Milliseconds 1200
    Get-Process -Name GitHubDesktop -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 400
    Step "已结束运行中的 GitHub Desktop"
  }
}

function Read-Dict([string]$path) {
  $d = @{}
  if (-not (Test-Path $path)) { return $d }
  foreach ($line in [System.IO.File]::ReadAllLines($path, [System.Text.Encoding]::UTF8)) {
    if (-not $line -or -not $line.Trim()) { continue }
    $i = $line.IndexOf([char]9)
    if ($i -lt 1) { continue }
    $en = $line.Substring(0, $i)
    $zh = $line.Substring($i + 1)
    if ($en -and $zh -and $en -ne $zh) { $d[$en] = $zh }
  }
  return $d
}

function Merge-Dicts([string[]]$files) {
  $all = @{}
  foreach ($f in $files) {
    $d = Read-Dict (Join-Path $here $f)
    foreach ($k in $d.Keys) { $all[$k] = $d[$k] }
  }
  return $all
}

function Read-RegexDict([string]$path) {
  $list = @()
  if (-not (Test-Path $path)) { return $list }
  foreach ($line in [System.IO.File]::ReadAllLines($path, [System.Text.Encoding]::UTF8)) {
    if (-not $line -or -not $line.Trim()) { continue }
    $i = $line.IndexOf([char]9)
    if ($i -lt 1) { continue }
    $list += ,@($line.Substring(0, $i), $line.Substring($i + 1))
  }
  return $list
}

function Invoke-WholeReplace {
  param([string]$Source, [hashtable]$Dict, [ref]$Hit, [ref]$Cnt)
  $src = $Source
  $quotes = @([string][char]34, [string][char]39, [string][char]96)
  foreach ($p in ($Dict.GetEnumerator() | Sort-Object { $_.Key.Length } -Descending)) {
    $en = $p.Key
    $zh = $p.Value
    $n = 0
    foreach ($q in $quotes) {
      if ($en -notmatch '\s$') {
        $withSpace = $q + $en + ' ' + $q
        if ($src.IndexOf($withSpace, [System.StringComparison]::Ordinal) -ge 0) {
          $src = $src.Replace($withSpace, $q + $zh + ' ' + $q)
          $n++
        }
      }
      $exact = $q + $en + $q
      if ($src.IndexOf($exact, [System.StringComparison]::Ordinal) -ge 0) {
        $src = $src.Replace($exact, $q + $zh + $q)
        $n++
      }
    }
    if ($n -gt 0) { $Hit.Value++; $Cnt.Value += $n }
  }
  return $src
}

function Invoke-RegexReplace {
  param([string]$Source, $Rules, [ref]$Cnt)
  $src = $Source
  foreach ($r in $Rules) {
    $m = [regex]::Matches($src, $r[0])
    if ($m.Count -gt 0) {
      $src = [regex]::Replace($src, $r[0], $r[1])
      $Cnt.Value += $m.Count
    }
  }
  return $src
}

function Invoke-Scan {
  param([string]$app, [hashtable]$Known)
  $quotes = [string]([char]34) + [string]([char]39) + [string]([char]96)
  $pattern = '(?<q>[' + $quotes + '])(?<s>[A-Z][^' + $quotes + '\r\n]{6,120})(\k<q>)'
  $backupDir = Join-Path $here ('backup' + (Get-VersionName $app))
  $found = @()
  foreach ($t in @('renderer.js', 'main.js')) {
    $p = Join-Path $app $t
    $b = Join-Path $backupDir $t
    if (Test-Path $b) { $p = $b }
    if (-not (Test-Path $p)) { continue }
    $src = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    foreach ($m in [regex]::Matches($src, $pattern)) {
      $s = $m.Groups['s'].Value
      if ($s -notmatch '\s') { continue }
      if ($s -match '[;{}<>|&$\[\]^~=]') { continue }
      if ($s -match '^M[0-9]') { continue }
      if ($s -match '[\u4e00-\u9fff]') { continue }
      if ($s -match '://|\\|\.(exe|dll|node|json|js|ts|tsx|md)$') { continue }
      $digits = ([regex]::Matches($s, '[0-9]')).Count
      if ($digits -gt ($s.Length * 0.15)) { continue }
      if ($Known.ContainsKey($s)) { continue }
      $found += $s
    }
  }
  $uniq = @($found | Sort-Object -Unique)
  $file = Join-Path $here ('scan-' + (Get-VersionName $app) + '.txt')
  $header = @(
    '# GitHub Desktop 未汉化文案扫描',
    ('# 版本: ' + (Get-VersionName $app) + '    时间: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')),
    '# 用法: 挑需要的行按「英文<TAB>中文」补进 dict7.tsv 或 dict-regex.tsv，重跑脚本即可',
    ''
  )
  [System.IO.File]::WriteAllLines($file, ($header + $uniq), $utf8bom)
  return @{ File = $file; Count = $uniq.Count }
}

$targets = Resolve-TargetApp $AppDir
$uiDict = Merge-Dicts @('dict1.tsv','dict2.tsv','dict3.tsv','dict4.tsv','dict5.tsv','dict6.tsv','dict7.tsv','dict8.tsv','dict9.tsv','dict10.tsv')
$menuDict = Merge-Dicts @('main-dict.tsv')
$regexRules = Read-RegexDict (Join-Path $here 'dict-regex.tsv')
$hookSrc = Join-Path $here 'out\zh-menu-hook.js'
$zhSrc = Join-Path $here 'out\zh-cn.js'
if (-not (Test-Path $zhSrc)) { $zhSrc = Join-Path $here 'zh-cn.js' }

Title "GitHub Desktop 简体中文汉化  v1.0"
Step ("界面词条: " + $uiDict.Count + "    菜单词条: " + $menuDict.Count + "    模板规则: " + $regexRules.Count)

$done = @()
foreach ($app in $targets) {
  if (-not (Test-Path $app)) { continue }
  $ver = Get-VersionName $app
  $renderer = Join-Path $app 'renderer.js'
  $mainJs = Join-Path $app 'main.js'
  $index = Join-Path $app 'index.html'

  if (-not (Test-Path $renderer)) {
    if (Test-Path (Join-Path $app 'app.asar')) {
      Write-Host ""
      Write-Host "[$ver] 检测到 app.asar 打包形态，请先解包后再运行："
      Write-Host ('      npx asar extract "' + $app + '\app.asar" "' + $app + '"')
    } else {
      Write-Host "[$ver] 跳过：未找到 renderer.js"
    }
    continue
  }

  $backupDir = Join-Path $here ("backup\" + $ver)

  if ($Restore) {
    if (-not (Test-Path $backupDir)) { Write-Host "[$ver] 无备份，跳过"; continue }
    Stop-App
    foreach ($f in 'renderer.js','main.js','index.html') {
      $b = Join-Path $backupDir $f
      if (Test-Path $b) { Copy-Item $b (Join-Path $app $f) -Force }
    }
    $zhf = Join-Path $app 'zh-cn.js'
    if (Test-Path $zhf) { Remove-Item $zhf -Force }
    Write-Host "[$ver] 已还原英文原版"
    continue
  }

  if ($Scan) {
    $r = Invoke-Scan -app $app -Known $uiDict
    Write-Host ("[$ver] 未覆盖文案 " + $r.Count + " 条 -> " + $r.File)
    continue
  }

  if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Force -Path $backupDir | Out-Null }
  foreach ($f in 'renderer.js','main.js','index.html') {
    $b = Join-Path $backupDir $f
    if (-not (Test-Path $b)) { Copy-Item (Join-Path $app $f) $b -Force }
  }

  if (-not $DryRun) { Stop-App }

  $hitA = 0; $repA = 0; $rxA = 0; $hitB = 0; $repB = 0; $rxB = 0
  # 始终以备份的原始文件为源做全量重建，保证幂等且不残留旧补丁
  $rendererSrcPath = $renderer
  $mainSrcPath = $mainJs
  $bRenderer = Join-Path $backupDir 'renderer.js'
  $bMain = Join-Path $backupDir 'main.js'
  if (Test-Path $bRenderer) { $rendererSrcPath = $bRenderer }
  if (Test-Path $bMain) { $mainSrcPath = $bMain }

  $rendererSrc = [System.IO.File]::ReadAllText($rendererSrcPath, [System.Text.Encoding]::UTF8)
  $rendererOut = Invoke-WholeReplace -Source $rendererSrc -Dict $uiDict -Hit ([ref]$hitA) -Cnt ([ref]$repA)
  $rendererOut = Invoke-RegexReplace -Source $rendererOut -Rules $regexRules -Cnt ([ref]$rxA)

  $mainSrc = [System.IO.File]::ReadAllText($mainSrcPath, [System.Text.Encoding]::UTF8)
  $mainOut = Invoke-WholeReplace -Source $mainSrc -Dict $menuDict -Hit ([ref]$hitB) -Cnt ([ref]$repB)
  $mainOut = Invoke-RegexReplace -Source $mainOut -Rules $regexRules -Cnt ([ref]$rxB)

  if ((Test-Path $hookSrc) -and ($mainOut.IndexOf('ZHD-MENU-HOOK') -lt 0)) {
    $mainOut = $mainOut + [Environment]::NewLine + [System.IO.File]::ReadAllText($hookSrc, [System.Text.Encoding]::UTF8)
  }

  Write-Host ""
  Write-Host "[$ver]"
  Step ("renderer.js: " + $hitA + " 条词条 / " + $repA + " 处 / 模板 " + $rxA + " 处")
  Step ("main.js    : " + $hitB + " 条词条 / " + $repB + " 处 / 模板 " + $rxB + " 处")
  Step ("备份目录   : " + $backupDir)

  if ($DryRun) { continue }

  [System.IO.File]::WriteAllText($renderer, $rendererOut, $utf8)
  [System.IO.File]::WriteAllText($mainJs, $mainOut, $utf8)

  if (Test-Path $zhSrc) {
    Copy-Item $zhSrc (Join-Path $app 'zh-cn.js') -Force
    Step "已部署 zh-cn.js"
  }

  if (Test-Path $index) {
    $html = [System.IO.File]::ReadAllText($index, [System.Text.Encoding]::UTF8)
    if (($html -notmatch 'zh-cn\.js') -and (Test-Path $zhSrc)) {
      $tag = '<script defer="defer" src="zh-cn.js"></script>'
      $newHtml = $html -replace '(</head>)', ($tag + '$1')
      [System.IO.File]::WriteAllText($index, $newHtml, $utf8)
      Step "已注入 index.html"
    } else {
      Step "index.html 已就绪"
    }
  }

  $done += $ver
}

Say ""
if ($Restore) {
  Say "还原完成，重新打开 GitHub Desktop 即为英文原版。"
} elseif ($Scan) {
  Say "扫描完成，结果见 scan-<版本>.txt"
} elseif ($DryRun) {
  Say "DryRun 结束，未写入任何文件。"
} else {
  Say ("汉化完成: " + ($done -join ', '))
  Say ('还原:     pwsh -File "' + (Join-Path $here '一键汉化.ps1') + '" -Restore')
  Say ('扫描残留: pwsh -File "' + (Join-Path $here '一键汉化.ps1') + '" -Scan')
}
