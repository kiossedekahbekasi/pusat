import { SiteSettings } from '../types';

export function applyGlobalTheme(settings: SiteSettings) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Apply Font Family
  const fontMap: Record<string, string> = {
    'Plus Jakarta Sans': "'Plus Jakarta Sans', sans-serif",
    'Inter': "'Inter', sans-serif",
    'Poppins': "'Poppins', sans-serif",
    'Playfair Display': "'Playfair Display', serif",
    'Roboto': "'Roboto', sans-serif",
    'Comic Neue': "'Comic Neue', cursive",
  };

  const selectedFont = fontMap[settings.fontFamily] || fontMap['Plus Jakarta Sans'];
  root.style.fontFamily = selectedFont;
  document.body.style.fontFamily = selectedFont;

  // Apply Font Size Scale
  const fontSizeMap: Record<string, string> = {
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  };
  root.style.fontSize = fontSizeMap[settings.fontSize] || '16px';

  // Apply Color Theme CSS Variables (for custom styled components or dynamic buttons)
  const colorMap: Record<string, { primary: string; hover: string; light: string; text: string }> = {
    emerald: { primary: '#065f46', hover: '#044e38', light: '#ecfdf5', text: '#065f46' },
    teal: { primary: '#0f766e', hover: '#115e59', light: '#f0fdfa', text: '#0f766e' },
    amber: { primary: '#b45309', hover: '#92400e', light: '#fffbeb', text: '#b45309' },
    blue: { primary: '#1d4ed8', hover: '#1e40af', light: '#eff6ff', text: '#1d4ed8' },
    indigo: { primary: '#4338ca', hover: '#3730a3', light: '#eef2ff', text: '#4338ca' },
    rose: { primary: '#be123c', hover: '#9f1239', light: '#fff1f2', text: '#be123c' },
  };

  const theme = colorMap[settings.primaryColor] || colorMap.emerald;
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-hover', theme.hover);
  root.style.setProperty('--color-primary-light', theme.light);
  root.style.setProperty('--color-primary-text', theme.text);
}
