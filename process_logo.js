const { Jimp } = require('jimp');

async function processLogo() {
  const image = await Jimp.read('info-agência/Logo Laercom.png');
  const lightLogo = image.clone();
  
  // Make white/light-gray background transparent
  lightLogo.scan(0, 0, lightLogo.bitmap.width, lightLogo.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // If pixel is light gray/white, make transparent
    if (r > 220 && g > 220 && b > 220) {
      this.bitmap.data[idx + 3] = 0; // alpha = 0
    }
  });
  
  await lightLogo.write('assets/logo-light.png');
  
  // Create dark logo
  const darkLogo = lightLogo.clone();
  darkLogo.scan(0, 0, darkLogo.bitmap.width, darkLogo.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const a = this.bitmap.data[idx + 3];
    
    // If it's dark blue (low RGB values), make it white
    if (a > 0 && r < 120 && g < 120 && b < 150) {
      this.bitmap.data[idx + 0] = 255;
      this.bitmap.data[idx + 1] = 255;
      this.bitmap.data[idx + 2] = 255;
    }
  });
  
  await darkLogo.write('assets/logo-dark.png');
  console.log("Logos processed!");
}

processLogo();
