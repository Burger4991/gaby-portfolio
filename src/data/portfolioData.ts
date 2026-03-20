export type PortfolioItem = {
  id: string
  src: string
  title: string
  alt: string
  slug?: string
}

export type ProcessStage = {
  label: string
  src: string
  caption?: string
}

export type PortfolioCategory = {
  id: string
  label: string
  subtitle: string
  description: string
  outcome: string
  items: PortfolioItem[]
  processStages: ProcessStage[]
}

export const categories: PortfolioCategory[] = [
  {
    id: 'resort',
    label: 'Resort & Activewear',
    subtitle: "RTW women's resort and activewear collections",
    description:
      'Trend-led resort and activewear capsules developed for global retail — blending wearable silhouettes with elevated fabrications. Directed from initial moodboard through final tech packs, vendor negotiation, and sample approval.',
    outcome: '12 styles across 3 colorways. Presented to buyers at Miami Swim Week.',
    items: [
      { id: 'r1', src: 'https://picsum.photos/seed/resort1/800/1000', title: 'Linen Co-ord Set', alt: 'Linen co-ordinate set — resort collection' },
      { id: 'r2', src: 'https://picsum.photos/seed/resort2/800/1000', title: 'Halter Maxi Dress', alt: 'Halter maxi dress styled for resort' },
      { id: 'r3', src: 'https://picsum.photos/seed/resort3/800/1000', title: 'Wrap Coverup', alt: 'Sheer wrap coverup over swimwear' },
    ],
    processStages: [
      { label: 'Research', src: 'https://picsum.photos/seed/resort-s1/800/600', caption: 'Trend & color research' },
      { label: 'Concept', src: 'https://picsum.photos/seed/resort-s2/800/600', caption: 'Silhouette sketches' },
      { label: 'Tech Packs', src: 'https://picsum.photos/seed/resort-s3/800/600', caption: 'Technical specifications' },
      { label: 'Sampling', src: 'https://picsum.photos/seed/resort-s4/800/600', caption: 'Sample review + fit' },
      { label: 'Final', src: 'https://picsum.photos/seed/resort-s5/800/600', caption: 'Production-ready styles' },
    ],
  },
  {
    id: 'cutsew',
    label: 'Cut & Sew Knits',
    subtitle: 'RTW — cut & sew knits, crochet, and soft wovens',
    description:
      'Artisan-led cut & sew and crochet capsule rooted in craft. Each piece developed with hand-crochet detailing, patchwork construction, and fabric innovation — balancing handmade character with mass-market scalability.',
    outcome: 'Featured in editorial. 300K+ units projected across the season.',
    items: [
      { id: 'cs1', src: 'https://picsum.photos/seed/knit1/800/1000', title: 'Crochet Top', alt: 'Hand-crocheted top — knit collection' },
      { id: 'cs2', src: 'https://picsum.photos/seed/knit2/800/1000', title: 'Soft Woven Set', alt: 'Soft woven co-ordinate set' },
    ],
    processStages: [
      { label: 'Moodboard', src: 'https://picsum.photos/seed/cutsew-s1/800/600', caption: 'Craft + texture references' },
      { label: 'Concept', src: 'https://picsum.photos/seed/cutsew-s2/800/600', caption: 'Crochet & patchwork exploration' },
      { label: 'Sampling', src: 'https://picsum.photos/seed/cutsew-s3/800/600', caption: 'Hand-sample development' },
      { label: 'Final', src: 'https://picsum.photos/seed/cutsew-s4/800/600', caption: 'Collection sign-off' },
      { label: 'Editorial', src: 'https://picsum.photos/seed/cutsew-s5/800/600', caption: 'Campaign photography' },
    ],
  },
  {
    id: 'bridal',
    label: 'Bridal & Eveningwear',
    subtitle: 'Custom bespoke bridal and evening collections',
    description:
      'Bespoke evening and bridal looks built from client concept to final fitting. Emphasis on luxe fabrication, intricate construction, and custom embellishment — each piece a singular design collaboration.',
    outcome: 'Custom pieces produced for private clients. Featured in editorial.',
    items: [
      { id: 'b1', src: 'https://picsum.photos/seed/bridal1/800/1000', title: 'Evening Gown', alt: 'Custom evening gown — bridal collection' },
      { id: 'b2', src: 'https://picsum.photos/seed/bridal2/800/1000', title: 'Bespoke Bridal', alt: 'Custom bespoke bridal look' },
    ],
    processStages: [
      { label: 'Consultation', src: 'https://picsum.photos/seed/bridal-s1/800/600', caption: 'Client brief + references' },
      { label: 'Sketch', src: 'https://picsum.photos/seed/bridal-s2/800/600', caption: 'Design development' },
      { label: 'Toile', src: 'https://picsum.photos/seed/bridal-s3/800/600', caption: 'Muslin fitting' },
      { label: 'Final Fabric', src: 'https://picsum.photos/seed/bridal-s4/800/600', caption: 'Final fabric + fitting' },
      { label: 'Delivery', src: 'https://picsum.photos/seed/bridal-s5/800/600', caption: 'Final piece delivered' },
    ],
  },
  {
    id: 'illustrations',
    label: 'Hand Illustrations',
    subtitle: 'Fashion illustrations — Procreate, markers, and colored pencils',
    description:
      'Original fashion illustration across digital and traditional media. Work spans technical flats for spec sheets, editorial illustration for concept presentations, and fine-art figure studies.',
    outcome: 'Used across design presentations, client pitches, and brand identity work.',
    items: [
      { id: 'i1', src: 'https://picsum.photos/seed/sketch1/800/1000', title: 'Evening Gown Study', alt: 'Hand-drawn fashion illustration — evening gown' },
      { id: 'i2', src: 'https://picsum.photos/seed/sketch2/800/1000', title: 'Resort Silhouettes', alt: 'Fashion illustration — resort silhouettes' },
      { id: 'i3', src: 'https://picsum.photos/seed/sketch3/800/1000', title: 'Technical Flat', alt: 'Technical design flat — spec sheet illustration' },
    ],
    processStages: [
      { label: 'Reference', src: 'https://picsum.photos/seed/illus-s1/800/600', caption: 'Photo + runway references' },
      { label: 'Rough', src: 'https://picsum.photos/seed/illus-s2/800/600', caption: 'Rough gesture sketches' },
      { label: 'Line Art', src: 'https://picsum.photos/seed/illus-s3/800/600', caption: 'Clean line illustration' },
      { label: 'Color', src: 'https://picsum.photos/seed/illus-s4/800/600', caption: 'Color + rendering' },
      { label: 'Final', src: 'https://picsum.photos/seed/illus-s5/800/600', caption: 'Finished illustration' },
    ],
  },
]
