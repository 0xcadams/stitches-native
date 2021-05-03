import { Config } from './types';

import {
  COLOR_PROPERTIES,
  RADII_PROPERTIES,
  SIZE_PROPERTIES,
  SPACE_PROPERTIES,
} from './constants';

export function getCompoundKey(compoundEntries: Array<[string, any]>) {
  // Eg. `color_primary+size_small`
  return (
    compoundEntries
      // Sort compound entries alphabetically
      .sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
      })
      .reduce((keyAcc, [prop, value]) => {
        return keyAcc + `${prop}_${value}+`;
      }, '')
      .slice(0, -1)
  ); // Remove last `+` character
}

export function processStyles(
  styles: { [property: string]: string | number },
  config: Config
) {
  if (!config.theme) return styles;

  return Object.entries(styles).reduce((acc, [key, val]) => {
    if (typeof val === 'number' || val.indexOf('$') === -1) {
      acc[key] = val;
      return acc;
    }

    const token = val.replace('$', '');

    if (key in COLOR_PROPERTIES && config.theme?.colors) {
      acc[key] = config.theme.colors[token];
    } else if (key in RADII_PROPERTIES && config.theme?.radii) {
      acc[key] = config.theme.radii[token];
    } else if (key in SIZE_PROPERTIES && config.theme?.sizes) {
      acc[key] = config.theme.sizes[token];
    } else if (key in SPACE_PROPERTIES && config.theme?.space) {
      acc[key] = config.theme.space[token];
    }

    return acc;
  }, {} as any);
}
