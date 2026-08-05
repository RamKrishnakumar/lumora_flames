import type { Category } from '../types/category';
import { ASSET_IMAGES } from '../data/assets';

export const CANDLE_CATEGORIES: Category[] = [
  {
    id: "bespoke-personalized",
    title: 'Bespoke & Personalized',
    tagline: 'Crafted for your uniquely cherished moemnts.',
    description: 'Custom fragrance blends, custome name labels, and photo-embedded candles designed to capture your personal story.',
    heroImage: ASSET_IMAGES.categories.bespoke,
    subCategories: [
      {
        id: 'custom-fragrance-blends',
        name: 'Custom Fragrance Blends',
        description: 'Create a scent that is uniquely yours, blending your favorite aromas into a signature fragrance.',
        examples: ['Lavender & Vanilla', 'Citrus & Sage', 'Rose & Sandalwood']
      },
      {
        id: 'personalized-name-labels',
        name: 'Personalized Name Labels',
        description: 'Add a personal touch with custom labels featuring names, dates, or special messages.',
        examples: ['John & Jane - 10.10.2023', 'Happy Birthday, Alex!', 'Our Wedding Day - 05.05.2024']
      },
      {
        id: 'photo-embedded-candles',
        name: 'Photo-Embedded Candles',
        description: 'Incorporate cherished photos into your candle design, creating a keepsake that illuminates memories.',
        examples: ['Family Portrait Candle', 'Pet Photo Candle', 'Vacation Memory Candle']
      }
    ]
  },
  {
    id: 'container-jar',
    title: 'Container & Jar Candles',
    tagline: 'Elegance encased in artisanal glass and tin.',
    description: 'Hand-poured soy wax candles in minimalist frosted glass jars, rustic wooden wicks, and portable tins.',
    heroImage: ASSET_IMAGES.categories.containerJar,
    subCategories: [
      {
        id: 'scented-soy-wax',
        name: 'Scented Soy/Wax Jars',
        description: 'Clean burning soy wax with comforting scents.',
        examples: ['Wooden wick jars', 'Frosted glass jars', 'Tin containers'] //[cite: 1]
      },
      {
        id: 'minimalist-frosted-glass',
        name: 'Minimalist Frosted Glass',
        description: 'Sleek and modern frosted glass containers for a contemporary aesthetic.',
        examples: ['Frosted glass jars', 'Matte finish containers', 'Translucent candle holders'] //[cite: 2]
      },
      {
        id: 'rustic-wooden-wicks',
        name: 'Rustic Wooden Wicks',
        description: 'Experience the soothing crackle of wooden wicks in our rustic candle collection.',
        examples: ['Wooden wick candles', 'Rustic jar candles', 'Hand-poured wooden wick blends'] //[cite: 3]
      }
    ]
  },
  {
    id: 'sculptural-decorative',
    title: 'Sculptural & Decorative',
    tagline: 'Artful creations that delight the senses.',
    description: 'Playful yet sophisticated designs mimicking gourmet desserts, smoothies, and cocktail delights.',
    heroImage: ASSET_IMAGES.categories.sculptural,
    subCategories: [
      {
        id: 'beverage-food',
        name: 'Beverage / Food Mimicking',
        description: 'Sculpted wax art crafted to resemble delightful drinks and treats.',
        examples: ['Smoothie candles', 'Dessert candles', 'Cocktail-inspired candles'] //[cite: 1]
      },
      {
        id: 'playful-sculptures',
        name: 'Playful Sculptures',
        description: 'Whimsical candle designs that bring a touch of fun and creativity to your space.',
        examples: ['Animal-shaped candles', 'Abstract art candles', 'Miniature scene candles'] //[cite: 2]
      },
      {
        id: 'luxury-decorative',
        name: 'Luxury Decorative Candles',
        description: 'Exquisite decorative pieces that elevate your home decor.',
        examples: ['Gold leaf candles', 'Marble effect candles', 'Hand-painted decorative candles'] //[cite: 3]
      }
    ]
  },
  {
    id: 'traditional-festive',
    title: 'Traditional & Festive',
    tagline: 'Timeless warmth for sacred celebrations.',
    description: 'Intricately handcrafted brass urlis, floral-embedded wax diyas, and exclusive seasonal releases.',
    heroImage: ASSET_IMAGES.categories.traditional,
    subCategories: [
      {
        id: 'urli-diya',
        name: 'Urli & Diya Candles',
        description: 'Festive handcrafted brass and floral candles.',
        examples: ['Festive brass urlis', 'Floral wax diyas', 'Seasonal releases'] //[cite: 1]
      },
      {
        id: 'floral-embedded-wax',
        name: 'Floral Embedded Wax Candles',
        description: 'Wax candles embedded with real flowers for a natural and elegant look.',
        examples: ['Rose embedded candles', 'Marigold wax candles', 'Jasmine floral candles'] //[cite: 2]
      },
      {
        id: 'exclusive-seasonal-releases',
        name: 'Exclusive Seasonal Releases',
        description: 'Limited edition candles designed for special occasions and festivals.',
        examples: ['Diwali special edition', 'Christmas limited release', 'Easter seasonal collection'] //[cite: 3]
      }
    ]
  },
  {
    id: 'specialty-wax',
    title: 'Specialty Wax',
    tagline: 'Botanical purity meets innovative wax design.',
    description: 'Granulated sand wax interactive setups and real embedded dried flowers for a natural aesthetic.',
    heroImage: ASSET_IMAGES.categories.specialtyWax,
    subCategories: [
      {
        id: 'sand-botanical',
        name: 'Sand Wax & Botanical',
        description: 'Interactive granulated wax and floral embeds.',
        examples: ['Granulated wax setups', 'Embedded flower candles'] //[cite: 1]
      },
      {
        id: 'dried-flower-embedded',
        name: 'Dried Flower Embedded Candles',
        description: 'Candles with real dried flowers embedded for a natural and elegant look.',
        examples: ['Rose embedded candles', 'Lavender wax candles', 'Daisy floral candles'] //[cite: 2]
      },
      {
        id: 'innovative-wax-designs',
        name: 'Innovative Wax Designs',
        description: 'Unique and creative wax designs that push the boundaries of traditional candle making.',
        examples: ['Geometric wax candles', 'Layered color wax designs', 'Sculptural wax art'] //[cite: 3]
      }
    ]
  },
  {
    id: 'raw-materials',
    title: 'Candle Raw Materials',
    tagline: 'Wanted to Make Your Own Candles? We got you covered.',
    description: 'We provide a curated selection of high-quality raw materials for candle making, including soy wax, fragrance oils, wicks, moulds and containers.',
    heroImage: ASSET_IMAGES.categories.rawMaterials,
    subCategories: [
      {
        id: 'wax',
        name: 'Wax',
        description: 'High-quality soy wax for candle making.',
        examples: ['Sand wax', 'Soy wax', 'Gell Wax', 'Paraffin Wax'] //[cite: 1]
      },
      {
        id: 'wicks',
        name: 'Wicks',
        description: 'High-quality wicks for candle making.',
        examples: ['Cotton wicks', 'Wooden wicks', 'Soy wax wicks'] //[cite: 2]
      },
      {
        id: 'moulds-and-containers',
        name: 'Moulds & Containers',
        description: 'High-quality moulds and containers for candle making.',
        examples: ['Silicone moulds', 'Glass jars', 'Metal containers'] //[cite: 3]
      },
      {
        id: 'fragrance-oils',
        name: 'Fragrance Oils',
        description: 'High-quality fragrance oils for candle making.',
        examples: ['Lavender', 'Vanilla', 'Citrus', 'Rose'] //[cite: 4]
      }
    ]
  }
]