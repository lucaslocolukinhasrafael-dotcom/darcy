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
  
  // Create a 64x64 container and center the icon
  const size = 64;
  const squareIcon = icon.clone().contain({ w: size, h: size });
  
  await squareIcon.write('assets/favicon.png');
  console.log("Favicon created at assets/favicon.png");
}

createFavicon().catch(err => console.error(err));
