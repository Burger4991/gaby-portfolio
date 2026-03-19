export type PortfolioItem = {
  id: string
  src: string
  title: string
  alt: string
  slug?: string
}

export type PortfolioCategory = {
  id: string
  label: string
  subtitle: string
  items: PortfolioItem[]
}

export const categories: PortfolioCategory[] = [
  {
    id: 'resort',
    label: 'Resort & Activewear',
    subtitle: "RTW women's resort and activewear collections",
    items: [
      { id: 'r1', src: 'https://picsum.photos/seed/resort1/800/1000', title: 'Linen Co-ord Set', alt: 'Linen co-ordinate set — resort collection' },
      { id: 'r2', src: 'https://picsum.photos/seed/resort2/800/1000', title: 'Halter Maxi Dress', alt: 'Halter maxi dress styled for resort' },
      { id: 'r3', src: 'https://picsum.photos/seed/resort3/800/1000', title: 'Wrap Coverup', alt: 'Sheer wrap coverup over swimwear' },
    ],
  },
  {
    id: 'cutsew',
    label: 'Cut & Sew Knits',
    subtitle: 'RTW — cut & sew knits, crochet, and soft wovens',
    items: [
      { id: 'cs1', src: 'https://picsum.photos/seed/knit1/800/1000', title: 'Crochet Top', alt: 'Hand-crocheted top — knit collection' },
      { id: 'cs2', src: 'https://picsum.photos/seed/knit2/800/1000', title: 'Soft Woven Set', alt: 'Soft woven co-ordinate set' },
    ],
  },
  {
    id: 'bridal',
    label: 'Bridal & Eveningwear',
    subtitle: 'Custom bespoke bridal and evening collections',
    items: [
      { id: 'b1', src: 'https://picsum.photos/seed/bridal1/800/1000', title: 'Evening Gown', alt: 'Custom evening gown — bridal collection' },
      { id: 'b2', src: 'https://picsum.photos/seed/bridal2/800/1000', title: 'Bespoke Bridal', alt: 'Custom bespoke bridal look' },
    ],
  },
  {
    id: 'illustrations',
    label: 'Hand Illustrations',
    subtitle: 'Fashion illustrations — Procreate, markers, and colored pencils',
    items: [
      { id: 'i1', src: 'https://picsum.photos/seed/sketch1/800/1000', title: 'Evening Gown Study', alt: 'Hand-drawn fashion illustration — evening gown' },
      { id: 'i2', src: 'https://picsum.photos/seed/sketch2/800/1000', title: 'Resort Silhouettes', alt: 'Fashion illustration — resort silhouettes' },
      { id: 'i3', src: 'https://picsum.photos/seed/sketch3/800/1000', title: 'Technical Flat', alt: 'Technical design flat — spec sheet illustration' },
    ],
  },
]
