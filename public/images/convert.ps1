# Navigate to your image folder
Set-Location "C:\Path\To\Your\Images"

# Load .NET image processing
Add-Type -AssemblyName System.Drawing

# Loop through image-1.jpg to image-13.jpg
for ($i = 1; $i -le 23; $i++) {
    $jpg = "image-$i.jpg"
    $png = "image-$i.png"

    if (Test-Path $jpg) {
        $img = [System.Drawing.Image]::FromFile($jpg)
        $img.Save($png, [System.Drawing.Imaging.ImageFormat]::Png)
        $img.Dispose()
        Write-Host "Converted $jpg → $png"
    } else {
        Write-Host "File not found: $jpg"
    }
}