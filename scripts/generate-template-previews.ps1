$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$dir = 'C:\Users\Sathish\OneDrive\Desktop\resume-ai\public\templates'

function NewBrush([string]$hex) {
  return New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function DrawTag([System.Drawing.Graphics]$g, [string]$text, [int]$x, [int]$y, [System.Drawing.Font]$font, [System.Drawing.Color]$bgColor, [System.Drawing.Color]$fgColor) {
  $size = $g.MeasureString($text, $font)
  $width = [Math]::Ceiling($size.Width) + 16
  $height = 26
  $bgBrush = New-Object System.Drawing.SolidBrush($bgColor)
  $fgBrush = New-Object System.Drawing.SolidBrush($fgColor)
  $g.FillRectangle($bgBrush, $x, $y, $width, $height)
  $g.DrawString($text, $font, $fgBrush, $x + 8, $y + 4)
  $bgBrush.Dispose()
  $fgBrush.Dispose()
  return $width
}

function DrawWrapped([System.Drawing.Graphics]$g, [string]$text, [System.Drawing.Font]$font, [System.Drawing.Brush]$brush, [int]$x, [int]$y, [int]$width) {
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $fmt.FormatFlags = [System.Drawing.StringFormatFlags]::LineLimit
  $rect = New-Object System.Drawing.RectangleF($x, $y, $width, 1000)
  $g.DrawString($text, $font, $brush, $rect, $fmt)
}

function NewCanvas() {
  $bmp = New-Object System.Drawing.Bitmap 1200, 1600
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
  return @{ Bitmap = $bmp; Graphics = $g }
}

function SaveCanvas([hashtable]$canvas, [string]$fileName) {
  $canvas.Bitmap.Save((Join-Path $dir $fileName), [System.Drawing.Imaging.ImageFormat]::Png)
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Dispose()
}

$white = [System.Drawing.Brushes]::White
$black = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 116, 139))
$soft = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(203, 213, 225))
$sectionFont = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold)
$headFont = New-Object System.Drawing.Font('Arial', 34, [System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font('Arial', 20, [System.Drawing.FontStyle]::Regular)
$bodyFont = New-Object System.Drawing.Font('Arial', 19, [System.Drawing.FontStyle]::Regular)
$tagFont = New-Object System.Drawing.Font('Arial', 11, [System.Drawing.FontStyle]::Bold)
$smallFont = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Regular)

function Header([System.Drawing.Graphics]$g, [string]$title, [string]$subtitle, [string]$accentHex, [bool]$darkMode = $false) {
  if ($darkMode) {
    $g.FillRectangle((New-Brush '#0f172a'), 0, 0, 1200, 1600)
  } else {
    $g.FillRectangle([System.Drawing.Brushes]::White, 0, 0, 1200, 1600)
  }
  $accentBrush = New-Brush $accentHex
  $g.FillRectangle($accentBrush, 0, 0, 1200, 185)
  $g.DrawString($title, (New-Object System.Drawing.Font('Arial', 34, [System.Drawing.FontStyle]::Bold)), $white, 60, 36)
  $g.DrawString($subtitle, (New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Regular)), $white, 60, 96)
  $accentBrush.Dispose()
}

# ATS Professional
$canvas = NewCanvas
$g = $canvas.Graphics
Header $g 'ATS Professional' 'Name: Sathish Kumar | Email: sathish@email.com' '#2563eb'
$g.DrawString('Senior Data Engineer', $headFont, $black, 60, 230)
$g.DrawString('TCS | 2021-Present', $subFont, $muted, 60, 280)
$g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(226, 232, 240), 2)), 60, 330, 1140, 330)
$g.DrawString('Experience', $sectionFont, $black, 60, 360)
DrawWrapped $g 'Delivered reliable data pipelines across Databricks, Spark, Kafka, and NiFi, improving reporting stability and supporting enterprise analytics.' $bodyFont $black 60 402 1040
$g.DrawString('Skills', $sectionFont, $black, 60, 630)
$x = 60
foreach ($tag in @('SQL','Python','Databricks','Spark','Kafka','NiFi')) {
  $x += (DrawTag $g $tag $x 670 $tagFont ([System.Drawing.Color]::FromArgb(37, 99, 235)) ([System.Drawing.Color]::FromArgb(255, 255, 255))) + 8
}
$g.DrawString('Education', $sectionFont, $black, 60, 760)
$g.DrawString('B.Tech', $bodyFont, $black, 60, 805)
$recBrush = NewBrush '#3b82f6'
$g.FillRectangle($recBrush, 915, 50, 175, 34)
$g.DrawString('Recommended', $smallFont, $white, 932, 56)
$recBrush.Dispose()
SaveCanvas $canvas 'ats-professional.png'

# ATS Minimal
$canvas = NewCanvas
$g = $canvas.Graphics
Header $g 'ATS Minimal' 'Clean, compact, recruiter-friendly' '#475569'
$g.DrawString('Sathish Kumar', $headFont, $black, 60, 230)
$g.DrawString('Data Engineer', $subFont, $muted, 60, 280)
$g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(226, 232, 240), 2)), 60, 330, 1140, 330)
$g.DrawString('Profile', $sectionFont, $black, 60, 360)
DrawWrapped $g 'Lean one-page resume format focused on keyword clarity, simple structure, and easy ATS parsing.' $bodyFont $black 60 402 1040
$g.DrawString('Experience', $sectionFont, $black, 60, 560)
$g.DrawString('TCS | 2021-Present', $bodyFont, $black, 60, 602)
$g.DrawString('SQL  Python  Databricks  Spark  Kafka  NiFi', $bodyFont, $muted, 60, 652)
SaveCanvas $canvas 'ats-minimal.png'

