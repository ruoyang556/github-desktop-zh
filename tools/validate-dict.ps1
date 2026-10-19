<#
.SYNOPSIS
  校验词典文件格式（CI 与本地通用）

.DESCRIPTION
  检查 dict*.tsv / main-dict.tsv / dict-regex.tsv：
    * 每行必须用 Tab 分隔
    * 左右两侧都不能为空
    * dict-regex.tsv 中的正则可被 .NET 编译
    * 同一文件内词条不重复
  发现 error 时以非零码退出，供 GitHub Actions 使用。

.EXAMPLE
  pwsh -File .\tools\validate-dict.ps1
#>
param(
  [string]$Root
)

$ErrorActionPreference = 'Stop'
if (-not $Root) { $Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path) }

$errors = @()
$warnings = @()
$stats = @()

$files = @()
$files += Get-ChildItem $Root -Filter 'dict*.tsv' -File -ErrorAction SilentlyContinue
foreach ($name in @('main-dict.tsv', 'dict-regex.tsv')) {
  $p = Join-Path $Root $name
  if (Test-Path $p) { $files += Get-Item $p }
}
$files = $files | Sort-Object Name -Unique

if (-not $files) {
  Write-Host "未找到任何词典文件，检查路径: $Root" -ForegroundColor Red
  exit 1
}

foreach ($f in $files) {
  $seen = @{}
  $lineNo = 0
  $count = 0
  $isRegex = ($f.Name -eq 'dict-regex.tsv')
  foreach ($line in [System.IO.File]::ReadAllLines($f.FullName, [System.Text.Encoding]::UTF8)) {
    $lineNo++
    if (-not $line -or -not $line.Trim()) { continue }
    if ($line.TrimStart().StartsWith('#')) { continue }
    $i = $line.IndexOf([char]9)
    if ($i -lt 1) { $errors += ($f.Name + ':' + $lineNo + ' 缺少 Tab 分隔'); continue }
    $en = $line.Substring(0, $i)
    $zh = $line.Substring($i + 1)
    if (-not $en.Trim()) { $errors += ($f.Name + ':' + $lineNo + ' 左侧（英文）为空'); continue }
    if (-not $zh.Trim()) { $errors += ($f.Name + ':' + $lineNo + ' 右侧（中文）为空'); continue }
    if ($en -eq $zh) { $warnings += ($f.Name + ':' + $lineNo + ' 中英相同，可能漏翻: ' + $en) }
    if ($seen.ContainsKey($en)) {
      $warnings += ($f.Name + ':' + $lineNo + ' 重复词条: ' + $en)
    } else {
      $seen[$en] = 1
    }
    if ($isRegex) {
      try { [void][regex]::new($en) } catch { $errors += ($f.Name + ':' + $lineNo + ' 正则编译失败: ' + $en) }
    }
    $count++
  }
  $stats += [pscustomobject]@{ File = $f.Name; Entries = $count }
}

Write-Host ''
Write-Host '词典统计' -ForegroundColor Cyan
$total = 0
foreach ($s in $stats) {
  Write-Host ('  {0,-18} {1,5} 条' -f $s.File, $s.Entries)
  $total += $s.Entries
}
Write-Host ('  {0,-18} {1,5} 条' -f '合计', $total)

if ($warnings.Count -gt 0) {
  Write-Host ''
  Write-Host ('警告 ' + $warnings.Count + ' 条') -ForegroundColor Yellow
  $warnings | Select-Object -First 20 | ForEach-Object { Write-Host ('  - ' + $_) }
}

if ($errors.Count -gt 0) {
  Write-Host ''
  Write-Host ('错误 ' + $errors.Count + ' 条') -ForegroundColor Red
  $errors | ForEach-Object { Write-Host ('  ! ' + $_) }
  exit 1
}

Write-Host ''
Write-Host '词典格式校验通过。' -ForegroundColor Green
exit 0
