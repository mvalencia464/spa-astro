import { brandImage } from '../lib/media';

export interface ProductFeature {
  tag: string;
  title: string;
  description: string;
}

export interface ProductSpecSection {
  title: string;
  rows: Array<[string, string]>;
}

export interface ProductSpecHighlight {
  value: string;
  label: string;
}

export interface ProductSwatch {
  name: string;
  gradient: string;
}

export interface ProductRelated {
  slug: string;
  series: string;
  name: string;
  meta: string;
  priceLabel: string;
  image: string;
}

export interface SpaProduct {
  slug: string;
  name: string;
  series: string;
  model: string;
  startingPrice: string;
  heroAlt: string;
  heroImage?: string;
  gallery: string[];
  quickSpecs: {
    seats: string;
    jets: string;
    dimensions: string;
    gallons: string;
  };
  features: ProductFeature[];
  signature: {
    title: string;
    description: string;
    stats: Array<{ value: string; label: string }>;
    image: string;
  };
  specSections: ProductSpecSection[];
  specDiagramLabel: string;
  specHighlights: ProductSpecHighlight[];
  shellColors: ProductSwatch[];
  cabinetColors: ProductSwatch[];
  related: ProductRelated[];
}

const sharedShellColors: ProductSwatch[] = [
  { name: 'Silver Marble', gradient: 'linear-gradient(135deg, #c0c8d0, #8898a4)' },
  { name: 'White Pearl', gradient: 'linear-gradient(135deg, #f5f0eb, #e2ddd6)' },
  { name: 'Midnight Canyon', gradient: 'linear-gradient(135deg, #1a2535, #0e1820)' }
];

const sharedCabinetColors: ProductSwatch[] = [
  { name: 'Coastal Gray', gradient: 'linear-gradient(135deg, #6b7a8a, #4a5568)' },
  { name: 'Espresso', gradient: 'linear-gradient(135deg, #3d2b1f, #2a1d14)' },
  { name: 'Teak', gradient: 'linear-gradient(135deg, #8b6340, #6b4a2a)' }
];

const lifestyle2025Images = [
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(5).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(7).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(9).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(12).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(14).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(18).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(20).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(24).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(27).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(29).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(32).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(34).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(38).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(41).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(45).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(46).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(49).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(52).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(58).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(61).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(62).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(63).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(64).webp',
  'https://media.stokeleads.com/spas/island-elite/2025_20Island.webp'
];

function withLifestyleImages(base: string[], seed: number): string[] {
  const picks = [0, 1, 2].map((step) => lifestyle2025Images[(seed + step * 5) % lifestyle2025Images.length]);
  return [...new Set([...base, ...picks])];
}

function buildIslandModel(slug: string, name: string, gallery: string[]): SpaProduct {
  const enrichedGallery = withLifestyleImages(gallery, slug.length);
  return {
    slug,
    name,
    series: 'Island Elite Series · Artesian Spas',
    model: 'Open Seating Hydrotherapy Spa',
    startingPrice: 'Call for Pricing',
    heroAlt: `Artesian ${name} Hot Tub`,
    heroImage: enrichedGallery[0],
    gallery: enrichedGallery,
    quickSpecs: { seats: 'Open Seating', jets: 'Jets Vary', dimensions: 'See Dealer', gallons: 'Capacity Varies' },
    features: [
      { tag: 'Hydrotherapy', title: 'Island Elite Therapy', description: `${name} is tuned for full-body hydrotherapy comfort.` },
      { tag: 'Performance', title: 'DirectFlow Controls', description: 'Fine-tune pressure output by seat in real time.' },
      { tag: 'Construction', title: 'All-Season Build', description: 'Premium shell and insulation package for year-round comfort.' }
    ],
    signature: {
      title: `${name} Therapy Layout`,
      description: `${name} balances social seating with trim-based hydrotherapy performance.`,
      stats: [{ value: 'Elite', label: 'Trim' }, { value: 'Luxury', label: 'Trim' }, { value: 'Essential', label: 'Trim' }],
      image: gallery[1] ?? gallery[0]
    },
    specSections: [{ title: 'Key Specs', rows: [['Seating Capacity', 'Varies by trim'], ['Dimensions (L x W x H)', 'See dealer spec sheet'], ['Water Capacity', 'See dealer spec sheet'], ['Pump Configuration', 'Varies by trim']] }],
    specDiagramLabel: `${name} · Island Elite`,
    specHighlights: [{ value: 'Elite', label: 'Trim' }, { value: 'Luxury', label: 'Trim' }, { value: 'Essential', label: 'Trim' }, { value: '104°', label: 'Max Temp' }],
    shellColors: sharedShellColors,
    cabinetColors: sharedCabinetColors,
    related: []
  };
}

