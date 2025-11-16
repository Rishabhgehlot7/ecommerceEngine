
'use client';

import { useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { hexToHsl } from '@/lib/utils';

export default function ThemeInjector() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.primaryColor || !settings.primaryColorDark) return;

    const { hsl: primaryColorLightHsl, luminance: lightLuminance } = hexToHsl(settings.primaryColor);
    const { hsl: primaryColorDarkHsl, luminance: darkLuminance } = hexToHsl(settings.primaryColorDark);

    const fontBody = settings.font === 'poppins' ? "'Poppins', sans-serif" : "'Inter', sans-serif";
    const fontHeadline = settings.font === 'poppins' ? "'Poppins', sans-serif" : "'Poppins', sans-serif";
    
    // Determine foreground color based on luminance
    const lightForegroundHsl = lightLuminance > 0.5 ? '222 47% 11%' : '210 40% 98%';
    const darkForegroundHsl = darkLuminance > 0.5 ? '222 47% 11%' : '210 40% 98%';

    const style = document.createElement('style');
    style.id = 'theme-variables';
    style.innerHTML = `
      :root { 
        --primary-hsl: ${primaryColorLightHsl};
        --primary-foreground-hsl: ${lightForegroundHsl};
        --font-body: ${fontBody};
        --font-headline: ${fontHeadline};
      }
      .dark {
        --primary-dark-hsl: ${primaryColorDarkHsl};
        --primary-foreground-hsl: ${darkForegroundHsl};
      }
    `;

    // Remove existing theme style if it exists
    const existingStyle = document.getElementById('theme-variables');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);
  }, [settings.primaryColor, settings.primaryColorDark, settings.font]);

  return null;
}
