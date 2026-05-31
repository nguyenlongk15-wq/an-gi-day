param(
  [int]$Port = 8082,
  [string]$HostName = "localhost",
  [int]$CheckSeconds = 10
)

$ErrorActionPreference = "SilentlyContinue"

$createdNew = $false
$mutex = New-Object System.Threading.Mutex($true, "AnGiDayWeb8082Watchdog", [ref]$createdNew)
if (-not $createdNew) {
  exit 0
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Split-Path -Parent $ScriptDir
$ServerLog = Join-Path $Root "expo-web.log"
$WatchdogLog = Join-Path $Root "expo-watchdog.log"
$PidFile = Join-Path $Root "expo-web-8082.pid"

function Write-WatchdogLog {
  param([string]$Message)
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -LiteralPath $WatchdogLog -Value "$stamp $Message"
}

function Test-PortOpen {
  $targets = @($HostName, "127.0.0.1", "::1") | Select-Object -Unique
  $addresses = @()
  $seen = @{}

  foreach ($target in $targets) {
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

  foreach ($address in $addresses) {
    $client = $null

    try {
      $client = New-Object System.Net.Sockets.TcpClient($address.AddressFamily)
      $connect = $client.BeginConnect($address, $Port, $null, $null)
      $ok = $connect.AsyncWaitHandle.WaitOne(1000, $false)

      if ($ok) {
        $client.EndConnect($connect)
        return $true
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

  return $false
}

function Start-WebServer {
  if (Test-PortOpen) {
    return
  }

  Write-WatchdogLog "Port $Port is down. Starting Expo web server."

  $command = "set BROWSER=none&& npm.cmd run dev -- --port $Port --host localhost >> expo-web.log 2>&1"
  $process = Start-Process `
    -FilePath "cmd.exe" `
    -ArgumentList @("/d", "/c", $command) `
    -WorkingDirectory $Root `
    -WindowStyle Hidden `
    -PassThru

  if ($process) {
    Set-Content -LiteralPath $PidFile -Value $process.Id
    Write-WatchdogLog "Started server wrapper process $($process.Id)."
  }
}

try {
  Set-Content -LiteralPath (Join-Path $Root "expo-watchdog.pid") -Value $PID
  Write-WatchdogLog "Watchdog started for http://localhost:$Port."

  while ($true) {
    if (-not (Test-PortOpen)) {
      Start-WebServer
      Start-Sleep -Seconds 20
    }

    Start-Sleep -Seconds $CheckSeconds
  }
}
finally {
  if ($mutex) {
    $mutex.ReleaseMutex() | Out-Null
    $mutex.Dispose()
  }
}
