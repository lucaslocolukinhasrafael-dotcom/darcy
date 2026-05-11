const { Jimp } = require('jimp');
const fs = require('fs');

async function optimize() {
  console.log('Starting image optimization...');

  const logoFiles = [
    { src: 'assets/logo-light.png', dist: 'assets/logo-light-opt.png' },
    { src: 'assets/logo-dark.png', dist: 'assets/logo-dark-opt.png' }
  ];

  for (const file of logoFiles) {
    try {
      const image = await Jimp.read(file.src);
      const ratio = image.bitmap.height / image.bitmap.width;
      const w = 384;
      const h = Math.round(w * ratio);
      
      console.log(`Resizing to ${w}x${h}`);
      // According to Jimp 1.0 docs/errors, it wants { w, h }
      image.resize({ w, h });
      
      await image.write(file.dist);
      console.log(`Saved ${file.dist}`);
    } catch (e) {
      console.error(`Error optimizing ${file.src}:`, e);
      // Fallback: just write without resize if it fails
      try {
        const image = await Jimp.read(file.src);
        await image.write(file.dist);
        console.log(`Saved ${file.dist} (no resize fallback)`);
      } catch(e2) {}
    }
  }

  const heroSrc = './site com imagens, animações, elementos e efeitos/images/image.jpg';
  const heroDist = 'assets/hero-dashboard.jpg';
  try {
    const hero = await Jimp.read(heroSrc);
    const w = 1200;
    const h = Math.round(w * (hero.bitmap.height / hero.bitmap.width));
    try {
        hero.resize({ w, h });
    } catch(e) {}
    await hero.quality(70).write(heroDist);
    console.log(`Saved ${heroDist}`);
  } catch (e) {
    console.error(`Error optimizing hero image:`, e);
  }
}

optimize();
