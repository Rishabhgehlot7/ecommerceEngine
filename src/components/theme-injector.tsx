
'use client';

import { useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { hexToHsl } from '@/lib/utils';

export default function ThemeInjector() {
  const { settings } = useSettings();

  useEffect(() => {
    const primaryColorLightHsl = hexToHsl(settings.primaryColor);
    const primaryColorDarkHsl = hexToHsl(settings.primaryColorDark);

    const style = document.createElement('style');
    style.id = 'theme-variables';
    style.innerHTML = `
      :root { 
        --primary-light: hsl(${primaryColorLightHsl});
        --primary-light-hsl: ${primaryColorLightHsl};
        --primary-dark: hsl(${primaryColorDarkHsl});
        --primary-dark-hsl: ${primaryColorDarkHsl};
        --font-body: 'Inter', sans-serif;
        --font-headline: 'Poppins', sans-serif;
      }
    `;

    // Remove existing theme style if it exists
    const existingStyle = document.getElementById('theme-variables');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);
  }, [settings.primaryColor, settings.primaryColorDark]);

  return null;
}
