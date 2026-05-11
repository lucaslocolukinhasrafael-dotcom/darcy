const { Jimp } = require('jimp');
const fs = require('fs');

async function optimizeHero() {
  const heroSrc = './site com imagens, animações, elementos e efeitos/images/image.jpg';
  const heroDist = 'assets/hero-dashboard.jpg';
  
  try {
    console.log('Optimizing hero image...');
    const hero = await Jimp.read(heroSrc);
    
    // Resize to 1200px (standard hero width)
    const ratio = hero.bitmap.height / hero.bitmap.width;
    const w = 1200;
    const h = Math.round(w * ratio);
    
    hero.resize({ w, h });
    
    // In newer Jimp, quality is often handled during write if supported,
    // or just use default. Let's try to just write it first.
    await hero.write(heroDist);
    
    const oldSize = fs.statSync(heroSrc).size / 1024;
    const newSize = fs.statSync(heroDist).size / 1024;
    console.log(`Saved ${heroDist}: ${oldSize.toFixed(1)}KB -> ${newSize.toFixed(1)}KB`);
  } catch (e) {
    console.error('Error:', e);
  }
}

optimizeHero();
