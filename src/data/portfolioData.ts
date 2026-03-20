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
      { id: 'r1', src: '/assets/resort/stephanie-gottlieb/969c394b624e05384f21c85fb925ab57.png', title: 'Stephanie Gottlieb', alt: 'Resort collection — Stephanie Gottlieb collab' },
      { id: 'r2', src: '/assets/resort/mimi-yoga/602e863833f8e3d31bfba9327396ba96.jpg', title: 'Mimi Yoga', alt: 'Activewear collection — Mimi Yoga' },
      { id: 'r3', src: '/assets/resort/mercedes-salazar/23733468ed63eb66ff075c4c69b13429.jpg', title: 'Mercedes Salazar', alt: 'Resort collection — Mercedes Salazar' },
      { id: 'r4', src: '/assets/resort/ephyra/155d455ff011477afccb0f20c37c9d31.jpg', title: 'Ephyra', alt: 'Resort collection — Ephyra' },
      { id: 'r5', src: '/assets/resort/ariel/824dc75060c059e33e72252363fc7274.jpg', title: 'Ariel', alt: 'Resort collection — Ariel' },
    ],
    processStages: [
      { label: 'Stephanie Gottlieb', src: '/assets/resort/stephanie-gottlieb/26c30cc032dd7e39a068bf3f41da0794.png', caption: 'Jewellery brand collab — resort capsule' },
      { label: 'Mercedes Salazar', src: '/assets/resort/mercedes-salazar/19ba3a8c8e816de42821b40cbb102ddd.png', caption: 'Accessories collab — print resort pieces' },
      { label: 'Mimi Yoga', src: '/assets/resort/mimi-yoga/0a4b03b2db58f5e997daa61bdb5086ee.jpg', caption: 'Activewear collab + moodboard' },
      { label: 'Private Label', src: '/assets/resort/private-label/069bc6d3f9f031fb7df089358aec7774.jpg', caption: 'Private label RTW development' },
      { label: 'HPSET', src: '/assets/resort/hpset/32c254d095dd794921e3135df89d9f1d.jpg', caption: 'HPSET collection' },
      { label: 'Ephyra', src: '/assets/resort/ephyra/155d455ff011477afccb0f20c37c9d31.jpg', caption: 'Ephyra resort styles' },
      { label: 'Ariel', src: '/assets/resort/ariel/3649f93c158e445a9f525942c02d49f4.jpg', caption: 'Ariel resort collection' },
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
      { id: 'cs1', src: '/assets/cutsew/chunky-knits/176e79aa3fab0cc597ef2e9f1364c846.png', title: 'Chunky Knits', alt: 'Chunky knit collection' },
      { id: 'cs2', src: '/assets/cutsew/crochet-patchwork/0445c4f9e362383a539751dd83a677de.png', title: 'Crochet & Patchwork', alt: 'Crochet and patchwork collection' },
      { id: 'cs3', src: '/assets/cutsew/vogue-mexico/068e4e0d4268c7a00ec3f0c3acf58faa.jpg', title: 'Vogue Mexico', alt: 'Vogue Mexico editorial — Miami Swim Week' },
      { id: 'cs4', src: '/assets/cutsew/silky-handloom/14e3b37be9f5c9cbece9e4264038af1a.jpg', title: 'Silky & Handloom', alt: 'Silky and handloom collection' },
    ],
    processStages: [
      { label: 'Chunky Knits', src: '/assets/cutsew/chunky-knits/176e79aa3fab0cc597ef2e9f1364c846.png', caption: 'Chunky knit development' },
      { label: 'Basics & Intimates', src: '/assets/cutsew/basics-intimates/18b087c23b1f433f451bc83c073765f7.png', caption: 'Basics and intimates capsule' },
      { label: 'Vogue Mexico', src: '/assets/cutsew/vogue-mexico/068e4e0d4268c7a00ec3f0c3acf58faa.jpg', caption: 'Miami Swim Week — Vogue Mexico feature' },
      { label: 'Crochet & Patchwork', src: '/assets/cutsew/crochet-patchwork/0445c4f9e362383a539751dd83a677de.png', caption: 'Hand-crochet and patchwork construction' },
      { label: 'Silky & Handloom', src: '/assets/cutsew/silky-handloom/14e3b37be9f5c9cbece9e4264038af1a.jpg', caption: 'Silky wovens and handloom development' },
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
      { id: 'b1', src: '/assets/bridal/galia-lahav/00a2ed772225f0f593ffe8c152ae60f5.png', title: 'Galia Lahav', alt: 'Bridal — Galia Lahav' },
      { id: 'b2', src: '/assets/bridal/resort-bride/1376b5b9dfa2bdf90ff056336a096f79.jpg', title: 'Resort Bride', alt: 'Resort bridal collection' },
      { id: 'b3', src: '/assets/bridal/night-time/108a4df01e4010d4e4523ed409c659cf.jpg', title: 'Night Time', alt: 'Evening and night-time bridal looks' },
      { id: 'b4', src: '/assets/bridal/satin-sara/1928ae062d734cbf01edfe842066b57c.jpg', title: 'Satin Sara', alt: 'Satin Sara bespoke bridal' },
      { id: 'b5', src: '/assets/bridal/butterfly-bridal/096916b4561d0ddd5814038466d1e234.jpg', title: 'Butterfly Bridal', alt: 'Butterfly Bridal collection' },
    ],
    processStages: [
      { label: 'Galia Lahav', src: '/assets/bridal/galia-lahav/00a2ed772225f0f593ffe8c152ae60f5.png', caption: 'Galia Lahav bridal inspiration' },
      { label: 'Resort Bride', src: '/assets/bridal/resort-bride/1376b5b9dfa2bdf90ff056336a096f79.jpg', caption: 'Resort bridal styling' },
      { label: 'Night Time', src: '/assets/bridal/night-time/108a4df01e4010d4e4523ed409c659cf.jpg', caption: 'Evening and night-time looks' },
      { label: 'Satin Sara', src: '/assets/bridal/satin-sara/1928ae062d734cbf01edfe842066b57c.jpg', caption: 'Bespoke satin bridal' },
      { label: 'Butterfly Bridal', src: '/assets/bridal/butterfly-bridal/096916b4561d0ddd5814038466d1e234.jpg', caption: 'Butterfly Bridal collection' },
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
      { id: 'i1', src: '/assets/illustrations/procreate/b8558489a2723e5f6a872f0150e4c597.jpg', title: 'Procreate', alt: 'Digital fashion illustration — Procreate' },
      { id: 'i2', src: '/assets/illustrations/markers-pencils/175cc67ab9481a0e757bc3d4eb7bd01c.jpg', title: 'Markers & Pencils', alt: 'Fashion illustration — markers and colored pencils' },
      { id: 'i3', src: '/assets/illustrations/markers-pencils/357d07c059821a600b5e02707e3329ae.jpg', title: 'Figure Study', alt: 'Fashion figure study illustration' },
    ],
    processStages: [
      { label: 'Procreate', src: '/assets/illustrations/procreate/b8558489a2723e5f6a872f0150e4c597.jpg', caption: 'Digital illustration — Procreate' },
      { label: 'Markers & Pencils', src: '/assets/illustrations/markers-pencils/175cc67ab9481a0e757bc3d4eb7bd01c.jpg', caption: 'Traditional media — markers and colored pencils' },
    ],
  },
]
