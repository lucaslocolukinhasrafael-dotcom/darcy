const { Jimp } = require('jimp');
const fs = require('fs');

async function createMobileHero() {
  const heroSrc = './site com imagens, animações, elementos e efeitos/images/image.jpg';
  const heroMobile = 'assets/hero-mobile.jpg';
  
  try {
    console.log('Creating mobile hero image...');
    const hero = await Jimp.read(heroSrc);
    
    // Resize to 600px for mobile
    const ratio = hero.bitmap.height / hero.bitmap.width;
    const w = 600;
    const h = Math.round(w * ratio);
    
    hero.resize({ w, h });
    await hero.write(heroMobile);
    
    console.log(`Saved ${heroMobile}`);
  } catch (e) {
    console.error('Error:', e);
  }
}

createMobileHero();
