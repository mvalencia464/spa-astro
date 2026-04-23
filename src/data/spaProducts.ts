import { brandImage } from '../lib/media';
import productsJson from '../../products.json';
import products2Json from '../../products2.json';

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

interface JsonIslandModel {
  Name: string;
  Elite_Tier?: {
    Specs?: Record<string, string | number>;
    Standard_Features?: string[];
  };
  Luxury_Tier?: {
    Specs?: Record<string, string | number>;
    Standard_Features?: string[];
  };
}

interface JsonProductsShape {
  Island_Series?: {
    Shared_Cabinet_Colors?: string[];
    Models?: JsonIslandModel[];
  };
}

const parsedProducts = productsJson as JsonProductsShape;
const parsedProducts2 = products2Json as {
  Artesian_Spas_2026_Catalog?: {
    Island_Spas_Series?: {
      Models?: Array<{
        Name: string;
        Specs_Elite_Trim?: {
          Seating?: number | string;
          Dimensions_Inches?: string;
          Dry_Weight_lbs?: number | string;
          Capacity_gal?: number | string;
          Total_Jets?: number | string;
          Jet_Pumps?: number | string;
          Circ_Pumps?: number | string;
        };
      }>;
    };
  };
};

const islandModelImageMap: Record<string, string[]> = {
  bimini: [
    'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_Black_Side_20View.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_Grey_Side_20View.webp',
    'https://media.stokeleads.com/spas/island-elite/2022_IslandSpas_TranquilityFall.webp'
  ],
  'grand-cayman': [
    'https://media.stokeleads.com/spas/island-elite/2025_20Cayman_Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Cayman_Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Cayman_Essential.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2022_IslandSpas_TranquilityFall.webp'
  ],
  antigua: [
    'https://media.stokeleads.com/spas/island-elite/2025_20Antigua_Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Antigua_Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Antigua_Essential.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Essential.webp',
    'https://media.stokeleads.com/spas/island-elite/2022_IslandSpas_TranquilityFall.webp'
  ],
  'isla-margarita': [
    'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Bahama_Luxury.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Cayman_Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2025_20Captiva_Elite.webp',
    'https://media.stokeleads.com/spas/island-elite/2022_IslandSpas_TranquilityFall.webp'
  ]
};

const cabinetGradientMap: Record<string, string> = {
  grey: 'linear-gradient(135deg, #6b7a8a, #4a5568)',
  black: 'linear-gradient(135deg, #2a2e34, #0f1114)',
  brown: 'linear-gradient(135deg, #8b6340, #6b4a2a)',
  tapestry: 'linear-gradient(135deg, #847766, #5d5346)'
};

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toSeatText(input: string | number | undefined): string {
  if (!input) return 'Seats Vary';
  const raw = String(input);
  const match = raw.match(/\d+/);
  return match ? `${match[0]} Seats` : raw;
}

function toGallonsText(input: string | number | undefined): string {
  if (!input) return 'Capacity Varies';
  const raw = String(input);
  const match = raw.match(/\d+/);
  return match ? `${match[0]} Gallons` : raw;
}

function toDimensionText(input: string | number | undefined): string {
  if (!input) return 'Dimensions Vary';
  const raw = String(input).replace(/ in$/i, '');
  const parts = raw.split(/\s*x\s*/i);
  return parts.length === 3 ? `${parts[0]}″ × ${parts[1]}″ × ${parts[2]}″` : raw;
}

