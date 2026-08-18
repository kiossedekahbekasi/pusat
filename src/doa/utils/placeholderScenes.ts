/**
 * Placeholder latar video untuk adegan animasi doa.
 * Menggunakan gradient SVG inline (data URI) supaya tidak bergantung
 * pada file gambar eksternal yang tidak tersedia di proyek ini.
 */
const gradientScene = (from: string, to: string, emoji: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0%' stop-color='${from}'/>` +
      `<stop offset='100%' stop-color='${to}'/>` +
      `</linearGradient></defs>` +
      `<rect width='800' height='450' fill='url(#g)'/>` +
      `<text x='400' y='245' font-size='140' text-anchor='middle' dominant-baseline='middle'>${emoji}</text>` +
      `</svg>`
  )}`;

export const salamImg = gradientScene('#059669', '#f59e0b', '👋');
export const doaImg = gradientScene('#0d9488', '#10b981', '🤲');
export const makanImg = gradientScene('#f59e0b', '#ea580c', '🍽️');
export const arfitaImg = gradientScene('#059669', '#0f766e', '🧕');
export const munifImg = gradientScene('#78350f', '#1e293b', '🧑');
