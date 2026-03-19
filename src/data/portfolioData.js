// src/data/portfolioData.js
// Image srcs use picsum.photos as dev placeholders — replace with real photos when ready.
// Format: https://picsum.photos/seed/{seed}/800/1000

export const categories = [
  {
    id: 'resort',
    label: 'Resort & Beach',
    subtitle: 'Warm weather collections from her last position',
    items: [
      { id: 'r1', src: 'https://picsum.photos/seed/resort1/800/1000', title: 'Linen Co-ord Set', alt: 'White linen co-ordinate set on model at beach' },
      { id: 'r2', src: 'https://picsum.photos/seed/resort2/800/1000', title: 'Halter Maxi Dress', alt: 'Terracotta halter maxi dress styled for resort' },
      { id: 'r3', src: 'https://picsum.photos/seed/resort3/800/1000', title: 'Wrap Coverup', alt: 'Sheer wrap coverup over swimwear' },
    ],
  },
  {
    id: 'sketches',
    label: 'Sketches',
    subtitle: 'Hand-drawn fashion illustrations and design flats',
    items: [
      { id: 's1', src: 'https://picsum.photos/seed/sketch1/800/1000', title: 'Evening Gown Study', alt: 'Hand-drawn sketch of an evening gown with draping detail' },
      { id: 's2', src: 'https://picsum.photos/seed/sketch2/800/1000', title: 'Structured Blazer Flat', alt: 'Design flat of structured double-breasted blazer' },
    ],
  },
  {
    id: 'streetwear',
    label: 'Streetwear',
    subtitle: 'Urban-influenced everyday pieces',
    items: [
      { id: 'sw1', src: 'https://picsum.photos/seed/street1/800/1000', title: 'Cargo Trousers', alt: 'Wide-leg cargo trousers in olive green' },
      { id: 'sw2', src: 'https://picsum.photos/seed/street2/800/1000', title: 'Oversized Bomber', alt: 'Quilted oversized bomber jacket' },
    ],
  },
  {
    id: 'sustainable',
    label: 'Sustainable',
    subtitle: 'Ethically made, consciously designed',
    items: [
      { id: 'su1', src: 'https://picsum.photos/seed/sustain1/800/1000', title: 'Deadstock Linen Shirt', alt: 'Boxy linen shirt made from deadstock fabric' },
      { id: 'su2', src: 'https://picsum.photos/seed/sustain2/800/1000', title: 'Upcycled Denim Set', alt: 'Two-piece set constructed from upcycled denim' },
    ],
  },
]