function buildIslandProductsFromJson(): SpaProduct[] {
  const island = parsedProducts.Island_Series;
  if (!island?.Models?.length) return [];

  const cabinetColors =
    island.Shared_Cabinet_Colors?.map((name) => ({
      name,
      gradient: cabinetGradientMap[name.toLowerCase()] ?? 'linear-gradient(135deg, #6b7a8a, #4a5568)'
    })) ?? [];

  return island.Models.map((model) => {
    const slug = slugifyName(model.Name);
    const eliteSpecs = model.Elite_Tier?.Specs ?? {};
    const eliteFeatures = model.Elite_Tier?.Standard_Features ?? [];
    const gallery = islandModelImageMap[slug] ?? islandModelImageMap.bimini;
    const jets = eliteSpecs.Jets ?? model.Luxury_Tier?.Specs?.Jets ?? 'N/A';

    const featureCards = eliteFeatures.slice(0, 3).map((feature, index) => ({
      tag: ['Hydrotherapy', 'Performance', 'Construction'][index] ?? 'Feature',
      title: feature,
      description: `${feature} is included standard on ${model.Name} in the Island Elite lineup.`
    }));

    const specRows: Array<[string, string]> = [
      ['Seating Capacity', String(eliteSpecs.Seating ?? 'See dealer')],
      ['Dimensions (L × W × H)', toDimensionText(eliteSpecs.Size)],
      ['Water Capacity', String(eliteSpecs.Capacity ?? 'See dealer')],
      ['Dry Weight', String(eliteSpecs.Dry_Weight ?? 'See dealer')]
    ];

    return {
      slug,
      name: model.Name,
      series: 'Island Elite Series · Artesian Spas',
      model: `${toSeatText(eliteSpecs.Seating)} Hydrotherapy Spa`,
      startingPrice: 'Call for Pricing',
      heroAlt: `Artesian ${model.Name} Hot Tub`,
      gallery,
      quickSpecs: {
        seats: toSeatText(eliteSpecs.Seating),
        jets: `${jets} Jets`,
        dimensions: toDimensionText(eliteSpecs.Size),
        gallons: toGallonsText(eliteSpecs.Capacity)
      },
      features: featureCards.length
        ? featureCards
        : [
            { tag: 'Hydrotherapy', title: 'Island Therapy Seating', description: 'Purpose-built seat geometry and jet placement for full-body relief.' },
            { tag: 'Performance', title: 'High-Output Jetting', description: 'Balanced pressure zones designed for long-duration therapeutic soaks.' },
            { tag: 'Construction', title: 'Island Elite Build', description: 'Engineered shell and cabinet construction for all-season reliability.' }
          ],
      signature: {
        title: `${model.Name} Therapy Configuration`,
        description: `${model.Name} combines high-jet therapy with Island Elite comfort zones for a premium backyard spa experience.`,
        stats: [
          { value: String(jets), label: 'Total Jets' },
          { value: toSeatText(eliteSpecs.Seating).replace(' Seats', ''), label: 'Seats' },
          { value: String(eliteSpecs.Capacity ?? 'N/A').replace(' gal', ''), label: 'Gallons' }
        ],
        image: gallery[1] ?? gallery[0]
      },
      specSections: [
        { title: 'Dimensions & Capacity', rows: specRows },
        {
          title: 'Jet System',
          rows: [
            ['Total Jets', `${jets} Jets`],
            ['Control System', 'DirectFlow Personal Control'],
            ['Water Feature', 'Dual Cascade Falls'],
            ['Ozone', 'Included']
          ]
        },
        {
          title: 'Electrical & Pumps',
          rows: [
            ['Pump Configuration', String(eliteSpecs.Pumps ?? 'See dealer')],
            ['Heater', '5.5 kW (60Hz)'],
            ['Insulation', 'Full Foam'],
            ['Warranty', 'Extended Warranty']
          ]
        }
      ],
      specDiagramLabel: `${model.Name} · Island Elite`,
      specHighlights: [
        { value: String(jets), label: 'Total Jets' },
        { value: String(eliteSpecs.Capacity ?? 'N/A').replace(' gal', ''), label: 'Gallons' },
        { value: toSeatText(eliteSpecs.Seating).replace(' Seats', ''), label: 'Seat Positions' },
        { value: '104°', label: 'Max Temp' }
      ],
      shellColors: [
        { name: 'Silver Marble', gradient: 'linear-gradient(135deg, #c0c8d0, #8898a4)' },
        { name: 'White Pearl', gradient: 'linear-gradient(135deg, #f5f0eb, #e2ddd6)' },
        { name: 'Midnight Canyon', gradient: 'linear-gradient(135deg, #1a2535, #0e1820)' }
      ],
      cabinetColors: cabinetColors.length
        ? cabinetColors
        : [
            { name: 'Grey', gradient: 'linear-gradient(135deg, #6b7a8a, #4a5568)' },
            { name: 'Black', gradient: 'linear-gradient(135deg, #2a2e34, #0f1114)' },
            { name: 'Brown', gradient: 'linear-gradient(135deg, #8b6340, #6b4a2a)' }
          ],
      related: []
    };
  });
}

