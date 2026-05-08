const { Jimp } = require('jimp');

async function processLogo() {
  const image = await Jimp.read('info-agência/Logo Laercom.png');
  const lightLogo = image.clone();
  
  // Make white/light-gray background transparent
  // and REMOVE the "CONSULTORIA EM E-COMMERCE" text
  lightLogo.scan(0, 0, lightLogo.bitmap.width, lightLogo.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Subtitle is at x >= 535 and y >= 435
    if (x >= 535 && y >= 435) {
      this.bitmap.data[idx + 3] = 0; // make transparent
      return;
    }
    
    // If pixel is light gray/white, make transparent
    if (r > 220 && g > 220 && b > 220) {
      this.bitmap.data[idx + 3] = 0; // alpha = 0
    }
  });
  
  // Crop transparent edges
  lightLogo.autocrop();
  await lightLogo.write('assets/logo-light.png');
  
  // Create dark logo
  const darkLogo = lightLogo.clone();
  
  // Convert ONLY the "LAERCOM" text to white
  // Note: Since we already autocropped, the coordinates changed!
  // So we just change any dark pixel to white IF it's on the right side of the image.
  // Let's scan to find where the gap is in the cropped image.
  const w = darkLogo.bitmap.width;
  const h = darkLogo.bitmap.height;
  
  // The icon is roughly the left half or 40% of the image.
  // Let's find the horizontal gap dynamically or just assume x > 300
  let colHasPixel = new Array(w).fill(false);
  darkLogo.scan(0, 0, w, h, function(x, y, idx) {
    if (this.bitmap.data[idx + 3] > 0) colHasPixel[x] = true;
  });
  
  let gapX = 0;
  for(let i = Math.floor(w * 0.2); i < w; i++) {
    if (!colHasPixel[i] && colHasPixel[i-1]) {
      // Found the start of a gap! Let's say the gap is at least 10px
      let isGap = true;
      for(let j = 0; j < 10; j++) {
        if(colHasPixel[i+j]) isGap = false;
      }
      if (isGap) {
        gapX = i + 5;
        break;
      }
    }
  }
  if (gapX === 0) gapX = 260; // fallback
  
  darkLogo.scan(0, 0, w, h, function(x, y, idx) {
    // Only process pixels in the text region
    if (x > gapX) {
      const a = this.bitmap.data[idx + 3];
      // Since it's already cropped, the text is here.
      // Make non-transparent pixels white
      if (a > 0) {
        this.bitmap.data[idx + 0] = 255;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 255;
      }
    }
  });
  
  await darkLogo.write('assets/logo-dark.png');
  console.log("Logos processed and cropped properly!");
}

processLogo();
