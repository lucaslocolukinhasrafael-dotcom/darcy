const { Jimp } = require('jimp');
const fs = require('fs');

async function createFavicon() {
  const image = await Jimp.read('info-agência/Logo Laercom.png');
  
  let minX=image.bitmap.width, maxX=0, minY=image.bitmap.height, maxY=0;
  
  // Encontra a exata bounding box dos pixels coloridos do icone
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const a = this.bitmap.data[idx + 3];
    
    // Ignora pixels quase transparentes
    if (a < 100) return;
    
    // Procura por tons de laranja ou azul (cores do icone) ignorando textos e fundos brancos/cinzas
    const isOrange = (r > 200 && g < 150);
    const isBlue = (b > 100 && r < 100);
    
    // Pega apenas a porcao esquerda onde sabemos que o icone esta (antes do texto)
    if ((isOrange || isBlue) && x < image.bitmap.width * 0.4) {
      if(x < minX) minX = x;
      if(x > maxX) maxX = x;
      if(y < minY) minY = y;
      if(y > maxY) maxY = y;
    }
  });
  
  // Adiciona uma margem minuscula (5%) para respirar
  const w = maxX - minX;
  const h = maxY - minY;
  const padding = Math.floor(Math.max(w, h) * 0.05);
  
  const icon = image.clone().crop({ 
    x: Math.max(0, minX - padding), 
    y: Math.max(0, minY - padding), 
    w: w + (padding * 2), 
    h: h + (padding * 2) 
  });
  
  const sizes = [32, 48, 180, 192];
  for (const size of sizes) {
    const squareIcon = icon.clone().contain({ w: size, h: size });
    const filename = `assets/favicon-${size}x${size}.png`;
    await squareIcon.write(filename);
    console.log(`Generated: ${filename}`);
  }
  
  const defaultIcon = icon.clone().contain({ w: 192, h: 192 });
  await defaultIcon.write('assets/favicon.png');
  console.log("Updated assets/favicon.png (192x192)");
  
  fs.copyFileSync('assets/favicon-32x32.png', 'favicon.ico');
  fs.copyFileSync('assets/favicon-192x192.png', 'favicon.png');
  console.log("Copied favicons to root directory");
}

createFavicon().catch(err => console.error(err));