function buildIslandProductsFromJson2026(): SpaProduct[] {
  const models = parsedProducts2.Artesian_Spas_2026_Catalog?.Island_Spas_Series?.Models;
  if (!models?.length) return [];

  return models.map((model) => {
    const slug = slugifyName(model.Name);
    const specs = model.Specs_Elite_Trim ?? {};
    const gallery = islandModelImageMap[slug] ?? islandModelImageMap.bimini;
    const jets = specs.Total_Jets ?? 'N/A';
    const seating = specs.Seating ?? 'See dealer';
    const capacity = specs.Capacity_gal ?? 'See dealer';

    return {
      slug,
      name: model.Name,
      series: 'Island Elite Series · Artesian Spas',
      model: `${toSeatText(seating)} Hydrotherapy Spa`,
      startingPrice: 'Call for Pricing',
      heroAlt: `Artesian ${model.Name} Hot Tub`,
      gallery,
      quickSpecs: {
        seats: toSeatText(seating),
        jets: `${jets} Jets`,
        dimensions: toDimensionText(specs.Dimensions_Inches),
        gallons: toGallonsText(capacity)
      },
      features: [
        {
          tag: 'Hydrotherapy',
          title: 'Island Elite Jet Therapy',
          description: `${model.Name} uses Elite trim hydrotherapy configuration for full-body treatment zones.`
        },
        {
          tag: 'Performance',
          title: 'DirectFlow Personal Control',
          description: 'DirectFlow control and high-output pumps let you tune pressure by seat in real time.'
        },
        {
          tag: 'Construction',
          title: 'Full Foam Insulation',
          description: 'Built with full foam insulation and rugged base construction for all-season operation.'
        }
      ],
      signature: {
        title: `${model.Name} Elite Configuration`,
        description: `${model.Name} in Elite trim balances high jet count, strong pump output, and deep seating comfort.`,
        stats: [
          { value: String(jets), label: 'Total Jets' },
          { value: String(seating).replace(/[^0-9/]/g, ''), label: 'Seats' },
          { value: String(capacity).replace(/[^0-9/]/g, ''), label: 'Gallons' }
        ],
        image: gallery[1] ?? gallery[0]
      },
      specSections: [
        {
          title: 'Dimensions & Capacity',
          rows: [
            ['Seating Capacity', String(seating)],
            ['Dimensions (L × W × H)', toDimensionText(specs.Dimensions_Inches)],
            ['Water Capacity', String(capacity)],
            ['Dry Weight', `${specs.Dry_Weight_lbs ?? 'See dealer'} lbs`]
          ]
        },
        {
          title: 'Jet System',
          rows: [
            ['Total Jets', `${jets} Jets`],
            ['Jet Pumps', String(specs.Jet_Pumps ?? 'See dealer')],
            ['Circulation Pumps', String(specs.Circ_Pumps ?? 'See dealer')],
            ['Control', 'DirectFlow Personal Control']
          ]
        },
        {
          title: 'Electrical & Build',
          rows: [
            ['Insulation', 'Full Foam'],
            ['Water Care', 'Ozone'],
            ['Lighting', 'Elite Interior & Exterior Lighting'],
            ['Warranty', 'See dealer for full details']
          ]
        }
      ],
      specDiagramLabel: `${model.Name} · Island Elite`,
      specHighlights: [
        { value: String(jets), label: 'Total Jets' },
        { value: String(capacity).replace(/[^0-9/]/g, ''), label: 'Gallons' },
        { value: String(seating).replace(/[^0-9/]/g, ''), label: 'Seat Positions' },
        { value: '104°', label: 'Max Temp' }
      ],
      shellColors: [
        { name: 'Silver Marble', gradient: 'linear-gradient(135deg, #c0c8d0, #8898a4)' },
        { name: 'White Pearl', gradient: 'linear-gradient(135deg, #f5f0eb, #e2ddd6)' },
        { name: 'Midnight Canyon', gradient: 'linear-gradient(135deg, #1a2535, #0e1820)' }
      ],
      cabinetColors: [
        { name: 'Grey', gradient: 'linear-gradient(135deg, #6b7a8a, #4a5568)' },
        { name: 'Black', gradient: 'linear-gradient(135deg, #2a2e34, #0f1114)' },
        { name: 'Brown', gradient: 'linear-gradient(135deg, #8b6340, #6b4a2a)' }
      ],
      related: []
    };
  });
}

