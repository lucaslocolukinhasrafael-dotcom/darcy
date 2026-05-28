const { Jimp } = require('jimp');

async function createFavicon() {
  const image = await Jimp.read('info-agência/Logo Laercom.png');
  
  // Apply transparency and remove subtitle
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    if (x >= 535 && y >= 435) {
      this.bitmap.data[idx + 3] = 0;
      return;
    }
    
    if (r > 220 && g > 220 && b > 220) {
      this.bitmap.data[idx + 3] = 0;
    }
  });
  
  image.autocrop();
  
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  
  let colHasPixel = new Array(w).fill(false);
  image.scan(0, 0, w, h, function(x, y, idx) {
    if (this.bitmap.data[idx + 3] > 0) colHasPixel[x] = true;
  });
  
  let gapX = 0;
  for(let i = Math.floor(w * 0.2); i < w; i++) {
    if (!colHasPixel[i] && colHasPixel[i-1]) {
      let isGap = true;
      for(let j = 0; j < 10; j++) {
        if(colHasPixel[i+j]) isGap = false;
      }
      if (isGap) {
        gapX = i;
        break;
      }
    }
  }
  
  if (gapX === 0) gapX = 260;
  
  // Crop the icon part
  const icon = image.clone().crop({ x: 0, y: 0, w: gapX, h: h }).autocrop();
  
  const fs = require('fs');
  
  const sizes = [32, 48, 180, 192];
  for (const size of sizes) {
    const zoomedW = Math.floor(size * 1.15);
    const zoomedH = Math.floor(size * 1.15);
    const squareIcon = icon.clone()
      .cover({ w: zoomedW, h: zoomedH })
      .crop({ x: Math.floor((zoomedW - size)/2), y: Math.floor((zoomedH - size)/2), w: size, h: size });
    const filename = `assets/favicon-${size}x${size}.png`;
    await squareIcon.write(filename);
    console.log(`Generated: ${filename}`);
  }
  
  // Write default favicon.png (192x192)
  const defaultZoomed = Math.floor(192 * 1.15);
  const defaultIcon = icon.clone()
    .cover({ w: defaultZoomed, h: defaultZoomed })
    .crop({ x: Math.floor((defaultZoomed - 192)/2), y: Math.floor((defaultZoomed - 192)/2), w: 192, h: 192 });
  await defaultIcon.write('assets/favicon.png');
  console.log("Updated assets/favicon.png (192x192)");
  
  // Copy 32x32 to root favicon.ico and 192x192 to root favicon.png for search engine discovery fallback
  fs.copyFileSync('assets/favicon-32x32.png', 'favicon.ico');
  fs.copyFileSync('assets/favicon-192x192.png', 'favicon.png');
  console.log("Copied favicons to root directory (favicon.ico and favicon.png)");
}

createFavicon().catch(err => console.error(err));
