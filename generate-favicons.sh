# Script para generar favicons PNG desde SVG
# Ejecutar este script si tienes ImageMagick instalado

# Generar favicon de 32x32
convert public/favicon.svg -resize 32x32 public/favicon-32x32.png

# Generar favicon de 16x16
convert public/favicon.svg -resize 16x16 public/favicon-16x16.png

# Generar apple-touch-icon de 180x180
convert public/favicon.svg -resize 180x180 public/apple-touch-icon.png

echo "Favicons generados correctamente!"