export const spaProducts: SpaProduct[] = [
  {
    slug: 'mystique',
    name: 'Mystique',
    series: 'Island Elite Series · Artesian Spas',
    model: '6-Person Hydrotherapy Spa · Model MST-639',
    startingPrice: '$11,999',
    heroAlt: 'Artesian Mystique Hot Tub',
    gallery: [
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Elite.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_Black_Side_20View.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Captiva_Elite.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Antigua_Elite.webp',
      'https://media.stokeleads.com/spas/island-elite/2022_IslandSpas_TranquilityFall.webp'
    ],
    quickSpecs: {
      seats: '6 Seats',
      jets: '38 Jets',
      dimensions: '84″ × 84″ × 35″',
      gallons: '350 Gallons'
    },
    features: [
      {
        tag: 'Hydrotherapy',
        title: 'SmartJet System',
        description:
          'Redirect water flow between jets with a simple twist — concentrate therapy exactly where you need it.'
      },
      {
        tag: 'Filtration',
        title: 'SureFlow Circulation',
        description:
          'A dedicated low-watt circulation pump runs 24/7 keeping water clear without cycling your main pump constantly.'
      },
      {
        tag: 'Construction',
        title: 'Everwood HD Cabinet',
        description: 'High-density polyethylene cabinet built for Idaho weather with zero maintenance required.'
      }
    ],
    signature: {
      title: 'Full-Length Lounge Seat',
      description:
        "Mystique's contoured lounge seat cradles your full body with dedicated jet zones for spine, calves, and feet.",
      stats: [
        { value: '6', label: 'Spine Jets' },
        { value: '4', label: 'Calf Jets' },
        { value: '2', label: 'Foot Jets' }
      ],
      image: 'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Elite.webp'
    },
    specSections: [
      {
        title: 'Dimensions & Capacity',
        rows: [
          ['Seating Capacity', '6 Adults'],
          ['Dimensions (L × W × H)', '84″ × 84″ × 35″'],
          ['Water Capacity', '350 Gallons'],
          ['Dry Weight', '680 lbs']
        ]
      },
      {
        title: 'Jet System',
        rows: [
          ['Total Jets', '38 Jets'],
          ['Lounge Jets', '12 (SmartJet)'],
          ['Therapy Seat Jets', '16 (directional)'],
          ['Foot Jets', '6']
        ]
      },
      {
        title: 'Electrical',
        rows: [
          ['Voltage', '240V / 60Hz'],
          ['Amperage', '50 Amps (GFCI required)'],
          ['Main Pump', '2.5 HP, 2-speed'],
          ['Heater', '5.5 kW Titanium']
        ]
      }
    ],
    specDiagramLabel: 'Mystique · MST-639 · 84″ × 84″',
    specHighlights: [
      { value: '38', label: 'Total Jets' },
      { value: '350', label: 'Gallons' },
      { value: '104°', label: 'Max Temp' },
      { value: '6', label: 'Seat Positions' }
    ],
    shellColors: [
      { name: 'Silver Marble', gradient: 'linear-gradient(135deg, #c0c8d0, #8898a4)' },
      { name: 'White Pearl', gradient: 'linear-gradient(135deg, #f5f0eb, #e2ddd6)' },
      { name: 'Midnight Canyon', gradient: 'linear-gradient(135deg, #1a2535, #0e1820)' }
    ],
    cabinetColors: [
      { name: 'Coastal Gray', gradient: 'linear-gradient(135deg, #6b7a8a, #4a5568)' },
      { name: 'Espresso', gradient: 'linear-gradient(135deg, #3d2b1f, #2a1d14)' },
      { name: 'Teak', gradient: 'linear-gradient(135deg, #8b6340, #6b4a2a)' }
    ],
    related: [
      {
        slug: 'bimini',
        series: 'Island Elite Series',
        name: 'Bimini',
        meta: '6 Seats · 42 Jets',
        priceLabel: 'From $12,499',
        image: 'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Luxury.webp'
      }
    ]
  },
  {
    slug: 'bimini',
    name: 'Bimini',
    series: 'Island Elite Series · Artesian Spas',
    model: '6-Person Hydrotherapy Spa · Model BIM-635',
    startingPrice: '$12,499',
    heroAlt: 'Artesian Bimini Hot Tub',
    gallery: [
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Elite.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Luxury.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_Black_Side_20View.webp',
      'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_Grey_Side_20View.webp',
      'https://media.stokeleads.com/spas/island-elite/2022_IslandSpas_TranquilityFall.webp'
    ],
    quickSpecs: {
      seats: '6 Seats',
      jets: '42 Jets',
      dimensions: '85″ × 85″ × 36″',
      gallons: '365 Gallons'
    },
    features: [
      {
        tag: 'Hydrotherapy',
        title: 'IslandFlow Therapy',
        description: 'Deep captain-seat hydrotherapy tuned for shoulder, lumbar, and calf recovery.'
      },
      {
        tag: 'Filtration',
        title: 'QuietFlo Circulation',
        description: '24/7 low-power circulation keeps the water polished while minimizing energy usage.'
      },
      {
        tag: 'Construction',
        title: 'WeatherShield Cabinet',
        description: 'Durable cabinet system designed for freeze/thaw cycles and hot summer conditions.'
      }
    ],
    signature: {
      title: 'Deep Therapy Captain Seat',
      description:
        'Bimini features a deep therapy captain seat that keeps body position stable for longer treatment sessions.',
      stats: [
        { value: '7', label: 'Back Jets' },
        { value: '4', label: 'Calf Jets' },
        { value: '2', label: 'Foot Jets' }
      ],
      image: 'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Luxury.webp'
    },
    specSections: [
      {
        title: 'Dimensions & Capacity',
        rows: [
          ['Seating Capacity', '6 Adults'],
          ['Dimensions (L × W × H)', '85″ × 85″ × 36″'],
          ['Water Capacity', '365 Gallons'],
          ['Dry Weight', '710 lbs']
        ]
      },
      {
        title: 'Jet System',
        rows: [
          ['Total Jets', '42 Jets'],
          ['Captain Seat Jets', '14'],
          ['Therapy Seat Jets', '18'],
          ['Foot Jets', '6']
        ]
      },
      {
        title: 'Electrical',
        rows: [
          ['Voltage', '240V / 60Hz'],
          ['Amperage', '50 Amps (GFCI required)'],
          ['Main Pump', '3.0 HP, 2-speed'],
          ['Heater', '5.5 kW Titanium']
        ]
      }
    ],
    specDiagramLabel: 'Bimini · BIM-635 · 85″ × 85″',
    specHighlights: [
      { value: '42', label: 'Total Jets' },
      { value: '365', label: 'Gallons' },
      { value: '104°', label: 'Max Temp' },
      { value: '6', label: 'Seat Positions' }
    ],
    shellColors: [
      { name: 'Silver Marble', gradient: 'linear-gradient(135deg, #c0c8d0, #8898a4)' },
      { name: 'White Pearl', gradient: 'linear-gradient(135deg, #f5f0eb, #e2ddd6)' },
      { name: 'Storm', gradient: 'linear-gradient(135deg, #4a5568, #2d3748)' }
    ],
    cabinetColors: [
      { name: 'Coastal Gray', gradient: 'linear-gradient(135deg, #6b7a8a, #4a5568)' },
      { name: 'Espresso', gradient: 'linear-gradient(135deg, #3d2b1f, #2a1d14)' },
      { name: 'Teak', gradient: 'linear-gradient(135deg, #8b6340, #6b4a2a)' }
    ],
    related: [
      {
        slug: 'mystique',
        series: 'Island Elite Series',
        name: 'Mystique',
        meta: '6 Seats · 38 Jets',
        priceLabel: 'From $11,999',
        image: 'https://media.stokeleads.com/spas/island-elite/2025_20Bimini_20Elite.webp'
      }
    ]
  }
];

const jsonIslandProducts = buildIslandProductsFromJson();
for (const product of jsonIslandProducts) {
  if (!spaProducts.some((p) => p.slug === product.slug)) {
    spaProducts.push(product);
  }
}

const json2026IslandProducts = buildIslandProductsFromJson2026();
for (const product of json2026IslandProducts) {
  if (!spaProducts.some((p) => p.slug === product.slug)) {
    spaProducts.push(product);
  }
}

export const spaProductBySlug = Object.fromEntries(spaProducts.map((product) => [product.slug, product]));
export const logoImage = brandImage('logo.webp');