export const spaProducts: SpaProduct[] = [
  {
    slug: 'mystique',
    name: 'Mystique',
    series: 'Island Elite Series · Artesian Spas',
    model: '6-Person Hydrotherapy Spa · Model MST-639',
    startingPrice: '$11,999',
    heroAlt: 'Artesian Mystique Hot Tub',
    heroImage: 'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(24).webp',
    gallery: withLifestyleImages([
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Elite.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_Black_Side_20View.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Captiva_Elite.webp'
    ], 2),
    quickSpecs: { seats: '6 Seats', jets: '38 Jets', dimensions: '84" x 84" x 35"', gallons: '350 Gallons' },
    features: [
      { tag: 'Hydrotherapy', title: 'SmartJet System', description: 'Redirect water flow between jets with a twist for focused therapy.' },
      { tag: 'Filtration', title: 'SureFlow Circulation', description: '24/7 low-watt circulation keeps water clear and energy use low.' },
      { tag: 'Construction', title: 'Everwood HD Cabinet', description: 'Low-maintenance cabinet engineered for all-season performance.' }
    ],
    signature: {
      title: 'Full-Length Lounge Seat',
      description: 'A contoured lounge seat with dedicated spine, calf, and foot jet zones.',
      stats: [{ value: '6', label: 'Spine Jets' }, { value: '4', label: 'Calf Jets' }, { value: '2', label: 'Foot Jets' }],
      image: 'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Elite.webp'
    },
    specSections: [{ title: 'Dimensions & Capacity', rows: [['Seating Capacity', '6 Adults'], ['Dimensions (L x W x H)', '84" x 84" x 35"'], ['Water Capacity', '350 Gallons'], ['Dry Weight', '680 lbs']] }],
    specDiagramLabel: 'Mystique · MST-639 · 84 x 84',
    specHighlights: [{ value: '38', label: 'Total Jets' }, { value: '350', label: 'Gallons' }, { value: '104°', label: 'Max Temp' }, { value: '6', label: 'Seat Positions' }],
    shellColors: sharedShellColors,
    cabinetColors: sharedCabinetColors,
    related: []
  },
  {
    slug: 'bimini',
    name: 'Bimini',
    series: 'Island Elite Series · Artesian Spas',
    model: '6-Person Hydrotherapy Spa · Model BIM-635',
    startingPrice: '$12,499',
    heroAlt: 'Artesian Bimini Hot Tub',
    heroImage: 'https://media.stokeleads.com/spas/island-elite/2025_20Island_20(32).webp',
    gallery: withLifestyleImages([
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Luxury.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_Black_Side_20View.webp',
      'https://media.stokeleads.com/spas/island-elite/2022_IslandSpas_TranquilityFall.webp'
    ], 4),
    quickSpecs: { seats: '6 Seats', jets: '42 Jets', dimensions: '85" x 85" x 36"', gallons: '365 Gallons' },
    features: [
      { tag: 'Hydrotherapy', title: 'IslandFlow Therapy', description: 'Deep captain-seat hydrotherapy for shoulders, lumbar, and calves.' },
      { tag: 'Filtration', title: 'QuietFlo Circulation', description: 'Keeps water polished without heavy main pump cycling.' },
      { tag: 'Construction', title: 'WeatherShield Cabinet', description: 'Durable cabinet system built for freeze/thaw climates.' }
    ],
    signature: {
      title: 'Deep Therapy Captain Seat',
      description: 'Keeps body position stable for longer treatment sessions and deeper relief.',
      stats: [{ value: '7', label: 'Back Jets' }, { value: '4', label: 'Calf Jets' }, { value: '2', label: 'Foot Jets' }],
      image: 'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Luxury.webp'
    },
    specSections: [{ title: 'Dimensions & Capacity', rows: [['Seating Capacity', '6 Adults'], ['Dimensions (L x W x H)', '85" x 85" x 36"'], ['Water Capacity', '365 Gallons'], ['Dry Weight', '710 lbs']] }],
    specDiagramLabel: 'Bimini · BIM-635 · 85 x 85',
    specHighlights: [{ value: '42', label: 'Total Jets' }, { value: '365', label: 'Gallons' }, { value: '104°', label: 'Max Temp' }, { value: '6', label: 'Seat Positions' }],
    shellColors: sharedShellColors,
    cabinetColors: sharedCabinetColors,
    related: []
  },
  {
    slug: 'isla-margarita',
    name: 'Isla Margarita',
    series: 'Island Elite Series · Artesian Spas',
    model: 'Open Seating Hydrotherapy Spa',
    startingPrice: 'Call for Pricing',
    heroAlt: 'Artesian Isla Margarita Hot Tub',
    heroImage: 'https://media.stokeleads.com/spas/island-elite/2025_20Island.webp',
    gallery: withLifestyleImages([
      'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Elite.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Luxury.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Cayman_Elite.webp'
    ], 6),
    quickSpecs: { seats: 'Open Seating', jets: 'Jets Vary', dimensions: 'See Dealer', gallons: 'Capacity Varies' },
    features: [
      { tag: 'Hydrotherapy', title: 'Island Elite Therapy', description: 'Balanced therapy seats tuned for all-body relaxation.' },
      { tag: 'Performance', title: 'DirectFlow Controls', description: 'Fine-tune pressure output by seat in real time.' },
      { tag: 'Construction', title: 'All-Season Build', description: 'Premium shell and insulation package for year-round comfort.' }
    ],
    signature: {
      title: 'Multi-Seat Therapy Layout',
      description: 'A social open-seat layout with trim-driven performance options.',
      stats: [{ value: 'Elite', label: 'Trim' }, { value: 'Luxury', label: 'Trim' }, { value: 'Essential', label: 'Trim' }],
      image: 'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Elite.webp'
    },
    specSections: [{ title: 'Key Specs', rows: [['Seating Capacity', 'Varies by trim'], ['Dimensions (L x W x H)', 'See dealer spec sheet'], ['Water Capacity', 'See dealer spec sheet'], ['Pump Configuration', 'Varies by trim']] }],
    specDiagramLabel: 'Isla Margarita · Island Elite',
    specHighlights: [{ value: 'Elite', label: 'Trim' }, { value: 'Luxury', label: 'Trim' }, { value: 'Essential', label: 'Trim' }, { value: '104°', label: 'Max Temp' }],
    shellColors: sharedShellColors,
    cabinetColors: sharedCabinetColors,
    related: []
  },
  buildIslandModel('grand-cayman', 'Grand Cayman', [
    'https://media.stokeleads.com/spas/island-elite/2025_20Cayman_Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Cayman_Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Cayman_Essential.webp'
  ]),
  buildIslandModel('grand-bahama', 'Grand Bahama', [
    'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Essential.webp'
  ]),
  buildIslandModel('antigua', 'Antigua', [
    'https://media.stokeleads.com/spas/island-elite/2025_20Antigua_Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Antigua_Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Antigua_Essential.webp'
  ]),
  buildIslandModel('captiva', 'Captiva', [
    'https://media.stokeleads.com/spas/island-elite/2025_20Captiva_Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Captiva_Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Captiva_Essential.webp'
  ]),
  buildIslandModel('nevis', 'Nevis', [
    'https://media.stokeleads.com/spas/island-elite/2025_20Captiva_Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Captiva_Essential.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Cayman_Essential.webp'
  ]),
  buildIslandModel('santa-cruz', 'Santa Cruz', [
    'https://media.stokeleads.com/spas/island-elite/2025_20Antigua_Essential.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Captiva_Essential.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Essential.webp'
  ])
];

export const spaProductBySlug = Object.fromEntries(spaProducts.map((product) => [product.slug, product]));
export const logoImage = brandImage('logo.webp');
