export function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Handle short hex (#000)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Adjusts the brightness of a hex color by a percentage.
 * Positive percent lightens, negative percent darkens.
 */
export function adjustBrightness(hex: string, percent: number): string {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }

  const r = Math.min(255, Math.max(0, parseInt(hex.substring(0, 2), 16) + Math.round(255 * percent / 100)))
  const g = Math.min(255, Math.max(0, parseInt(hex.substring(2, 4), 16) + Math.round(255 * percent / 100)))
  const b = Math.min(255, Math.max(0, parseInt(hex.substring(4, 6), 16) + Math.round(255 * percent / 100)))

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
