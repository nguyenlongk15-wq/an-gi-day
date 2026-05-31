param(
  [switch]$RemoveAtLogon,
  [switch]$StopServer
)

$TaskName = "AnGiDayWeb8082Watchdog"

Get-CimInstance Win32_Process |
  Where-Object {
    $_.CommandLine -and
    $_.CommandLine -like "*keep-web-8082.ps1*"
  } |
  ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force
  }

if ($StopServer) {
  Get-CimInstance Win32_Process |
    Where-Object {
      $_.Name -eq "node.exe" -and
      $_.CommandLine -and
      ($_.CommandLine -like "*expo*start*--web*" -or $_.CommandLine -like "*@expo*cli*start*")
    } |
    ForEach-Object {
      Stop-Process -Id $_.ProcessId -Force
    }
}

if ($RemoveAtLogon) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
}

Write-Output "stopped"
