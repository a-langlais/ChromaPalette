/**
 * Converts a Hex color to HSL
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Converts HSL to Hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generates a random Hex color
 */
export function generateRandomHex(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Generates palette algorithmically based on a seed color
 */
export function generateAlgorithmicPalette(
  baseHex: string,
  mode: string,
  count: number
): string[] {
  const { h, s, l } = hexToHSL(baseHex);
  const colors: string[] = [];

  // Helper to safely clamp values
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  for (let i = 0; i < count; i++) {
    let newH = h;
    let newS = s;
    let newL = l;

    const step = i / Math.max(1, count - 1); // 0 to 1

    switch (mode) {
      case 'MONOCHROMATIC':
        // Vary Lightness and Saturation slightly
        // We want a range from dark to light usually, centered around the base if possible, 
        // or spread out. Let's spread lightness from 10% to 90%
        newL = 10 + (80 * step);
        // Add a tiny bit of random saturation shift for flavor
        newS = clamp(s - 10 + Math.random() * 20, 0, 100);
        break;

      case 'ANALOGOUS':
        // Shift Hue by up to 60 degrees total
        newH = (h - 30 + (60 * step)) % 360;
        if (newH < 0) newH += 360;
        break;

      case 'COMPLEMENTARY':
        if (i === 0) {
            // Keep base
        } else if (i < count / 2) {
            // Variations of base
             newL = clamp(l + (Math.random() * 40 - 20), 20, 90);
        } else {
             // Complementary side
             newH = (h + 180) % 360;
             newL = clamp(l + (Math.random() * 40 - 20), 20, 90);
        }
        break;
      
      case 'TRIADIC':
         // Split into 3 hue groups
         const offset = Math.floor(i / (count / 3)) * 120;
         newH = (h + offset) % 360;
         newL = clamp(l + (Math.random() * 30 - 15), 25, 85);
         break;

      case 'RANDOM':
      default:
        return Array.from({ length: count }, () => generateRandomHex());
    }

    colors.push(hslToHex(newH, newS, newL));
  }
  
  // Ensure the base color is present for non-gradient types if count is small, 
  // but for gradients (mono/analog) it's better to just follow the curve.
  // For algorithmic generation, the result is usually clean enough.
  
  return colors;
}

export function downloadPaletteAsPng(colors: string[], name: string) {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 600;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // Draw colors
  const barWidth = width / colors.length;
  
  colors.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(index * barWidth, 0, barWidth, height);
    
    // Determine text color (black or white) for contrast
    const rgb = parseInt(color.substring(1), 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    ctx.fillStyle = luma < 100 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    
    // Draw Hex Code at the bottom
    ctx.fillText(color.toUpperCase(), (index * barWidth) + (barWidth / 2), height - 40);
  });

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${name.replace(/\s+/g, '_')}.png`;
  link.href = dataUrl;
  link.click();
}

export function downloadPixelArtPng(colors: string[], name: string) {
  const canvas = document.createElement('canvas');
  const size = 8; // 8x8 pixels per color
  const width = colors.length * size;
  const height = size;
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  colors.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(index * size, 0, size, size);
  });

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `${name.replace(/\s+/g, '_')}_pixel.png`;
  link.href = dataUrl;
  link.click();
}