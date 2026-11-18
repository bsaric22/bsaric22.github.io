Add-Type -AssemblyName System.Drawing
$sourceDir = Join-Path (Get-Location) 'assets/Clients'
$targetDir = Join-Path $sourceDir 'processed'
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

# Normalize every source to a transparent PNG and one readable gray ink. PNG
# sources already contain transparency; the JPEG gets a near-white key.
Get-ChildItem -LiteralPath $sourceDir -File |
  Where-Object { $_.Extension -match '^\.(png|jpe?g)$' } |
  ForEach-Object {
    $source = [System.Drawing.Bitmap]::new($_.FullName)
    $scale = [Math]::Min(1.0, 720.0 / [double]([Math]::Max($source.Width, $source.Height)))
    $width = [Math]::Max(1, [int]($source.Width * $scale))
    $height = [Math]::Max(1, [int]($source.Height * $scale))
    $canvas = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.DrawImage($source, 0, 0, $width, $height)
    $graphics.Dispose(); $source.Dispose()
    $output = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $isJpeg = $_.Extension -ieq '.jpg' -or $_.Extension -ieq '.jpeg'
    for ($x = 0; $x -lt $width; $x++) { for ($y = 0; $y -lt $height; $y++) {
      $pixel = $canvas.GetPixel($x, $y)
      if ($pixel.A -eq 0) { $output.SetPixel($x, $y, [System.Drawing.Color]::Transparent); continue }
      if ($isJpeg -and $pixel.R -gt 220 -and $pixel.G -gt 220 -and $pixel.B -gt 220) { $output.SetPixel($x, $y, [System.Drawing.Color]::Transparent); continue }
      $luma = 0.299 * $pixel.R + 0.587 * $pixel.G + 0.114 * $pixel.B
      $gray = [Math]::Max(112, [Math]::Min(198, [int](112 + $luma * .34)))
      $output.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, $gray, $gray, $gray))
    } }
    $output.Save((Join-Path $targetDir ([System.IO.Path]::GetFileNameWithoutExtension($_.Name) + '.png')), [System.Drawing.Imaging.ImageFormat]::Png)
    $output.Dispose(); $canvas.Dispose()
  }
