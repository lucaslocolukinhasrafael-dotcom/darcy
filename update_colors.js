const fs = require('fs');

const path = 'laercom.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Update Tailwind config
const tailwindConfigTarget = `tailwind.config = {
      darkMode: 'class',
      theme: { extend: {} }
    }`;
const tailwindConfigReplacement = `tailwind.config = {
      darkMode: 'class',
      theme: { 
        extend: {
          colors: {
            brand: {
              navy: '#041E40',
              orange: {
                light: '#F2811D',
                DEFAULT: '#F26B1D',
                dark: '#F2561D'
              },
              white: '#F2F2F2'
            }
          }
        } 
      }
    }`;
content = content.replace(tailwindConfigTarget, tailwindConfigReplacement);

// 2. Logo size
// From: class="h-10 w-auto dark:hidden transition-all duration-300"
// To: class="h-16 md:h-20 w-auto dark:hidden transition-all duration-300"
content = content.replace(/h-10 w-auto/g, 'h-16 md:h-20 w-auto');

// 3. Colors:
// Replace zinc-950 (the darkest background) with brand-navy in dark mode or main backgrounds.
// Actually, let's keep zinc for light mode text, but for backgrounds let's use brand-navy
content = content.replace(/bg-zinc-950/g, 'bg-brand-navy');
content = content.replace(/dark:bg-zinc-950/g, 'dark:bg-brand-navy');
content = content.replace(/dark:bg-zinc-900/g, 'dark:bg-brand-navy/90');
content = content.replace(/text-zinc-950/g, 'text-brand-navy');
content = content.replace(/border-zinc-800/g, 'border-brand-navy/30');

// Change emerald to brand-orange
content = content.replace(/emerald-500/g, 'brand-orange');
content = content.replace(/emerald-600/g, 'brand-orange-dark');
content = content.replace(/emerald-400/g, 'brand-orange-light');
content = content.replace(/emerald-700/g, 'brand-orange-dark');
content = content.replace(/emerald-100/g, 'brand-orange/20');
content = content.replace(/emerald-200/g, 'brand-orange/30');
content = content.replace(/emerald-50/g, 'brand-orange/10');

// Change blue/indigo gradients to brand colors
content = content.replace(/rgba\(59,130,246,0.10\)/g, 'rgba(242,107,29,0.15)'); // blue to orange
content = content.replace(/rgba\(59,130,246,0.15\)/g, 'rgba(242,107,29,0.20)');
content = content.replace(/rgba\(16,185,129,/g, 'rgba(242,129,29,'); // emerald to light orange

fs.writeFileSync(path, content, 'utf8');
console.log('laercom.html updated successfully with brand colors and logo size.');
