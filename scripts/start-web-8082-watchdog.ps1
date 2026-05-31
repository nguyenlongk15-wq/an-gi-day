param(
  [switch]$InstallAtLogon
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Split-Path -Parent $ScriptDir
$WatchdogScript = Join-Path $ScriptDir "keep-web-8082.ps1"
$TaskName = "AnGiDayWeb8082Watchdog"

if ($InstallAtLogon) {
  try {
    $action = New-ScheduledTaskAction `
      -Execute "powershell.exe" `
      -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WatchdogScript`""
    $trigger = New-ScheduledTaskTrigger -AtLogOn
    $settings = New-ScheduledTaskSettingsSet `
      -AllowStartIfOnBatteries `
      -DontStopIfGoingOnBatteries `
      -RestartCount 3 `
      -RestartInterval (New-TimeSpan -Minutes 1) `
      -ExecutionTimeLimit (New-TimeSpan -Days 30)

    Register-ScheduledTask `
      -TaskName $TaskName `
      -Action $action `
      -Trigger $trigger `
      -Settings $settings `
      -Description "Keeps the An Gi Day web app available on http://localhost:8082." `
      -Force | Out-Null

    Write-Output "autostart=scheduled_task"
  }
  catch {
    $Startup = [Environment]::GetFolderPath("Startup")
    $ShortcutPath = Join-Path $Startup "$TaskName.lnk"
    $Shell = New-Object -ComObject WScript.Shell
    $Shortcut = $Shell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = "powershell.exe"
    $Shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WatchdogScript`""
    $Shortcut.WorkingDirectory = $Root
    $Shortcut.WindowStyle = 7
    $Shortcut.Description = "Keeps the An Gi Day web app available on http://localhost:8082."
    $Shortcut.Save()
    Write-Output "autostart=startup_shortcut"
  }
}

$existing = Get-CimInstance Win32_Process |
  Where-Object {
    $_.ProcessId -ne $PID -and
    $_.CommandLine -and
    $_.CommandLine -like "*keep-web-8082.ps1*"
  }

if (-not $existing) {
  $watchdogArgs = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$WatchdogScript`""
  Start-Process `
    -FilePath "powershell.exe" `
    -ArgumentList $watchdogArgs `
    -WorkingDirectory $Root `
    -WindowStyle Hidden
}

Start-Sleep -Seconds 25

$addresses = @()
$seen = @{}
foreach ($target in @("localhost", "127.0.0.1", "::1")) {
  try {
    foreach ($address in [System.Net.Dns]::GetHostAddresses($target)) {
      $key = $address.ToString()
      if (-not $seen.ContainsKey($key)) {
        $seen[$key] = $true
        $addresses += $address
      }
    }
  }
  catch {
  }
}

$ok = $false
foreach ($address in $addresses) {
  $client = $null
  try {
    $client = New-Object System.Net.Sockets.TcpClient($address.AddressFamily)
    $connect = $client.BeginConnect($address, 8082, $null, $null)
    $connected = $connect.AsyncWaitHandle.WaitOne(1000, $false)

    if ($connected) {
      $client.EndConnect($connect)
      $ok = $true
      break
    }
  }
  catch {
  }
  finally {
   if ($client) {
     $client.Close()
   }
  }
}

Write-Output "port_8082=$ok"