# Data Engineer
$canvas = NewCanvas
$g = $canvas.Graphics
Header $g 'Data Engineer' 'Projects | Databricks | Spark | Kafka | NiFi | Azure | Snowflake' '#0d9488'
$projFill = NewBrush '#ecfdf5'
$g.FillRectangle($projFill, 60, 235, 1080, 280)
$projFill.Dispose()
$g.DrawString('Projects', $sectionFont, $black, 85, 255)
DrawWrapped $g 'Built batch and streaming data solutions using Databricks, Spark, Kafka, NiFi, Azure, and Snowflake.' $bodyFont $black 85 300 1020
$x = 85
foreach ($tag in @('Databricks','Spark','Kafka','NiFi','Azure','Snowflake')) {
  $x += (DrawTag $g $tag $x 390 $tagFont ([System.Drawing.Color]::FromArgb(13, 148, 136)) ([System.Drawing.Color]::FromArgb(255, 255, 255))) + 8
}
$g.DrawString('Impact', $sectionFont, $black, 60, 560)
DrawWrapped $g 'Designed reliable data flows and optimized analytics delivery for reporting, orchestration, and scale.' $bodyFont $black 60 605 1020
SaveCanvas $canvas 'data-engineer.png'

# Software Engineer
$canvas = NewCanvas
$g = $canvas.Graphics
$g.FillRectangle((New-Brush '#0f172a'), 0, 0, 1200, 1600)
Header $g 'Software Engineer' 'Java | Spring Boot | Microservices | React | AWS' '#06b6d4' $true
$g.DrawString('Sathish Kumar', $headFont, [System.Drawing.Brushes]::White, 60, 230)
$g.DrawString('Backend & Frontend Engineer', $subFont, $soft, 60, 280)
$x = 60
foreach ($tag in @('Java','Spring Boot','Microservices','React','AWS')) {
  $x += (DrawTag $g $tag $x 340 $tagFont ([System.Drawing.Color]::FromArgb(6, 182, 212)) ([System.Drawing.Color]::FromArgb(255, 255, 255))) + 8
}
$g.DrawString('Experience', $sectionFont, [System.Drawing.Brushes]::White, 60, 410)
DrawWrapped $g 'Built services, APIs, and user-facing experiences with a focus on reliability, scalability, and maintainability.' $bodyFont $soft 60 455 1040
SaveCanvas $canvas 'software-engineer.png'

# Executive Pro
$canvas = NewCanvas
$g = $canvas.Graphics
Header $g 'Executive Pro' 'Director | Head of Engineering | VP Technology' '#7c3aed'
$panel = NewBrush '#f5f3ff'
$g.FillRectangle($panel, 60, 235, 1080, 300)
$panel.Dispose()
$g.DrawString('Leadership Summary', $sectionFont, $black, 85, 260)
DrawWrapped $g 'Director-level resume emphasizing team leadership, strategy, operational excellence, and business impact.' $bodyFont $black 85 305 980
$x = 85
foreach ($tag in @('Director','Head of Engineering','VP Technology')) {
  $x += (DrawTag $g $tag $x 390 $tagFont ([System.Drawing.Color]::FromArgb(124, 58, 237)) ([System.Drawing.Color]::FromArgb(255, 255, 255))) + 8
}
SaveCanvas $canvas 'executive-pro.png'

# Corporate Blue
$canvas = NewCanvas
$g = $canvas.Graphics
Header $g 'Corporate Blue' 'Professional | Clean | Interview Ready' '#334155'
$g.DrawString('Executive Profile', $headFont, $black, 60, 230)
DrawWrapped $g 'A corporate-style layout with balanced structure and calm visual hierarchy for business roles.' $bodyFont $black 60 285 1000
$x = 60
foreach ($tag in @('Professional','Clean','Interview Ready')) {
  $x += (DrawTag $g $tag $x 370 $tagFont ([System.Drawing.Color]::FromArgb(51, 65, 85)) ([System.Drawing.Color]::FromArgb(255, 255, 255))) + 8
}
SaveCanvas $canvas 'corporate-blue.png'

# Healthcare
$canvas = NewCanvas
$g = $canvas.Graphics
Header $g 'Healthcare' 'Patient Care | Clinical Operations | Trust' '#0284c7'
$g.DrawString('Healthcare Professional', $headFont, $black, 60, 230)
DrawWrapped $g 'Highlights compassionate care, compliance, and operational readiness in a clean professional format.' $bodyFont $black 60 285 1020
$x = 60
foreach ($tag in @('Healthcare','Trust','Experience')) {
  $x += (DrawTag $g $tag $x 370 $tagFont ([System.Drawing.Color]::FromArgb(2, 132, 199)) ([System.Drawing.Color]::FromArgb(255, 255, 255))) + 8
}
SaveCanvas $canvas 'healthcare.png'

# Student
$canvas = NewCanvas
$g = $canvas.Graphics
Header $g 'Student' 'Freshers | Internships | Campus Hiring' '#1d4ed8'
$g.DrawString('Student Resume', $headFont, $black, 60, 230)
DrawWrapped $g 'Designed for first jobs, internships, and campus hiring with space for education, projects, and skills.' $bodyFont $black 60 285 1020
$x = 60
foreach ($tag in @('Freshers','Internships','Campus Hiring')) {
  $x += (DrawTag $g $tag $x 370 $tagFont ([System.Drawing.Color]::FromArgb(29, 78, 216)) ([System.Drawing.Color]::FromArgb(255, 255, 255))) + 8
}
SaveCanvas $canvas 'student.png'

$black.Dispose(); $muted.Dispose(); $soft.Dispose(); $sectionFont.Dispose(); $headFont.Dispose(); $subFont.Dispose(); $bodyFont.Dispose(); $tagFont.Dispose(); $smallFont.Dispose()
