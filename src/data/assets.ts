/**
 * Image asset registry for Lumora Flames.
 *
 * Images are imported (not referenced by string path) so Vite fingerprints them,
 * bundles them, and fails the build if a file goes missing. To swap a photo,
 * drop the new file into `src/data/images/**` and update the import below.
 */

// Collection hero imagery
import bespoke from './images/collections-landing/bespoke.png';
import jarCandles from './images/collections-landing/jarCandles.jpeg';
import sculptural from './images/collections-landing/Sculptural_Decorative.png';
import traditional from './images/collections-landing/Traditional_Festive.png';
import specialtyWax from './images/collections-landing/Speciality_Candles.png';
import rawMaterial from './images/collections-landing/rawMaterial.png';

// Promotional carousel imagery
import beveragesCocktails from './images/deserts_beverages/Beverages_cocktails.png';
import desserts from './images/deserts_beverages/desserts.png';
import smoothie from './images/deserts_beverages/Smoothie.png';

export const ASSET_IMAGES = {
  categories: {
    bespoke,
    containerJar: jarCandles,
    sculptural,
    traditional,
    specialtyWax,
    rawMaterials: rawMaterial,
  },
  promotional_one: {
    first: beveragesCocktails,
    second: desserts,
    third: smoothie,
  },
} as const;
