Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Image]::FromFile('frontend\public\Meshy_AI_59c9267862c1ca3dfccfe8a0de4854ad15179326.png')

foreach ($size in @(32, 192, 512)) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.DrawImage($src, 0, 0, $size, $size)
    
    $path = "frontend\public\favicon-$size`x$size.png"
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $bmp.Dispose()
}

$src.Dispose()